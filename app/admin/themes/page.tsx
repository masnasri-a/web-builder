import { db } from "@/lib/db"
import { ThemeForm } from "@/components/admin/theme-form"
import { ThemesManager } from "./themes-manager"
import type { ThemeConfig } from "@/types"

export default async function AdminThemesPage() {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Theme Manager</h1>
        <p className="text-muted-foreground">
          {themes.length} themes — kelola nama, thumbnail, warna, dan status
        </p>
      </div>

      {/* Create New Theme */}
      <div className="rounded-2xl border border-dashed border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">Create New Theme</h2>
        <ThemeForm />
      </div>

      {/* Edit Existing Themes */}
      <ThemesManager initialThemes={serialized} />
    </div>
  )
}
