import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let guestId: string
  try {
    const body = await req.json()
    guestId = body.guestId
    if (!guestId || typeof guestId !== "string") throw new Error()
  } catch {
    return NextResponse.json({ error: "guestId required" }, { status: 400 })
  }

  // Find guest + verify invitation ownership
  const guest = await db.guest.findUnique({
    where: { id: guestId },
    include: { invitation: { select: { userId: true } } },
  })

  if (!guest || guest.invitation.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Idempotent: only set checkedInAt if not already set
  const updated = await db.guest.update({
    where: { id: guestId },
    data: { checkedInAt: guest.checkedInAt ?? new Date() },
  })

  return NextResponse.json(updated)
}
