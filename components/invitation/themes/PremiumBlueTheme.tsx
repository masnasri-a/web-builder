"use client"

/**
 * Premium Blue Theme
 * Concept : Luxury royal blue — premium corporate/formal with gold details
 * Palette : Royal (#1B3A7A) · Gold (#C9A84C) · Pearl (#F8F4EE) · Deep navy text (#0D2352) · Light blue tint (#EEF2FF)
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
const ROYAL = "#1B3A7A"
const GOLD  = "#C9A84C"
const PEARL = "#F8F4EE"
const TXT   = "#0D2352"
const LIGHT = "#EEF2FF"

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ──────────────────────────────────────────────────────────

/** GoldOrnament — diamond shape with 4 small triangles at corners */
function GoldOrnament({ size = 48, opacity = 1 }: { size?: number; opacity?: number }) {
  const c = size / 2
  const R = size * 0.38
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      {/* main diamond */}
      <polygon
        points={`${c},${c - R} ${c + R},${c} ${c},${c + R} ${c - R},${c}`}
        fill={GOLD}
        opacity="0.25"
        stroke={GOLD}
        strokeWidth="1"
      />
      {/* inner diamond */}
      <polygon
        points={`${c},${c - R * 0.55} ${c + R * 0.55},${c} ${c},${c + R * 0.55} ${c - R * 0.55},${c}`}
        fill="none"
        stroke={GOLD}
        strokeWidth="0.8"
        opacity="0.7"
      />
      {/* 4 small corner triangles */}
      <polygon points={`${c},${c - R - 5} ${c - 4},${c - R} ${c + 4},${c - R}`} fill={GOLD} opacity="0.6" />
      <polygon points={`${c},${c + R + 5} ${c - 4},${c + R} ${c + 4},${c + R}`} fill={GOLD} opacity="0.6" />
      <polygon points={`${c - R - 5},${c} ${c - R},${c - 4} ${c - R},${c + 4}`} fill={GOLD} opacity="0.6" />
      <polygon points={`${c + R + 5},${c} ${c + R},${c - 4} ${c + R},${c + 4}`} fill={GOLD} opacity="0.6" />
      {/* center dot */}
      <circle cx={c} cy={c} r="2.5" fill={GOLD} opacity="0.9" />
    </svg>
  )
}

/** BlueFrame — partial L-bracket corners for elegant framing */
function BlueFrame({ width = 280, height = 180, opacity = 0.5 }: { width?: number; height?: number; opacity?: number }) {
  const L = 28 // corner arm length
  const T = 1.5
  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ opacity, display: "block", pointerEvents: "none" }}>
      {/* top-left */}
      <path d={`M0,${L} L0,0 L${L},0`} stroke={ROYAL} strokeWidth={T} fill="none" />
      {/* top-right */}
      <path d={`M${width - L},0 L${width},0 L${width},${L}`} stroke={ROYAL} strokeWidth={T} fill="none" />
      {/* bottom-left */}
      <path d={`M0,${height - L} L0,${height} L${L},${height}`} stroke={ROYAL} strokeWidth={T} fill="none" />
      {/* bottom-right */}
      <path d={`M${width - L},${height} L${width},${height} L${width},${height - L}`} stroke={ROYAL} strokeWidth={T} fill="none" />
      {/* corner gold dots */}
      <circle cx="0" cy="0" r="2" fill={GOLD} opacity="0.7" />
      <circle cx={width} cy="0" r="2" fill={GOLD} opacity="0.7" />
      <circle cx="0" cy={height} r="2" fill={GOLD} opacity="0.7" />
      <circle cx={width} cy={height} r="2" fill={GOLD} opacity="0.7" />
    </svg>
  )
}

/** DiamondDivider — horizontal line with a diamond in center */
function DiamondDivider({ width = 240, opacity = 0.65 }: { width?: number; opacity?: number }) {
  const mid = width / 2
  return (
    <svg aria-hidden="true" width={width} height="20" viewBox={`0 0 ${width} 20`} style={{ opacity, display: "block" }}>
      <line x1="0" y1="10" x2={mid - 9} y2="10" stroke={GOLD} strokeWidth="1" />
      <polygon points={`${mid},2 ${mid + 8},10 ${mid},18 ${mid - 8},10`} fill={GOLD} opacity="0.8" />
      <line x1={mid + 9} y1="10" x2={width} y2="10" stroke={GOLD} strokeWidth="1" />
    </svg>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function PremiumBlueSection({ section, inv, index }: { section: Section; inv: GuestInvitation; index: number }) {
  const c = section.content as Record<string, unknown>
  const sectionBg = index % 2 === 0 ? PEARL : LIGHT

  switch (section.type) {

    // ── Hero ──────────────────────────────────────────────────────────────────
    case "hero":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden text-center"
          style={{ backgroundColor: PEARL, color: TXT, ...snap }}
        >
          {/* BlueFrame overlay corners */}
          <div className="absolute inset-6 pointer-events-none flex items-stretch">
            <BlueFrame width={320} height={500} opacity={0.35} />
          </div>

          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><GoldOrnament size={56} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mb-3 text-[10px] tracking-[0.5em] uppercase" style={{ color: ROYAL, opacity: 0.65 }}>
                The Wedding of
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={240}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: ROYAL, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={360}>
              <p className="my-3 text-3xl font-light italic" style={{ color: GOLD }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={420}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: ROYAL, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.brideName}
              </h1>
            </Anim>
            <Anim variant="fadeIn" delay={520}>
              <div className="flex justify-center mt-5"><DiamondDivider /></div>
            </Anim>
            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={580}>
                <p className="mt-4 text-sm italic" style={{ color: TXT, opacity: 0.6 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={640}>
              <p className="mt-4 text-sm" style={{ color: ROYAL, opacity: 0.7 }}>
                {inv.eventDate
                  ? new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : "Wedding Date TBD"}
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={720}>
              <div className="flex justify-center mt-5"><GoldOrnament size={32} opacity={0.5} /></div>
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
            style={{ border: `2.5px solid ${GOLD}`, boxShadow: `0 0 0 4px ${ROYAL}18` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={80} height={80} className="object-cover w-full h-full" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: ROYAL, fontFamily: "Cormorant Garamond, serif" }}>
            {name}
          </h2>
          {parents && <p className="text-xs opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-40 text-sm leading-relaxed opacity-70" style={{ color: TXT }}>{bio}</p>}
          {instagram && (
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs opacity-60" style={{ color: ROYAL }}>
              <Instagram className="h-3 w-3" />@{instagram}
            </a>
          )}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ backgroundColor: sectionBg, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}><GoldOrnament size={44} /></Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mt-3 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: ROYAL, opacity: 0.65 }}>
              The Couple
            </p>
          </Anim>
          <div className="flex justify-center gap-10 items-center">
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
          style={{ backgroundColor: sectionBg, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><DiamondDivider width={200} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={100}>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: ROYAL, opacity: 0.65 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="text-2xl font-bold" style={{ color: ROYAL, fontFamily: "Cormorant Garamond, serif" }}>
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
                      className="rounded px-5 py-4 text-center min-w-32.5"
                      style={{ border: `1.5px solid ${ROYAL}50`, backgroundColor: `${ROYAL}08` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ROYAL }}>
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
              <div className="flex justify-center mt-6"><DiamondDivider width={200} /></div>
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
          style={{ backgroundColor: sectionBg, ...snap }}
        >
          <div className="px-4 py-12">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: ROYAL }}>
                Gallery
              </p>
            </Anim>
            {images.length === 0 ? (
              <div className="mx-4 flex h-32 items-center justify-center rounded text-sm opacity-40" style={{ backgroundColor: `${ROYAL}15` }}>
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
          style={{ backgroundColor: sectionBg, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: ROYAL, opacity: 0.65 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={ROYAL} />
          </Anim>
          <Anim variant="fadeIn" delay={340}>
            <div className="mt-8 flex justify-center"><DiamondDivider width={180} /></div>
          </Anim>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center"
          style={{ backgroundColor: sectionBg, color: TXT, ...snap }}
        >
          <div className="w-full max-w-sm px-8">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><GoldOrnament size={40} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={80}>
              <p className="mb-6 text-center text-[10px] tracking-[0.4em] uppercase" style={{ color: ROYAL, opacity: 0.65 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <RsvpForm invitationId={inv.id} primaryColor={ROYAL} />
          </div>
        </section>
      )

    // ── Closing ───────────────────────────────────────────────────────────────
    case "closing":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
          style={{ backgroundColor: PEARL, ...snap }}
        >
          <div className="absolute inset-6 pointer-events-none">
            <BlueFrame width={320} height={460} opacity={0.25} />
          </div>
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><GoldOrnament size={52} /></div>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="text-3xl font-bold" style={{ color: ROYAL, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.groomName} &amp; {inv.brideName}
              </p>
            </Anim>
            <Anim variant="fadeIn" delay={320}>
              <div className="flex justify-center mt-4"><DiamondDivider width={200} /></div>
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
          style={{ backgroundColor: sectionBg, color: TXT, ...snap }}
        >
          <div className="w-full max-w-lg px-8">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-center opacity-60">
                {(c.label as string) || "Lokasi Acara"}
              </p>
            </Anim>
            {gmapsUrl ? (
              <Anim variant="fadeUp" delay={150}>
                <div className="overflow-hidden rounded-xl" style={{ border: `1.5px solid ${ROYAL}40` }}>
                  <iframe src={gmapsUrl} width="100%" height="240" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </Anim>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${ROYAL}20` }}>
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
          style={{ backgroundColor: sectionBg, ...snap }}
        >
          <Anim variant="scaleIn" delay={0}><GoldOrnament size={40} opacity={0.7} /></Anim>
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

    // ── Gift ──────────────────────────────────────────────────────────────────
    case "gift": {
      const banks = (c.banks as import("@/components/invitation/gift-section").BankAccount[]) ?? []
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16"
          style={{ backgroundColor: PEARL, color: TXT, ...snap }}
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
                primaryColor={ROYAL}
                accentColor={GOLD}
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

export function PremiumBlueTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <PremiumBlueSection section={s} inv={inv} index={i} />
        </div>
      ))}
    </>
  )
}
