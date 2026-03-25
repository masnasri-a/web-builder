import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getTierConfig } from "@/lib/tier"

// GET /api/tier-config — returns current user's tier limits + feature flags
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const config = await getTierConfig(session.user.id)
  return NextResponse.json(config)
}
