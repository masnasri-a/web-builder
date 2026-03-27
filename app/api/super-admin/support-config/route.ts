import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"

// GET /api/super-admin/support-config
export async function GET() {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const config = await db.supportConfig.findFirst()
  return NextResponse.json(config ?? { waNumber: "", waMessage: "Halo, saya butuh bantuan terkait Selembar.id" })
}

// PUT /api/super-admin/support-config — upsert
export async function PUT(req: Request) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { waNumber, waMessage } = await req.json()
  if (!waNumber?.trim()) {
    return NextResponse.json({ error: "waNumber is required" }, { status: 400 })
  }

  const existing = await db.supportConfig.findFirst()

  const config = existing
    ? await db.supportConfig.update({
        where: { id: existing.id },
        data: { waNumber: waNumber.trim(), waMessage: waMessage?.trim() ?? "" },
      })
    : await db.supportConfig.create({
        data: { waNumber: waNumber.trim(), waMessage: waMessage?.trim() ?? "" },
      })

  return NextResponse.json(config)
}
