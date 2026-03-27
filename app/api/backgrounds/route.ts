import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import sharp from "sharp"
import { uploadFile, BG_IMAGE_BUCKET } from "@/lib/s3"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

// GET /api/backgrounds?invitationId=xxx — list presets + user's own backgrounds
export async function GET(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const invitationId = searchParams.get("invitationId")

  // Presets are always visible to everyone
  const presets = await db.backgroundImage.findMany({
    where: { isPreset: true },
    orderBy: { createdAt: "desc" },
  })

  // User's own uploads: scoped by userId + optionally invitationId
  const userBgs = await db.backgroundImage.findMany({
    where: {
      userId: session.user.id,
      isPreset: false,
      ...(invitationId ? { invitationId } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ presets, userBackgrounds: userBgs })
}

// POST /api/backgrounds — upload a user-private background
export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const invitationId = formData.get("invitationId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }
    if (!invitationId) {
      return NextResponse.json({ error: "Missing invitationId" }, { status: 400 })
    }

    // Verify ownership
    const invitation = await db.invitation.findFirst({
      where: { id: invitationId, userId: session.user.id },
    })
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
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
    const key = `user/${session.user.id}/${invitationId}/${Date.now()}-${safeName}`
    const url = await uploadFile(BG_IMAGE_BUCKET, key, compressed, "image/jpeg")

    const bg = await db.backgroundImage.create({
      data: {
        url,
        key,
        name: file.name,
        isPreset: false,
        userId: session.user.id,
        invitationId,
      },
    })

    return NextResponse.json(bg)
  } catch (err) {
    console.error("[backgrounds POST]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// DELETE /api/backgrounds — delete a user-owned background
export async function DELETE(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    // Only allow deleting own backgrounds
    await db.backgroundImage.delete({
      where: { id, userId: session.user.id, isPreset: false },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[backgrounds DELETE]", err)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
