"use client"

/**
 * Bunga Bunga Theme
 * Palette : Fuchsia (#D4456C) · Tropical Green (#2D8B4E) · Sunny Yellow (#F0C040) · Warm White (#FFFBF0)
 * Use case: Festive / tropical Indonesian floral wedding, garden party, colourful & joyful
 */

import Image from "next/image"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { Navigation } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"
import { GiftSection } from "@/components/invitation/gift-section"

// ─── Palette ──────────────────────────────────────────────────────────────────
const FUCHSIA = "#D4456C"  // coral fuchsia
const GREEN   = "#2D8B4E"  // tropical green
const YELLOW  = "#F0C040"  // sunny yellow
const BG      = "#FFFBF0"  // warm white
const PURPLE  = "#9B2060"  // deep flower
const TXT     = "#2A1A20"  // dark warm text

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ─────────────────────────────────────────────────────────

/** Hibiscus flower (kembang sepatu) */
function Hibiscus({ size = 56, color = FUCHSIA }: { size?: number; color?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 56 56">
      {/* 5 petals */}
      <ellipse cx="28" cy="14" rx="8"  ry="14" fill={color} opacity="0.75" />
      <ellipse cx="28" cy="14" rx="8"  ry="14" fill={color} opacity="0.75" transform="rotate(72  28 28)" />
      <ellipse cx="28" cy="14" rx="8"  ry="14" fill={color} opacity="0.75" transform="rotate(144 28 28)" />
      <ellipse cx="28" cy="14" rx="8"  ry="14" fill={color} opacity="0.75" transform="rotate(216 28 28)" />
      <ellipse cx="28" cy="14" rx="8"  ry="14" fill={color} opacity="0.75" transform="rotate(288 28 28)" />
      {/* stamen column */}
      <line x1="28" y1="10" x2="28" y2="28" stroke={YELLOW} strokeWidth="2" />
      {/* pollen tips */}
      <circle cx="28" cy="10" r="2.5" fill={YELLOW} />
      <circle cx="24" cy="12" r="1.5" fill={YELLOW} opacity="0.8" />
      <circle cx="32" cy="12" r="1.5" fill={YELLOW} opacity="0.8" />
      {/* centre */}
      <circle cx="28" cy="28" r="5.5" fill={YELLOW} />
      <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.6" />
    </svg>
  )
}

/** Frangipani / kamboja flower */
function Frangipani({ size = 44, color = YELLOW }: { size?: number; color?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 44 44">
      {/* 5 rounded petals */}
      <ellipse cx="22" cy="10" rx="6"  ry="10" fill={color} opacity="0.8" />
      <ellipse cx="22" cy="10" rx="6"  ry="10" fill={color} opacity="0.8" transform="rotate(72  22 22)" />
      <ellipse cx="22" cy="10" rx="6"  ry="10" fill={color} opacity="0.8" transform="rotate(144 22 22)" />
      <ellipse cx="22" cy="10" rx="6"  ry="10" fill={color} opacity="0.8" transform="rotate(216 22 22)" />
      <ellipse cx="22" cy="10" rx="6"  ry="10" fill={color} opacity="0.8" transform="rotate(288 22 22)" />
      {/* centre */}
      <circle cx="22" cy="22" r="5" fill="white" opacity="0.9" />
      <circle cx="22" cy="22" r="2.5" fill={color} />
    </svg>
  )
}

/** Tropical monstera-style leaf */
function Leaf({ size = 60, flip = false }: { size?: number; flip?: boolean }) {
  const h = size * 0.9
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={h}
      viewBox="0 0 60 54"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* main leaf shape */}
      <path d="M8,50 C5,35 8,18 20,8 C32,-2 50,2 56,14 C62,26 52,48 38,52 C24,56 10,52 8,50 Z" fill={GREEN} opacity="0.6" />
      {/* midrib */}
      <path d="M8,50 C18,38 32,20 56,14" stroke={GREEN} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* leaf cuts (monstera splits) */}
      <path d="M22,44 C20,36 22,28 28,22" stroke="white" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M34,48 C32,40 34,32 40,26" stroke="white" strokeWidth="2.5" fill="none" opacity="0.4" />
    </svg>
  )
}

/** Full corner bouquet: hibiscus + frangipani + leaves */
function TropicalCorner({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      aria-hidden="true"
      width="90"
      height="90"
      viewBox="0 0 90 90"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      {/* leaves */}
      <g transform="translate(0 20) scale(0.7)"><Leaf size={60} /></g>
      <g transform="translate(18 5) rotate(50 20 20) scale(0.6)"><Leaf size={60} flip /></g>
      {/* hibiscus */}
      <g transform="translate(4 4) scale(0.65)"><Hibiscus size={56} color={FUCHSIA} /></g>
      {/* frangipani */}
      <g transform="translate(32 0) scale(0.55)"><Frangipani size={44} color={YELLOW} /></g>
      {/* small bud */}
      <circle cx="55" cy="20" r="4.5" fill={PURPLE} opacity="0.55" />
      <circle cx="20" cy="55" r="4"   fill={FUCHSIA} opacity="0.45" />
      <circle cx="62" cy="35" r="3"   fill={YELLOW} opacity="0.65" />
    </svg>
  )
}

/** Batik-inspired repeating border strip */
function BatikBorder({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 20"
      className="w-full"
      preserveAspectRatio="none"
      style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined }}
    >
      {/* repeating diamond + dot motif */}
      {Array.from({ length: 20 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 20 + 10}, 10)`}>
          <rect x="-5" y="-5" width="10" height="10" fill={FUCHSIA} opacity="0.25" transform="rotate(45 0 0)" />
          <circle cx="0" cy="0" r="1.8" fill={FUCHSIA} opacity="0.5" />
          <circle cx="-10" cy="0" r="1" fill={YELLOW} opacity="0.45" />
        </g>
      ))}
    </svg>
  )
}

/** Floral section divider */
function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3 w-full" aria-hidden="true">
      <Leaf size={44} />
      <Hibiscus size={28} />
      <Frangipani size={28} />
      <Hibiscus size={28} color={PURPLE} />
      <Leaf size={44} flip />
    </div>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function BungaSection({
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
          {/* tropical corner bouquets */}
          <div className="absolute top-0 left-0 pointer-events-none"><TropicalCorner rotate={0} /></div>
          <div className="absolute top-0 right-0 pointer-events-none"><TropicalCorner rotate={90} /></div>
          <div className="absolute bottom-0 left-0 pointer-events-none"><TropicalCorner rotate={270} /></div>
          <div className="absolute bottom-0 right-0 pointer-events-none"><TropicalCorner rotate={180} /></div>

          {/* top green band + batik border */}
          <div className="absolute inset-x-0 top-0 pointer-events-none">
            <div style={{ backgroundColor: GREEN, height: 6 }} />
            <BatikBorder />
          </div>

          {/* centre content */}
          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center gap-3">
                <Hibiscus size={52} />
                <Frangipani size={44} />
                <Hibiscus size={52} color={PURPLE} />
              </div>
            </Anim>
            <Anim variant="fadeIn" delay={160}>
              <p className="mt-4 mb-3 text-[10px] tracking-[0.55em] uppercase" style={{ color: GREEN, opacity: 0.75 }}>
                — Undangan Pernikahan —
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={280}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: FUCHSIA, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={400}>
              <p className="my-3 text-2xl font-light italic" style={{ color: YELLOW }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={460}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: FUCHSIA, fontFamily: "Cormorant Garamond, Georgia, serif" }}
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
              <FloralDivider />
              <p className="text-sm" style={{ color: GREEN, opacity: 0.8 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>
          </div>

          {/* bottom batik border + green band */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <BatikBorder flip />
            <div style={{ backgroundColor: GREEN, height: 6 }} />
          </div>
        </section>
      )

    // ── Couple ────────────────────────────────────────────────────────────────
    case "couple": {
      const layout = (c.coupleLayout as string) ?? "side-by-side"
      const PersonCard = ({ photo, name, parents, bio }: { photo?: string; name: string; parents?: string; bio?: string }) => (
        <div className="space-y-3 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full" style={{ border: `2.5px solid ${FUCHSIA}`, boxShadow: `0 0 0 4px ${YELLOW}30` }}>
            {photo && <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: FUCHSIA, fontFamily: "Cormorant Garamond, serif" }}>{name}</h2>
          {parents && <p className="text-sm opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: TXT }}>{bio}</p>}
        </div>
      )
      return (
        <section id={section.id} className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center overflow-hidden" style={{ backgroundColor: BG, ...snap }}>
          <div className="absolute top-0 left-0 opacity-40 pointer-events-none"><TropicalCorner rotate={0} /></div>
          <div className="absolute top-0 right-0 opacity-40 pointer-events-none"><TropicalCorner rotate={90} /></div>
          <div className="relative z-10 w-full">
            <Anim variant="fadeIn" delay={0}><div className="flex justify-center gap-2"><Hibiscus size={36} /><Frangipani size={32} /></div></Anim>
            <Anim variant="fadeIn" delay={60}><p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: GREEN, opacity: 0.7 }}>Mempelai</p></Anim>
            {layout === "side-by-side" ? (
              <div className="flex justify-center gap-10">
                <Anim variant="slideLeft" delay={150}><PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} /></Anim>
                <Anim variant="scaleIn" delay={300} className="self-center"><span className="text-3xl font-light italic" style={{ color: YELLOW }}>&amp;</span></Anim>
                <Anim variant="slideRight" delay={150}><PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} /></Anim>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <Anim variant="fadeUp" delay={150}><PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} /></Anim>
                <span className="text-3xl font-light italic" style={{ color: YELLOW }}>&amp;</span>
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
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center" style={{ background: `linear-gradient(160deg, #FFF0F5 0%, ${BG} 100%)`, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><div className="flex justify-center gap-2"><Frangipani size={40} color={FUCHSIA} /><Hibiscus size={44} /><Frangipani size={40} /></div></Anim>
            <Anim variant="fadeIn" delay={120}><p className="mt-3 mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: GREEN, opacity: 0.72 }}>Save The Date</p></Anim>
            <Anim variant="fadeUp" delay={200}><p className="mb-2 text-3xl font-bold" style={{ color: FUCHSIA, fontFamily: "Cormorant Garamond, serif" }}>{new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p></Anim>
            <Anim variant="fadeUp" delay={300}><div><p className="text-lg font-medium" style={{ color: TXT }}>{inv.eventVenue}</p>{inv.eventAddress && <p className="mt-1 text-sm opacity-60" style={{ color: TXT }}>{inv.eventAddress}</p>}</div></Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={400}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div key={i} className="rounded-2xl px-5 py-4 text-center min-w-[120px]" style={{ border: `1.5px solid ${FUCHSIA}50`, backgroundColor: `${FUCHSIA}0d` }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: FUCHSIA }}>{ev.name || `Acara ${i + 1}`}</p>
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
          <Anim variant="fadeIn" delay={0}><p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: GREEN, opacity: 0.7 }}>Menghitung Hari</p></Anim>
          <Anim variant="scaleIn" delay={160}><CountdownTimer eventDate={inv.eventDate} primaryColor={FUCHSIA} /></Anim>
          <Anim variant="scaleIn" delay={340}><div className="mt-6"><FloralDivider /></div></Anim>
        </section>
      )

    case "rsvp":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-16" style={{ background: `linear-gradient(160deg, #FFF0F5 0%, ${BG} 100%)`, ...snap }}>
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><div className="flex justify-center gap-2 mb-4"><Hibiscus size={32} /><Frangipani size={28} /></div></Anim>
            <Anim variant="fadeIn" delay={60}><p className="mb-2 text-center text-[10px] tracking-[0.35em] uppercase" style={{ color: GREEN, opacity: 0.72 }}>{(c.title as string) || "RSVP"}</p></Anim>
            <Anim variant="fadeUp" delay={160}><p className="mb-6 text-center text-sm" style={{ color: TXT, opacity: 0.65 }}>Konfirmasi Kehadiran Anda</p></Anim>
            <Anim variant="fadeUp" delay={260}><RsvpForm invitationId={inv.id} primaryColor={FUCHSIA} deadline={c.deadline as string | undefined} /></Anim>
          </div>
        </section>
      )

    case "quote":
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="scaleIn" delay={0}><Hibiscus size={44} /></Anim>
          <Anim variant="fadeUp" delay={160}><blockquote className="mx-auto max-w-sm text-base italic leading-relaxed mt-5" style={{ color: TXT, opacity: 0.85 }}>&ldquo;{c.quote as string}&rdquo;</blockquote></Anim>
          {!!c.source && <Anim variant="fadeIn" delay={360}><p className="mt-4 text-xs uppercase tracking-widest" style={{ color: GREEN, opacity: 0.65 }}>— {c.source as string}</p></Anim>}
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
            <Anim variant="fadeIn" delay={0}><p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: GREEN, opacity: 0.7 }}>{(c.label as string) || "Lokasi Acara"}</p></Anim>
            {gmapsUrl && <Anim variant="fadeUp" delay={150}><div className="overflow-hidden rounded-2xl" style={{ border: `1.5px solid ${FUCHSIA}50` }}><iframe src={gmapsUrl} width="100%" height="280" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></Anim>}
            {(c.address as string) && <Anim variant="fadeIn" delay={280}><p className="mt-3 text-sm opacity-65" style={{ color: TXT }}>{c.address as string}</p></Anim>}
            {dirUrl && <Anim variant="fadeUp" delay={380}><a href={dirUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80" style={{ border: `1.5px solid ${GREEN}`, color: GREEN }}><Navigation className="h-4 w-4" />Petunjuk Arah</a></Anim>}
          </div>
        </section>
      )
    }

    case "closing":
      return (
        <section id={section.id} className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden" style={{ background: `linear-gradient(160deg, #FFF0F5 0%, ${BG} 60%, #F0FAF4 100%)`, ...snap }}>
          <div className="absolute bottom-0 left-0 opacity-50 pointer-events-none"><TropicalCorner rotate={270} /></div>
          <div className="absolute bottom-0 right-0 opacity-50 pointer-events-none"><TropicalCorner rotate={180} /></div>
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}><div className="flex justify-center gap-3"><Hibiscus size={52} /><Frangipani size={44} /><Hibiscus size={52} color={PURPLE} /></div></Anim>
            <Anim variant="fadeUp" delay={200}><p className="mx-auto max-w-xs text-base leading-relaxed mt-6" style={{ color: TXT, opacity: 0.72 }}>{(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}</p></Anim>
            <Anim variant="scaleIn" delay={380}><FloralDivider /></Anim>
            <Anim variant="fadeIn" delay={480}><p className="text-xl font-bold" style={{ color: FUCHSIA, fontFamily: "Cormorant Garamond, serif" }}>{inv.groomName} & {inv.brideName}</p></Anim>
          </div>
        </section>
      )

    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      if (images.length === 0) return null
      return (
        <section id={section.id} className="min-h-dvh flex flex-col items-center justify-center py-12 text-center" style={{ backgroundColor: BG, ...snap }}>
          <Anim variant="fadeIn" delay={0}><p className="mb-6 text-[10px] tracking-[0.35em] uppercase" style={{ color: GREEN, opacity: 0.7 }}>Gallery</p></Anim>
          <div className="columns-2 gap-2 px-4 w-full max-w-sm mx-auto">
            {images.map((url, i) => (<div key={i} className="mb-2 overflow-hidden rounded-2xl" style={{ border: `1.5px solid ${FUCHSIA}45` }}><Image src={url} alt={`Gallery ${i + 1}`} width={200} height={200} className="w-full h-auto object-cover" /></div>))}
          </div>
        </section>
      )
    }

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
                primaryColor={FUCHSIA}
                accentColor={YELLOW}
              />
            </Anim>
          </div>
        </section>
      )
    }

    default: return null
  }
}

export function BungaBungaTheme({ inv, sections, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <BungaSection section={s} inv={inv} />
        </div>
      ))}
    </>
  )
}
