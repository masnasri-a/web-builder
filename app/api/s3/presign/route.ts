import { NextResponse } from "next/server"
import { getUploadUrl } from "@/lib/s3"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const invitationId = url.searchParams.get("invitationId")
  const filename = url.searchParams.get("filename")
  const contentType = url.searchParams.get("contentType") || "application/octet-stream"

  if (!invitationId || !filename) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 })
  }

  // sanitize filename
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
  const key = `${invitationId}/${Date.now()}-${safeName}`

  try {
    const uploadUrl = await getUploadUrl(key, contentType)
    return NextResponse.json({ uploadUrl, key })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to generate url" }, { status: 500 })
  }
}
