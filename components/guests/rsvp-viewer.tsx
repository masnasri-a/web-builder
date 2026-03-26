"use client"

import { useEffect, useState, useCallback } from "react"
import type { GuestRecord } from "@/types"
import { GuestQrModal } from "./guest-qr-modal"
import { QrCode } from "lucide-react"

type InvitationSummary = {
  id: string
  groomName: string
  brideName: string
  slug: string
}

type Tab = "all" | "attending" | "not_attending" | "pending" | "checked_in"

const TABS: { id: Tab; label: string }[] = [
  { id: "all",           label: "Semua" },
  { id: "attending",     label: "Hadir" },
  { id: "not_attending", label: "Tidak Hadir" },
  { id: "pending",       label: "Menunggu" },
  { id: "checked_in",    label: "Sudah Datang" },
]

const BADGE: Record<string, { label: string; bg: string; text: string }> = {
  ATTENDING:     { label: "Hadir",       bg: "#dcfce7", text: "#15803d" },
  NOT_ATTENDING: { label: "Tidak Hadir", bg: "#fee2e2", text: "#b91c1c" },
  PENDING:       { label: "Menunggu",    bg: "#fef9c3", text: "#92400e" },
}

function filterGuests(guests: GuestRecord[], tab: Tab): GuestRecord[] {
  switch (tab) {
    case "attending":     return guests.filter((g) => g.attendance === "ATTENDING")
    case "not_attending": return guests.filter((g) => g.attendance === "NOT_ATTENDING")
    case "pending":       return guests.filter((g) => g.attendance === "PENDING")
    case "checked_in":    return guests.filter((g) => g.checkedInAt !== null)
    default:              return guests
  }
}

export function RsvpViewer({ invitations }: { invitations: InvitationSummary[] }) {
  const [selectedId, setSelectedId] = useState<string>(invitations[0]?.id ?? "")
  const [guests, setGuests] = useState<GuestRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("all")
  const [qrGuest, setQrGuest] = useState<GuestRecord | null>(null)

  const fetchGuests = useCallback(async () => {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/rsvp?invitationId=${selectedId}`)
      if (res.ok) {
        const data = await res.json()
        setGuests(data)
      }
    } catch {
      // silently ignore polling errors
    }
  }, [selectedId])

  // Initial load
  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    fetchGuests().finally(() => setLoading(false))
  }, [selectedId, fetchGuests])

  // Polling every 5s
  useEffect(() => {
    if (!selectedId) return
    const id = setInterval(fetchGuests, 5000)
    return () => clearInterval(id)
  }, [selectedId, fetchGuests])

  const totalGuests    = guests.reduce((s, g) => s + g.guestCount, 0)
  const attending      = guests.filter((g) => g.attendance === "ATTENDING")
  const notAttending   = guests.filter((g) => g.attendance === "NOT_ATTENDING")
  const pending        = guests.filter((g) => g.attendance === "PENDING")
  const checkedIn      = guests.filter((g) => g.checkedInAt !== null)
  const attendingCount = attending.reduce((s, g) => s + g.guestCount, 0)

  const filtered = filterGuests(guests, activeTab)

  const selectedInv = invitations.find((i) => i.id === selectedId)

  return (
    <div className="space-y-6">
      {/* Header + invitation picker */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tamu RSVP</h1>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-green-600">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Live • diperbarui setiap 5 detik
          </div>
        </div>

        {invitations.length > 1 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.groomName} &amp; {inv.brideName}
              </option>
            ))}
          </select>
        )}
        {invitations.length === 1 && selectedInv && (
          <p className="text-sm text-muted-foreground">
            {selectedInv.groomName} &amp; {selectedInv.brideName}
          </p>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total RSVP",    value: guests.length,         sub: `${totalGuests} tamu` },
          { label: "Hadir",         value: attending.length,      sub: `${attendingCount} tamu` },
          { label: "Tidak Hadir",   value: notAttending.length,   sub: "" },
          { label: "Menunggu",      value: pending.length,        sub: "" },
          { label: "Sudah Check-in",value: checkedIn.length,      sub: "" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
            {card.sub && <p className="text-[11px] text-muted-foreground">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={
              activeTab === tab.id
                ? { background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                : { color: "var(--muted-foreground)" }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Memuat data tamu…</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Belum ada tamu di kategori ini.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Nama</th>
                <th className="px-4 py-3 text-left font-medium">Telepon</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Tamu</th>
                <th className="px-4 py-3 text-left font-medium">Pesan</th>
                <th className="px-4 py-3 text-left font-medium">Check-in</th>
                <th className="px-4 py-3 text-left font-medium">QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((guest) => {
                const badge = BADGE[guest.attendance] ?? BADGE.PENDING
                return (
                  <tr key={guest.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{guest.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{guest.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{guest.guestCount}</td>
                    <td className="px-4 py-3 max-w-[160px] truncate text-muted-foreground">
                      {guest.message ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {guest.checkedInAt
                        ? new Date(guest.checkedInAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setQrGuest(guest)}
                        className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                        title="Lihat QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <GuestQrModal guest={qrGuest} onClose={() => setQrGuest(null)} />
    </div>
  )
}
