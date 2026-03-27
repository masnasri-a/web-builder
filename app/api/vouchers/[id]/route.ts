import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"

// PATCH /api/vouchers/[id] — update isActive, expiry, maxClaims, description
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const data = await req.json()

  const voucher = await db.voucher.findUnique({ where: { id } })
  if (!voucher) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const role = session.user.role

  // Super admin can edit any; vendor can only edit their own
  if (role === "VENDOR") {
    const vendor = await db.vendorProfile.findUnique({ where: { userId: session.user.id } })
    if (!vendor || voucher.vendorProfileId !== vendor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else if (!isAdminRole(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await db.voucher.update({
    where: { id },
    data: {
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.expiresAt !== undefined && { expiresAt: data.expiresAt ? new Date(data.expiresAt) : null }),
      ...(data.maxClaims !== undefined && { maxClaims: data.maxClaims }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.discountPercent !== undefined && { discountPercent: data.discountPercent }),
    },
  })

  return NextResponse.json(updated)
}

// DELETE /api/vouchers/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const voucher = await db.voucher.findUnique({ where: { id } })
  if (!voucher) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const role = session.user.role
  if (role === "VENDOR") {
    const vendor = await db.vendorProfile.findUnique({ where: { userId: session.user.id } })
    if (!vendor || voucher.vendorProfileId !== vendor.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else if (!isAdminRole(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await db.voucher.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
