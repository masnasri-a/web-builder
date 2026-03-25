import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// POST /api/vouchers/claim — body: { code }
export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: "code is required" }, { status: 400 })

  const voucher = await db.voucher.findUnique({
    where: { code: (code as string).toUpperCase().trim() },
    include: { _count: { select: { claims: true } } },
  })

  if (!voucher) return NextResponse.json({ error: "Voucher not found" }, { status: 404 })
  if (!voucher.isActive) return NextResponse.json({ error: "Voucher is inactive" }, { status: 400 })
  if (voucher.expiresAt && voucher.expiresAt < new Date()) {
    return NextResponse.json({ error: "Voucher has expired" }, { status: 400 })
  }
  if (voucher.maxClaims !== null && voucher._count.claims >= voucher.maxClaims) {
    return NextResponse.json({ error: "Voucher has reached its claim limit" }, { status: 400 })
  }

  // Check if already claimed
  const existing = await db.voucherClaim.findUnique({
    where: { voucherId_userId: { voucherId: voucher.id, userId: session.user.id } },
  })
  if (existing) return NextResponse.json({ error: "You have already claimed this voucher" }, { status: 400 })

  const claim = await db.voucherClaim.create({
    data: { voucherId: voucher.id, userId: session.user.id },
    include: { voucher: true },
  })

  return NextResponse.json(claim, { status: 201 })
}
