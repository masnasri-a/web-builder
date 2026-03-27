import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"
import { syncFaqsToPinecone } from "@/lib/pinecone"

// PATCH /api/super-admin/faq/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const data = await req.json()

  const faq = await db.faqItem.update({
    where: { id },
    data: {
      ...(data.question !== undefined && { question: data.question }),
      ...(data.answer !== undefined && { answer: data.answer }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  })

  syncFaqsToPinecone().catch(err => console.error("[faq] pinecone sync error:", err))
  return NextResponse.json(faq)
}

// DELETE /api/super-admin/faq/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  await db.faqItem.delete({ where: { id } })
  syncFaqsToPinecone().catch(err => console.error("[faq] pinecone sync error:", err))
  return NextResponse.json({ ok: true })
}
