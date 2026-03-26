"use client"

import { useState } from "react"
import { useGuestContext } from "@/components/invitation/guest-context"
import QRCode from "react-qr-code"
import { QrCode, X } from "lucide-react"

export function QrCheckinWidget() {
  const { guestId } = useGuestContext()
  const [expanded, setExpanded] = useState(false)

  if (!guestId) return null

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {expanded ? (
        <div className="relative rounded-2xl bg-white/95 backdrop-blur-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-2 right-2 rounded-full p-1 hover:bg-black/5 transition-colors"
            aria-label="Tutup QR"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-xl bg-white p-3">
              <QRCode value={guestId} size={140} />
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500">
              Tunjukkan ke panitia
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2.5 text-white backdrop-blur-sm transition-all hover:bg-black/50 active:scale-95"
          aria-label="Tampilkan QR Check-in"
        >
          <QrCode className="h-4 w-4" />
          <span className="text-xs font-medium">QR Check-in</span>
        </button>
      )}
    </div>
  )
}
