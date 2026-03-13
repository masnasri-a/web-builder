"use client"

/**
 * Blue Java Theme
 * Concept : Javanese batik indigo — traditional Indonesian batik motifs in deep indigo/blue
 * Palette : Indigo (#1E3566) · Blue (#2B6CB0) · Gold (#C8A84B) · Cream BG (#F5F0E6) · Dark text (#1A2040)
 */

import Image from "next/image"
import dynamic from "next/dynamic"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { Navigation, Instagram } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"
import type { GuestInvitation } from "@/components/invitation/guest-sections"

const Masonry = dynamic(
  () => import("@/components/ui/masonry").then((m) => ({ default: m.Masonry })),
  { ssr: false }
)

// ─── Palette ──────────────────────────────────────────────────────────────────
const INDIGO  = "#1E3566"
const BLUE    = "#2B6CB0"
const GOLD    = "#C8A84B"
const BG      = "#F5F0E6"
const TXT     = "#1A2040"

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ──────────────────────────────────────────────────────────

/** Kawung motif — 4-petal lotus circle (classic Javanese batik) */
function KawungMotif({ size = 56, opacity = 1 }: { size?: number; opacity?: number }) {
  const r = size / 2
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 56 56" style={{ opacity }}>
      {/* 4 overlapping ellipses forming kawung petals */}
      <ellipse cx="28" cy="16" rx="8" ry="13" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.7" />
      <ellipse cx="28" cy="40" rx="8" ry="13" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.7" />
      <ellipse cx="16" cy="28" rx="13" ry="8" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.7" />
      <ellipse cx="40" cy="28" rx="13" ry="8" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.7" />
      {/* center diamond */}
      <circle cx="28" cy="28" r="4" fill={GOLD} opacity="0.55" />
      <circle cx="28" cy="28" r="2" fill={INDIGO} opacity="0.6" />
      {/* corner dots */}
      <circle cx="28" cy="4"  r="1.5" fill={GOLD} opacity="0.5" />
      <circle cx="28" cy="52" r="1.5" fill={GOLD} opacity="0.5" />
      <circle cx="4"  cy="28" r="1.5" fill={GOLD} opacity="0.5" />
      <circle cx="52" cy="28" r="1.5" fill={GOLD} opacity="0.5" />
    </svg>
  )
}

/** BatikBorder — repeating diamond/parang geometric strip */
function BatikBorder({ width = 280, opacity = 0.7 }: { width?: number; opacity?: number }) {
  return (
    <svg aria-hidden="true" width={width} height={24} viewBox={`0 0 ${width} 24`} style={{ opacity, display: "block" }}>
      <defs>
        <pattern id="bjDiamond" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          {/* diamond outline */}
          <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.8" />
          {/* inner diamond */}
          <polygon points="12,6 18,12 12,18 6,12" fill={GOLD} opacity="0.25" />
          {/* center dot */}
          <circle cx="12" cy="12" r="1.5" fill={GOLD} opacity="0.6" />
        </pattern>
      </defs>
      <rect width={width} height="24" fill="url(#bjDiamond)" />
    </svg>
  )
}

/** ParangDiagonal — wavy parang-style flowing S-curve diagonal lines */
function ParangDiagonal({ width = 300, height = 200, opacity = 0.08 }: { width?: number; height?: number; opacity?: number }) {
  const lines = []
  for (let i = -2; i < 8; i++) {
    const x = i * 40
    lines.push(
      <path
        key={i}
        d={`M${x},${height} C${x + 20},${height * 0.6} ${x + 10},${height * 0.4} ${x + 40},0`}
        stroke={INDIGO}
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
      />
    )
  }
  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity, display: "block" }}>
      {lines}
    </svg>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function BlueJavaSection({ section, inv }: { section: Section; inv: GuestInvitation }) {
  const c = section.content as Record<string, unknown>

  switch (section.type) {

    // ── Hero ──────────────────────────────────────────────────────────────────
    case "hero":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden text-center"
          style={{ backgroundColor: BG, color: TXT, ...snap }}
        >
          {/* Diagonal parang background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <ParangDiagonal width={400} height={700} opacity={0.06} />
          </div>

          {/* Corner kawung motifs */}
          <div className="absolute top-4 left-4 pointer-events-none"><KawungMotif size={40} opacity={0.35} /></div>
          <div className="absolute top-4 right-4 pointer-events-none"><KawungMotif size={40} opacity={0.35} /></div>
          <div className="absolute bottom-4 left-4 pointer-events-none"><KawungMotif size={40} opacity={0.35} /></div>
          <div className="absolute bottom-4 right-4 pointer-events-none"><KawungMotif size={40} opacity={0.35} /></div>

          <div className="relative z-10 px-8 py-24">
            <Anim variant="fadeIn" delay={0}>
              <KawungMotif size={64} opacity={0.75} />
            </Anim>
            <Anim variant="fadeIn" delay={100}>
              <p className="mt-4 mb-2 text-[10px] tracking-[0.5em] uppercase" style={{ color: BLUE, opacity: 0.7 }}>
                The Wedding of
              </p>
            </Anim>
            <Anim variant="fadeIn" delay={80}>
              <div className="my-3"><BatikBorder width={240} opacity={0.6} /></div>
            </Anim>
            <Anim variant="fadeUp" delay={220}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: INDIGO, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={340}>
              <p className="my-3 text-3xl font-light italic" style={{ color: GOLD }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={400}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: INDIGO, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.brideName}
              </h1>
            </Anim>
            <Anim variant="fadeIn" delay={500}>
              <div className="my-3"><BatikBorder width={240} opacity={0.6} /></div>
            </Anim>
            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={560}>
                <p className="mt-4 text-sm italic" style={{ color: TXT, opacity: 0.6 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={640}>
              <p className="mt-4 text-sm" style={{ color: BLUE, opacity: 0.75 }}>
                {inv.eventDate
                  ? new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : "Wedding Date TBD"}
              </p>
            </Anim>
          </div>
        </section>
      )

    // ── Couple ────────────────────────────────────────────────────────────────
    case "couple": {
      const PersonCard = ({ photo, name, parents, bio, instagram }: { photo?: string; name: string; parents?: string; bio?: string; instagram?: string }) => (
        <div className="space-y-3 text-center">
          <div
            className="mx-auto h-20 w-20 overflow-hidden rounded-full"
            style={{ border: `2.5px solid ${GOLD}`, boxShadow: `0 0 0 4px ${GOLD}30` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={80} height={80} className="object-cover w-full h-full" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: INDIGO, fontFamily: "Cormorant Garamond, serif" }}>
            {name}
          </h2>
          {parents && <p className="text-xs opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-40 text-sm leading-relaxed opacity-70" style={{ color: TXT }}>{bio}</p>}
          {instagram && (
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs opacity-60" style={{ color: BLUE }}>
              <Instagram className="h-3 w-3" />@{instagram}
            </a>
          )}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}><KawungMotif size={44} /></Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mt-3 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: BLUE, opacity: 0.65 }}>
              The Couple
            </p>
          </Anim>
          <div className="flex justify-center gap-8 items-center">
            <Anim variant="slideLeft" delay={150}>
              <PersonCard
                photo={c.groomPhoto as string}
                name={inv.groomName}
                parents={c.groomParents as string}
                bio={c.groomBio as string}
                instagram={c.groomInstagram as string}
              />
            </Anim>
            <Anim variant="scaleIn" delay={300}>
              <KawungMotif size={36} opacity={0.55} />
            </Anim>
            <Anim variant="slideRight" delay={150}>
              <PersonCard
                photo={c.bridePhoto as string}
                name={inv.brideName}
                parents={c.brideParents as string}
                bio={c.brideBio as string}
                instagram={c.brideInstagram as string}
              />
            </Anim>
          </div>
        </section>
      )
    }

    // ── Event ─────────────────────────────────────────────────────────────────
    case "event": {
      type EventItem = { name: string; date: string; time: string }
      const events = (c.events as EventItem[]) ?? []
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}><BatikBorder width={260} opacity={0.55} /></Anim>
            <Anim variant="fadeIn" delay={80}>
              <p className="mt-4 mb-3 text-[10px] tracking-[0.45em] uppercase" style={{ color: BLUE, opacity: 0.65 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={180}>
              <div
                className="inline-block px-8 py-5 rounded-sm"
                style={{ border: `2px solid ${INDIGO}`, backgroundColor: `${INDIGO}08` }}
              >
                <p className="text-2xl font-bold" style={{ color: INDIGO, fontFamily: "Cormorant Garamond, serif" }}>
                  {inv.eventDate
                    ? new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                    : "Wedding Date TBD"}
                </p>
              </div>
            </Anim>
            <Anim variant="fadeUp" delay={280}>
              <div className="mt-5">
                <p className="text-lg font-medium" style={{ color: TXT }}>{inv.eventVenue}</p>
                {inv.eventAddress && (
                  <p className="mt-1 text-sm opacity-60" style={{ color: TXT }}>{inv.eventAddress}</p>
                )}
              </div>
            </Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={380}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded px-5 py-4 text-center min-w-32.5"
                      style={{ border: `1.5px solid ${GOLD}80`, backgroundColor: `${GOLD}10` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
                        {ev.name || `Acara ${i + 1}`}
                      </p>
                      {ev.date && (
                        <p className="mt-1.5 text-sm font-medium" style={{ color: TXT }}>
                          {new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                      {ev.time && <p className="text-sm opacity-65" style={{ color: TXT }}>{ev.time}</p>}
                    </div>
                  ))}
                </div>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={460}>
              <div className="mt-6"><BatikBorder width={260} opacity={0.55} /></div>
            </Anim>
          </div>
        </section>
      )
    }

    // ── Gallery ───────────────────────────────────────────────────────────────
    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      const items = images.map((url, i) => ({ id: String(i), img: url }))
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col"
          style={{ backgroundColor: BG, ...snap }}
        >
          <div className="px-4 py-12">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: BLUE }}>
                Gallery
              </p>
            </Anim>
            {images.length === 0 ? (
              <div
                className="mx-4 flex h-32 items-center justify-center rounded text-sm opacity-40"
                style={{ backgroundColor: `${INDIGO}15` }}
              >
                Belum ada foto
              </div>
            ) : (
              <Masonry items={items} animateFrom="bottom" stagger={0.05} blurToFocus maxColumns={2} />
            )}
          </div>
        </section>
      )
    }

    // ── Countdown ─────────────────────────────────────────────────────────────
    case "countdown":
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: BLUE, opacity: 0.65 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={INDIGO} />
          </Anim>
          <Anim variant="fadeIn" delay={340}>
            <div className="mt-8"><BatikBorder width={200} opacity={0.5} /></div>
          </Anim>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center"
          style={{ backgroundColor: BG, color: TXT, ...snap }}
        >
          <div className="w-full max-w-sm px-8">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><KawungMotif size={40} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={80}>
              <p className="mb-6 text-center text-[10px] tracking-[0.4em] uppercase" style={{ color: BLUE, opacity: 0.65 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <RsvpForm invitationId={inv.id} primaryColor={INDIGO} />
          </div>
        </section>
      )

    // ── Closing ───────────────────────────────────────────────────────────────
    case "closing":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
          style={{ backgroundColor: BG, ...snap }}
        >
          <div className="absolute top-0 left-0 right-0 pointer-events-none">
            <BatikBorder width={400} opacity={0.4} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <BatikBorder width={400} opacity={0.4} />
          </div>
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <p className="text-6xl font-light italic" style={{ color: GOLD }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={180}>
              <p className="text-3xl font-bold mt-2" style={{ color: INDIGO, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.groomName} &amp; {inv.brideName}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={300}>
              <p className="mx-auto max-w-xs text-sm leading-relaxed mt-6" style={{ color: TXT, opacity: 0.7 }}>
                {(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={440}>
              <div className="mt-8"><KawungMotif size={48} opacity={0.55} /></div>
            </Anim>
          </div>
        </section>
      )

    // ── Maps ──────────────────────────────────────────────────────────────────
    case "maps": {
      const lat = parseFloat(c.lat as string)
      const lng = parseFloat(c.lng as string)
      const hasCoords = !isNaN(lat) && !isNaN(lng)
      const gmapsUrl = hasCoords ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed` : null
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center"
          style={{ backgroundColor: BG, color: TXT, ...snap }}
        >
          <div className="w-full max-w-lg px-8">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-center opacity-60">
                {(c.label as string) || "Lokasi Acara"}
              </p>
            </Anim>
            {gmapsUrl ? (
              <Anim variant="fadeUp" delay={150}>
                <div className="overflow-hidden rounded-xl" style={{ border: `2px solid ${INDIGO}40` }}>
                  <iframe src={gmapsUrl} width="100%" height="240" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </Anim>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${INDIGO}20` }}>
                Pilih lokasi di panel kanan
              </div>
            )}
            {gmapsUrl && (
              <Anim variant="fadeIn" delay={280}>
                <a
                  href={`https://maps.google.com/?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs opacity-60"
                >
                  <Navigation className="h-3 w-3" />Buka di Google Maps
                </a>
              </Anim>
            )}
          </div>
        </section>
      )
    }

    // ── Quote ─────────────────────────────────────────────────────────────────
    case "quote":
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}><KawungMotif size={44} opacity={0.6} /></Anim>
          <Anim variant="fadeUp" delay={160}>
            <blockquote
              className="mx-auto max-w-sm text-base italic leading-relaxed mt-6"
              style={{ color: TXT, opacity: 0.85 }}
            >
              &ldquo;{c.quote as string}&rdquo;
            </blockquote>
          </Anim>
          {!!c.source && (
            <Anim variant="fadeIn" delay={360}>
              <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: GOLD, opacity: 0.8 }}>
                — {c.source as string}
              </p>
            </Anim>
          )}
        </section>
      )

    default:
      return null
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function BlueJavaTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  return (
    <>
      {sorted.map((s) => (
        <div
          key={s.id}
          onClick={() => onSectionClick?.(s.id)}
          className={onSectionClick ? "cursor-pointer" : ""}
          style={activeSection === s.id ? { outline: "2px solid rgba(0,0,0,0.25)", outlineOffset: "-2px" } : undefined}
        >
          <BlueJavaSection section={s} inv={inv} />
        </div>
      ))}
    </>
  )
}
