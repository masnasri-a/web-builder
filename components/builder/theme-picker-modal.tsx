"use client"

import { useState } from "react"
import { Palette, Check, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { themeRegistry } from "@/lib/themeRegistry"
import type { ThemeConfig } from "@/types"

interface ThemePickerModalProps {
  themeSlug: string
  themeConfig: ThemeConfig
  onThemeChange: (slug: string) => void
  onThemeConfigChange: (config: Partial<ThemeConfig>) => void
}

const COLOR_FIELDS: { key: keyof ThemeConfig; label: string }[] = [
  { key: "primaryColor", label: "Primary" },
  { key: "bgColor", label: "Background" },
  { key: "accentColor", label: "Accent" },
  { key: "secondaryColor", label: "Secondary" },
]

const FONT_OPTIONS = [
  "Playfair Display",
  "Cormorant Garamond",
  "Cinzel",
  "Great Vibes",
  "Lora",
  "Dancing Script",
]

export function ThemePickerModal({
  themeSlug,
  themeConfig,
  onThemeChange,
  onThemeConfigChange,
}: ThemePickerModalProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"presets" | "custom">("presets")

  const activeEntry = themeRegistry.find((e) => e.id === themeSlug)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:border-muted-foreground/40">
          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: activeEntry?.previewColor ?? themeConfig.primaryColor }}
            />
            <span className="font-medium truncate">
              {activeEntry?.name ?? "Custom"}
            </span>
          </div>
          <Palette className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex rounded-xl border border-border bg-muted p-1 gap-1">
          <button
            onClick={() => setTab("presets")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              tab === "presets" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            Preset Themes
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              tab === "custom" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <Sliders className="mr-1.5 inline h-3 w-3" />
            Custom
          </button>
        </div>

        {tab === "presets" ? (
          <div className="grid grid-cols-2 gap-2">
            {themeRegistry.map((entry) => {
              const isActive = entry.id === themeSlug
              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    onThemeChange(entry.id)
                    setOpen(false)
                  }}
                  className={`relative flex flex-col gap-2 rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-muted-foreground/40"
                  }`}
                >
                  {/* Color preview strip */}
                  <div className="flex gap-1">
                    <div
                      className="h-6 flex-1 rounded-md"
                      style={{ backgroundColor: entry.defaultConfig.bgColor }}
                    />
                    <div
                      className="h-6 w-6 rounded-md"
                      style={{ backgroundColor: entry.defaultConfig.primaryColor }}
                    />
                    <div
                      className="h-6 w-6 rounded-md"
                      style={{ backgroundColor: entry.defaultConfig.accentColor }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium leading-tight">{entry.name}</span>
                    {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}

            {/* Custom option */}
            <button
              onClick={() => {
                onThemeChange("")
                setTab("custom")
              }}
              className={`flex flex-col gap-2 rounded-xl border p-3 text-left transition-all ${
                !themeSlug
                  ? "border-primary bg-primary/5"
                  : "border-dashed border-border bg-card hover:border-muted-foreground/40"
              }`}
            >
              <div className="flex h-6 items-center gap-1">
                <Sliders className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Custom</span>
                {!themeSlug && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Edit colors &amp; font manually
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Color pickers */}
            <div className="grid grid-cols-2 gap-3">
              {COLOR_FIELDS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{label}</label>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-1.5">
                    <input
                      type="color"
                      value={(themeConfig[key] as string) ?? "#000000"}
                      onChange={(e) => onThemeConfigChange({ [key]: e.target.value })}
                      className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {(themeConfig[key] as string)?.toUpperCase() ?? ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Font picker */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Font Family</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font}
                    onClick={() => onThemeConfigChange({ fontFamily: font })}
                    className={`rounded-xl border px-3 py-2 text-left text-xs transition-all ${
                      themeConfig.fontFamily === font
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-background hover:border-muted-foreground/40"
                    }`}
                    style={{ fontFamily: `"${font}", serif` }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
