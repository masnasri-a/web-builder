import { db } from "@/lib/db"
import { DEFAULT_CONFIGS } from "@/lib/tier"
import { TierConfigManager } from "./tier-config-manager"

const ROLE_TYPES = ["USER", "VENDOR"] as const
const TIERS = ["BASIC", "PRO", "PLATINUM", "LUXURY"] as const

async function ensureAll() {
  for (const roleType of ROLE_TYPES) {
    for (const tier of TIERS) {
      await db.tierConfig.upsert({
        where: { roleType_tier: { roleType, tier } },
        update: {},
        create: { roleType, tier, ...DEFAULT_CONFIGS[roleType][tier] },
      })
    }
  }
}

export default async function TiersPage() {
  await ensureAll()

  const [rawConfigs, themes] = await Promise.all([
    db.tierConfig.findMany({ orderBy: [{ roleType: "asc" }, { tier: "asc" }] }),
    db.theme.findMany({ select: { id: true, name: true, slug: true, isActive: true }, orderBy: { name: "asc" } }),
  ])

  const configs = rawConfigs.map(c => ({
    ...c,
    allowedThemeIds: (c.allowedThemeIds as string[] | null) ?? [],
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tier Configuration</h1>
        <p className="text-muted-foreground">
          Kelola harga, batas fitur, dan akses tema per paket untuk setiap tipe pengguna
        </p>
      </div>
      <TierConfigManager initialConfigs={configs} themes={themes} />
    </div>
  )
}
