import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/super-admin/vendors — list all vendors
export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const vendors = await db.vendorProfile.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(vendors)
}

// POST /api/super-admin/vendors — promote user to VENDOR
// body: { email, shopName, description?, discount? }
export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { email, shopName, description, discount } = await req.json()
  if (!email || !shopName) {
    return NextResponse.json({ error: "email and shopName are required" }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const [, vendorProfile] = await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { role: "VENDOR" } }),
    db.vendorProfile.upsert({
      where: { userId: user.id },
      update: { shopName, description, discount: discount ?? 5.0 },
      create: { userId: user.id, shopName, description, discount: discount ?? 5.0 },
    }),
  ])

  return NextResponse.json(vendorProfile, { status: 201 })
}
