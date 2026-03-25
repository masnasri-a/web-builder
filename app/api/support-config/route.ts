import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/support-config — public, returns WA number + message
export async function GET() {
  try {
    const config = await db.supportConfig.findFirst()
    return NextResponse.json(config ?? { waNumber: "", waMessage: "" })
  } catch {
    return NextResponse.json({ waNumber: "", waMessage: "" }, { status: 200 })
  }
}
