import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const invitation = await db.invitation.findFirst({
    where: { id, userId: session.user.id },
    include: { theme: true, guests: { orderBy: { createdAt: "desc" } } },
  })

  if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(invitation)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  // Verify ownership
  const existing = await db.invitation.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  try {
    const body = await req.json()
    const {
      groomName, brideName, eventDate, eventVenue, eventAddress, eventTime,
      musicUrl, sections, themeConfig, slug, isPublished,
    } = body

    const updated = await db.invitation.update({
      where: { id },
      data: {
        ...(groomName !== undefined && { groomName }),
        ...(brideName !== undefined && { brideName }),
        ...(eventDate !== undefined && { eventDate: new Date(eventDate) }),
        ...(eventVenue !== undefined && { eventVenue }),
        ...(eventAddress !== undefined && { eventAddress }),
        ...(eventTime !== undefined && { eventTime }),
        ...(musicUrl !== undefined && { musicUrl }),
        ...(sections !== undefined && { sections }),
        ...(themeConfig !== undefined && { themeConfig }),
        ...(slug !== undefined && { slug }),
        ...(isPublished !== undefined && { isPublished }),
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const existing = await db.invitation.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.invitation.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
