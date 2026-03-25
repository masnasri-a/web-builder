import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { CheckoutClient } from "./checkout-client"

const VALID_TIERS = ["BASIC", "PRO", "PLATINUM", "LUXURY"] as const
type Tier = (typeof VALID_TIERS)[number]

const TIER_ORDER: Record<Tier, number> = { BASIC: 0, PRO: 1, PLATINUM: 2, LUXURY: 3 }

interface PageProps {
  searchParams: Promise<{ tier?: string }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session) redirect("/login")

  const { tier: rawTier } = await searchParams
  const tier = rawTier?.toUpperCase() as Tier | undefined

  if (!tier || !VALID_TIERS.includes(tier)) notFound()

  const roleType = session.user.role === "VENDOR" ? "VENDOR" : "USER"

  // All data fetched server-side — no price ever comes from the client
  const [tierConfig, currentUser, claimedVouchers] = await Promise.all([
    db.tierConfig.findUnique({
      where: { roleType_tier: { roleType, tier } },
      select: {
        tier: true,
        label: true,
        description: true,
        price: true,
        maxInvitations: true,
        maxRsvpGuests: true,
        maxGalleryImages: true,
        allowMusic: true,
        allowCustomDomain: true,
        allowAnalytics: true,
        allowBroadcast: true,
        allThemes: true,
      },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, email: true, name: true },
    }),
    // Fetch vouchers this user has already claimed (valid only)
    db.voucherClaim.findMany({
      where: { userId: session.user.id },
      include: {
        voucher: {
          include: { _count: { select: { claims: true } } },
        },
      },
    }),
  ])

  if (!tierConfig) notFound()

  // Redirect if same tier or trying to downgrade
  const currentTierOrder = TIER_ORDER[currentUser?.tier as Tier] ?? 0
  const targetTierOrder = TIER_ORDER[tier]
  if (targetTierOrder <= currentTierOrder) {
    redirect("/dashboard/billing")
  }

  // Filter to only valid claimed vouchers
  const now = new Date()
  const validClaimed = claimedVouchers
    .filter(({ voucher: v }) => {
      if (!v.isActive) return false
      if (v.expiresAt && v.expiresAt < now) return false
      if (v.maxClaims !== null && v._count.claims >= v.maxClaims) return false
      return true
    })
    .map(({ voucher: v }) => ({
      id: v.id,
      code: v.code,
      type: v.type,
      description: v.description ?? "",
      discountPercent: v.discountPercent ?? null,
      expiresAt: v.expiresAt?.toISOString() ?? null,
    }))

  return (
    <CheckoutClient
      tier={tierConfig.tier}
      tierLabel={tierConfig.label}
      tierDescription={tierConfig.description}
      originalPrice={tierConfig.price}
      tierFeatures={{
        maxInvitations: tierConfig.maxInvitations,
        maxRsvpGuests: tierConfig.maxRsvpGuests,
        maxGalleryImages: tierConfig.maxGalleryImages,
        allowMusic: tierConfig.allowMusic,
        allowCustomDomain: tierConfig.allowCustomDomain,
        allowAnalytics: tierConfig.allowAnalytics,
        allowBroadcast: tierConfig.allowBroadcast,
        allThemes: tierConfig.allThemes,
      }}
      currentTier={currentUser?.tier ?? "BASIC"}
      claimedVouchers={validClaimed}
    />
  )
}
