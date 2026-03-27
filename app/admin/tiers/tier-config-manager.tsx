"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Theme = { id: string; name: string; slug: string; isActive: boolean; previewImage: string | null; config: { primaryColor?: string; accentColor?: string } | null }
type TierConfig = {
  id: string
  roleType: string
  tier: string
  label: string
  description: string
  isPopular: boolean
  isVisible: boolean
  ctaLabel: string
  price: number
  originalPrice: number
  maxInvitations: number
  maxRsvpGuests: number
  maxGalleryImages: number
  allowGallery: boolean
  allowMusic: boolean
  allowCountdown: boolean
  allowRsvp: boolean
  allowMaps: boolean
  allowGift: boolean
  allowUcapan: boolean
  allowQuote: boolean
  allowBroadcast: boolean
  allowCustomDomain: boolean
  allowAnalytics: boolean
  allThemes: boolean
  allowedThemeIds: string[]
}

const TIERS = ["BASIC", "PRO", "PLATINUM", "LUXURY"] as const

const TIER_COLORS: Record<string, string> = {
  BASIC: "border-border",
  PRO: "border-primary",
  PLATINUM: "border-purple-400",
  LUXURY: "border-amber-400",
}
const TIER_BADGE: Record<string, string> = {
  BASIC: "bg-muted text-muted-foreground",
  PRO: "bg-primary text-primary-foreground",
  PLATINUM: "bg-purple-500 text-white",
  LUXURY: "bg-amber-500 text-white",
}

const SECTION_FLAGS: { key: keyof TierConfig; label: string }[] = [
  { key: "allowGallery", label: "Galeri Foto" },
  { key: "allowMusic", label: "Musik Latar" },
  { key: "allowCountdown", label: "Countdown" },
  { key: "allowRsvp", label: "RSVP Tamu" },
  { key: "allowMaps", label: "Peta Lokasi" },
  { key: "allowGift", label: "Hadiah/Transfer" },
  { key: "allowUcapan", label: "Ucapan & Doa" },
  { key: "allowQuote", label: "Quote" },
]

const PLATFORM_FLAGS: { key: keyof TierConfig; label: string }[] = [
  { key: "allowBroadcast", label: "Broadcast WhatsApp" },
  { key: "allowCustomDomain", label: "Custom Domain" },
  { key: "allowAnalytics", label: "Analitik" },
]

function formatIDR(val: number) {
  return val === 0 ? "Gratis" : `Rp ${val.toLocaleString("id-ID")}`
}

function limitLabel(val: number) {
  return val === 0 ? "Tak terbatas" : String(val)
}

export function TierConfigManager({
  initialConfigs,
  themes,
}: {
  initialConfigs: TierConfig[]
  themes: Theme[]
}) {
  const [configs, setConfigs] = useState(initialConfigs)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"USER" | "VENDOR">("USER")

  function getConfig(roleType: string, tier: string) {
    return configs.find(c => c.roleType === roleType && c.tier === tier)!
  }

  function updateLocal(roleType: string, tier: string, patch: Partial<TierConfig>) {
    setConfigs(prev =>
      prev.map(c => (c.roleType === roleType && c.tier === tier ? { ...c, ...patch } : c))
    )
  }

  async function handleSave(roleType: string, tier: string) {
    const key = `${roleType}_${tier}`
    setSaving(key)
    const cfg = getConfig(roleType, tier)

    const res = await fetch("/api/super-admin/tier-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cfg),
    })

    setSaving(null)
    if (!res.ok) { toast.error("Gagal menyimpan"); return }
    const updated = await res.json()
    setConfigs(prev => prev.map(c => (c.roleType === roleType && c.tier === tier ? updated : c)))
    toast.success(`${roleType} ${tier} tersimpan`)
  }

  function toggleTheme(roleType: string, tier: string, themeId: string) {
    const cfg = getConfig(roleType, tier)
    const ids = cfg.allowedThemeIds ?? []
    const next = ids.includes(themeId) ? ids.filter(id => id !== themeId) : [...ids, themeId]
    updateLocal(roleType, tier, { allowedThemeIds: next })
  }

  const roleLabel = { USER: "Individual / User", VENDOR: "Vendor" }

  return (
    <div className="space-y-6">
      {/* Tab */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 w-fit">
        {(["USER", "VENDOR"] as const).map(rt => (
          <button
            key={rt}
            onClick={() => setActiveTab(rt)}
            className={`rounded-lg px-5 py-1.5 text-sm font-medium transition-colors ${
              activeTab === rt
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {roleLabel[rt]}
          </button>
        ))}
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
        {TIERS.map(tier => {
          const cfg = getConfig(activeTab, tier)
          if (!cfg) return null
          const key = `${activeTab}_${tier}`
          const isSaving = saving === key

          return (
            <div key={tier} className={`rounded-2xl border-2 bg-card shadow-sm overflow-hidden ${TIER_COLORS[tier]}`}>
              {/* Card header */}
              <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${TIER_BADGE[tier]}`}>
                    {tier}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">{formatIDR(cfg.price)}/bln</span>
                </div>
                <Button size="sm" onClick={() => handleSave(activeTab, tier)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Simpan
                </Button>
              </div>

              <div className="p-5 space-y-5">
                {/* Display */}
                <section className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tampilan Landing</p>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={cfg.label}
                        onChange={e => updateLocal(activeTab, tier, { label: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="e.g. Basic"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Deskripsi</Label>
                      <Input
                        value={cfg.description}
                        onChange={e => updateLocal(activeTab, tier, { description: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="Tagline singkat"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tombol CTA</Label>
                      <Input
                        value={cfg.ctaLabel}
                        onChange={e => updateLocal(activeTab, tier, { ctaLabel: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <ToggleRow label="Tampilkan di Landing" value={cfg.isVisible} onChange={v => updateLocal(activeTab, tier, { isVisible: v })} />
                    <ToggleRow label="Badge Most Popular" value={cfg.isPopular} onChange={v => updateLocal(activeTab, tier, { isPopular: v })} />
                  </div>
                </section>

                {/* Pricing */}
                <section className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Harga & Batas</p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Harga (IDR/bulan)</Label>
                        <Input
                          type="number" min="0" step="1000"
                          value={cfg.price}
                          onChange={e => updateLocal(activeTab, tier, { price: parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Harga Coret (0 = tidak ada)</Label>
                        <Input
                          type="number" min="0" step="1000"
                          value={cfg.originalPrice}
                          onChange={e => updateLocal(activeTab, tier, { originalPrice: parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                          placeholder="e.g. 150000"
                        />
                        {cfg.originalPrice > 0 && cfg.originalPrice > cfg.price && (
                          <p className="text-[10px] text-muted-foreground">
                            Diskon {Math.round(((cfg.originalPrice - cfg.price) / cfg.originalPrice) * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "maxInvitations" as const, label: "Undangan" },
                        { key: "maxRsvpGuests" as const, label: "RSVP" },
                        { key: "maxGalleryImages" as const, label: "Foto" },
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs">{label}</Label>
                          <Input
                            type="number" min="0"
                            value={cfg[key] as number}
                            onChange={e => updateLocal(activeTab, tier, { [key]: parseInt(e.target.value) || 0 })}
                            className="h-8 text-sm"
                            title="0 = tak terbatas"
                          />
                          <p className="text-[10px] text-muted-foreground">{limitLabel(cfg[key] as number)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Sections */}
                <section className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</p>
                  <div className="space-y-1.5">
                    {SECTION_FLAGS.map(({ key, label }) => (
                      <ToggleRow
                        key={key}
                        label={label}
                        value={cfg[key] as boolean}
                        onChange={v => updateLocal(activeTab, tier, { [key]: v })}
                      />
                    ))}
                  </div>
                </section>

                {/* Platform features */}
                <section className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</p>
                  <div className="space-y-1.5">
                    {PLATFORM_FLAGS.map(({ key, label }) => (
                      <ToggleRow
                        key={key}
                        label={label}
                        value={cfg[key] as boolean}
                        onChange={v => updateLocal(activeTab, tier, { [key]: v })}
                      />
                    ))}
                  </div>
                </section>

                {/* Theme access */}
                <section className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Akses Tema</p>
                  <ToggleRow
                    label="Semua tema"
                    value={cfg.allThemes}
                    onChange={v => updateLocal(activeTab, tier, { allThemes: v })}
                  />
                  {!cfg.allThemes && (
                    <div className="mt-2 rounded-xl border border-border bg-muted/30 p-3">
                      <p className="text-[11px] text-muted-foreground mb-2">Pilih tema yang diizinkan:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {themes.map(theme => {
                          const checked = (cfg.allowedThemeIds ?? []).includes(theme.id)
                          const cfg2 = theme.config as { primaryColor?: string; accentColor?: string } | null
                          return (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => toggleTheme(activeTab, tier, theme.id)}
                              className={`group relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all text-center ${
                                checked
                                  ? "border-primary bg-primary/5"
                                  : "border-transparent bg-card hover:border-border"
                              }`}
                            >
                              {/* Thumbnail / color swatch */}
                              <div className="relative h-14 w-full overflow-hidden rounded-lg bg-muted">
                                {theme.previewImage ? (
                                  <img
                                    src={theme.previewImage}
                                    alt={theme.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center gap-1">
                                    <div className="h-5 w-5 rounded" style={{ backgroundColor: cfg2?.primaryColor ?? "#888" }} />
                                    <div className="h-5 w-5 rounded" style={{ backgroundColor: cfg2?.accentColor ?? "#aaa" }} />
                                  </div>
                                )}
                                {/* Hover preview tooltip */}
                                {theme.previewImage && (
                                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 group-hover:block">
                                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                                      <img
                                        src={theme.previewImage}
                                        alt={theme.name}
                                        className="h-48 w-32 object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <span className="text-[11px] font-medium leading-tight">{theme.name}</span>
                              {!theme.isActive && (
                                <span className="text-[9px] text-muted-foreground">(nonaktif)</span>
                              )}
                              {/* Check indicator */}
                              {checked && (
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      {themes.length === 0 && (
                        <p className="text-xs text-muted-foreground">Belum ada tema</p>
                      )}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        * Nilai 0 pada batas Undangan / RSVP / Foto berarti tidak terbatas. Perubahan berlaku setelah di-save.
      </p>
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
