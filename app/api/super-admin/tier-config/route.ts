import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isAdminRole } from "@/lib/utils"
import { DEFAULT_CONFIGS } from "@/lib/tier"
import { invalidate } from "@/lib/redis"

const ROLE_TYPES = ["USER", "VENDOR"] as const
const TIERS = ["BASIC", "PRO", "PLATINUM", "LUXURY"] as const

/** Ensure all 6 TierConfig rows exist (auto-seed missing). */
async function ensureAllConfigs() {
  for (const roleType of ROLE_TYPES) {
    for (const tier of TIERS) {
      const exists = await db.tierConfig.findUnique({
        where: { roleType_tier: { roleType, tier } },
      })
      if (!exists) {
        await db.tierConfig.create({
          data: { roleType, tier, ...DEFAULT_CONFIGS[roleType][tier] },
        })
      }
    }
  }
}

// GET /api/super-admin/tier-config — all 6 configs + themes list
export async function GET() {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await ensureAllConfigs()

  const [configs, themes] = await Promise.all([
    db.tierConfig.findMany({ orderBy: [{ roleType: "asc" }, { tier: "asc" }] }),
    db.theme.findMany({ select: { id: true, name: true, slug: true, isActive: true }, orderBy: { name: "asc" } }),
  ])

  return NextResponse.json({ configs, themes })
}

// PATCH /api/super-admin/tier-config — update one config cell
// body: { roleType, tier, ...fields }
export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { roleType, tier, ...data } = await req.json()

  if (!ROLE_TYPES.includes(roleType) || !TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid roleType or tier" }, { status: 400 })
  }

  const updated = await db.tierConfig.upsert({
    where: { roleType_tier: { roleType, tier } },
    update: data,
    create: { roleType, tier, ...DEFAULT_CONFIGS[roleType][tier], ...data },
  })

  await invalidate("tier-configs", "landing:tiers")

  return NextResponse.json(updated)
}
