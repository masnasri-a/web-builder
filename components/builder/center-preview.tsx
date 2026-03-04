"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import React, { useRef, useState } from "react"
import type { Section, ThemeConfig } from "@/types"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { Anim } from "@/components/invitation/anim"
import { FontLoader } from "@/components/invitation/font-loader"
import { SplashScreen } from "@/components/invitation/splash-screen"
import dynamic from "next/dynamic"
import { Instagram, Music, Play, VolumeX } from "lucide-react"

const Masonry = dynamic(
  () => import("@/components/ui/masonry").then((m) => ({ default: m.Masonry })),
  { ssr: false }
)

interface CenterPreviewProps {
  isMobile: boolean
  groomName: string
  brideName: string
  eventDate: string
  eventVenue: string
  eventAddress: string
  sections: Section[]
  themeConfig: ThemeConfig
  activeSection: string | null
  musicUrl?: string
  onSelectSection: (id: string) => void
  onUpdateContent: (id: string, content: Record<string, unknown>) => void
}

export function CenterPreview({
  isMobile,
  groomName,
  brideName,
  eventDate,
  eventVenue,
  eventAddress,
  sections,
  themeConfig,
  activeSection,
  musicUrl,
  onSelectSection,
  onUpdateContent,
}: CenterPreviewProps) {
  const [showSplash, setShowSplash] = useState(true)
  const visible = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)

  const sectionFonts = visible
    .map((s) => (s.content as { fontFamily?: string }).fontFamily)
    .filter(Boolean) as string[]
  const fonts = [themeConfig.fontFamily, ...sectionFonts]

  const style = {
    "--inv-primary": themeConfig.primaryColor,
    "--inv-accent": themeConfig.accentColor,
    "--inv-bg": themeConfig.bgColor,
    "--inv-font": themeConfig.fontFamily,
    backgroundColor: themeConfig.bgColor,
    fontFamily: `"${themeConfig.fontFamily}", serif`,
  } as React.CSSProperties

  return (
    <div
      className="flex flex-1 flex-col items-center justify-start overflow-y-auto bg-muted/50 py-6"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <FontLoader fontFamily={fonts} />

      {/* Toolbar: splash toggle + music indicator */}
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={() => setShowSplash(true)}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Preview Splash
        </button>
        {musicUrl && (
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <Music className="h-3 w-3" />
            Music set
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
          isMobile ? "w-93.75" : "w-3xl"
        )}
        style={style}
      >
        {/* Splash overlay inside the card */}
        {showSplash && (
          <SplashScreen
            groomName={groomName}
            brideName={brideName}
            themeConfig={themeConfig}
            onEnter={() => setShowSplash(false)}
            fullscreen={false}
          />
        )}

        {visible.map((section) => (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            style={{ scrollSnapAlign: "start" }}
            className={cn(
              "cursor-pointer transition-all",
              activeSection === section.id &&
                "outline-2 outline-primary -outline-offset-2"
            )}
          >
            <SectionRenderer
              section={section}
              groomName={groomName}
              brideName={brideName}
              eventDate={eventDate}
              eventVenue={eventVenue}
              eventAddress={eventAddress}
              themeConfig={themeConfig}
              isActive={activeSection === section.id}
              onUpdateContent={onUpdateContent}
            />
          </div>
        ))}

        {/* Music player mock (shows controls but no actual audio in builder) */}
        {musicUrl && !showSplash && (
          <div className="sticky bottom-4 flex justify-end px-4 pointer-events-none">
            <div className="flex items-center gap-2 opacity-60">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white">
                <VolumeX className="h-4 w-4" />
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white">
                <Play className="h-4 w-4 translate-x-0.5" />
              </div>
              <Music className="h-3.5 w-3.5 text-white/40" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface SectionRendererProps {
  section: Section
  groomName: string
  brideName: string
  eventDate: string
  eventVenue: string
  eventAddress: string
  themeConfig: ThemeConfig
  isActive: boolean
  onUpdateContent: (id: string, content: Record<string, unknown>) => void
}

function SectionRenderer({
  section,
  groomName,
  brideName,
  eventDate,
  eventVenue,
  eventAddress,
  themeConfig,
  isActive,
  onUpdateContent,
}: SectionRendererProps) {
  const c = section.content as Record<string, unknown>
  const primary = themeConfig.primaryColor
  const accent = themeConfig.accentColor
  const sectionFont = (section.content as { fontFamily?: string }).fontFamily as string | undefined
  const sectionBg = (section.content as { bgImage?: string }).bgImage as string | undefined
  const fontStyle: React.CSSProperties = {
    ...(sectionFont ? { fontFamily: `"${sectionFont}", serif` } : {}),
    ...(sectionBg
      ? { backgroundImage: `url(${sectionBg})`, backgroundSize: "cover", backgroundPosition: "center" }
      : {}),
  }

  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          section={section}
          groomName={groomName}
          brideName={brideName}
          primary={primary}
          fontStyle={fontStyle}
          isActive={isActive}
          onUpdateContent={onUpdateContent}
        />
      )

    case "couple": {
      const layout = (c.coupleLayout as string) ?? "side-by-side"
      const groomInstagram = c.groomInstagram as string | undefined
      const brideInstagram = c.brideInstagram as string | undefined

      const groomCard = (
        <div className="space-y-2 text-center">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-gray-100">
            {c.groomPhoto ? (
              <Image
                src={c.groomPhoto as string}
                alt="Groom"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>
          <p className="font-semibold">{groomName || "Groom"}</p>
          {(c.groomParents as string) && (
            <p className="text-xs opacity-60">{c.groomParents as string}</p>
          )}
          {(c.groomBio as string) && (
            <p className="text-xs opacity-70 leading-relaxed max-w-[140px] mx-auto">{c.groomBio as string}</p>
          )}
          {groomInstagram && (
            <p className="flex items-center justify-center gap-1 text-xs opacity-60">
              <Instagram className="h-3 w-3" />@{groomInstagram}
            </p>
          )}
        </div>
      )

      const brideCard = (
        <div className="space-y-2 text-center">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-gray-100">
            {c.bridePhoto ? (
              <Image
                src={c.bridePhoto as string}
                alt="Bride"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>
          <p className="font-semibold">{brideName || "Bride"}</p>
          {(c.brideParents as string) && (
            <p className="text-xs opacity-60">{c.brideParents as string}</p>
          )}
          {(c.brideBio as string) && (
            <p className="text-xs opacity-70 leading-relaxed max-w-[140px] mx-auto">{c.brideBio as string}</p>
          )}
          {brideInstagram && (
            <p className="flex items-center justify-center gap-1 text-xs opacity-60">
              <Instagram className="h-3 w-3" />@{brideInstagram}
            </p>
          )}
        </div>
      )

      return (
        <div className="px-8 py-12 text-center" style={fontStyle}>
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-6 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              The Couple
            </p>
          </Anim>
          {layout === "side-by-side" ? (
            <div className="flex justify-center gap-8">
              <Anim variant="slideLeft" delay={150}>{groomCard}</Anim>
              <Anim variant="scaleIn" delay={300} className="self-center">
                <div className="text-2xl opacity-40" style={{ color: accent }}>&</div>
              </Anim>
              <Anim variant="slideRight" delay={150}>{brideCard}</Anim>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <Anim variant="fadeUp" delay={150}>{groomCard}</Anim>
              <Anim variant="scaleIn" delay={300}>
                <div className="text-2xl opacity-40" style={{ color: accent }}>&</div>
              </Anim>
              <Anim variant="fadeUp" delay={450}>{brideCard}</Anim>
            </div>
          )}
        </div>
      )
    }

    case "event": {
      type EventItem = { name: string; date: string; time: string }
      const events = (c.events as EventItem[]) ?? []
      return (
        <div className="px-8 py-12 text-center" style={fontStyle}>
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-6 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              Save The Date
            </p>
          </Anim>
          <Anim variant="fadeUp" delay={150}>
            <p className="mb-2 text-2xl font-semibold">
              {eventDate
                ? new Date(eventDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Wedding Date TBD"}
            </p>
          </Anim>
          <Anim variant="fadeUp" delay={260}>
            <p className="opacity-70">{eventVenue || "Venue"}</p>
            {eventAddress && (
              <p className="mt-1 text-sm opacity-50">{eventAddress}</p>
            )}
          </Anim>
          {events.length > 0 && (
            <Anim variant="fadeUp" delay={380}>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {events.map((ev, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-black/10 px-4 py-3 text-center min-w-[100px]"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60" style={{ color: primary }}>
                      {ev.name || `Event ${i + 1}`}
                    </p>
                    {ev.date && (
                      <p className="mt-1 text-xs font-medium">
                        {new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                    {ev.time && <p className="text-xs opacity-70">{ev.time}</p>}
                  </div>
                ))}
              </div>
            </Anim>
          )}
        </div>
      )
    }

    case "countdown":
      return (
        <div className="px-8 py-10 text-center" style={fontStyle}>
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              Counting Down
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={150}>
            <CountdownTimer eventDate={eventDate} primaryColor={primary} />
          </Anim>
        </div>
      )

    case "rsvp":
      return (
        <div className="px-8 py-12 text-center" style={fontStyle}>
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              {(c.title as string) || "RSVP"}
            </p>
          </Anim>
          <Anim variant="fadeUp" delay={120}>
            <p className="mb-6 text-sm opacity-70">
              {c.deadline
                ? `Please respond by ${c.deadline as string}`
                : "Kindly confirm your attendance"}
            </p>
          </Anim>
          <Anim variant="fadeUp" delay={240}>
            <div className="mx-auto max-w-sm space-y-3 rounded-xl border border-black/10 p-4">
              <div className="h-8 rounded-lg bg-black/5" />
              <div className="h-8 rounded-lg bg-black/5" />
              <div className="h-10 rounded-lg" style={{ backgroundColor: primary }} />
            </div>
          </Anim>
        </div>
      )

    case "closing":
      return (
        <div className="px-8 py-16 text-center" style={fontStyle}>
          <Anim variant="fadeUp" delay={0}>
            <p className="text-base leading-relaxed opacity-70">
              {(c.message as string) || "We look forward to celebrating with you."}
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={200}>
            <p
              className="mt-6 text-xl font-semibold"
              style={{ color: primary }}
            >
              {groomName || "Groom"} & {brideName || "Bride"}
            </p>
          </Anim>
        </div>
      )

    case "quote":
      return (
        <div className="px-8 py-12 text-center" style={fontStyle}>
          <Anim variant="scaleIn" delay={0}>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              ✦
            </p>
          </Anim>
          <Anim variant="fadeUp" delay={150}>
            <blockquote
              className="mx-auto max-w-sm text-base leading-relaxed italic opacity-80"
              style={{ color: primary }}
            >
              &ldquo;{(c.quote as string) || "Kutipan akan muncul di sini."}&rdquo;
            </blockquote>
          </Anim>
          {c.source && (
            <Anim variant="fadeIn" delay={350}>
              <p
                className="mt-4 text-xs font-semibold uppercase tracking-widest opacity-60"
                style={{ color: primary }}
              >
                — {c.source as string}
              </p>
            </Anim>
          )}
        </div>
      )

    case "maps": {
      const lat = parseFloat(c.lat as string)
      const lng = parseFloat(c.lng as string)
      const hasCoords = !isNaN(lat) && !isNaN(lng)
      const gmapsUrl = hasCoords
        ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        : null
      return (
        <div className="px-8 py-10 text-center" style={fontStyle}>
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              {(c.label as string) || "Lokasi Acara"}
            </p>
          </Anim>
          <Anim variant="fadeUp" delay={150}>
            {gmapsUrl ? (
              <div className="overflow-hidden rounded-xl">
                <iframe
                  src={gmapsUrl}
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div
                className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40"
                style={{ backgroundColor: `${primary}15` }}
              >
                Pilih lokasi di panel kanan
              </div>
            )}
          </Anim>
        </div>
      )
    }

    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      const galleryItems = images.map((url, i) => ({
        id: String(i),
        img: url,
      }))
      return (
        <div className="py-6 text-center" style={fontStyle}>
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-widest opacity-60"
              style={{ color: primary }}
            >
              Gallery
            </p>
          </Anim>
          {images.length === 0 ? (
            <div
              className="mx-8 flex h-32 items-center justify-center rounded-xl text-sm opacity-40"
              style={{ backgroundColor: `${primary}15` }}
            >
              Belum ada foto
            </div>
          ) : (
            <div className="px-2">
              <Masonry
                items={galleryItems}
                animateFrom="bottom"
                stagger={0.05}
                blurToFocus={true}
                maxColumns={2}
              />
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

// ── Hero section with drag-to-reposition ────────────────────────────────────

interface HeroSectionProps {
  section: Section
  groomName: string
  brideName: string
  primary: string
  fontStyle: React.CSSProperties
  isActive: boolean
  onUpdateContent: (id: string, content: Record<string, unknown>) => void
}

function HeroSection({
  section,
  groomName,
  brideName,
  primary,
  fontStyle,
  isActive,
  onUpdateContent,
}: HeroSectionProps) {
  const c = section.content as Record<string, unknown>
  const textX = (c.textX as number) ?? 50
  const textY = (c.textY as number) ?? 50
  const containerRef = useRef<HTMLDivElement>(null)

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()

    const onMouseMove = (ev: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(5, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100))
      const y = Math.max(5, Math.min(95, ((ev.clientY - rect.top) / rect.height) * 100))
      const textEl = containerRef.current.querySelector<HTMLDivElement>("[data-hero-text]")
      if (textEl) {
        textEl.style.left = `${x}%`
        textEl.style.top = `${y}%`
      }
    }

    const onMouseUp = (ev: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.round(Math.max(5, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100)))
      const y = Math.round(Math.max(5, Math.min(95, ((ev.clientY - rect.top) / rect.height) * 100)))
      onUpdateContent(section.id, { textX: x, textY: y })
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-[50vh]"
      style={{ color: primary, ...fontStyle }}
    >
      <div
        data-hero-text=""
        className="absolute select-none text-center"
        style={{
          left: `${textX}%`,
          top: `${textY}%`,
          transform: "translate(-50%, -50%)",
          width: "80%",
          cursor: isActive ? "move" : "default",
        }}
        onMouseDown={isActive ? handleMouseDown : undefined}
      >
        <Anim variant="fadeIn" delay={0}>
          <p className="mb-2 text-sm tracking-[0.3em] uppercase opacity-70">
            The Wedding of
          </p>
        </Anim>
        <Anim variant="fadeUp" delay={150}>
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            {groomName || "Groom"} & {brideName || "Bride"}
          </h1>
        </Anim>
        {(c.subtitle as string) && (
          <Anim variant="fadeUp" delay={300}>
            <p className="text-base opacity-80">{c.subtitle as string}</p>
          </Anim>
        )}
        <Anim variant="scaleIn" delay={420}>
          <div
            className="mt-6 mx-auto h-px w-24 opacity-40"
            style={{ backgroundColor: primary }}
          />
        </Anim>
      </div>
      {isActive && (
        <div className="absolute bottom-2 right-2 rounded-full bg-black/20 px-2 py-0.5 text-[10px] text-white opacity-70 select-none pointer-events-none">
          drag text to reposition
        </div>
      )}
    </div>
  )
}
