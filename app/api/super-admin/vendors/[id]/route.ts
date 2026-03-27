import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"

// PATCH /api/super-admin/vendors/[id] — update discount / isActive
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const data = await req.json()

  const vendor = await db.vendorProfile.update({
    where: { id },
    data: {
      ...(data.discount !== undefined && { discount: data.discount }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.shopName !== undefined && { shopName: data.shopName }),
      ...(data.description !== undefined && { description: data.description }),
    },
  })

  return NextResponse.json(vendor)
}

// DELETE /api/super-admin/vendors/[id] — demote back to USER, remove profile
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const vendor = await db.vendorProfile.findUnique({ where: { id } })
  if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.$transaction([
    db.vendorProfile.delete({ where: { id } }),
    db.user.update({ where: { id: vendor.userId }, data: { role: "USER" } }),
  ])

  return NextResponse.json({ ok: true })
}
