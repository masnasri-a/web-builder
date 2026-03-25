import { db } from "@/lib/db"
import { Tier } from "@/lib/generated/prisma/client"

// ── Expiry check ───────────────────────────────────────────────────────────────
// Returns true if a subscription was expired and user was downgraded.
// Safe to call on every request — no-ops instantly when nothing is expired.
export async function checkAndExpireSubscription(userId: string): Promise<boolean> {
  const expiredSub = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      expiresAt: { lt: new Date() },
    },
    include: { user: { select: { tier: true } } },
  })

  if (!expiredSub) return false
  if (expiredSub.user.tier === "BASIC") {
    // Already downgraded — just mark the sub as expired
    await db.subscription.update({ where: { id: expiredSub.id }, data: { status: "EXPIRED" } })
    return false
  }

  const fromTier = expiredSub.user.tier

  await db.$transaction([
    db.subscription.update({ where: { id: expiredSub.id }, data: { status: "EXPIRED" } }),
    db.user.update({ where: { id: userId }, data: { tier: "BASIC" } }),
    db.tierHistory.create({
      data: {
        userId,
        fromTier,
        toTier: "BASIC",
        reason: "SUBSCRIPTION_EXPIRED",
        notes: `Subscription ${expiredSub.tier} (ID: ${expiredSub.id}) expired at ${expiredSub.expiresAt.toISOString()}`,
      },
    }),
  ])

  return true
}

// ── Create subscription ────────────────────────────────────────────────────────
// Cancels any current active subscription then creates the new one.
export async function createSubscription({
  userId,
  tier,
  orderId,
  durationDays = 30,
}: {
  userId: string
  tier: Tier
  orderId?: string
  durationDays?: number
}) {
  const now = new Date()

  // Cancel any existing active subs (mid-cycle upgrade)
  await db.subscription.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "CANCELLED" },
  })

  const expiresAt =
    durationDays === 0
      ? new Date("2099-12-31T23:59:59.000Z") // lifetime
      : new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

  return db.subscription.create({
    data: {
      userId,
      tier,
      status: "ACTIVE",
      startedAt: now,
      expiresAt,
      orderId: orderId ?? null,
    },
  })
}

// ── Record tier change ────────────────────────────────────────────────────────
export async function recordTierChange({
  userId,
  fromTier,
  toTier,
  reason,
  notes,
}: {
  userId: string
  fromTier: string
  toTier: string
  reason: string
  notes?: string
}) {
  return db.tierHistory.create({
    data: {
      userId,
      fromTier: fromTier as Tier,
      toTier: toTier as Tier,
      reason,
      notes: notes ?? null,
    },
  })
}

// ── Get active subscription ───────────────────────────────────────────────────
export async function getActiveSubscription(userId: string) {
  return db.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
    include: { order: { select: { id: true, voucherCode: true, finalPrice: true, createdAt: true } } },
  })
}
