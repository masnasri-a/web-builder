"use client"

import { useState } from "react"
import { GuestSections, type GuestInvitation } from "@/components/invitation/guest-sections"
import { SplashScreen } from "@/components/invitation/splash-screen"
import { MusicPlayer } from "@/components/invitation/music-player"
import { FontLoader } from "@/components/invitation/font-loader"
import type { Section, ThemeConfig } from "@/types"

interface GuestPageClientProps {
  inv: GuestInvitation
  sections: Section[]
  themeConfig: ThemeConfig
  fonts: string[]
  guestName?: string
  musicUrl?: string | null
}

export function GuestPageClient({
  inv,
  sections,
  themeConfig,
  fonts,
  guestName,
  musicUrl,
}: GuestPageClientProps) {
  const [entered, setEntered] = useState(false)

  const style: React.CSSProperties = {
    backgroundColor: themeConfig.bgColor,
    fontFamily: `"${themeConfig.fontFamily}", Georgia, serif`,
    color: "#1a1a1a",
    scrollSnapType: "y mandatory",
    overscrollBehaviorY: "contain",
  }

  return (
    <div className="h-dvh overflow-y-scroll" style={style}>
      <FontLoader fontFamily={fonts} />

      <GuestSections sections={sections} inv={inv} themeConfig={themeConfig} />

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
  )
}
