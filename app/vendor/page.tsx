import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Tag, Gift, Percent } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function VendorDashboard() {
  const session = await auth()
  const vendor = await db.vendorProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      vouchers: {
        include: { _count: { select: { claims: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!vendor) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Vendor profile not found. Please contact Super Admin.
      </div>
    )
  }

  const totalClaims = vendor.vouchers.reduce((s, v) => s + v._count.claims, 0)

  const stats = [
    { label: "Shop Name", value: vendor.shopName, icon: Tag, color: "text-teal-500" },
    { label: "Vouchers", value: vendor.vouchers.length, icon: Tag, color: "text-blue-500" },
    { label: "Total Claims", value: totalClaims, icon: Gift, color: "text-purple-500" },
    { label: "Default Discount", value: `${vendor.discount}%`, icon: Percent, color: "text-orange-500" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{vendor.shopName}</h1>
          <p className="text-muted-foreground">{vendor.description || "Vendor Dashboard"}</p>
        </div>
        <Button asChild>
          <Link href="/vendor/vouchers">Manage Vouchers</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {vendor.vouchers.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold">Recent Vouchers</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Claims</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendor.vouchers.map(v => (
                <tr key={v.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono font-bold text-primary">{v.code}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.type === "FREE" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{v._count.claims}{v.maxClaims ? `/${v.maxClaims}` : ""}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {v.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
