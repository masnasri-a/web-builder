import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Gift } from "lucide-react"

export default async function MyVouchersPage() {
  const session = await auth()

  const claims = await db.voucherClaim.findMany({
    where: { userId: session!.user.id },
    include: {
      voucher: { include: { vendorProfile: { select: { shopName: true } } } },
    },
    orderBy: { claimedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Vouchers</h1>
        <p className="text-muted-foreground">All vouchers you have claimed</p>
      </div>

      {claims.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Gift className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No vouchers claimed yet</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {claims.map(c => {
            const isValid =
              c.voucher.isActive &&
              (!c.voucher.expiresAt || new Date(c.voucher.expiresAt) > new Date())

            return (
              <div
                key={c.id}
                className={`rounded-2xl border bg-card p-5 shadow-sm space-y-2 ${isValid ? "border-border" : "opacity-60 border-muted"}`}
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono font-bold text-primary text-lg">{c.voucher.code}</code>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isValid ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {isValid ? "Valid" : "Expired"}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium">{c.voucher.vendorProfile?.shopName ?? "Platform Voucher"}</p>
                  {c.voucher.description && (
                    <p className="text-xs text-muted-foreground">{c.voucher.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${c.voucher.type === "FREE" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {c.voucher.type}
                  </span>
                  {c.voucher.discountPercent !== null && (
                    <span className="font-semibold text-foreground">{c.voucher.discountPercent}% off</span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Claimed {new Date(c.claimedAt).toLocaleDateString()}
                  {c.voucher.expiresAt && ` · Expires ${new Date(c.voucher.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
