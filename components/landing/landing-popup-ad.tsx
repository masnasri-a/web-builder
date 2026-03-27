"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"

interface PopupAdData {
  id: string
  headline: string | null
  body: string | null
  bannerUrl: string | null
  ctaLabel: string | null
  ctaUrl: string | null
}

const STORAGE_KEY = "selembar_popup_dismissed"

export function LandingPopupAd() {
  const [ad, setAd] = useState<PopupAdData | null>(null)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    // Show only once per browser session
    if (sessionStorage.getItem(STORAGE_KEY)) return

    fetch("/api/popup-ads/active")
      .then((r) => r.json())
      .then((data: PopupAdData | null) => {
        if (!data) return
        setAd(data)
        // Small delay so the page loads first
        setTimeout(() => setOpen(true), 800)
      })
      .catch(() => {})
  }, [])

  function handleClose() {
    setClosing(true)
    sessionStorage.setItem(STORAGE_KEY, "1")
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
      setAd(null)
    }, 300)
  }

  if (!ad || !open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={`fixed inset-0 z-9999 flex items-center justify-center p-4 transition-all duration-300 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Banner */}
          {ad.bannerUrl && (
            <div className="relative aspect-video w-full">
              <Image
                src={ad.bannerUrl}
                alt={ad.headline || "Promo"}
                fill
                className="object-cover"
                sizes="(max-width: 448px) 100vw, 448px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 text-center">
            {ad.headline && (
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                {ad.headline}
              </h2>
            )}
            {ad.body && (
              <p className="mb-4 text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                {ad.body}
              </p>
            )}
            {ad.ctaLabel && ad.ctaUrl && (
              <a
                href={ad.ctaUrl}
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-amber-600 to-amber-800 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
              >
                {ad.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
