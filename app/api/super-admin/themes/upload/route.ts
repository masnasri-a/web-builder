import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadFile, BG_IMAGE_BUCKET } from "@/lib/s3"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

// POST /api/super-admin/themes/upload
export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const themeId = formData.get("themeId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (!themeId) {
      return NextResponse.json({ error: "Missing themeId" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5 MB)" },
        { status: 413 }
      )
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
    const key = `themes/${themeId}/${Date.now()}-${safeName}`
    const url = await uploadFile(
      BG_IMAGE_BUCKET,
      key,
      buffer,
      file.type || "image/jpeg"
    )

    return NextResponse.json({ url })
  } catch (err) {
    console.error("[super-admin/themes/upload]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
