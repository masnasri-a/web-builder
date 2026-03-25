import { db } from "@/lib/db"
import { Users, Tag, Gift } from "lucide-react"

export default async function SuperAdminDashboard() {
  const [totalVendors, totalVouchers, totalClaims] = await Promise.all([
    db.vendorProfile.count(),
    db.voucher.count(),
    db.voucherClaim.count(),
  ])

  const stats = [
    { label: "Total Vendors", value: totalVendors, icon: Users, color: "text-blue-500" },
    { label: "Total Vouchers", value: totalVouchers, icon: Tag, color: "text-teal-500" },
    { label: "Total Claims", value: totalClaims, icon: Gift, color: "text-purple-500" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
    </div>
  )
}
