import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { uploadFile } from "@/lib/s3"

export const GIFT_PROOF_BUCKET = "gift-proofs"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

/**
 * POST /api/gift-proof
 * Public endpoint — no auth required.
 * Accepts multipart/form-data:
 *   - invitationId  : required
 *   - guestName     : required
 *   - proofFile     : required (image)
 *   - amount        : optional (IDR integer string)
 *   - bankFrom      : optional (sender's bank)
 *   - note          : optional (personal message)
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const invitationId = formData.get("invitationId") as string | null
    const guestName = (formData.get("guestName") as string | null)?.trim()
    const proofFile = formData.get("proofFile") as File | null
    const amount = formData.get("amount") as string | null
    const bankFrom = (formData.get("bankFrom") as string | null)?.trim() || null
    const note = (formData.get("note") as string | null)?.trim() || null

    if (!invitationId || !guestName || !proofFile) {
      return NextResponse.json(
        { error: "invitationId, guestName, and proofFile are required" },
        { status: 400 }
      )
    }

    // Validate invitation exists and allows transfer proof
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      select: { id: true, sections: true },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    const buffer = Buffer.from(await proofFile.arrayBuffer())

    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5 MB)" },
        { status: 413 }
      )
    }

    const safeName = proofFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
    const key = `${invitationId}/${Date.now()}-${safeName}`
    const proofUrl = await uploadFile(
      GIFT_PROOF_BUCKET,
      key,
      buffer,
      proofFile.type || "image/jpeg"
    )

    const giftProof = await db.giftProof.create({
      data: {
        invitationId,
        guestName,
        proofUrl,
        amount: amount ? parseInt(amount, 10) : null,
        bankFrom,
        note,
      },
    })

    return NextResponse.json({ success: true, id: giftProof.id })
  } catch (err) {
    console.error("[gift-proof]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
