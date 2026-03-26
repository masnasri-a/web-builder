import { db } from "@/lib/db"
import { ThemesManager } from "./themes-manager"
import type { ThemeConfig } from "@/types"

export default async function SuperAdminThemesPage() {
  const themes = await db.theme.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { invitations: true } } },
  })

  const serialized = themes.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    previewImage: t.previewImage,
    config: t.config as ThemeConfig,
    isActive: t.isActive,
    usageCount: t._count.invitations,
    createdAt: t.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Theme Manager</h1>
        <p className="text-muted-foreground">
          Kelola nama, thumbnail, warna, dan status tema undangan
        </p>
      </div>
      <ThemesManager initialThemes={serialized} />
    </div>
  )
}
