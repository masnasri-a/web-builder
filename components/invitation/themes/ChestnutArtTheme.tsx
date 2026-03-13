"use client"

/**
 * Chestnut Art Theme
 * Palette : Chestnut (#8B4513) · Terracotta (#D4956A) · Warm Cream (#FDF5EE) · Olive (#7A8C5E)
 * Use case: Artistic / bohemian wedding, gallery aesthetic, earthy & handcrafted nuance
 */

import Image from "next/image"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { Navigation } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"

// ─── Palette ──────────────────────────────────────────────────────────────────
const CHEST  = "#8B4513"  // chestnut brown
const TERRA  = "#C4683A"  // terracotta
const BG     = "#FDF5EE"  // warm cream
const OLIVE  = "#7A8C5E"  // olive / sage
const TXT    = "#3A1F0A"  // dark espresso text
const SAND   = "#D4B896"  // sandy neutral

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ─────────────────────────────────────────────────────────

/** Abstract watercolour wash blob — painterly background accent */
function WashBlob({ x = 0, y = 0, color = TERRA, opacity = 0.12, rx = 80, ry = 55 }: {
  x?: number; y?: number; color?: string; opacity?: number; rx?: number; ry?: number
}) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity={opacity} style={{ filter: "blur(18px)" }} />
}

/** Artistic botanical branch — flowing hand-drawn style */
function Branch({ flip = false, size = 120 }: { flip?: boolean; size?: number }) {
  const h = size * 0.7
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={h}
      viewBox="0 0 120 84"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* main stem */}
      <path d="M8,78 C20,60 35,45 55,30 C70,18 90,12 115,8" stroke={OLIVE} strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
      {/* leaf clusters */}
      <ellipse cx="32" cy="55" rx="11" ry="5" fill={OLIVE} opacity="0.5" transform="rotate(-38 32 55)" />
      <ellipse cx="48" cy="42" rx="11" ry="5" fill={OLIVE} opacity="0.5" transform="rotate(-48 48 42)" />
      <ellipse cx="68" cy="28" rx="10" ry="4" fill={OLIVE} opacity="0.45" transform="rotate(-55 68 28)" />
      <ellipse cx="88" cy="17" rx="9"  ry="4" fill={OLIVE} opacity="0.4"  transform="rotate(-60 88 17)" />
      {/* secondary leaves */}
      <ellipse cx="22" cy="63" rx="8"  ry="3.5" fill={CHEST} opacity="0.3" transform="rotate(-28 22 63)" />
      <ellipse cx="58" cy="32" rx="8"  ry="3.5" fill={CHEST} opacity="0.3" transform="rotate(-65 58 32)" />
      {/* berries */}
      <circle cx="38" cy="50" r="2.5" fill={TERRA} opacity="0.6" />
      <circle cx="72" cy="24" r="2"   fill={TERRA} opacity="0.55" />
      <circle cx="105" cy="10" r="2"  fill={TERRA} opacity="0.5" />
    </svg>
  )
}

/** Abstract art brushstroke frame corner */
function BrushCorner({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      aria-hidden="true"
      width="70"
      height="70"
      viewBox="0 0 70 70"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      {/* loose brushstroke L */}
      <path d="M5,5 C5,18 4,32 6,65" stroke={CHEST} strokeWidth="3.5" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M5,5 C18,4 32,5 65,6" stroke={CHEST} strokeWidth="3.5" fill="none" opacity="0.45" strokeLinecap="round" />
      {/* offset second stroke */}
      <path d="M9,9 C9,20 8,34 10,58" stroke={TERRA} strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" />
      <path d="M9,9 C20,9 34,8 58,10" stroke={TERRA} strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" />
      {/* ink dot */}
      <circle cx="5" cy="5" r="4" fill={CHEST} opacity="0.6" />
    </svg>
  )
}

/** Small artistic flower doodle */
function DoodleFlower({ size = 28, color = TERRA }: { size?: number; color?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 28 28">
      <ellipse cx="14" cy="9"  rx="4" ry="7" fill={color} opacity="0.55" />
      <ellipse cx="14" cy="9"  rx="4" ry="7" fill={color} opacity="0.55" transform="rotate(60 14 14)" />
      <ellipse cx="14" cy="9"  rx="4" ry="7" fill={color} opacity="0.55" transform="rotate(120 14 14)" />
      <ellipse cx="14" cy="9"  rx="4" ry="7" fill={color} opacity="0.55" transform="rotate(180 14 14)" />
      <ellipse cx="14" cy="9"  rx="4" ry="7" fill={color} opacity="0.55" transform="rotate(240 14 14)" />
      <ellipse cx="14" cy="9"  rx="4" ry="7" fill={color} opacity="0.55" transform="rotate(300 14 14)" />
      <circle cx="14" cy="14" r="4" fill={SAND} />
      <circle cx="14" cy="14" r="2" fill={color} opacity="0.7" />
    </svg>
  )
}

/** Artistic divider */
function ArtDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3 w-full" aria-hidden="true">
      <Branch size={80} />
      <DoodleFlower size={24} />
      <Branch size={80} flip />
    </div>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function ChestnutSection({
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
          style={{ backgroundColor: BG, color: TXT, ...snap }}
        >
          {/* painterly wash blobs */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 780" preserveAspectRatio="xMidYMid slice">
            <WashBlob x={60}  y={100} color={TERRA} opacity={0.10} rx={100} ry={70} />
            <WashBlob x={300} y={200} color={OLIVE} opacity={0.08} rx={90}  ry={65} />
            <WashBlob x={80}  y={620} color={CHEST} opacity={0.08} rx={110} ry={75} />
            <WashBlob x={310} y={700} color={TERRA} opacity={0.09} rx={85}  ry={60} />
          </svg>

          {/* corner brush strokes */}
          <div className="absolute top-0 left-0 pointer-events-none"><BrushCorner rotate={0} /></div>
          <div className="absolute top-0 right-0 pointer-events-none"><BrushCorner rotate={90} /></div>
          <div className="absolute bottom-0 left-0 pointer-events-none"><BrushCorner rotate={270} /></div>
          <div className="absolute bottom-0 right-0 pointer-events-none"><BrushCorner rotate={180} /></div>

          {/* top branch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-70">
            <Branch size={200} />
          </div>

          {/* content */}
          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <DoodleFlower size={56} color={CHEST} />
            </Anim>
            <Anim variant="fadeIn" delay={160}>
              <p className="mt-4 mb-3 text-[10px] tracking-[0.55em] uppercase" style={{ color: CHEST, opacity: 0.68 }}>
                — The Wedding of —
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={280}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: CHEST, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={400}>
              <p className="my-3 text-2xl italic font-light" style={{ color: TERRA }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={460}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: CHEST, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.brideName}
              </h1>
            </Anim>
            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={560}>
                <p className="mt-5 text-sm italic" style={{ color: TXT, opacity: 0.6 }}>{c.subtitle as string}</p>
              </Anim>
            )}
            <Anim variant="fadeIn" delay={640}>
              <ArtDivider />
              <p className="text-sm" style={{ color: CHEST, opacity: 0.72 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>
          </div>

          {/* bottom branch mirrored */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-60" style={{ transform: "translateX(-50%) scaleY(-1)" }}>
            <Branch size={200} />
          </div>
        </section>
      )

    // ── Couple ────────────────────────────────────────────────────────────────
    case "couple": {
      const layout = (c.coupleLayout as string) ?? "side-by-side"
      const PersonCard = ({ photo, name, parents, bio }: { photo?: string; name: string; parents?: string; bio?: string }) => (
        <div className="space-y-3 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full" style={{ border: `2.5px solid ${SAND}`, boxShadow: `0 0 0 4px ${TERRA}20` }}>
            {photo && <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: CHEST, fontFamily: "Cormorant Garamond, serif" }}>{name}</h2>
          {parents && <p className="text-sm opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: TXT }}>{bio}</p>}
        </div>
      )
      return (
        <section id={section.id} className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center overflow-hidden" style={{ background: `linear-gradient(160deg, ${BG} 0%, #F5EBE0 100%)`, ...snap }}>
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 780" preserveAspectRatio="xMidYMid slice">
            <WashBlob x={300} y={150} color={OLIVE} opacity={0.08} rx={100} ry={70} />
            <WashBlob x={60}  y={650} color={TERRA} opacity={0.07} rx={90}  ry={65} />
          </svg>
          <div className="relative z-10 w-full">
            <Anim variant="fadeIn" delay={0}><DoodleFlower size={38} color={CHEST} /></Anim>
            <Anim variant="fadeIn" delay={60}><p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: CHEST, opacity: 0.6 }}>The Couple</p></Anim>
            {layout === "side-by-side" ? (
              <div className="flex justify-center gap-10">
                <Anim variant="slideLeft" delay={150}><PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} /></Anim>
                <Anim variant="scaleIn" delay={300} className="self-center"><span className="text-3xl italic font-light" style={{ color: TERRA }}>&amp;</span></Anim>
                <Anim variant="slideRight" delay={150}><PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} /></Anim>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <Anim variant="fadeUp" delay={150}><PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} /></Anim>
                <span className="text-3xl italic font-light" style={{ color: TERRA }}>&amp;</span>
                <Anim variant="fadeUp" delay={300}><PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} /></Anim>
              </div>
            )}
          </div>
        </section>
      )
    }

    case "event": {
      type EventItem = { name: string; date: string; time: string }
      const events = (c.events as EventItem[]) ?? []
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center" style={{ background: `linear-gradient(160deg, #F5EBE0 0%, ${BG} 100%)`, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><DoodleFlower size={44} color={TERRA} /></Anim>
            <Anim variant="fadeIn" delay={120}><p className="mt-3 mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: CHEST, opacity: 0.65 }}>Save The Date</p></Anim>
            <Anim variant="fadeUp" delay={200}><p className="mb-2 text-3xl font-bold" style={{ color: CHEST, fontFamily: "Cormorant Garamond, serif" }}>{new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></Anim>
            <Anim variant="fadeUp" delay={300}><div><p className="text-lg font-medium" style={{ color: TXT }}>{inv.eventVenue}</p>{inv.eventAddress && <p className="mt-1 text-sm opacity-60" style={{ color: TXT }}>{inv.eventAddress}</p>}</div></Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={400}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div key={i} className="rounded-xl px-5 py-4 text-center min-w-[120px]" style={{ border: `1.5px solid ${SAND}`, backgroundColor: `${TERRA}0d` }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TERRA }}>{ev.name || `Acara ${i + 1}`}</p>
                      {ev.date && <p className="mt-1.5 text-sm font-medium" style={{ color: TXT }}>{new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
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

    case "countdown":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="fadeIn" delay={0}><p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: CHEST, opacity: 0.6 }}>Menghitung Hari</p></Anim>
          <Anim variant="scaleIn" delay={160}><CountdownTimer eventDate={inv.eventDate} primaryColor={CHEST} /></Anim>
          <Anim variant="scaleIn" delay={340}><div className="mt-6"><ArtDivider /></div></Anim>
        </section>
      )

    case "rsvp":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16" style={{ background: `linear-gradient(160deg, #F5EBE0 0%, ${BG} 100%)`, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><div className="flex justify-center mb-4"><DoodleFlower size={36} color={CHEST} /></div></Anim>
            <Anim variant="fadeIn" delay={60}><p className="mb-2 text-center text-[10px] tracking-[0.35em] uppercase" style={{ color: CHEST, opacity: 0.65 }}>{(c.title as string) || "RSVP"}</p></Anim>
            <Anim variant="fadeUp" delay={160}><p className="mb-6 text-center text-sm" style={{ color: TXT, opacity: 0.65 }}>Konfirmasi Kehadiran Anda</p></Anim>
            <Anim variant="fadeUp" delay={260}><RsvpForm invitationId={inv.id} primaryColor={CHEST} deadline={c.deadline as string | undefined} /></Anim>
          </div>
        </section>
      )

    case "quote":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="scaleIn" delay={0}><p className="text-4xl leading-none" style={{ color: TERRA }}>&ldquo;</p></Anim>
          <Anim variant="fadeUp" delay={160}><blockquote className="mx-auto max-w-sm text-base italic leading-relaxed mt-3" style={{ color: TXT, opacity: 0.85 }}>{c.quote as string}</blockquote></Anim>
          {!!c.source && <Anim variant="fadeIn" delay={360}><p className="mt-4 text-xs uppercase tracking-widest" style={{ color: CHEST, opacity: 0.6 }}>— {c.source as string}</p></Anim>}
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
            <Anim variant="fadeIn" delay={0}><p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: CHEST, opacity: 0.65 }}>{(c.label as string) || "Lokasi Acara"}</p></Anim>
            {gmapsUrl && <Anim variant="fadeUp" delay={150}><div className="overflow-hidden rounded-xl" style={{ border: `1.5px solid ${SAND}` }}><iframe src={gmapsUrl} width="100%" height="280" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></Anim>}
            {(c.address as string) && <Anim variant="fadeIn" delay={280}><p className="mt-3 text-sm opacity-65" style={{ color: TXT }}>{c.address as string}</p></Anim>}
            {dirUrl && <Anim variant="fadeUp" delay={380}><a href={dirUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80" style={{ border: `1.5px solid ${CHEST}`, color: CHEST }}><Navigation className="h-4 w-4" />Petunjuk Arah</a></Anim>}
          </div>
        </section>
      )
    }

    case "closing":
      return (
        <section id={section.id} className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden" style={{ background: `linear-gradient(160deg, #F5EBE0 0%, ${BG} 60%, #EDF2E8 100%)`, ...snap }}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-50 pointer-events-none"><Branch size={180} /></div>
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}><DoodleFlower size={60} color={CHEST} /></Anim>
            <Anim variant="fadeUp" delay={200}><p className="mx-auto max-w-xs text-base leading-relaxed mt-6" style={{ color: TXT, opacity: 0.72 }}>{(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}</p></Anim>
            <Anim variant="scaleIn" delay={380}><ArtDivider /></Anim>
            <Anim variant="fadeIn" delay={480}><p className="text-xl font-bold" style={{ color: CHEST, fontFamily: "Cormorant Garamond, serif" }}>{inv.groomName} & {inv.brideName}</p></Anim>
          </div>
        </section>
      )

    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      if (images.length === 0) return null
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="fadeIn" delay={0}><p className="mb-6 text-[10px] tracking-[0.35em] uppercase" style={{ color: CHEST, opacity: 0.6 }}>Gallery</p></Anim>
          <div className="columns-2 gap-2 px-4 w-full max-w-sm mx-auto">
            {images.map((url, i) => (<div key={i} className="mb-2 overflow-hidden rounded-xl" style={{ border: `1.5px solid ${SAND}60` }}><Image src={url} alt={`Gallery ${i + 1}`} width={200} height={200} className="w-full h-auto object-cover" /></div>))}
          </div>
        </section>
      )
    }

    default: return null
  }
}

export function ChestnutArtTheme({ inv, sections, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <ChestnutSection section={s} inv={inv} />
        </div>
      ))}
    </>
  )
}
