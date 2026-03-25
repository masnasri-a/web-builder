"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "react-qr-code"
import { X, CheckCircle2, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type PaymentData = {
  payment_id: string
  qr_string: string
  amount: number
  tier: string
  label: string
}

type Phase = "loading" | "qr" | "success" | "error"

export function PaymentModal({
  tier,
  label,
  onClose,
  onSuccess,
}: {
  tier: string
  label: string
  price: number
  currentTier: string
  onClose: () => void
  onSuccess: (newTier: string) => void
}) {
  const [phase, setPhase] = useState<Phase>("loading")
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function initiate() {
    setPhase("loading")
    setError(null)
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Gagal membuat pembayaran")
        setPhase("error")
        return
      }
      setPayment(data)
      setPhase("qr")
    } catch {
      setError("Gagal terhubung ke payment gateway")
      setPhase("error")
    }
  }

  // Poll payment status every 3s once QR is shown
  useEffect(() => {
    if (phase !== "qr") return

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/payment/status")
        const data = await res.json()
        if (data.tier === tier) {
          clearInterval(pollRef.current!)
          setPhase("success")
          onSuccess(tier)
        }
      } catch {
        // ignore poll error
      }
    }, 3000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [phase, tier, onSuccess])

  useEffect(() => {
    initiate()
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div>
            <p className="font-semibold text-sm">Upgrade ke {label}</p>
            <p className="text-xs text-muted-foreground">Scan QRIS untuk bayar</p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {phase === "loading" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Membuat invoice...</p>
            </div>
          )}

          {phase === "error" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-center text-muted-foreground">{error}</p>
              <Button size="sm" variant="outline" onClick={initiate} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
              </Button>
            </div>
          )}

          {phase === "qr" && payment && (
            <div className="flex flex-col items-center gap-4">
              {/* Amount */}
              <div className="text-center">
                <p className="text-2xl font-bold">
                  Rp {payment.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bayar dengan aplikasi bank / dompet digital
                </p>
              </div>

              {/* QR Code */}
              <div className="rounded-2xl border-2 border-border bg-white p-4 shadow-sm">
                <QRCode
                  value={payment.qr_string}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              {/* Polling indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Menunggu konfirmasi pembayaran...
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                QR ini berlaku sementara. Jangan tutup halaman ini sebelum pembayaran selesai.
              </p>
            </div>
          )}

          {phase === "success" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Pembayaran Berhasil!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Akunmu sudah diupgrade ke <span className="font-medium text-foreground">{label}</span>
                </p>
              </div>
              <Button className="w-full rounded-xl" onClick={onClose}>
                Lanjutkan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
