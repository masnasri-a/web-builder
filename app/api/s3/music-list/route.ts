import { NextResponse } from "next/server"
import { listMusic } from "@/lib/s3"

export async function GET() {
  try {
    const files = await listMusic()
    return NextResponse.json({ files })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
