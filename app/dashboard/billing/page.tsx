import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BillingClient } from "./billing-client"

export default async function BillingPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const roleType = session.user.role === "VENDOR" ? "VENDOR" : "USER"

  const [tiers, user, activeSub, paymentHistory, tierHistory] = await Promise.all([
    db.tierConfig.findMany({
      where: { roleType },
      orderBy: { price: "asc" },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    }),
    // Active subscription
    db.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" },
      orderBy: { startedAt: "desc" },
    }),
    // Last 10 payment orders
    db.paymentOrder.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        tier: true,
        originalPrice: true,
        finalPrice: true,
        voucherCode: true,
        status: true,
        createdAt: true,
        subscription: { select: { expiresAt: true } },
      },
    }),
    // Last 20 tier changes
    db.tierHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, fromTier: true, toTier: true, reason: true, notes: true, createdAt: true },
    }),
  ])

  const configs = tiers.map(t => ({
    ...t,
    allowedThemeIds: (t.allowedThemeIds as string[] | null) ?? [],
  }))

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Billing & Upgrade"
        description="Kelola langganan dan riwayat pembayaranmu"
      />
      <div className="p-6">
        <BillingClient
          tiers={configs}
          currentTier={user?.tier ?? "BASIC"}
          activeSub={
            activeSub
              ? {
                  tier: activeSub.tier,
                  status: activeSub.status,
                  startedAt: activeSub.startedAt.toISOString(),
                  expiresAt: activeSub.expiresAt.toISOString(),
                }
              : null
          }
          paymentHistory={paymentHistory.map(p => ({
            id: p.id,
            tier: p.tier,
            originalPrice: p.originalPrice,
            finalPrice: p.finalPrice,
            voucherCode: p.voucherCode,
            status: p.status,
            createdAt: p.createdAt.toISOString(),
            subscriptionExpiresAt: p.subscription?.expiresAt?.toISOString() ?? null,
          }))}
          tierHistory={tierHistory.map(h => ({
            id: h.id,
            fromTier: h.fromTier,
            toTier: h.toTier,
            reason: h.reason,
            notes: h.notes,
            createdAt: h.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  )
}
