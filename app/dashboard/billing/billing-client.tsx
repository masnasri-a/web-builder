"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check, Sparkles, Zap, Crown, Gem,
  CalendarClock, Receipt, History, AlertTriangle, Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type TierConfig = {
  id: string
  tier: string
  label: string
  description: string
  ctaLabel: string
  price: number
  isPopular: boolean
  maxInvitations: number
  maxRsvpGuests: number
  maxGalleryImages: number
  allowMusic: boolean
  allowCustomDomain: boolean
  allowAnalytics: boolean
  allThemes: boolean
  allowBroadcast: boolean
}

type ActiveSub = {
  tier: string
  status: string
  startedAt: string
  expiresAt: string
}

type PaymentRecord = {
  id: string
  tier: string
  originalPrice: number
  finalPrice: number
  voucherCode: string | null
  status: string
  createdAt: string
  subscriptionExpiresAt: string | null
}

type TierHistoryRecord = {
  id: string
  fromTier: string
  toTier: string
  reason: string
  notes: string | null
  createdAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIER_ORDER = ["BASIC", "PRO", "PLATINUM", "LUXURY"]

const TIER_ICON: Record<string, React.ElementType> = {
  BASIC: Sparkles, PRO: Zap, PLATINUM: Crown, LUXURY: Gem,
}

const TIER_STYLE: Record<string, { border: string; icon: string }> = {
  BASIC:    { border: "border-border",    icon: "text-muted-foreground" },
  PRO:      { border: "border-primary",   icon: "text-primary" },
  PLATINUM: { border: "border-purple-400", icon: "text-purple-500" },
  LUXURY:   { border: "border-amber-400", icon: "text-amber-500" },
}

const REASON_LABEL: Record<string, string> = {
  PAYMENT:              "Pembayaran",
  SUBSCRIPTION_EXPIRED: "Langganan habis",
  ADMIN:                "Diubah admin",
  VOUCHER_FREE:         "Voucher gratis",
  CANCELLED:            "Dibatalkan",
  INITIAL:              "Awal",
}

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
  EXPIRED:   "bg-muted text-muted-foreground border-border",
}

function buildFeatures(cfg: TierConfig) {
  const inv = cfg.maxInvitations === 0 ? "Undangan tak terbatas" : `${cfg.maxInvitations} undangan`
  const rsvp = cfg.maxRsvpGuests === 0 ? "RSVP tak terbatas" : `Maks ${cfg.maxRsvpGuests} tamu`
  const gallery = cfg.maxGalleryImages === 0 ? "Galeri tak terbatas" : `Maks ${cfg.maxGalleryImages} foto`
  const feats = [inv, rsvp, gallery]
  if (cfg.allThemes) feats.push("Semua tema")
  if (cfg.allowMusic) feats.push("Musik latar")
  if (cfg.allowCustomDomain) feats.push("Custom domain")
  if (cfg.allowAnalytics) feats.push("Analitik")
  if (cfg.allowBroadcast) feats.push("Broadcast WA")
  return feats
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function daysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function isLifetime(iso: string) {
  return new Date(iso).getFullYear() >= 2099
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BillingClient({
  tiers,
  currentTier,
  activeSub,
  paymentHistory,
  tierHistory,
}: {
  tiers: TierConfig[]
  currentTier: string
  activeSub: ActiveSub | null
  paymentHistory: PaymentRecord[]
  tierHistory: TierHistoryRecord[]
}) {
  const router = useRouter()
  const [localTier] = useState(currentTier)
  const currentIdx = TIER_ORDER.indexOf(localTier)

  const subDays = activeSub ? daysLeft(activeSub.expiresAt) : 0
  const subIsLifetime = activeSub ? isLifetime(activeSub.expiresAt) : false
  const subExpiringSoon = !subIsLifetime && subDays <= 7 && subDays > 0

  return (
    <div className="space-y-8">

      {/* ── Active subscription banner ──────────────────────────────────────── */}
      {activeSub && activeSub.tier !== "BASIC" && (
        <div className={cn(
          "rounded-2xl border p-4 flex items-start gap-4",
          subExpiringSoon
            ? "border-amber-200 bg-amber-50"
            : "border-border bg-card"
        )}>
          <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
            <CalendarClock className={cn("h-4 w-4", subExpiringSoon ? "text-amber-600" : "text-primary")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm">
                Langganan {tiers.find(t => t.tier === activeSub.tier)?.label ?? activeSub.tier}
              </p>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                activeSub.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-muted text-muted-foreground border-border"
              )}>
                {activeSub.status === "ACTIVE" ? "Aktif" : activeSub.status}
              </span>
              {subExpiringSoon && (
                <span className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold">
                  <AlertTriangle className="h-3 w-3" /> Segera habis
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mulai: {fmtDate(activeSub.startedAt)}
              {" · "}
              {subIsLifetime
                ? "Seumur hidup"
                : `Berakhir: ${fmtDate(activeSub.expiresAt)} (${subDays} hari lagi)`}
            </p>
          </div>
        </div>
      )}

      {/* ── Tier cards ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-4">
          Pilih Paket
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map(t => {
            const tierIdx = TIER_ORDER.indexOf(t.tier)
            const isCurrent = t.tier === localTier
            const isDowngrade = tierIdx < currentIdx
            const isFree = t.price === 0
            const style = TIER_STYLE[t.tier] ?? TIER_STYLE.BASIC
            const Icon = TIER_ICON[t.tier] ?? Sparkles

            return (
              <div
                key={t.tier}
                className={cn(
                  "relative rounded-2xl border-2 bg-card p-5 shadow-sm transition-all",
                  style.border,
                  isCurrent && "ring-2 ring-primary/30"
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-4">
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Paket Aktif
                    </span>
                  </div>
                )}
                {t.isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-4">
                    <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold text-background">
                      Populer
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60", style.icon)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.label}</p>
                    {t.description && (
                      <p className="text-[11px] text-muted-foreground">{t.description}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold">
                    {t.price === 0 ? "Gratis" : `Rp ${(t.price / 1000).toFixed(0)}k`}
                  </span>
                  {t.price > 0 && <span className="text-xs text-muted-foreground ml-1">/ periode</span>}
                </div>

                <ul className="mb-5 space-y-1.5">
                  {buildFeatures(t).map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" className="w-full rounded-xl h-9 text-sm" disabled>
                    Paket Aktif
                  </Button>
                ) : isDowngrade ? (
                  <Button variant="ghost" className="w-full rounded-xl h-9 text-sm text-muted-foreground" disabled>
                    Tidak tersedia
                  </Button>
                ) : isFree ? (
                  <Button variant="outline" className="w-full rounded-xl h-9 text-sm" disabled>
                    Paket Gratis
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-xl h-9 text-sm"
                    onClick={() => router.push(`/dashboard/checkout?tier=${t.tier}`)}
                  >
                    {t.ctaLabel || `Upgrade ke ${t.label}`}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * Pembayaran via QRIS. Upgrade berlaku instan setelah konfirmasi.
        </p>
      </div>

      {/* ── Payment history ─────────────────────────────────────────────────── */}
      {paymentHistory.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Receipt className="h-3.5 w-3.5" /> Riwayat Pembayaran
          </p>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Paket</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Harga</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Voucher</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">Berakhir</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p, i) => {
                  const Icon = TIER_ICON[p.tier] ?? Sparkles
                  const hasDiscount = p.originalPrice !== p.finalPrice
                  const isLifetimeSub = p.subscriptionExpiresAt ? isLifetime(p.subscriptionExpiresAt) : false
                  return (
                    <tr key={p.id} className={cn("border-b border-border last:border-0", i % 2 === 0 ? "" : "bg-muted/20")}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-3.5 w-3.5 shrink-0", TIER_STYLE[p.tier]?.icon ?? "text-muted-foreground")} />
                          <span className="font-medium">{tiers.find(t => t.tier === p.tier)?.label ?? p.tier}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {hasDiscount ? (
                          <div>
                            <span className="font-semibold text-emerald-700">
                              Rp {p.finalPrice.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-through ml-1.5">
                              {p.originalPrice.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold">
                            {p.finalPrice === 0 ? "Gratis" : `Rp ${p.finalPrice.toLocaleString("id-ID")}`}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {p.voucherCode ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono">
                            <Tag className="h-3 w-3" /> {p.voucherCode}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs hidden md:table-cell">
                        {p.subscriptionExpiresAt
                          ? isLifetimeSub ? "Seumur hidup" : fmtDate(p.subscriptionExpiresAt)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          STATUS_STYLE[p.status] ?? STATUS_STYLE.EXPIRED
                        )}>
                          {p.status === "COMPLETED" ? "Selesai"
                            : p.status === "PENDING" ? "Menunggu"
                            : "Kedaluwarsa"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {fmtDateTime(p.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tier history ────────────────────────────────────────────────────── */}
      {tierHistory.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <History className="h-3.5 w-3.5" /> Riwayat Perubahan Tier
          </p>
          <div className="space-y-2">
            {tierHistory.map(h => {
              const FromIcon = TIER_ICON[h.fromTier] ?? Sparkles
              const ToIcon = TIER_ICON[h.toTier] ?? Sparkles
              const isDowngradeEvent = TIER_ORDER.indexOf(h.toTier) < TIER_ORDER.indexOf(h.fromTier)
              return (
                <div key={h.id} className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    isDowngradeEvent ? "bg-amber-50" : "bg-emerald-50"
                  )}>
                    <History className={cn("h-3.5 w-3.5", isDowngradeEvent ? "text-amber-600" : "text-emerald-600")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <FromIcon className={cn("h-3.5 w-3.5", TIER_STYLE[h.fromTier]?.icon)} />
                        <span className="text-xs font-medium">
                          {tiers.find(t => t.tier === h.fromTier)?.label ?? h.fromTier}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">→</span>
                      <div className="flex items-center gap-1">
                        <ToIcon className={cn("h-3.5 w-3.5", TIER_STYLE[h.toTier]?.icon)} />
                        <span className="text-xs font-semibold">
                          {tiers.find(t => t.tier === h.toTier)?.label ?? h.toTier}
                        </span>
                      </div>
                      <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {REASON_LABEL[h.reason] ?? h.reason}
                      </span>
                    </div>
                    {h.notes && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{h.notes}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5">{fmtDateTime(h.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
