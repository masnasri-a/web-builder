"use client"

import { useState } from "react"
import { GuestSections, type GuestInvitation } from "@/components/invitation/guest-sections"
import { SplashScreen } from "@/components/invitation/splash-screen"
import { MusicPlayer } from "@/components/invitation/music-player"
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
  musicUrl?: string | null
  themeSlug?: string
}

export function GuestPageClient({
  inv,
  sections,
  themeConfig,
  fonts,
  guestName,
  musicUrl,
  themeSlug,
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
    <GuestContextProvider guestName={guestName}>
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
          themeConfig={themeConfig}
          onEnter={() => setEntered(true)}
          fullscreen
        />
      )}

      {/* Music player — only shown after entering, only if musicUrl provided */}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} autoPlay={entered} />}
    </div>
    </GuestContextProvider>
  )
}
