import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["INDIVIDUAL", "VENDOR"]).default("INDIVIDUAL"),
  // Vendor-only
  shopName: z.string().min(1).max(100).optional(),
  description: z.string().max(300).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role, shopName, description } = parsed.data

    if (role === "VENDOR" && !shopName?.trim()) {
      return NextResponse.json(
        { error: "Shop name is required for vendor registration" },
        { status: 400 }
      )
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: { name, email, passwordHash, role },
    })

    if (role === "VENDOR") {
      await db.vendorProfile.create({
        data: {
          userId: user.id,
          shopName: shopName!.trim(),
          description: description?.trim() ?? null,
          discount: 5.0,
        },
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
