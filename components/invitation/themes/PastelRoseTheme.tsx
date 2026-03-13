"use client"

/**
 * Pastel Rose Theme
 * Concept : Pastel rose dream — ultra-soft modern pastel aesthetic
 * Palette : Rose (#E8A0B0) · Blush (#F5C8D0) · Peach (#F5D5C0) · Sage (#B8C8B8) · Warm BG (#FFF8F6) · Dark text (#4A2835)
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
import { GiftSection } from "@/components/invitation/gift-section"

const Masonry = dynamic(
  () => import("@/components/ui/masonry").then((m) => ({ default: m.Masonry })),
  { ssr: false }
)

// ─── Palette ──────────────────────────────────────────────────────────────────
const ROSE  = "#E8A0B0"
const BLUSH = "#F5C8D0"
const PEACH = "#F5D5C0"
const SAGE  = "#B8C8B8"
const BG    = "#FFF8F6"
const TXT   = "#4A2835"

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ──────────────────────────────────────────────────────────

/** PastelRose — stylized rose with inner/outer petal rings */
function PastelRose({ size = 56, opacity = 1 }: { size?: number; opacity?: number }) {
  const c = size / 2
  const OR = size * 0.38 // outer petal radius from center
  const IR = size * 0.22 // inner petal radius from center
  const outerPetals = Array.from({ length: 6 }, (_, i) => (i * 60) - 90)
  const innerPetals = Array.from({ length: 6 }, (_, i) => (i * 60) - 60)
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      {/* outer petal ring */}
      {outerPetals.map((angle, i) => (
        <ellipse
          key={`op${i}`}
          cx={c}
          cy={c - OR * 0.75}
          rx={size * 0.1}
          ry={size * 0.18}
          fill={BLUSH}
          opacity="0.7"
          transform={`rotate(${angle} ${c} ${c})`}
        />
      ))}
      {/* inner petal ring */}
      {innerPetals.map((angle, i) => (
        <ellipse
          key={`ip${i}`}
          cx={c}
          cy={c - IR * 0.8}
          rx={size * 0.075}
          ry={size * 0.13}
          fill={ROSE}
          opacity="0.75"
          transform={`rotate(${angle} ${c} ${c})`}
        />
      ))}
      {/* center circle */}
      <circle cx={c} cy={c} r={size * 0.1} fill={ROSE} opacity="0.9" />
      <circle cx={c} cy={c} r={size * 0.05} fill={BLUSH} opacity="0.8" />
    </svg>
  )
}

/** SoftRibbon — elegant ribbon/bow: two curved loops with a knot */
function SoftRibbon({ width = 120, height = 50, opacity = 1 }: { width?: number; height?: number; opacity?: number }) {
  const cx = width / 2
  const cy = height / 2
  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity, display: "block" }}>
      {/* left ribbon loop */}
      <path
        d={`M${cx},${cy} C${cx - 20},${cy - 18} ${cx - 50},${cy - 10} ${cx - 55},${cy + 5} C${cx - 50},${cy + 18} ${cx - 20},${cy + 12} ${cx},${cy}`}
        fill={BLUSH}
        stroke={ROSE}
        strokeWidth="0.8"
        opacity="0.75"
      />
      {/* right ribbon loop */}
      <path
        d={`M${cx},${cy} C${cx + 20},${cy - 18} ${cx + 50},${cy - 10} ${cx + 55},${cy + 5} C${cx + 50},${cy + 18} ${cx + 20},${cy + 12} ${cx},${cy}`}
        fill={BLUSH}
        stroke={ROSE}
        strokeWidth="0.8"
        opacity="0.75"
      />
      {/* left tail */}
      <path
        d={`M${cx - 5},${cy + 2} Q${cx - 30},${cy + 28} ${cx - 20},${cy + 42}`}
        stroke={ROSE}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      {/* right tail */}
      <path
        d={`M${cx + 5},${cy + 2} Q${cx + 30},${cy + 28} ${cx + 20},${cy + 42}`}
        stroke={ROSE}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      {/* knot */}
      <ellipse cx={cx} cy={cy} rx="5" ry="4" fill={ROSE} opacity="0.9" />
    </svg>
  )
}

/** DotGrid — subtle 5x5 grid of tiny circles for background texture */
function DotGrid({ size = 80, opacity = 0.15 }: { size?: number; opacity?: number }) {
  const spacing = size / 4
  const dots = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      dots.push({ x: col * spacing + spacing / 2, y: row * spacing + spacing / 2 })
    }
  }
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.5" fill={ROSE} />
      ))}
    </svg>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function PastelRoseSection({ section, inv, index }: { section: Section; inv: GuestInvitation; index: number }) {
  const c = section.content as Record<string, unknown>
  // Alternating soft gradient backgrounds
  const altBg = index % 3 === 0
    ? `linear-gradient(160deg, ${BG} 0%, ${BLUSH}25 100%)`
    : index % 3 === 1
      ? `linear-gradient(160deg, ${BG} 0%, ${PEACH}25 100%)`
      : `linear-gradient(160deg, ${BG} 0%, ${SAGE}20 100%)`

  switch (section.type) {

    // ── Hero ──────────────────────────────────────────────────────────────────
    case "hero":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden text-center"
          style={{ backgroundColor: BG, color: TXT, ...snap }}
        >
          {/* Background dot grid texture */}
          <div className="absolute top-4 left-4 pointer-events-none"><DotGrid size={80} opacity={0.18} /></div>
          <div className="absolute top-4 right-4 pointer-events-none"><DotGrid size={80} opacity={0.15} /></div>
          <div className="absolute bottom-4 left-4 pointer-events-none"><DotGrid size={80} opacity={0.15} /></div>
          <div className="absolute bottom-4 right-4 pointer-events-none"><DotGrid size={80} opacity={0.18} /></div>

          {/* Corner PastelRose decorations */}
          <div className="absolute top-8 left-6 pointer-events-none" style={{ transform: "rotate(-15deg)" }}>
            <PastelRose size={44} opacity={0.45} />
          </div>
          <div className="absolute top-8 right-6 pointer-events-none" style={{ transform: "rotate(15deg)" }}>
            <PastelRose size={44} opacity={0.45} />
          </div>
          <div className="absolute bottom-8 left-6 pointer-events-none" style={{ transform: "rotate(20deg)" }}>
            <PastelRose size={36} opacity={0.35} />
          </div>
          <div className="absolute bottom-8 right-6 pointer-events-none" style={{ transform: "rotate(-20deg)" }}>
            <PastelRose size={36} opacity={0.35} />
          </div>

          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><PastelRose size={64} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mb-3 text-[10px] tracking-[0.5em] uppercase" style={{ color: ROSE, opacity: 0.75 }}>
                The Wedding of
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={240}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: TXT, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={360}>
              <div className="my-3 flex justify-center"><SoftRibbon width={100} height={44} opacity={0.8} /></div>
            </Anim>
            <Anim variant="fadeUp" delay={420}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: TXT, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.brideName}
              </h1>
            </Anim>
            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={520}>
                <p className="mt-5 text-sm italic" style={{ color: TXT, opacity: 0.6 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={600}>
              <p className="mt-5 text-sm" style={{ color: TXT, opacity: 0.55 }}>
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
            style={{ border: `2.5px solid ${ROSE}`, boxShadow: `0 0 0 4px ${BLUSH}60` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={80} height={80} className="object-cover w-full h-full" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: TXT, fontFamily: "Cormorant Garamond, serif" }}>
            {name}
          </h2>
          {parents && <p className="text-xs opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-40 text-sm leading-relaxed opacity-70" style={{ color: TXT }}>{bio}</p>}
          {instagram && (
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs opacity-60" style={{ color: ROSE }}>
              <Instagram className="h-3 w-3" />@{instagram}
            </a>
          )}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ background: altBg, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <div className="flex justify-center mb-4"><PastelRose size={48} /></div>
          </Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: ROSE, opacity: 0.75 }}>
              The Couple
            </p>
          </Anim>
          <div className="flex justify-center gap-8 items-center">
            <Anim variant="slideLeft" delay={150}>
              <PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} instagram={c.groomInstagram as string} />
            </Anim>
            <Anim variant="scaleIn" delay={300}>
              <span className="text-3xl italic font-light" style={{ color: ROSE }}>&amp;</span>
            </Anim>
            <Anim variant="slideRight" delay={150}>
              <PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} instagram={c.brideInstagram as string} />
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
          style={{ background: altBg, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4">
                <SoftRibbon width={110} height={46} opacity={0.7} />
              </div>
            </Anim>
            <Anim variant="fadeIn" delay={100}>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: ROSE, opacity: 0.75 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="text-2xl font-bold" style={{ color: TXT, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.eventDate
                  ? new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : "Wedding Date TBD"}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={300}>
              <div className="mt-4">
                <p className="text-lg font-medium" style={{ color: TXT }}>{inv.eventVenue}</p>
                {inv.eventAddress && (
                  <p className="mt-1 text-sm opacity-60" style={{ color: TXT }}>{inv.eventAddress}</p>
                )}
              </div>
            </Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={400}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-2xl px-5 py-4 text-center min-w-32.5"
                      style={{ border: `1.5px solid ${ROSE}50`, backgroundColor: `${BLUSH}35` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ROSE }}>
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
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: ROSE }}>
                Gallery
              </p>
            </Anim>
            {images.length === 0 ? (
              <div className="mx-4 flex h-32 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${BLUSH}40` }}>
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
          style={{ background: altBg, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: ROSE, opacity: 0.75 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={ROSE} />
          </Anim>
          <Anim variant="fadeIn" delay={340}>
            <div className="mt-8 flex justify-center">
              <SoftRibbon width={100} height={44} opacity={0.6} />
            </div>
          </Anim>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center"
          style={{ background: altBg, color: TXT, ...snap }}
        >
          <div className="w-full max-w-sm px-8">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><PastelRose size={48} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={80}>
              <p className="mb-6 text-center text-[10px] tracking-[0.4em] uppercase" style={{ color: ROSE, opacity: 0.75 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <RsvpForm invitationId={inv.id} primaryColor={ROSE} />
          </div>
        </section>
      )

    // ── Closing ───────────────────────────────────────────────────────────────
    case "closing":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${BG} 0%, ${BLUSH}30 60%, ${PEACH}25 100%)`, ...snap }}
        >
          {/* Background dot grids */}
          <div className="absolute top-6 left-6 pointer-events-none"><DotGrid size={64} opacity={0.15} /></div>
          <div className="absolute bottom-6 right-6 pointer-events-none"><DotGrid size={64} opacity={0.15} /></div>

          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><PastelRose size={60} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={180}>
              <div className="flex justify-center mb-4">
                <SoftRibbon width={110} height={46} opacity={0.7} />
              </div>
            </Anim>
            <Anim variant="fadeUp" delay={280}>
              <p className="text-3xl font-bold" style={{ color: TXT, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.groomName} &amp; {inv.brideName}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={400}>
              <p className="mx-auto max-w-xs text-sm leading-relaxed mt-5" style={{ color: TXT, opacity: 0.7 }}>
                {(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
              </p>
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
                <div className="overflow-hidden rounded-xl" style={{ border: `1.5px solid ${ROSE}50` }}>
                  <iframe src={gmapsUrl} width="100%" height="240" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </Anim>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${BLUSH}40` }}>
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
          style={{ background: altBg, ...snap }}
        >
          <Anim variant="scaleIn" delay={0}>
            <div className="flex justify-center mb-2"><PastelRose size={44} opacity={0.75} /></div>
          </Anim>
          <Anim variant="fadeUp" delay={160}>
            <blockquote
              className="mx-auto max-w-sm text-base italic leading-relaxed mt-4"
              style={{ color: TXT, opacity: 0.85 }}
            >
              &ldquo;{c.quote as string}&rdquo;
            </blockquote>
          </Anim>
          {!!c.source && (
            <Anim variant="fadeIn" delay={360}>
              <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: ROSE, opacity: 0.7 }}>
                — {c.source as string}
              </p>
            </Anim>
          )}
        </section>
      )

    // ── Gift ──────────────────────────────────────────────────────────────────
    case "gift": {
      const banks = (c.banks as import("@/components/invitation/gift-section").BankAccount[]) ?? []
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16"
          style={{ background: `linear-gradient(160deg, ${BG} 0%, ${BLUSH}25 100%)`, color: TXT, ...snap }}
        >
          <div className="max-w-sm mx-auto w-full">
            <Anim variant="fadeUp" delay={0}>
              <GiftSection
                invitationId={inv.id}
                title={c.title as string | undefined}
                description={c.description as string | undefined}
                showQris={c.showQris as boolean | undefined}
                qrisImage={c.qrisImage as string | null | undefined}
                banks={banks}
                allowTransferProof={c.allowTransferProof as boolean | undefined}
                primaryColor={ROSE}
                accentColor={BLUSH}
              />
            </Anim>
          </div>
        </section>
      )
    }

    default:
      return null
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PastelRoseTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  return (
    <>
      {sorted.map((s, i) => (
        <div
          key={s.id}
          onClick={() => onSectionClick?.(s.id)}
          className={onSectionClick ? "cursor-pointer" : ""}
          style={activeSection === s.id ? { outline: "2px solid rgba(0,0,0,0.25)", outlineOffset: "-2px" } : undefined}
        >
          <PastelRoseSection section={s} inv={inv} index={i} />
        </div>
      ))}
    </>
  )
}
