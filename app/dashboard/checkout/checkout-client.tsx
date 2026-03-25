"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import QRCode from "react-qr-code"
import {
  ArrowLeft, Check, CheckCircle2, ChevronRight, Loader2,
  RefreshCw, Tag, X, AlertCircle, ShieldCheck, Zap, Crown, Gem, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ClaimedVoucher = {
  id: string
  code: string
  type: string
  description: string
  discountPercent: number | null
  expiresAt: string | null
}

type TierFeatures = {
  maxInvitations: number
  maxRsvpGuests: number
  maxGalleryImages: number
  allowMusic: boolean
  allowCustomDomain: boolean
  allowAnalytics: boolean
  allowBroadcast: boolean
  allThemes: boolean
}

type PricingPreview = {
  originalPrice: number
  discountPercent: number
  discountAmount: number
  finalPrice: number
  voucherCode: string | null
  voucherType: string | null
  voucherDescription: string | null
  voucherError: string | null
}

type PaymentData = {
  payment_id: string
  qr_string: string
  amount: number
  originalAmount: number
  discountAmount: number
  tier: string
  label: string
}

type Phase = "checkout" | "loading" | "qr" | "success" | "error"

const TIER_ICON: Record<string, React.ElementType> = {
  BASIC: Sparkles,
  PRO: Zap,
  PLATINUM: Crown,
  LUXURY: Gem,
}

const TIER_COLOR: Record<string, string> = {
  BASIC: "text-muted-foreground",
  PRO: "text-primary",
  PLATINUM: "text-purple-500",
  LUXURY: "text-amber-500",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutClient({
  tier,
  tierLabel,
  tierDescription,
  originalPrice,
  tierFeatures,
  claimedVouchers,
}: {
  tier: string
  tierLabel: string
  tierDescription: string
  originalPrice: number
  tierFeatures: TierFeatures
  currentTier: string
  claimedVouchers: ClaimedVoucher[]
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>("checkout")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [payment, setPayment] = useState<PaymentData | null>(null)

  // Voucher state
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null)
  const [inputCode, setInputCode] = useState("")
  const [preview, setPreview] = useState<PricingPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const previewDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Polling
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [, startTransition] = useTransition()

  const Icon = TIER_ICON[tier] ?? Sparkles
  const iconColor = TIER_COLOR[tier] ?? "text-muted-foreground"

  // ── Voucher logic ──────────────────────────────────────────────────────────

  const activeVoucherCode = selectedVoucher ?? (inputCode.trim() || undefined)

  async function fetchPreview(code?: string) {
    setPreviewLoading(true)
    try {
      const params = new URLSearchParams({ tier })
      if (code) params.set("voucher", code)
      const res = await fetch(`/api/checkout/preview?${params}`)
      const data: PricingPreview = await res.json()
      setPreview(data)
    } catch {
      setPreview(null)
    } finally {
      setPreviewLoading(false)
    }
  }

  // Fetch base preview on mount (no voucher)
  useEffect(() => {
    fetchPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced preview when voucher changes
  useEffect(() => {
    if (previewDebounce.current) clearTimeout(previewDebounce.current)
    previewDebounce.current = setTimeout(() => {
      fetchPreview(activeVoucherCode)
    }, 400)
    return () => {
      if (previewDebounce.current) clearTimeout(previewDebounce.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVoucherCode])

  function handleSelectClaimed(code: string) {
    setInputCode("")
    setSelectedVoucher(prev => (prev === code ? null : code))
  }

  function handleInputChange(val: string) {
    setSelectedVoucher(null)
    setInputCode(val)
  }

  // ── Payment logic ──────────────────────────────────────────────────────────

  async function handlePay() {
    setPhase("loading")
    setErrorMsg(null)

    try {
      const res = await fetch("/api/checkout/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send tier (enum) and optional voucher code — NEVER any price
        body: JSON.stringify({
          tier,
          ...(activeVoucherCode ? { voucherCode: activeVoucherCode } : {}),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? "Terjadi kesalahan")
        setPhase("error")
        return
      }

      // Free upgrade (voucher type=FREE or price=0 after discount)
      if (data.free) {
        setPhase("success")
        return
      }

      setPayment(data)
      setPhase("qr")
    } catch {
      setErrorMsg("Gagal terhubung ke server")
      setPhase("error")
    }
  }

  // Poll payment status every 3s after QR shown
  useEffect(() => {
    if (phase !== "qr") return

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/payment/status")
        const data = await res.json()
        if (data.tier === tier) {
          clearInterval(pollRef.current!)
          setPhase("success")
        }
      } catch {
        // ignore poll errors
      }
    }, 3000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [phase, tier])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  // ── Feature list ───────────────────────────────────────────────────────────

  function buildFeatures() {
    const f = tierFeatures
    const items: string[] = []
    items.push(f.maxInvitations === 0 ? "Undangan tak terbatas" : `${f.maxInvitations} undangan`)
    items.push(f.maxRsvpGuests === 0 ? "RSVP tak terbatas" : `Maks ${f.maxRsvpGuests} tamu RSVP`)
    items.push(f.maxGalleryImages === 0 ? "Galeri tak terbatas" : `Maks ${f.maxGalleryImages} foto`)
    if (f.allThemes) items.push("Semua tema tersedia")
    if (f.allowMusic) items.push("Musik latar")
    if (f.allowCustomDomain) items.push("Custom domain")
    if (f.allowAnalytics) items.push("Analitik kunjungan")
    if (f.allowBroadcast) items.push("Broadcast WhatsApp")
    return items
  }

  const hasDiscount = preview && preview.discountAmount > 0
  const finalPrice = preview?.finalPrice ?? originalPrice
  const isFreeAfterVoucher = finalPrice === 0

  // ── Render: success ────────────────────────────────────────────────────────
  if (phase === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-background">
        <div className="flex flex-col items-center gap-4 max-w-xs text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold">Upgrade Berhasil!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Akunmu sudah diupgrade ke paket{" "}
              <span className="font-semibold text-foreground">{tierLabel}</span>.
            </p>
          </div>
          <Button
            className="w-full rounded-xl mt-2"
            onClick={() => {
              startTransition(() => {
                router.push("/dashboard/billing")
                router.refresh()
              })
            }}
          >
            Lihat Paketku
          </Button>
        </div>
      </div>
    )
  }

  // ── Render: QR code ────────────────────────────────────────────────────────
  if (phase === "qr" && payment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-lg p-6 flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="font-semibold text-lg">Scan QRIS untuk Bayar</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Upgrade ke <span className="font-medium text-foreground">{tierLabel}</span>
            </p>
          </div>

          {/* Amount */}
          <div className="text-center">
            {payment.discountAmount > 0 && (
              <p className="text-xs text-muted-foreground line-through mb-0.5">
                Rp {payment.originalAmount.toLocaleString("id-ID")}
              </p>
            )}
            <p className="text-3xl font-bold">
              Rp {payment.amount.toLocaleString("id-ID")}
            </p>
          </div>

          {/* QR */}
          <div className="rounded-2xl border-2 border-border bg-white p-4 shadow-sm">
            <QRCode
              value={payment.qr_string}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Menunggu konfirmasi pembayaran...
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            QR berlaku 15 menit. Jangan tutup halaman ini sebelum pembayaran selesai.
          </p>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              if (pollRef.current) clearInterval(pollRef.current)
              router.back()
            }}
          >
            Batalkan
          </Button>
        </div>
      </div>
    )
  }

  // ── Render: checkout form ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="font-semibold text-sm">Checkout</p>
          <p className="text-xs text-muted-foreground">Upgrade ke {tierLabel}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 grid gap-6 md:grid-cols-[1fr_360px]">
        {/* ── Left: Voucher section ─────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Voucher heading */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Voucher
            </p>

            {/* Claimed vouchers */}
            {claimedVouchers.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Vouchermu
                </p>
                <div className="grid gap-2">
                  {claimedVouchers.map(v => {
                    const isSelected = selectedVoucher === v.code
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleSelectClaimed(v.code)}
                        className={cn(
                          "w-full text-left rounded-xl border-2 px-4 py-3 transition-all text-sm",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono font-semibold tracking-wider text-xs bg-muted px-2 py-0.5 rounded-md">
                              {v.code}
                            </span>
                            {v.description && (
                              <p className="text-xs text-muted-foreground mt-1">{v.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-primary">
                              {v.type === "FREE"
                                ? "GRATIS"
                                : v.discountPercent
                                  ? `${v.discountPercent}% off`
                                  : "Diskon"}
                            </span>
                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                        {v.expiresAt && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Berlaku hingga{" "}
                            {new Date(v.expiresAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Manual input */}
            <div className="space-y-2">
              {claimedVouchers.length > 0 && (
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Atau masukkan kode
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Kode voucher"
                  value={inputCode}
                  onChange={e => handleInputChange(e.target.value.toUpperCase())}
                  className="font-mono uppercase rounded-xl h-10 text-sm"
                  disabled={!!selectedVoucher}
                />
                {inputCode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl shrink-0"
                    onClick={() => setInputCode("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Voucher status feedback */}
              {previewLoading && activeVoucherCode && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memeriksa voucher...
                </div>
              )}
              {!previewLoading && preview?.voucherError && activeVoucherCode && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" /> {preview.voucherError}
                </div>
              )}
              {!previewLoading && preview && !preview.voucherError && activeVoucherCode && (
                <div className="flex items-center gap-2 text-xs text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  {preview.voucherType === "FREE"
                    ? "Voucher gratis diterapkan!"
                    : `Diskon ${preview.discountPercent}% diterapkan`}
                </div>
              )}
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Harga dan diskon dihitung sepenuhnya di server. Tidak ada nominal yang dikirim dari
              browser — aman dari manipulasi.
            </p>
          </div>
        </div>

        {/* ── Right: Order summary ──────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Tier card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center">
                <Icon className={cn("h-5 w-5", iconColor)} />
              </div>
              <div>
                <p className="font-semibold">{tierLabel}</p>
                {tierDescription && (
                  <p className="text-xs text-muted-foreground">{tierDescription}</p>
                )}
              </div>
            </div>

            <ul className="space-y-1.5 mb-5">
              {buildFeatures().map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Pricing breakdown */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Harga paket</span>
                <span>Rp {originalPrice.toLocaleString("id-ID")}</span>
              </div>

              {previewLoading && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diskon</span>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                </div>
              )}

              {!previewLoading && hasDiscount && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>
                    Diskon voucher
                    {preview.discountPercent < 100 ? ` (${preview.discountPercent}%)` : ""}
                  </span>
                  <span>− Rp {preview.discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="flex justify-between font-bold pt-2 border-t border-border text-base">
                <span>Total</span>
                <span>
                  {isFreeAfterVoucher ? (
                    <span className="text-emerald-600">GRATIS</span>
                  ) : (
                    `Rp ${finalPrice.toLocaleString("id-ID")}`
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <Button
            className="w-full rounded-xl h-11 font-semibold"
            disabled={
              phase === "loading" ||
              previewLoading ||
              (!!activeVoucherCode && !!preview?.voucherError)
            }
            onClick={handlePay}
          >
            {phase === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : isFreeAfterVoucher ? (
              <>
                <Check className="h-4 w-4" />
                Upgrade Gratis
              </>
            ) : (
              <>
                Bayar Rp {finalPrice.toLocaleString("id-ID")}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {phase === "error" && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p>{errorMsg}</p>
                <button
                  className="text-xs underline mt-1 font-medium"
                  onClick={() => {
                    setPhase("checkout")
                    setErrorMsg(null)
                  }}
                >
                  Coba lagi <RefreshCw className="h-3 w-3 inline" />
                </button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-center text-muted-foreground">
            Pembayaran via QRIS · Upgrade berlaku instan setelah konfirmasi
          </p>
        </div>
      </div>
    </div>
  )
}
