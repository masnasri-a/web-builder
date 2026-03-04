import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const uploadUrl = req.headers.get("x-upload-url")
  if (!uploadUrl) {
    return NextResponse.json({ error: "Missing upload url" }, { status: 400 })
  }

  try {
    const body = await req.arrayBuffer()
    const contentType = req.headers.get("content-type") || "application/octet-stream"

    const s3Res = await fetch(uploadUrl, {
      method: "PUT",
      body,
      headers: { "Content-Type": contentType },
    })

    if (!s3Res.ok) {
      const errorBody = await s3Res.text()
      console.error("[s3/upload] S3 error", s3Res.status, errorBody)
      return NextResponse.json(
        { error: `S3 returned ${s3Res.status}`, detail: errorBody },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[s3/upload]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
