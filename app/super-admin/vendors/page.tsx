import { db } from "@/lib/db"
import { VendorsManager } from "./vendors-manager"

export default async function VendorsPage() {
  const vendors = await db.vendorProfile.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <p className="text-muted-foreground">Promote users to vendors and configure their discount rates</p>
      </div>
      <VendorsManager initialVendors={vendors} />
    </div>
  )
}
