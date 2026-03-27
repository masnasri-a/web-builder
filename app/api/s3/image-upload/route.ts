import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getTierConfig } from "@/lib/tier"
import sharp from "sharp"
import {
  uploadFile,
  BG_IMAGE_BUCKET,
  PROFILE_PHOTO_BUCKET,
  GALLERY_BUCKET,
} from "@/lib/s3"

const BUCKET_MAP: Record<string, string> = {
  background: BG_IMAGE_BUCKET,
  profile: PROFILE_PHOTO_BUCKET,
  gallery: GALLERY_BUCKET,
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

/**
 * POST /api/s3/image-upload
 * Accepts multipart/form-data fields:
 *   - file         : the image file
 *   - invitationId : invitation ID (used as S3 key prefix)
 *   - uploadType   : one of "background", "profile", "gallery"
 *
 * Uploads to the corresponding bucket with key: {invitationId}/{timestamp}-{filename}.
 * Returns { url, key, bucket }.
 */
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const invitationId = formData.get("invitationId") as string | null
    const type = formData.get("uploadType") as string | null

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (!invitationId)
      return NextResponse.json(
        { error: "Missing invitationId" },
        { status: 400 }
      )
    if (!type || !BUCKET_MAP[type])
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })

    // Verify ownership
    const invitation = await db.invitation.findFirst({
      where: { id: invitationId, userId: session.user.id },
    })
    if (!invitation)
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      )

    // Enforce gallery image limit
    if (type === "gallery") {
      const tierCfg = await getTierConfig(session.user.id)
      if (tierCfg && tierCfg.maxGalleryImages > 0) {
        const sections = invitation.sections as { type: string; content: Record<string, unknown> }[]
        const gallerySec = sections.find((s) => s.type === "gallery")
        const currentImages = (gallerySec?.content?.images as string[]) ?? []
        if (currentImages.length >= tierCfg.maxGalleryImages) {
          return NextResponse.json(
            { error: `Batas galeri tercapai (maks ${tierCfg.maxGalleryImages} foto). Upgrade untuk menambah lebih banyak.` },
            { status: 403 },
          )
        }
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (buffer.length > MAX_FILE_SIZE)
      return NextResponse.json(
        { error: "File terlalu besar (maks 10 MB)" },
        { status: 413 }
      )

    // Compress to Full HD max using sharp
    const compressed = await sharp(buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer()

    const bucket = BUCKET_MAP[type]
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").replace(/\.[^.]+$/, ".jpg")
    const key = `${invitationId}/${Date.now()}-${safeName}`
    const url = await uploadFile(bucket, key, compressed, "image/jpeg")

    return NextResponse.json({ url, key, bucket })
  } catch (err) {
    console.error("[image-upload]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
