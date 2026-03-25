import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Gift, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function IndividualDashboard() {
  const session = await auth()

  const claims = await db.voucherClaim.findMany({
    where: { userId: session!.user.id },
    include: {
      voucher: { include: { vendorProfile: { select: { shopName: true } } } },
    },
    orderBy: { claimedAt: "desc" },
    take: 5,
  })

  const stats = [
    { label: "Vouchers Claimed", value: claims.length, icon: Gift, color: "text-purple-500" },
    { label: "Active Vouchers", value: claims.filter(c => c.voucher.isActive).length, icon: Tag, color: "text-teal-500" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hi, {session!.user.name ?? "there"}!</h1>
          <p className="text-muted-foreground">Your voucher collection</p>
        </div>
        <Button asChild>
          <Link href="/individual/claim">Claim Voucher</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {claims.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Recent Claims</h2>
            <Link href="/individual/my-vouchers" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {claims.map(c => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <code className="font-mono font-bold text-primary">{c.voucher.code}</code>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.voucher.vendorProfile?.shopName ?? "Platform"} · {c.voucher.type}
                    {c.voucher.discountPercent ? ` · ${c.voucher.discountPercent}% off` : ""}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.voucher.isActive && (!c.voucher.expiresAt || new Date(c.voucher.expiresAt) > new Date()) ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {c.voucher.isActive && (!c.voucher.expiresAt || new Date(c.voucher.expiresAt) > new Date()) ? "Valid" : "Expired"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {claims.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Gift className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No vouchers yet</p>
          <p className="text-sm">Claim your first voucher to get started</p>
        </div>
      )}
    </div>
  )
}
