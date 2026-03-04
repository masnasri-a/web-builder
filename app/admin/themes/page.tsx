import { db } from "@/lib/db"
import { ThemeForm } from "@/components/admin/theme-form"
import { Badge } from "@/components/ui/badge"
import type { ThemeConfig } from "@/types"

export default async function AdminThemesPage() {
  const themes = await db.theme.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invitations: true } } },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Theme Manager</h1>
        <p className="text-sm text-muted-foreground">
          {themes.length} themes — manage colors, fonts, and styles
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Create Theme Form */}
        <div className="rounded-2xl border border-dashed border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Create New Theme</h2>
          <ThemeForm />
        </div>

        {/* Theme List */}
        <div className="space-y-3">
          {themes.map((theme) => {
            const config = theme.config as ThemeConfig
            return (
              <div
                key={theme.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {/* Color preview */}
                  <div className="flex gap-1">
                    <div
                      className="h-6 w-6 rounded-lg"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                    <div
                      className="h-6 w-6 rounded-lg"
                      style={{ backgroundColor: config.accentColor }}
                    />
                    <div
                      className="h-6 w-6 rounded-lg border border-border"
                      style={{ backgroundColor: config.bgColor }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {config.fontFamily} · {theme._count.invitations} uses
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={theme.isActive ? "default" : "secondary"}>
                    {theme.isActive ? "Active" : "Hidden"}
                  </Badge>
                  <ToggleThemeButton themeId={theme.id} isActive={theme.isActive} />
                </div>
              </div>
            )
          })}
          {themes.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No themes yet. Create one!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleThemeButton({
  themeId,
  isActive,
}: {
  themeId: string
  isActive: boolean
}) {
  async function toggle() {
    "use server"
    await db.theme.update({
      where: { id: themeId },
      data: { isActive: !isActive },
    })
  }

  return (
    <form action={toggle}>
      <button
        type="submit"
        className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
      >
        {isActive ? "Hide" : "Show"}
      </button>
    </form>
  )
}
