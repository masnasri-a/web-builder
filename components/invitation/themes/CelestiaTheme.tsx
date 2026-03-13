"use client"

/**
 * Celestia Theme
 * Concept : Celestial night sky — stars, crescent moon, ethereal dark theme
 * Palette : Midnight (#080E1C) · Navy (#0E1F42) · Silver (#C8D4E0) · Gold (#E8C547) · Light text (#E8F0F8)
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
const NIGHT  = "#080E1C"
const NAVY   = "#0E1F42"
const SILVER = "#C8D4E0"
const GOLD   = "#E8C547"
const BG     = "#080E1C"
const TXT    = "#E8F0F8"

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ──────────────────────────────────────────────────────────

/** StarField — scattered 4-point stars at various sizes */
function StarField({ width = 300, height = 300, count = 16, opacity = 1 }: { width?: number; height?: number; count?: number; opacity?: number }) {
  const stars = [
    { cx: 30,  cy: 40,  r: 3,   fill: GOLD   },
    { cx: 80,  cy: 15,  r: 2,   fill: SILVER },
    { cx: 140, cy: 55,  r: 2.5, fill: GOLD   },
    { cx: 200, cy: 20,  r: 1.5, fill: SILVER },
    { cx: 250, cy: 60,  r: 3,   fill: GOLD   },
    { cx: 60,  cy: 90,  r: 1.5, fill: SILVER },
    { cx: 170, cy: 100, r: 2,   fill: GOLD   },
    { cx: 280, cy: 85,  r: 1.5, fill: SILVER },
    { cx: 110, cy: 130, r: 2.5, fill: GOLD   },
    { cx: 230, cy: 140, r: 2,   fill: SILVER },
    { cx: 20,  cy: 160, r: 1.5, fill: GOLD   },
    { cx: 290, cy: 170, r: 3,   fill: SILVER },
    { cx: 150, cy: 180, r: 1.5, fill: GOLD   },
    { cx: 70,  cy: 200, r: 2,   fill: SILVER },
    { cx: 210, cy: 200, r: 2.5, fill: GOLD   },
    { cx: 130, cy: 220, r: 1.5, fill: SILVER },
  ]

  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity, display: "block" }}>
      {stars.slice(0, count).map((s, i) => {
        // 4-point star shape
        const R = s.r
        const r2 = R * 0.4
        const pts = Array.from({ length: 8 }, (_, k) => {
          const angle = (k * Math.PI) / 4 - Math.PI / 2
          const rad = k % 2 === 0 ? R : r2
          return `${s.cx + rad * Math.cos(angle)},${s.cy + rad * Math.sin(angle)}`
        }).join(" ")
        return <polygon key={i} points={pts} fill={s.fill} opacity="0.85" />
      })}
    </svg>
  )
}

/** CrescentMoon — crescent using two overlapping circles */
function CrescentMoon({ size = 48, opacity = 1 }: { size?: number; opacity?: number }) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.38
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      <defs>
        <mask id="cMask">
          <circle cx={cx} cy={cy} r={R} fill="white" />
          {/* cut out circle slightly offset to create crescent */}
          <circle cx={cx + R * 0.45} cy={cy - R * 0.1} r={R * 0.78} fill="black" />
        </mask>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill={SILVER} mask="url(#cMask)" />
      {/* subtle glow ring */}
      <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke={SILVER} strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

/** ConstellationDots — 5-6 small circles connected by thin lines */
function ConstellationDots({ width = 160, height = 80, opacity = 0.5 }: { width?: number; height?: number; opacity?: number }) {
  const nodes = [
    { x: 10,  y: 60 },
    { x: 50,  y: 20 },
    { x: 90,  y: 50 },
    { x: 120, y: 15 },
    { x: 150, y: 40 },
    { x: 140, y: 70 },
  ]
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 3],
  ]
  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity }}>
      {connections.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={SILVER} strokeWidth="0.6" opacity="0.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 0 || i === 4 ? 2.5 : 1.8} fill={i % 2 === 0 ? GOLD : SILVER} opacity="0.9" />
      ))}
    </svg>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function CelestiaSection({ section, inv }: { section: Section; inv: GuestInvitation }) {
  const c = section.content as Record<string, unknown>

  switch (section.type) {

    // ── Hero ──────────────────────────────────────────────────────────────────
    case "hero":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden text-center"
          style={{ backgroundColor: NIGHT, color: TXT, ...snap }}
        >
          {/* Star field background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-start justify-center">
            <StarField width={400} height={400} count={16} opacity={0.6} />
          </div>
          {/* Constellation bottom right */}
          <div className="absolute bottom-8 right-4 pointer-events-none">
            <ConstellationDots opacity={0.35} />
          </div>
          {/* Constellation top left */}
          <div className="absolute top-8 left-4 pointer-events-none">
            <ConstellationDots width={120} height={60} opacity={0.3} />
          </div>

          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4">
                <CrescentMoon size={60} />
              </div>
            </Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mb-3 text-[10px] tracking-[0.5em] uppercase" style={{ color: SILVER, opacity: 0.6 }}>
                The Wedding of
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={240}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: SILVER, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={360}>
              <p className="my-3 text-3xl font-light italic" style={{ color: GOLD }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={420}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: SILVER, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.brideName}
              </h1>
            </Anim>
            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={520}>
                <p className="mt-5 text-sm italic" style={{ color: TXT, opacity: 0.5 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={600}>
              <p className="mt-5 text-sm" style={{ color: SILVER, opacity: 0.6 }}>
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
            style={{ border: `2px solid ${GOLD}`, boxShadow: `0 0 0 4px ${GOLD}25` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={80} height={80} className="object-cover w-full h-full" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: SILVER, fontFamily: "Cormorant Garamond, serif" }}>
            {name}
          </h2>
          {parents && <p className="text-xs opacity-55" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-40 text-sm leading-relaxed opacity-65" style={{ color: TXT }}>{bio}</p>}
          {instagram && (
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs opacity-55" style={{ color: SILVER }}>
              <Instagram className="h-3 w-3" />@{instagram}
            </a>
          )}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ backgroundColor: NIGHT, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <div className="flex justify-center mb-4"><CrescentMoon size={40} /></div>
          </Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: SILVER, opacity: 0.55 }}>
              The Couple
            </p>
          </Anim>
          <div className="flex justify-center gap-8 items-center">
            <Anim variant="slideLeft" delay={150}>
              <PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} instagram={c.groomInstagram as string} />
            </Anim>
            <Anim variant="scaleIn" delay={300}>
              <span className="text-3xl italic font-light" style={{ color: GOLD }}>&amp;</span>
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><ConstellationDots opacity={0.5} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={100}>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: SILVER, opacity: 0.6 }}>
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
                <p className="text-lg font-medium" style={{ color: SILVER }}>{inv.eventVenue}</p>
                {inv.eventAddress && (
                  <p className="mt-1 text-sm opacity-55" style={{ color: TXT }}>{inv.eventAddress}</p>
                )}
              </div>
            </Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={400}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-5 py-4 text-center min-w-32.5"
                      style={{ border: `1px solid ${GOLD}50`, backgroundColor: `${GOLD}10` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                        {ev.name || `Acara ${i + 1}`}
                      </p>
                      {ev.date && (
                        <p className="mt-1.5 text-sm font-medium" style={{ color: TXT }}>
                          {new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                      {ev.time && <p className="text-sm opacity-60" style={{ color: TXT }}>{ev.time}</p>}
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
          style={{ backgroundColor: NIGHT, ...snap }}
        >
          <div className="px-4 py-12">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: SILVER, opacity: 0.6 }}>
                Gallery
              </p>
            </Anim>
            {images.length === 0 ? (
              <div className="mx-4 flex h-32 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${SILVER}15` }}>
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
          style={{ backgroundColor: NIGHT, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: SILVER, opacity: 0.6 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={GOLD} />
          </Anim>
          <Anim variant="fadeIn" delay={340}>
            <div className="mt-8 flex justify-center"><StarField width={200} height={60} count={8} opacity={0.5} /></div>
          </Anim>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center"
          style={{ backgroundColor: NIGHT, color: TXT, ...snap }}
        >
          <div className="w-full max-w-sm px-8">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><CrescentMoon size={36} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={80}>
              <p className="mb-6 text-center text-[10px] tracking-[0.4em] uppercase" style={{ color: SILVER, opacity: 0.6 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <RsvpForm invitationId={inv.id} primaryColor={GOLD} />
          </div>
        </section>
      )

    // ── Closing ───────────────────────────────────────────────────────────────
    case "closing":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
          style={{ backgroundColor: NIGHT, ...snap }}
        >
          <div className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none">
            <StarField width={300} height={100} count={12} opacity={0.4} />
          </div>
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><CrescentMoon size={52} /></div>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="text-3xl font-bold" style={{ color: SILVER, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.groomName} &amp; {inv.brideName}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={340}>
              <p className="mx-auto max-w-xs text-sm leading-relaxed mt-5" style={{ color: TXT, opacity: 0.65 }}>
                {(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
              </p>
            </Anim>
            <Anim variant="fadeIn" delay={460}>
              <div className="mt-8 flex justify-center">
                <ConstellationDots opacity={0.45} />
              </div>
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
          style={{ backgroundColor: NIGHT, color: TXT, ...snap }}
        >
          <div className="w-full max-w-lg px-8">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-center opacity-60">
                {(c.label as string) || "Lokasi Acara"}
              </p>
            </Anim>
            {gmapsUrl ? (
              <Anim variant="fadeUp" delay={150}>
                <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${SILVER}30` }}>
                  <iframe src={gmapsUrl} width="100%" height="240" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </Anim>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${SILVER}15` }}>
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}><ConstellationDots opacity={0.5} /></Anim>
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
              <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: GOLD, opacity: 0.7 }}>
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
          style={{ backgroundColor: BG, color: TXT, ...snap }}
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
                primaryColor={GOLD}
                accentColor={SILVER}
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

export function CelestiaTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order)
  return (
    <>
      {sorted.map((s) => (
        <div
          key={s.id}
          onClick={() => onSectionClick?.(s.id)}
          className={onSectionClick ? "cursor-pointer" : ""}
          style={activeSection === s.id ? { outline: "2px solid rgba(200,212,224,0.4)", outlineOffset: "-2px" } : undefined}
        >
          <CelestiaSection section={s} inv={inv} />
        </div>
      ))}
    </>
  )
}
