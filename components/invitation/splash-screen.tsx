"use client"

import { useEffect, useState } from "react"
import type { ThemeConfig } from "@/types"

interface SplashScreenProps {
  groomName: string
  brideName: string
  guestName?: string
  themeConfig: ThemeConfig
  onEnter: () => void
  /** true = fixed inset-0 (public page), false = absolute inset-0 (builder preview) */
  fullscreen?: boolean
}

export function SplashScreen({
  groomName,
  brideName,
  guestName,
  themeConfig,
  onEnter,
  fullscreen = true,
}: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  function handleEnter() {
    setLeaving(true)
    setTimeout(onEnter, 600)
  }

  const positionClass = fullscreen ? "fixed inset-0 z-50" : "absolute inset-0 z-20 rounded-2xl"

  return (
    <div
      className={`${positionClass} flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500`}
      style={{
        backgroundColor: themeConfig.bgColor,
        fontFamily: `"${themeConfig.fontFamily}", Georgia, serif`,
        opacity: leaving ? 0 : mounted ? 1 : 0,
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 opacity-20"
        style={{ backgroundColor: themeConfig.primaryColor }}
      />
      {/* Decorative bottom line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 opacity-20"
        style={{ backgroundColor: themeConfig.primaryColor }}
      />

      <div
        className="flex flex-col items-center text-center px-10 transition-all duration-700"
        style={{
          opacity: mounted && !leaving ? 1 : 0,
          transform: mounted && !leaving ? "translateY(0)" : "translateY(16px)",
        }}
      >
        {/* Wedding label */}
        <p
          className="mb-6 text-[10px] tracking-[0.4em] uppercase"
          style={{ color: themeConfig.primaryColor, opacity: 0.6 }}
        >
          Wedding Invitation
        </p>

        {/* Couple names */}
        <h1
          className="text-4xl font-bold leading-tight mb-2"
          style={{ color: themeConfig.primaryColor }}
        >
          {groomName || "Groom"}
        </h1>
        <div
          className="text-xl opacity-40 mb-2"
          style={{ color: themeConfig.accentColor }}
        >
          &
        </div>
        <h1
          className="text-4xl font-bold leading-tight mb-8"
          style={{ color: themeConfig.primaryColor }}
        >
          {brideName || "Bride"}
        </h1>

        {/* Divider */}
        <div
          className="w-16 h-px mb-8 opacity-30"
          style={{ backgroundColor: themeConfig.primaryColor }}
        />

        {/* Guest name */}
        {guestName ? (
          <div className="mb-8 text-center">
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: themeConfig.primaryColor, opacity: 0.5 }}
            >
              Kepada Yth.
            </p>
            <p
              className="text-xl font-medium"
              style={{ color: themeConfig.primaryColor }}
            >
              {guestName}
            </p>
          </div>
        ) : (
          <div className="mb-8" />
        )}

        {/* CTA button */}
        <button
          onClick={handleEnter}
          className="group relative overflow-hidden rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            border: `1px solid ${themeConfig.primaryColor}`,
            color: themeConfig.primaryColor,
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
            style={{ backgroundColor: themeConfig.primaryColor }}
          />
          Buka Undangan
        </button>
      </div>
    </div>
  )
}
