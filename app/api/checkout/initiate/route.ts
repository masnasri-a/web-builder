import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { createSubscription, recordTierChange } from "@/lib/subscription"

const schema = z.object({
  tier: z.enum(["BASIC", "PRO", "PLATINUM", "LUXURY"]),
  voucherCode: z.string().optional(),
})

// POST /api/checkout/initiate
// ALL amounts computed server-side from DB. No price accepted from the client.
export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const { tier, voucherCode } = parsed.data

  // ── 1. Resolve tier price from DB ─────────────────────────────────────────
  const roleType = session.user.role === "VENDOR" ? "VENDOR" : "USER"
  const tierConfig = await db.tierConfig.findUnique({
    where: { roleType_tier: { roleType, tier } },
  })

  if (!tierConfig) return NextResponse.json({ error: "Tier tidak ditemukan" }, { status: 404 })
  if (tierConfig.price === 0) {
    return NextResponse.json({ error: "Tier ini gratis, tidak perlu pembayaran" }, { status: 400 })
  }

  // Prevent downgrade
  const TIER_ORDER: Record<string, number> = { BASIC: 0, PRO: 1, PLATINUM: 2, LUXURY: 3 }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, name: true, email: true },
  })
  if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
  if ((TIER_ORDER[tier] ?? 0) <= (TIER_ORDER[user.tier] ?? 0)) {
    return NextResponse.json({ error: "Tidak dapat downgrade tier" }, { status: 400 })
  }

  // ── 2. Validate voucher server-side ───────────────────────────────────────
  const originalPrice = tierConfig.price
  let discountAmount = 0
  let isFreeVoucher = false
  let validatedCode: string | null = null

  if (voucherCode) {
    const code = voucherCode.toUpperCase().trim()
    const voucher = await db.voucher.findUnique({
      where: { code },
      include: { _count: { select: { claims: true } } },
    })

    if (!voucher || !voucher.isActive) {
      return NextResponse.json({ error: "Voucher tidak valid" }, { status: 400 })
    }
    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      return NextResponse.json({ error: "Voucher sudah kedaluwarsa" }, { status: 400 })
    }
    if (voucher.maxClaims !== null && voucher._count.claims >= voucher.maxClaims) {
      return NextResponse.json({ error: "Voucher sudah habis digunakan" }, { status: 400 })
    }

    validatedCode = code
    if (voucher.type === "FREE") {
      isFreeVoucher = true
      discountAmount = originalPrice
    } else if (voucher.type === "DISCOUNT" && voucher.discountPercent) {
      discountAmount = Math.floor((originalPrice * voucher.discountPercent) / 100)
    }

    // Record the claim (idempotent)
    await db.voucherClaim.upsert({
      where: { voucherId_userId: { voucherId: voucher.id, userId: session.user.id } },
      update: {},
      create: { voucherId: voucher.id, userId: session.user.id },
    })
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount)

  // ── 3. Create PaymentOrder in DB ──────────────────────────────────────────
  const order = await db.paymentOrder.create({
    data: {
      userId: session.user.id,
      tier,
      originalPrice,
      finalPrice,
      voucherCode: validatedCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  })

  // ── 4. Free path — upgrade immediately ────────────────────────────────────
  if (isFreeVoucher || finalPrice === 0) {
    await db.$transaction([
      db.paymentOrder.update({ where: { id: order.id }, data: { status: "COMPLETED" } }),
      db.user.update({ where: { id: session.user.id }, data: { tier } }),
    ])

    // Create subscription + history (subscription links back to order via orderId)
    await createSubscription({
      userId: session.user.id,
      tier,
      orderId: order.id,
      durationDays: tierConfig.durationDays ?? 30,
    })
    await recordTierChange({
      userId: session.user.id,
      fromTier: user.tier,
      toTier: tier,
      reason: validatedCode ? "VOUCHER_FREE" : "PAYMENT",
      notes: validatedCode
        ? `Free upgrade via voucher ${validatedCode} (order ${order.id})`
        : `Free tier upgrade (order ${order.id})`,
    })

    return NextResponse.json({ free: true, tier, label: tierConfig.label })
  }

  // ── 5. Call Saweria for paid path ──────────────────────────────────────────
  const creatorId = process.env.SAWERIA_CREATOR_ID
  if (!creatorId) {
    await db.paymentOrder.update({ where: { id: order.id }, data: { status: "EXPIRED" } })
    return NextResponse.json({ error: "Payment gateway belum dikonfigurasi" }, { status: 503 })
  }

  const saweriaBody = {
    agree: true,
    notUnderage: true,
    // Use order.id as message so the webhook can look up the exact finalPrice
    message: order.id,
    amount: String(finalPrice),
    payment_type: "qris",
    vote: "",
    currency: "IDR",
    customer_info: {
      first_name: user.name ?? user.email!.split("@")[0],
      email: user.email ?? "",
      phone: "",
    },
  }

  try {
    const res = await fetch(
      `https://backend.saweria.co/donations/snap/${creatorId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saweriaBody),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      await db.paymentOrder.update({ where: { id: order.id }, data: { status: "EXPIRED" } })
      return NextResponse.json({ error: `Payment gateway error: ${errText}` }, { status: 502 })
    }

    const data = await res.json()

    await db.paymentOrder.update({
      where: { id: order.id },
      data: { saweriaId: data.data?.id ?? null },
    })

    return NextResponse.json({
      payment_id: order.id,
      qr_string: data.data?.qr_string,
      amount: finalPrice,
      originalAmount: originalPrice,
      discountAmount,
      tier,
      label: tierConfig.label,
    })
  } catch {
    await db.paymentOrder.update({ where: { id: order.id }, data: { status: "EXPIRED" } })
    return NextResponse.json({ error: "Gagal menghubungi payment gateway" }, { status: 502 })
  }
}
