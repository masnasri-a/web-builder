"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Loader2, Save, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ThemeConfig } from "@/types"

interface ThemeItem {
  id: string
  name: string
  slug: string
  previewImage: string | null
  config: ThemeConfig
  isActive: boolean
  usageCount: number
  createdAt: string
}

export function ThemesManager({
  initialThemes,
}: {
  initialThemes: ThemeItem[]
}) {
  const [themes, setThemes] = useState(initialThemes)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  function updateLocal(id: string, patch: Partial<ThemeItem>) {
    setThemes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    )
  }

  function updateConfig(id: string, configPatch: Partial<ThemeConfig>) {
    setThemes((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, config: { ...t.config, ...configPatch } } : t
      )
    )
  }

  async function handleSave(id: string) {
    setSavingId(id)
    const theme = themes.find((t) => t.id === id)!

    const res = await fetch("/api/super-admin/themes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: theme.id,
        name: theme.name,
        slug: theme.slug,
        previewImage: theme.previewImage,
        config: theme.config,
        isActive: theme.isActive,
      }),
    })

    setSavingId(null)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || "Gagal menyimpan")
      return
    }

    toast.success(`${theme.name} tersimpan`)
  }

  async function handleUpload(id: string, file: File) {
    setUploadingId(id)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("themeId", id)

    const res = await fetch("/api/super-admin/themes/upload", {
      method: "POST",
      body: formData,
    })

    setUploadingId(null)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || "Upload gagal")
      return
    }

    const { url } = await res.json()
    updateLocal(id, { previewImage: url })
    toast.success("Thumbnail di-upload")
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {themes.map((theme) => {
        const isSaving = savingId === theme.id
        const isUploading = uploadingId === theme.id

        return (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSaving={isSaving}
            isUploading={isUploading}
            onUpdate={(patch) => updateLocal(theme.id, patch)}
            onUpdateConfig={(patch) => updateConfig(theme.id, patch)}
            onSave={() => handleSave(theme.id)}
            onUpload={(file) => handleUpload(theme.id, file)}
          />
        )
      })}

      {themes.length === 0 && (
        <p className="col-span-2 py-12 text-center text-sm text-muted-foreground">
          Belum ada tema
        </p>
      )}
    </div>
  )
}

function ThemeCard({
  theme,
  isSaving,
  isUploading,
  onUpdate,
  onUpdateConfig,
  onSave,
  onUpload,
}: {
  theme: ThemeItem
  isSaving: boolean
  isUploading: boolean
  onUpdate: (patch: Partial<ThemeItem>) => void
  onUpdateConfig: (patch: Partial<ThemeConfig>) => void
  onSave: () => void
  onUpload: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rounded-2xl border-2 border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {/* Color swatches */}
          <div className="flex gap-1">
            <div
              className="h-6 w-6 rounded-lg"
              style={{ backgroundColor: theme.config.primaryColor }}
            />
            <div
              className="h-6 w-6 rounded-lg"
              style={{ backgroundColor: theme.config.accentColor }}
            />
            <div
              className="h-6 w-6 rounded-lg border border-border"
              style={{ backgroundColor: theme.config.bgColor }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{theme.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {theme.usageCount} undangan · {theme.config.fontFamily}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              theme.isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {theme.isActive ? "Active" : "Hidden"}
          </span>
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Simpan
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Thumbnail */}
        <section className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Thumbnail
          </p>
          <div className="flex items-start gap-4">
            <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
              {theme.previewImage ? (
                <img
                  src={theme.previewImage}
                  alt={theme.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onUpload(file)
                  e.target.value = ""
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Max 5 MB · JPG/PNG
              </p>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Info
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nama</Label>
              <Input
                value={theme.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Slug</Label>
              <Input
                value={theme.slug}
                onChange={(e) => onUpdate({ slug: e.target.value })}
                className="h-8 text-sm font-mono"
              />
            </div>
          </div>
        </section>

        {/* Config */}
        <section className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Warna & Font
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ColorField
              label="Primary"
              value={theme.config.primaryColor}
              onChange={(v) => onUpdateConfig({ primaryColor: v })}
            />
            <ColorField
              label="Secondary"
              value={theme.config.secondaryColor}
              onChange={(v) => onUpdateConfig({ secondaryColor: v })}
            />
            <ColorField
              label="Accent"
              value={theme.config.accentColor}
              onChange={(v) => onUpdateConfig({ accentColor: v })}
            />
            <ColorField
              label="Background"
              value={theme.config.bgColor}
              onChange={(v) => onUpdateConfig({ bgColor: v })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Font Family</Label>
            <Input
              value={theme.config.fontFamily}
              onChange={(e) => onUpdateConfig({ fontFamily: e.target.value })}
              className="h-8 text-sm"
              placeholder="e.g. Cormorant Garamond"
            />
          </div>
        </section>

        {/* Status */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <ToggleRow
            label="Aktif (tampil di pilihan user)"
            value={theme.isActive}
            onChange={(v) => onUpdate({ isActive: v })}
          />
        </section>

        {/* Footer */}
        <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            Dibuat{" "}
            {new Date(theme.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-sm font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          value ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}
