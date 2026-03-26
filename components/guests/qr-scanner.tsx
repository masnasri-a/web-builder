"use client"

import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QrScannerProps {
  onScanSuccess: (guestId: string) => void
}

// Module-level singleton — only one camera stream can exist at a time.
// This survives React StrictMode's double-mount without spawning duplicates.
let _scanner: Html5Qrcode | null = null
async function stopGlobal() {
  if (!_scanner) return
  const s = _scanner
  _scanner = null
  try {
    if (s.isScanning) await s.stop()
    s.clear()
  } catch { /* ignore */ }
}

const CONTAINER_ID = "qr-scanner-singleton"

export function QrScanner({ onScanSuccess }: QrScannerProps) {
  const cbRef = useRef(onScanSuccess)
  cbRef.current = onScanSuccess

  useEffect(() => {
    let cancelled = false

    async function start() {
      // Ensure any previous stream is fully stopped first
      await stopGlobal()
      if (cancelled) return

      const scanner = new Html5Qrcode(CONTAINER_ID)
      _scanner = scanner

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (text) => cbRef.current(text.trim()),
          undefined
        )
      } catch {
        // Camera permission denied or unavailable
        _scanner = null
      }
    }

    start()

    return () => {
      cancelled = true
      stopGlobal()
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl">
      <div id={CONTAINER_ID} style={{ width: "100%" }} />
    </div>
  )
}
