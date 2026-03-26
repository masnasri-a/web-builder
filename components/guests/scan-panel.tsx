"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import type { GuestRecord } from "@/types"
import { CheckCircle, XCircle } from "lucide-react"

const QrScanner = dynamic(
  () => import("./qr-scanner").then((m) => ({ default: m.QrScanner })),
  { ssr: false }
)

type InvitationSummary = {
  id: string
  groomName: string
  brideName: string
  slug: string
}

type CheckInResult =
  | { status: "success"; guest: GuestRecord }
  | { status: "error"; message: string }

export function ScanPanel({ invitations }: { invitations: InvitationSummary[] }) {
  const [selectedId, setSelectedId] = useState<string>(invitations[0]?.id ?? "")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<CheckInResult | null>(null)
  const [recentArrivals, setRecentArrivals] = useState<GuestRecord[]>([])
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Prevent duplicate scan while request is in-flight
  const processingRef = useRef(false)

  const fetchArrivals = useCallback(async () => {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/rsvp?invitationId=${selectedId}`)
      if (res.ok) {
        const data: GuestRecord[] = await res.json()
        setRecentArrivals(data.filter((g) => g.checkedInAt !== null))
      }
    } catch {
      // silently ignore
    }
  }, [selectedId])

  // Poll every 3s while scanning
  useEffect(() => {
    if (!scanning) return
    fetchArrivals()
    const id = setInterval(fetchArrivals, 3000)
    return () => clearInterval(id)
  }, [scanning, fetchArrivals])

  // Load arrivals on invitation change
  useEffect(() => {
    fetchArrivals()
  }, [fetchArrivals])

  async function handleScan(guestId: string) {
    if (processingRef.current) return
    processingRef.current = true

    if (dismissTimer.current) clearTimeout(dismissTimer.current)

    try {
      const res = await fetch("/api/guests/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId }),
      })

      if (res.ok) {
        const guest: GuestRecord = await res.json()
        setResult({ status: "success", guest })
        fetchArrivals()
      } else {
        const data = await res.json().catch(() => ({}))
        setResult({ status: "error", message: data.error ?? "Tamu tidak ditemukan." })
      }
    } catch {
      setResult({ status: "error", message: "Gagal terhubung ke server." })
    } finally {
      dismissTimer.current = setTimeout(() => {
        setResult(null)
        processingRef.current = false
      }, 3000)
    }
  }

  const selectedInv = invitations.find((i) => i.id === selectedId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Scan Kedatangan</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Scan QR code tamu untuk konfirmasi kedatangan secara real-time.
        </p>
      </div>

      {/* Invitation picker */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium">Undangan:</label>
        {invitations.length > 1 ? (
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value)
              setScanning(false)
              setResult(null)
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.groomName} &amp; {inv.brideName}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm">
            {selectedInv?.groomName} &amp; {selectedInv?.brideName}
          </span>
        )}
      </div>

      {/* Scanner area */}
      <div className="flex w-full space-x-5">
        <div className="rounded-2xl border border-border p-4 w-2/6">
        {scanning ? (
          <div className="space-y-4">
            <div className="max-w-sm mx-auto">
              <QrScanner onScanSuccess={handleScan} />
            </div>
            <div className="text-center">
              <button
                onClick={() => { setScanning(false); setResult(null) }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Stop Scan
              </button>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <button
              onClick={() => setScanning(true)}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              Mulai Scan
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Izinkan akses kamera saat diminta</p>
          </div>
        )}
      </div>

      
      {/* Recent arrivals */}
      <div className="w-4/6">
      {/* Result card */}
      {result && (
        <div
          className="rounded-2xl border p-4 flex items-start gap-3 animate-bounce"
          style={
            result.status === "success"
              ? { borderColor: "#bbf7d0", background: "#f0fdf4" }
              : { borderColor: "#fecaca", background: "#fef2f2" }
          }
        >
          {result.status === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          )}
          <div>
            {result.status === "success" ? (
              <>
                <p className="font-semibold text-green-700">{result.guest.name}</p>
                <p className="text-sm text-green-600">Kedatangan berhasil dicatat!</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-red-600">Gagal</p>
                <p className="text-sm text-red-500">{result.message}</p>
              </>
            )}
          </div>
        </div>
      )}

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">Tamu yang Sudah Datang</p>
          {scanning && (
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Live
            </span>
          )}
        </div>
        {recentArrivals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada tamu yang check-in.</p>
        ) : (
          <div className="space-y-2">
            {recentArrivals.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5"
              >
                <span className="text-sm font-medium">{g.name}</span>
                <span className="text-xs text-muted-foreground">
                  {g.checkedInAt
                    ? new Date(g.checkedInAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
