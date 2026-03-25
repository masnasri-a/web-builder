import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const schema = z.object({
  tier: z.enum(["BASIC", "PRO", "PLATINUM", "LUXURY"]),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid tier" }, { status: 400 })

  const { tier } = parsed.data
  const creatorId = process.env.SAWERIA_CREATOR_ID

  if (!creatorId) return NextResponse.json({ error: "Payment not configured" }, { status: 503 })

  // Get price from DB
  const roleType = session.user.role === "VENDOR" ? "VENDOR" : "USER"
  const tierConfig = await db.tierConfig.findUnique({
    where: { roleType_tier: { roleType, tier } },
  })

  if (!tierConfig || tierConfig.price === 0) {
    return NextResponse.json({ error: "This tier is free — no payment needed" }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  })

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = {
    agree: true,
    notUnderage: true,
    message: tier,
    amount: String(tierConfig.price),
    payment_type: "qris",
    vote: "",
    currency: "IDR",
    customer_info: {
      first_name: user.name ?? user.email!.split("@")[0],
      email: user.email ?? "",
      phone: "",
    },
  }

  try {
    const res = await fetch(
      `https://backend.saweria.co/donations/snap/${creatorId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Payment gateway error: ${err}` }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({
      payment_id: data.data.id,
      qr_string: data.data.qr_string,
      amount: data.data.etc?.amount_to_display ?? tierConfig.price,
      tier,
      label: tierConfig.label || tier,
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach payment gateway" }, { status: 502 })
  }
}
