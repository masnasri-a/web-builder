import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const VALID_TIERS = ["BASIC", "PRO", "PLATINUM", "LUXURY"] as const
type Tier = (typeof VALID_TIERS)[number]

// GET /api/checkout/preview?tier=PRO&voucher=CODE
// Returns a server-computed pricing breakdown — never trusts FE for amounts.
export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const rawTier = searchParams.get("tier")?.toUpperCase() as Tier | undefined
  const voucherCode = searchParams.get("voucher")?.toUpperCase().trim() || undefined

  if (!rawTier || !VALID_TIERS.includes(rawTier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
  }

  const roleType = session.user.role === "VENDOR" ? "VENDOR" : "USER"
  const tierConfig = await db.tierConfig.findUnique({
    where: { roleType_tier: { roleType, tier: rawTier } },
    select: { price: true, label: true, tier: true },
  })

  if (!tierConfig) return NextResponse.json({ error: "Tier not found" }, { status: 404 })

  const originalPrice = tierConfig.price
  let discountPercent = 0
  let discountAmount = 0
  let voucherType: string | null = null
  let voucherDescription: string | null = null
  let voucherError: string | null = null

  if (voucherCode) {
    const voucher = await db.voucher.findUnique({
      where: { code: voucherCode },
      include: { _count: { select: { claims: true } } },
    })

    if (!voucher) {
      voucherError = "Voucher tidak ditemukan"
    } else if (!voucher.isActive) {
      voucherError = "Voucher tidak aktif"
    } else if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      voucherError = "Voucher sudah kedaluwarsa"
    } else if (
      voucher.maxClaims !== null &&
      voucher._count.claims >= voucher.maxClaims
    ) {
      voucherError = "Voucher sudah habis digunakan"
    } else {
      voucherType = voucher.type
      voucherDescription = voucher.description ?? null
      if (voucher.type === "FREE") {
        discountPercent = 100
        discountAmount = originalPrice
      } else if (voucher.type === "DISCOUNT" && voucher.discountPercent) {
        discountPercent = voucher.discountPercent
        discountAmount = Math.floor((originalPrice * voucher.discountPercent) / 100)
      }
    }
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount)

  return NextResponse.json({
    tier: tierConfig.tier,
    label: tierConfig.label,
    originalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
    voucherCode: voucherCode ?? null,
    voucherType,
    voucherDescription,
    voucherError,
  })
}
