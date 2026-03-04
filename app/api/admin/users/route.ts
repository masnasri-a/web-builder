import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  userId: z.string().min(1),
  action: z.enum(["suspend", "unsuspend", "upgrade"]),
  tier: z.enum(["FREE", "PRO", "UNLIMITED"]).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invitations: true } } },
  })

  return NextResponse.json(users)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { userId, action, tier } = parsed.data

    const updateData: Record<string, unknown> = {}

    if (action === "suspend") updateData.isSuspended = true
    if (action === "unsuspend") updateData.isSuspended = false
    if (action === "upgrade" && tier) updateData.tier = tier

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
