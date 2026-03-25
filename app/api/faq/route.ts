import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/faq — public, returns active FAQs ordered by `order`
export async function GET() {
  try {
    const faqs = await db.faqItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, question: true, answer: true },
      take: 3,
    })
    return NextResponse.json(faqs)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
