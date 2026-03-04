import { NextResponse } from "next/server"
import { uploadFile, MUSIC_BUCKET } from "@/lib/s3"

/**
 * POST /api/s3/music-upload
 * Accepts multipart/form-data with a `file` field.
 * Uploads directly to the "list-music" S3 bucket from the server.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
    const key = `${Date.now()}-${safeName}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadFile(MUSIC_BUCKET, key, buffer, file.type || "audio/mpeg")

    return NextResponse.json({ url, key })
  } catch (err) {
    console.error("[music-upload]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
