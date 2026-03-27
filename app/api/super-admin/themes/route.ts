import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"
import { z } from "zod"
import { invalidate } from "@/lib/redis"

const patchSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung")
    .optional(),
  previewImage: z.string().url().nullable().optional(),
  config: z
    .object({
      primaryColor: z.string(),
      secondaryColor: z.string(),
      accentColor: z.string(),
      fontFamily: z.string(),
      bgColor: z.string(),
    })
    .optional(),
  isActive: z.boolean().optional(),
})

// GET /api/super-admin/themes
export async function GET() {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const themes = await db.theme.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { invitations: true } } },
  })

  return NextResponse.json(themes)
}

// PATCH /api/super-admin/themes — update one theme
export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = patchSchema.parse(body)
    const { id, ...data } = parsed

    // If slug changed, check uniqueness
    if (data.slug) {
      const existing = await db.theme.findFirst({
        where: { slug: data.slug, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json(
          { error: "Slug sudah digunakan tema lain" },
          { status: 409 }
        )
      }
    }

    const updated = await db.theme.update({
      where: { id },
      data,
      include: { _count: { select: { invitations: true } } },
    })

    await invalidate("themes")

    return NextResponse.json(updated)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      )
    }
    console.error("[super-admin/themes PATCH]", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
