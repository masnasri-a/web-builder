import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createSubscription, recordTierChange } from "@/lib/subscription"

const VALID_TIERS = ["BASIC", "PRO", "PLATINUM", "LUXURY"] as const
type Tier = (typeof VALID_TIERS)[number]

const TIER_ORDER: Record<Tier, number> = { BASIC: 0, PRO: 1, PLATINUM: 2, LUXURY: 3 }

export async function POST(req: Request) {
  let body: {
    type?: string
    message?: string
    donator_email?: string
    amount_raw?: number
    etc?: { amount_to_display?: number }
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (body.type !== "donation") {
    return NextResponse.json({ ok: true, skipped: "not a donation" })
  }

  const message = body.message?.trim() ?? ""
  const email = body.donator_email?.toLowerCase()
  const displayAmount = body.etc?.amount_to_display ?? body.amount_raw ?? 0

  if (!email) {
    return NextResponse.json({ error: "Missing donator_email" }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, tier: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // ── Path A: message is a PaymentOrder ID (new checkout flow) ──────────────
  // cuid format starts with 'c' and is 25 chars — distinct from tier names
  const looksLikeOrderId = message.length > 10 && !VALID_TIERS.includes(message as Tier)

  if (looksLikeOrderId) {
    const order = await db.paymentOrder.findUnique({
      where: { id: message },
      select: { id: true, userId: true, tier: true, finalPrice: true, status: true, expiresAt: true, voucherCode: true },
    })

    if (!order) {
      return NextResponse.json({ error: "PaymentOrder not found" }, { status: 404 })
    }
    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Order/user mismatch" }, { status: 403 })
    }
    if (order.status !== "PENDING") {
      return NextResponse.json({ ok: true, skipped: `Order already ${order.status}` })
    }
    if (order.expiresAt < new Date()) {
      await db.paymentOrder.update({ where: { id: order.id }, data: { status: "EXPIRED" } })
      return NextResponse.json({ error: "Order expired" }, { status: 400 })
    }

    // Validate amount against order's finalPrice (5% tolerance for gateway fees)
    if (displayAmount < order.finalPrice * 0.95) {
      console.warn(
        `[saweria] Amount mismatch for order ${order.id}: expected ${order.finalPrice}, got ${displayAmount}`
      )
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
    }

    const tier = order.tier as Tier
    const currentOrder = TIER_ORDER[user.tier as Tier] ?? 0
    const newOrder = TIER_ORDER[tier]
    if (newOrder <= currentOrder) {
      await db.paymentOrder.update({ where: { id: order.id }, data: { status: "COMPLETED" } })
      return NextResponse.json({ ok: true, skipped: "already on equal or higher tier" })
    }

    const fromTier = user.tier
    await db.$transaction([
      db.paymentOrder.update({ where: { id: order.id }, data: { status: "COMPLETED" } }),
      db.user.update({ where: { id: user.id }, data: { tier } }),
    ])

    // Resolve durationDays for this tier
    const tierCfg = await db.tierConfig.findFirst({
      where: { tier, roleType: "USER" },
      select: { durationDays: true },
    })
    await createSubscription({
      userId: user.id,
      tier,
      orderId: order.id,
      durationDays: tierCfg?.durationDays ?? 30,
    })
    await recordTierChange({
      userId: user.id,
      fromTier,
      toTier: tier,
      reason: "PAYMENT",
      notes: `Paid Rp ${displayAmount} via Saweria (order ${order.id})${order.voucherCode ? `, voucher: ${order.voucherCode}` : ""}`,
    })

    console.log(`[saweria] Upgraded ${email}: ${fromTier} → ${tier} via order ${order.id}`)
    return NextResponse.json({ ok: true, upgraded: { from: fromTier, to: tier } })
  }

  // ── Path B: legacy — message is the tier name directly ────────────────────
  const tier = message.toUpperCase() as Tier
  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Unknown tier in message" }, { status: 400 })
  }

  const roleType = "USER"
  const tierConfig = await db.tierConfig.findUnique({
    where: { roleType_tier: { roleType, tier } },
    select: { price: true, durationDays: true },
  })

  const expectedPrice = tierConfig?.price ?? 0
  if (expectedPrice > 0 && displayAmount < expectedPrice * 0.95) {
    console.warn(
      `[saweria legacy] Amount mismatch: expected ${expectedPrice}, got ${displayAmount} for tier ${tier}`
    )
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
  }

  const currentOrder = TIER_ORDER[user.tier as Tier] ?? 0
  const newOrder = TIER_ORDER[tier]
  if (newOrder <= currentOrder) {
    return NextResponse.json({ ok: true, skipped: "already on equal or higher tier" })
  }

  const fromTierLegacy = user.tier
  await db.user.update({ where: { id: user.id }, data: { tier } })
  await createSubscription({
    userId: user.id,
    tier,
    durationDays: tierConfig?.durationDays ?? 30,
  })
  await recordTierChange({
    userId: user.id,
    fromTier: fromTierLegacy,
    toTier: tier,
    reason: "PAYMENT",
    notes: `Paid Rp ${displayAmount} via Saweria (legacy webhook)`,
  })

  console.log(`[saweria legacy] Upgraded ${email}: ${fromTierLegacy} → ${tier} (paid Rp ${displayAmount})`)
  return NextResponse.json({ ok: true, upgraded: { from: fromTierLegacy, to: tier } })
}
