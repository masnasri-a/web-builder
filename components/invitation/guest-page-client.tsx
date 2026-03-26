"use client"

import { useState } from "react"
import { GuestSections, type GuestInvitation } from "@/components/invitation/guest-sections"
import { SplashScreen } from "@/components/invitation/splash-screen"
import { MusicPlayer } from "@/components/invitation/music-player"
import { QrCheckinWidget } from "@/components/invitation/qr-checkin-widget"
import { FontLoader } from "@/components/invitation/font-loader"
import type { Section, ThemeConfig } from "@/types"
import { getThemeBySlug } from "@/lib/themeRegistry"
import { RomanticFloralTheme } from "@/components/invitation/themes"
import { GuestContextProvider } from "@/components/invitation/guest-context"

interface GuestPageClientProps {
  inv: GuestInvitation
  sections: Section[]
  themeConfig: ThemeConfig
  fonts: string[]
  guestName?: string
  guestId?: string
  musicUrl?: string | null
  themeSlug?: string
  ownerTier?: string
}

export function GuestPageClient({
  inv,
  sections,
  themeConfig,
  fonts,
  guestName,
  guestId,
  musicUrl,
  themeSlug,
  ownerTier,
}: GuestPageClientProps) {
  const [entered, setEntered] = useState(false)

  const registryEntry = themeSlug ? getThemeBySlug(themeSlug) : undefined
  const ThemeComponent = registryEntry?.component ?? RomanticFloralTheme

  const style: React.CSSProperties = {
    backgroundColor: themeConfig.bgColor,
    fontFamily: `"${themeConfig.fontFamily}", Georgia, serif`,
    color: "#1a1a1a",
    scrollSnapType: "y mandatory",
    overscrollBehaviorY: "contain",
  }

  return (
    <GuestContextProvider guestName={guestName} guestId={guestId} ownerTier={ownerTier}>
    <div className="h-dvh overflow-y-scroll" style={style}>
      <FontLoader fontFamily={fonts} />

      {registryEntry ? (
        <ThemeComponent inv={inv} sections={sections} themeConfig={themeConfig} />
      ) : (
        <GuestSections sections={sections} inv={inv} themeConfig={themeConfig} />
      )}

      {/* Splash screen overlay (fixed, full-screen) */}
      {!entered && (
        <SplashScreen
          groomName={inv.groomName}
          brideName={inv.brideName}
          guestName={guestName}
          guestId={guestId}
          themeConfig={themeConfig}
          onEnter={() => setEntered(true)}
          fullscreen
        />
      )}

      {/* QR check-in widget — only shown after entering, only if guestId is known */}
      {entered && <QrCheckinWidget />}

      {/* Music player — only shown after entering, only if musicUrl provided */}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} autoPlay={entered} />}
    </div>
    </GuestContextProvider>
  )
}
