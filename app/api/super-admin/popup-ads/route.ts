import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"
import sharp from "sharp"
import { uploadFile, BG_IMAGE_BUCKET } from "@/lib/s3"

const MAX_FILE_SIZE = 10 * 1024 * 1024

// GET — list all popup ads (admin)
export async function GET() {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const ads = await db.popupAd.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(ads)
}

// POST — create a new popup ad (with optional banner upload)
export async function POST(req: Request) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const headline = (formData.get("headline") as string) || null
    const body = (formData.get("body") as string) || null
    const ctaLabel = (formData.get("ctaLabel") as string) || null
    const ctaUrl = (formData.get("ctaUrl") as string) || null
    const isActive = formData.get("isActive") === "true"
    const startAt = formData.get("startAt") ? new Date(formData.get("startAt") as string) : null
    const endAt = formData.get("endAt") ? new Date(formData.get("endAt") as string) : null

    let bannerUrl: string | null = null
    let bannerKey: string | null = null

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
      bannerKey = `popup-ads/${Date.now()}-${safeName}`
      bannerUrl = await uploadFile(BG_IMAGE_BUCKET, bannerKey, compressed, "image/jpeg")
    }

    const ad = await db.popupAd.create({
      data: { title, headline, body, bannerUrl, bannerKey, ctaLabel, ctaUrl, isActive, startAt, endAt },
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (err) {
    console.error("[popup-ads POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
