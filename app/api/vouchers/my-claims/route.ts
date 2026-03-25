import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/vouchers/my-claims — individual's claimed vouchers
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const claims = await db.voucherClaim.findMany({
    where: { userId: session.user.id },
    include: {
      voucher: {
        include: { vendorProfile: { select: { shopName: true } } },
      },
    },
    orderBy: { claimedAt: "desc" },
  })

  return NextResponse.json(claims)
}
