import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/vouchers — super admin gets all, vendor gets own, individual gets active/public
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const role = session.user.role

  if (role === "SUPER_ADMIN") {
    const vouchers = await db.voucher.findMany({
      include: { vendorProfile: { select: { shopName: true } }, _count: { select: { claims: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(vouchers)
  }

  if (role === "VENDOR") {
    const vendor = await db.vendorProfile.findUnique({ where: { userId: session.user.id } })
    if (!vendor) return NextResponse.json([])

    const vouchers = await db.voucher.findMany({
      where: { vendorProfileId: vendor.id },
      include: { _count: { select: { claims: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(vouchers)
  }

  // INDIVIDUAL: list active vouchers they can claim
  const vouchers = await db.voucher.findMany({
    where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    include: { vendorProfile: { select: { shopName: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(vouchers)
}

// POST /api/vouchers — super admin creates FREE vouchers, vendor creates DISCOUNT vouchers
export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const role = session.user.role
  if (role !== "SUPER_ADMIN" && role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { code, type, description, discountPercent, expiresAt, maxClaims } = await req.json()
  if (!code || !type) return NextResponse.json({ error: "code and type required" }, { status: 400 })

  let vendorProfileId: string | null = null
  if (role === "VENDOR") {
    const vendor = await db.vendorProfile.findUnique({ where: { userId: session.user.id } })
    if (!vendor) return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    vendorProfileId = vendor.id
  }

  const voucher = await db.voucher.create({
    data: {
      code: (code as string).toUpperCase().trim(),
      type,
      description,
      discountPercent: discountPercent ?? null,
      vendorProfileId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxClaims: maxClaims ?? null,
    },
  })

  return NextResponse.json(voucher, { status: 201 })
}
