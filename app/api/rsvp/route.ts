import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { FREE_TIER_LIMIT, PRO_TIER_LIMIT } from "@/types"

const schema = z.object({
  invitationId: z.string().min(1),
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  attendance: z.enum(["ATTENDING", "NOT_ATTENDING", "PENDING"]),
  guestCount: z.number().int().min(1).max(20).default(1),
  message: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { invitationId, name, phone, email, attendance, guestCount, message } = parsed.data

    // Get invitation + owner tier
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId, isPublished: true },
      include: {
        user: { select: { tier: true } },
        _count: { select: { guests: true } },
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Enforce RSVP limit based on owner tier
    const tier = invitation.user.tier
    const limit =
      tier === "UNLIMITED"
        ? Infinity
        : tier === "PRO"
          ? PRO_TIER_LIMIT
          : FREE_TIER_LIMIT

    if (invitation._count.guests >= limit) {
      return NextResponse.json(
        {
          error: `RSVP limit reached (${limit} guests). Please contact the couple directly.`,
        },
        { status: 429 }
      )
    }

    const guest = await db.guest.create({
      data: {
        invitationId,
        name,
        phone: phone || null,
        email: email || null,
        attendance,
        guestCount,
        message: message || null,
      },
    })

    return NextResponse.json(guest, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const invitationId = searchParams.get("invitationId")

  if (!invitationId) {
    return NextResponse.json({ error: "invitationId required" }, { status: 400 })
  }

  const guests = await db.guest.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(guests)
}
