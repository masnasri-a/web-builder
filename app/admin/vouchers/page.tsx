import { db } from "@/lib/db"
import { VouchersManager } from "./vouchers-manager"

export default async function SuperAdminVouchersPage() {
  const raw = await db.voucher.findMany({
    include: {
      vendorProfile: { select: { shopName: true } },
      _count: { select: { claims: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const vouchers = raw.map(v => ({ ...v, expiresAt: v.expiresAt?.toISOString() ?? null }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Voucher Management</h1>
        <p className="text-muted-foreground">Create and manage platform-wide vouchers</p>
      </div>
      <VouchersManager initialVouchers={vouchers} role="SUPER_ADMIN" />
    </div>
  )
}
