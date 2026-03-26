"use client"

import QRCode from "react-qr-code"
import type { GuestRecord } from "@/types"

interface GuestQrModalProps {
  guest: GuestRecord | null
  onClose: () => void
}

const ATTENDANCE_BADGE: Record<string, { label: string; color: string }> = {
  ATTENDING:     { label: "Hadir",        color: "#16a34a" },
  NOT_ATTENDING: { label: "Tidak Hadir",  color: "#dc2626" },
  PENDING:       { label: "Menunggu",     color: "#d97706" },
}

export function GuestQrModal({ guest, onClose }: GuestQrModalProps) {
  if (!guest) return null

  const badge = ATTENDANCE_BADGE[guest.attendance] ?? ATTENDANCE_BADGE.PENDING

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-1 text-lg font-semibold">{guest.name}</p>
        <span
          className="mb-4 inline-block rounded-full px-3 py-0.5 text-xs font-medium text-white"
          style={{ background: badge.color }}
        >
          {badge.label}
        </span>

        <div className="flex justify-center my-4 p-3 rounded-xl bg-gray-50">
          <QRCode value={guest.id} size={180} />
        </div>

        <p className="mb-4 text-xs text-gray-400">ID: {guest.id.slice(0, 8)}…</p>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
