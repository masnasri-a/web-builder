import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdminRole } from "@/lib/utils"
import { syncFaqsToPinecone } from "@/lib/pinecone"

// POST /api/super-admin/faq-sync — re-embed all active FAQs into Pinecone
export async function POST() {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const result = await syncFaqsToPinecone()
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error("[faq-sync]", err)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
