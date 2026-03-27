import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { VouchersManager } from "@/app/admin/vouchers/vouchers-manager"
import { redirect } from "next/navigation"

export default async function VendorVouchersPage() {
  const session = await auth()
  const vendor = await db.vendorProfile.findUnique({ where: { userId: session!.user.id } })
  if (!vendor) redirect("/vendor")

  const raw = await db.voucher.findMany({
    where: { vendorProfileId: vendor.id },
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
        <h1 className="text-2xl font-bold">My Vouchers</h1>
        <p className="text-muted-foreground">Create and manage discount vouchers for your customers</p>
      </div>
      <VouchersManager initialVouchers={vouchers} role="VENDOR" />
    </div>
  )
}
