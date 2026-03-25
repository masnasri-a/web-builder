import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { containsProfanity } from "@/lib/profanity-filter"

const postSchema = z.object({
  invitationId: z.string().min(1),
  name: z.string().min(1).max(100),
  message: z.string().min(1).max(300),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = postSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { invitationId, name, message } = parsed.data

    const invitation = await db.invitation.findUnique({
      where: { id: invitationId, isPublished: true },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 })
    }

    if (containsProfanity(name) || containsProfanity(message)) {
      return NextResponse.json(
        { error: "Pesan mengandung kata yang tidak pantas. Harap gunakan bahasa yang sopan." },
        { status: 422 }
      )
    }

    const wish = await db.wish.create({
      data: { invitationId, name: name.trim(), message: message.trim() },
    })

    return NextResponse.json(wish, { status: 201 })
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

  const wishes = await db.wish.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, message: true, createdAt: true },
  })

  return NextResponse.json(wishes)
}
