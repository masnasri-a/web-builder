import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { syncFaqsToPinecone } from "@/lib/pinecone"

// GET /api/super-admin/faq — all FAQs (incl. inactive)
export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const faqs = await db.faqItem.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(faqs)
}

// POST /api/super-admin/faq — create FAQ
export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { question, answer, order } = await req.json()
  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: "question and answer are required" }, { status: 400 })
  }

  const faq = await db.faqItem.create({
    data: { question: question.trim(), answer: answer.trim(), order: order ?? 0 },
  })

  // Background sync — don't block the response
  syncFaqsToPinecone().catch(err => console.error("[faq] pinecone sync error:", err))

  return NextResponse.json(faq, { status: 201 })
}
