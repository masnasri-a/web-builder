import { NextResponse } from "next/server"
import { getMusicUploadUrl } from "@/lib/s3"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const filename = url.searchParams.get("filename")
  const contentType = url.searchParams.get("contentType") || "audio/mpeg"

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 })
  }

  try {
    const { key, uploadUrl } = await getMusicUploadUrl(filename, contentType)
    return NextResponse.json({ key, uploadUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
