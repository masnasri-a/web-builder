import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"
import sharp from "sharp"
import { uploadFile, BG_IMAGE_BUCKET } from "@/lib/s3"

const MAX_FILE_SIZE = 10 * 1024 * 1024

// PATCH — update a popup ad
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const formData = await req.formData()

    const data: Record<string, unknown> = {}

    const title = formData.get("title") as string | null
    if (title !== null) data.title = title

    const headline = formData.get("headline") as string | null
    if (headline !== null) data.headline = headline || null

    const body = formData.get("body") as string | null
    if (body !== null) data.body = body || null

    const ctaLabel = formData.get("ctaLabel") as string | null
    if (ctaLabel !== null) data.ctaLabel = ctaLabel || null

    const ctaUrl = formData.get("ctaUrl") as string | null
    if (ctaUrl !== null) data.ctaUrl = ctaUrl || null

    if (formData.has("isActive")) data.isActive = formData.get("isActive") === "true"

    if (formData.has("startAt")) {
      const v = formData.get("startAt") as string
      data.startAt = v ? new Date(v) : null
    }
    if (formData.has("endAt")) {
      const v = formData.get("endAt") as string
      data.endAt = v ? new Date(v) : null
    }

    // Optional banner re-upload
    const file = formData.get("banner") as File | null
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      if (buffer.length > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File terlalu besar (maks 10 MB)" }, { status: 413 })
      }

      const compressed = await sharp(buffer)
        .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer()

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").replace(/\.[^.]+$/, ".jpg")
      const bannerKey = `popup-ads/${Date.now()}-${safeName}`
      const bannerUrl = await uploadFile(BG_IMAGE_BUCKET, bannerKey, compressed, "image/jpeg")
      data.bannerUrl = bannerUrl
      data.bannerKey = bannerKey
    }

    // If removeBanner flag is set, clear banner fields
    if (formData.get("removeBanner") === "true") {
      data.bannerUrl = null
      data.bannerKey = null
    }

    const updated = await db.popupAd.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (err) {
    console.error("[popup-ads PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE — delete a popup ad
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    await db.popupAd.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[popup-ads DELETE]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
