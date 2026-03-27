import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"
import sharp from "sharp"
import { uploadFile, BG_IMAGE_BUCKET } from "@/lib/s3"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

// GET /api/super-admin/backgrounds — list all preset backgrounds
export async function GET() {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const backgrounds = await db.backgroundImage.findMany({
    where: { isPreset: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(backgrounds)
}

// POST /api/super-admin/backgrounds — upload a new preset background
export async function POST(req: Request) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const name = (formData.get("name") as string) || null

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File terlalu besar (maks 10 MB)" }, { status: 413 })
    }

    // Compress to Full HD
    const compressed = await sharp(buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer()

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").replace(/\.[^.]+$/, ".jpg")
    const key = `presets/${Date.now()}-${safeName}`
    const url = await uploadFile(BG_IMAGE_BUCKET, key, compressed, "image/jpeg")

    const bg = await db.backgroundImage.create({
      data: { url, key, name, isPreset: true },
    })

    return NextResponse.json(bg)
  } catch (err) {
    console.error("[super-admin/backgrounds POST]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// DELETE /api/super-admin/backgrounds — delete a preset background
export async function DELETE(req: Request) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    await db.backgroundImage.delete({ where: { id, isPreset: true } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[super-admin/backgrounds DELETE]", err)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
