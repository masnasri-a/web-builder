import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { DEFAULT_SECTIONS, DEFAULT_THEME_CONFIG } from "@/types"

const createSchema = z.object({
  groomName: z.string().min(1).max(100),
  brideName: z.string().min(1).max(100),
  eventDate: z.string(),
  eventVenue: z.string().min(1).max(200),
  eventAddress: z.string().max(300).optional(),
  themeSlug: z.string().optional(),
  themeId: z.string().optional(),
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const invitations = await db.invitation.findMany({
    where: { userId: session.user.id },
    include: {
      theme: { select: { id: true, name: true, slug: true } },
      _count: { select: { guests: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(invitations)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { groomName, brideName, eventDate, eventVenue, eventAddress, themeSlug, themeId, slug } = parsed.data

    // Check slug uniqueness
    const existing = await db.invitation.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: "That URL is already taken. Try a different one." },
        { status: 409 }
      )
    }

    // Resolve theme: prefer themeSlug lookup, then themeId, then first active theme
    let resolvedTheme = null
    if (themeSlug) {
      resolvedTheme = await db.theme.findUnique({ where: { slug: themeSlug, isActive: true } })
    }
    if (!resolvedTheme && themeId) {
      resolvedTheme = await db.theme.findFirst({ where: { id: themeId, isActive: true } })
    }
    if (!resolvedTheme) {
      resolvedTheme = await db.theme.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } })
    }

    if (!resolvedTheme) {
      return NextResponse.json({ error: "No active theme found. Please seed themes first." }, { status: 422 })
    }

    const invitation = await db.invitation.create({
      data: {
        slug,
        userId: session.user.id,
        themeId: resolvedTheme.id,
        groomName,
        brideName,
        eventDate: new Date(eventDate),
        eventVenue,
        eventAddress: eventAddress ?? null,
        sections: DEFAULT_SECTIONS as unknown as object[],
        themeConfig: (resolvedTheme.config ?? DEFAULT_THEME_CONFIG) as unknown as object,
      },
    })

    return NextResponse.json(invitation, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
