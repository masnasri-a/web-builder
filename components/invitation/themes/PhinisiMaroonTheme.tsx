"use client"

/**
 * Phinisi Maroon Theme
 * Palette : Maroon (#7D1535) · Gold/Copper (#C49A45) · Parchment (#F9F1E8) · Dark Wood (#3B1F0A)
 * Use case: Heritage pernikahan adat Bugis-Makassar, nuansa kapal Phinisi, coastal Indonesia
 */

import Image from "next/image"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { Navigation } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"

// ─── Palette ──────────────────────────────────────────────────────────────────
const MAROON = "#7D1535"
const GOLD   = "#C49A45"
const BG     = "#F9F1E8"  // parchment / aged paper
const WOOD   = "#3B1F0A"  // dark wood for text
const COPPER = "#A0522D"  // copper accent

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ─────────────────────────────────────────────────────────

/** Traditional Phinisi sailing ship silhouette */
function PhinisiShip({ width = 260 }: { width?: number }) {
  const h = width * 0.45
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={h}
      viewBox="0 0 260 118"
      style={{ display: "block" }}
    >
      {/* hull */}
      <path d="M20,95 Q130,115 240,95 L235,108 Q130,122 25,108 Z" fill={MAROON} opacity="0.85" />
      {/* hull detail stripe */}
      <path d="M30,97 Q130,112 230,97" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* main mast */}
      <line x1="100" y1="18" x2="100" y2="95" stroke={WOOD} strokeWidth="3" />
      {/* fore mast */}
      <line x1="60"  y1="32" x2="60"  y2="95" stroke={WOOD} strokeWidth="2.5" />
      {/* rear mast */}
      <line x1="155" y1="28" x2="155" y2="95" stroke={WOOD} strokeWidth="2.5" />
      {/* main sail */}
      <path d="M100,20 L145,38 L145,85 L100,95 Z" fill={MAROON} opacity="0.55" />
      <path d="M100,20 L60,38  L60,85  L100,95 Z" fill={MAROON} opacity="0.45" />
      {/* rear sail */}
      <path d="M155,30 L190,45 L190,82 L155,90 Z" fill={COPPER} opacity="0.4" />
      {/* rigging lines */}
      <line x1="60"  y1="32" x2="100" y2="18" stroke={WOOD} strokeWidth="1" opacity="0.5" />
      <line x1="155" y1="28" x2="100" y2="18" stroke={WOOD} strokeWidth="1" opacity="0.5" />
      <line x1="155" y1="28" x2="190" y2="40" stroke={WOOD} strokeWidth="1" opacity="0.4" />
      {/* bowsprit */}
      <line x1="60" y1="60" x2="15" y2="45" stroke={WOOD} strokeWidth="2" />
      {/* flag */}
      <polygon points="100,18 120,22 100,26" fill={GOLD} opacity="0.9" />
      {/* water ripple */}
      <path d="M5,110 Q65,105 130,110 Q195,115 255,110" stroke={MAROON} strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  )
}

/** Wave / rope border pattern */
function RopeBorder({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 16"
      className="w-full"
      preserveAspectRatio="none"
      style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined }}
    >
      {/* rope-like twisted line */}
      <path
        d="M0,8 C10,3 20,13 30,8 C40,3 50,13 60,8 C70,3 80,13 90,8 C100,3 110,13 120,8 C130,3 140,13 150,8 C160,3 170,13 180,8 C190,3 200,13 210,8 C220,3 230,13 240,8 C250,3 260,13 270,8 C280,3 290,13 300,8 C310,3 320,13 330,8 C340,3 350,13 360,8 C370,3 380,13 390,8 C395,5 400,8 400,8"
        stroke={GOLD}
        strokeWidth="1.8"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M0,8 C10,13 20,3 30,8 C40,13 50,3 60,8 C70,13 80,3 90,8 C100,13 110,3 120,8 C130,13 140,3 150,8 C160,13 170,3 180,8 C190,13 200,3 210,8 C220,13 230,3 240,8 C250,13 260,3 270,8 C280,13 290,3 300,8 C310,13 320,3 330,8 C340,13 350,3 360,8 C370,13 380,3 390,8"
        stroke={COPPER}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}

/** Compass rose ornament */
function CompassRose({ size = 48 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48">
      {/* 8-point star */}
      <polygon points="24,4  26,22 24,24 22,22"  fill={GOLD} opacity="0.9" />
      <polygon points="24,44 26,26 24,24 22,26"  fill={GOLD} opacity="0.9" />
      <polygon points="4,24  22,26 24,24 22,22"  fill={GOLD} opacity="0.9" />
      <polygon points="44,24 26,22 24,24 26,26"  fill={GOLD} opacity="0.9" />
      <polygon points="8,8   22,22 24,24 22,24"  fill={COPPER} opacity="0.6" transform="rotate(0 24 24)" />
      <polygon points="40,8  26,22 24,24 24,22"  fill={COPPER} opacity="0.6" />
      <polygon points="8,40  22,26 24,24 22,24"  fill={COPPER} opacity="0.6" transform="rotate(180 24 24)" />
      <polygon points="40,40 26,26 24,24 26,24"  fill={COPPER} opacity="0.6" />
      {/* centre */}
      <circle cx="24" cy="24" r="4"   fill={MAROON} />
      <circle cx="24" cy="24" r="2"   fill={GOLD} />
      <circle cx="24" cy="24" r="5"   fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.6" />
      <circle cx="24" cy="24" r="9"   fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}

/** Corner knot / traditional Bugis motif */
function CornerKnot({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      aria-hidden="true"
      width="56"
      height="56"
      viewBox="0 0 56 56"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      {/* L border */}
      <path d="M4,4 L4,52" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M4,4 L52,4" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* knot circles along border */}
      <circle cx="4" cy="16" r="3" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.55" />
      <circle cx="4" cy="30" r="3" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.55" />
      <circle cx="16" cy="4" r="3" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.55" />
      <circle cx="30" cy="4" r="3" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.55" />
      {/* corner jewel */}
      <circle cx="4" cy="4" r="5" fill={MAROON} opacity="0.9" />
      <circle cx="4" cy="4" r="2.5" fill={GOLD} />
      {/* diagonal line */}
      <path d="M12,12 L12,44" stroke={COPPER} strokeWidth="0.7" fill="none" opacity="0.35" />
      <path d="M12,12 L44,12" stroke={COPPER} strokeWidth="0.7" fill="none" opacity="0.35" />
    </svg>
  )
}

/** Horizontal section divider */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 w-full" aria-hidden="true">
      <div className="h-px flex-1" style={{ backgroundColor: GOLD, opacity: 0.4 }} />
      <CompassRose size={20} />
      <div className="h-px flex-1" style={{ backgroundColor: GOLD, opacity: 0.4 }} />
    </div>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function PhinisiSection({
  section,
  inv,
}: {
  section: Section
  inv: ThemeTemplateProps["inv"]
}) {
  const c = section.content as Record<string, unknown>

  switch (section.type) {
    // ── Hero ──────────────────────────────────────────────────────────────────
    case "hero":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden text-center"
          style={{ backgroundColor: BG, color: WOOD, ...snap }}
        >
          {/* top maroon band + rope border */}
          <div className="absolute inset-x-0 top-0 pointer-events-none">
            <div style={{ backgroundColor: MAROON, height: 8 }} />
            <RopeBorder />
            <div className="absolute top-0 left-0"><CornerKnot rotate={0} /></div>
            <div className="absolute top-0 right-0"><CornerKnot rotate={90} /></div>
          </div>

          {/* content */}
          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <CompassRose size={64} />
            </Anim>
            <Anim variant="fadeIn" delay={160}>
              <p className="mt-4 mb-3 text-[10px] tracking-[0.55em] uppercase" style={{ color: MAROON, opacity: 0.7 }}>
                — Undangan Pernikahan —
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={280}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: MAROON, fontFamily: "Cinzel, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={400}>
              <p className="my-3 text-xl" style={{ color: GOLD }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={460}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: MAROON, fontFamily: "Cinzel, Georgia, serif" }}
              >
                {inv.brideName}
              </h1>
            </Anim>
            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={560}>
                <p className="mt-5 text-sm italic" style={{ color: WOOD, opacity: 0.6 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={640}>
              <Divider />
              <p className="text-sm tracking-widest" style={{ color: MAROON, opacity: 0.75 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>
          </div>

          {/* Phinisi ship at bottom */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
            <PhinisiShip width={220} />
          </div>

          {/* bottom rope border + maroon band */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <RopeBorder flip />
            <div style={{ backgroundColor: MAROON, height: 8 }} />
            <div className="absolute bottom-0 left-0"><CornerKnot rotate={270} /></div>
            <div className="absolute bottom-0 right-0"><CornerKnot rotate={180} /></div>
          </div>
        </section>
      )

    // ── Couple ────────────────────────────────────────────────────────────────
    case "couple": {
      const layout = (c.coupleLayout as string) ?? "side-by-side"
      const PersonCard = ({ photo, name, parents, bio }: { photo?: string; name: string; parents?: string; bio?: string }) => (
        <div className="space-y-3 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full" style={{ border: `2.5px solid ${GOLD}` }}>
            {photo && <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: MAROON, fontFamily: "Cinzel, serif" }}>{name}</h2>
          {parents && <p className="text-sm opacity-60" style={{ color: WOOD }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: WOOD }}>{bio}</p>}
        </div>
      )
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="scaleIn" delay={0}><CompassRose size={40} /></Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: MAROON, opacity: 0.6 }}>Mempelai</p>
          </Anim>
          {layout === "side-by-side" ? (
            <div className="flex justify-center gap-10">
              <Anim variant="slideLeft" delay={150}><PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} /></Anim>
              <Anim variant="scaleIn" delay={300} className="self-center"><span className="text-3xl font-light" style={{ color: GOLD }}>&amp;</span></Anim>
              <Anim variant="slideRight" delay={150}><PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} /></Anim>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <Anim variant="fadeUp" delay={150}><PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} /></Anim>
              <span className="text-3xl font-light" style={{ color: GOLD }}>&amp;</span>
              <Anim variant="fadeUp" delay={300}><PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} /></Anim>
            </div>
          )}
        </section>
      )
    }

    // ── Event ─────────────────────────────────────────────────────────────────
    case "event": {
      type EventItem = { name: string; date: string; time: string }
      const events = (c.events as EventItem[]) ?? []
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center" style={{ backgroundColor: `${MAROON}0e`, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><PhinisiShip width={160} /></Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mt-3 mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: MAROON, opacity: 0.65 }}>Save The Date</p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mb-2 text-3xl font-bold" style={{ color: MAROON, fontFamily: "Cinzel, serif" }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={300}>
              <div>
                <p className="text-lg font-medium" style={{ color: WOOD }}>{inv.eventVenue}</p>
                {inv.eventAddress && <p className="mt-1 text-sm opacity-60" style={{ color: WOOD }}>{inv.eventAddress}</p>}
              </div>
            </Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={400}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div key={i} className="rounded px-5 py-4 text-center min-w-[120px]" style={{ border: `1.5px solid ${GOLD}60`, backgroundColor: `${MAROON}07` }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>{ev.name || `Acara ${i + 1}`}</p>
                      {ev.date && <p className="mt-1.5 text-sm font-medium" style={{ color: WOOD }}>{new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
                      {ev.time && <p className="text-sm opacity-65" style={{ color: WOOD }}>{ev.time}</p>}
                    </div>
                  ))}
                </div>
              </Anim>
            )}
          </div>
        </section>
      )
    }

    case "countdown":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="fadeIn" delay={0}><p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: MAROON, opacity: 0.6 }}>Menghitung Hari</p></Anim>
          <Anim variant="scaleIn" delay={160}><CountdownTimer eventDate={inv.eventDate} primaryColor={MAROON} /></Anim>
          <Anim variant="scaleIn" delay={340}><div className="mt-8 max-w-xs mx-auto"><Divider /></div></Anim>
        </section>
      )

    case "rsvp":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16" style={{ backgroundColor: `${MAROON}0e`, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><div className="flex justify-center mb-4"><CompassRose size={38} /></div></Anim>
            <Anim variant="fadeIn" delay={60}><p className="mb-2 text-center text-[10px] tracking-[0.35em] uppercase" style={{ color: MAROON, opacity: 0.65 }}>{(c.title as string) || "RSVP"}</p></Anim>
            <Anim variant="fadeUp" delay={160}><p className="mb-6 text-center text-sm" style={{ color: WOOD, opacity: 0.65 }}>Konfirmasi Kehadiran Anda</p></Anim>
            <Anim variant="fadeUp" delay={260}><RsvpForm invitationId={inv.id} primaryColor={MAROON} deadline={c.deadline as string | undefined} /></Anim>
          </div>
        </section>
      )

    case "quote":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="scaleIn" delay={0}><p className="text-4xl leading-none" style={{ color: GOLD }}>&ldquo;</p></Anim>
          <Anim variant="fadeUp" delay={160}><blockquote className="mx-auto max-w-sm text-base italic leading-relaxed mt-3" style={{ color: WOOD, opacity: 0.85 }}>{c.quote as string}</blockquote></Anim>
          {!!c.source && <Anim variant="fadeIn" delay={360}><p className="mt-4 text-xs uppercase tracking-widest" style={{ color: MAROON, opacity: 0.6 }}>— {c.source as string}</p></Anim>}
        </section>
      )

    case "maps": {
      const lat = parseFloat(c.lat as string), lng = parseFloat(c.lng as string)
      const hasCoords = !isNaN(lat) && !isNaN(lng)
      const gmapsUrl = hasCoords ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed` : null
      const dirUrl   = hasCoords ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-10 text-center" style={{ backgroundColor: BG, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}><p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: MAROON, opacity: 0.65 }}>{(c.label as string) || "Lokasi Acara"}</p></Anim>
            {gmapsUrl && <Anim variant="fadeUp" delay={150}><div className="overflow-hidden rounded" style={{ border: `1.5px solid ${GOLD}60` }}><iframe src={gmapsUrl} width="100%" height="280" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></Anim>}
            {(c.address as string) && <Anim variant="fadeIn" delay={280}><p className="mt-3 text-sm opacity-65" style={{ color: WOOD }}>{c.address as string}</p></Anim>}
            {dirUrl && <Anim variant="fadeUp" delay={380}><a href={dirUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80" style={{ border: `1.5px solid ${MAROON}`, color: MAROON }}><Navigation className="h-4 w-4" />Petunjuk Arah</a></Anim>}
          </div>
        </section>
      )
    }

    case "closing":
      return (
        <section id={section.id} className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden" style={{ backgroundColor: `${MAROON}0e`, ...snap }}>
          <Anim variant="scaleIn" delay={0}><PhinisiShip width={180} /></Anim>
          <Anim variant="fadeUp" delay={200}><p className="mx-auto max-w-xs text-base leading-relaxed mt-6" style={{ color: WOOD, opacity: 0.72 }}>{(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}</p></Anim>
          <Anim variant="scaleIn" delay={380}><div className="mt-6 max-w-xs mx-auto"><Divider /></div></Anim>
          <Anim variant="fadeIn" delay={480}><p className="text-xl font-bold" style={{ color: MAROON, fontFamily: "Cinzel, serif" }}>{inv.groomName} & {inv.brideName}</p></Anim>
        </section>
      )

    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      if (images.length === 0) return null
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="fadeIn" delay={0}><p className="mb-6 text-[10px] tracking-[0.35em] uppercase" style={{ color: MAROON, opacity: 0.6 }}>Gallery</p></Anim>
          <div className="columns-2 gap-2 px-4 w-full max-w-sm mx-auto">
            {images.map((url, i) => (<div key={i} className="mb-2 overflow-hidden rounded-sm" style={{ border: `1.5px solid ${GOLD}45` }}><Image src={url} alt={`Gallery ${i + 1}`} width={200} height={200} className="w-full h-auto object-cover" /></div>))}
          </div>
        </section>
      )
    }

    default: return null
  }
}

export function PhinisiMaroonTheme({ inv, sections, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <PhinisiSection section={s} inv={inv} />
        </div>
      ))}
    </>
  )
}
