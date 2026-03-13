"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugify } from "@/lib/utils"
import { DEFAULT_THEME_CONFIG } from "@/types"
import { themeRegistry } from "@/lib/themeRegistry"

export function ThemeForm() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [config, setConfig] = useState({ ...DEFAULT_THEME_CONFIG })

  function loadFromTemplate(slug: string) {
    if (!slug) return
    const entry = themeRegistry.find((t) => t.id === slug)
    if (!entry) return
    setName(entry.name)
    setConfig({ ...entry.defaultConfig })
    toast.info(`Template "${entry.name}" loaded`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/admin/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slugify(name),
        config,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      toast.error("Failed to create theme")
      return
    }

    toast.success(`Theme "${name}" created!`)
    setName("")
    setConfig({ ...DEFAULT_THEME_CONFIG })
  }

  function updateConfig(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Load from template ── */}
      <div className="space-y-1.5">
        <Label className="text-xs">Load from Template</Label>
        <div className="flex items-center gap-2">
          <select
            defaultValue=""
            onChange={(e) => loadFromTemplate(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">— choose a preset —</option>
            {themeRegistry.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {/* colour swatches */}
          <div className="flex gap-1">
            {themeRegistry.map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.name}
                onClick={() => loadFromTemplate(t.id)}
                className="h-6 w-6 rounded-full border-2 border-background ring-1 ring-border transition-transform hover:scale-110"
                style={{ backgroundColor: t.previewColor }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Theme Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Classic Elegance"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Primary Color", key: "primaryColor" },
          { label: "Accent Color", key: "accentColor" },
          { label: "Secondary Color", key: "secondaryColor" },
          { label: "Background", key: "bgColor" },
        ].map(({ label, key }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">{label}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config[key as keyof typeof config] ?? "#ffffff"}
                onChange={(e) => updateConfig(key, e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
              />
              <Input
                value={config[key as keyof typeof config] ?? ""}
                onChange={(e) => updateConfig(key, e.target.value)}
                className="font-mono text-xs uppercase"
                maxLength={7}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Font Family</Label>
        <Input
          value={config.fontFamily}
          onChange={(e) => updateConfig("fontFamily", e.target.value)}
          placeholder="Playfair Display"
        />
      </div>

      <div className="rounded-xl border border-border p-3 text-xs font-mono">
        <p className="mb-1 text-muted-foreground">JSON Preview:</p>
        <pre className="overflow-auto text-[10px]">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Creating..." : "Create Theme"}
      </Button>
    </form>
  )
}
