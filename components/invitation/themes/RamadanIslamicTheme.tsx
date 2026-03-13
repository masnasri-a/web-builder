"use client"

/**
 * Ramadan Islamic Theme
 * Palette : Emerald (#1A5C38) · Gold (#C9A84C) · Cream (#FAF6EE)
 * Use case: Islamic wedding (akad nikah), Ramadan nuance, pesantren-style
 */

import Image from "next/image"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { Navigation } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"
import { GiftSection } from "@/components/invitation/gift-section"

// ─── Palette constants ────────────────────────────────────────────────────────
const P   = "#1A5C38" // emerald — primary
const G   = "#C9A84C" // gold    — accent
const BG  = "#FAF6EE" // cream   — background
const TXT = "#1A2C1E" // dark green for body text

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── Inline SVG decorations ───────────────────────────────────────────────────

/** Crescent moon + star */
function CrescentStar({ size = 56 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 56 56">
      {/* Moon body */}
      <circle cx="26" cy="28" r="16" fill={G} opacity="0.9" />
      {/* Cutout to create crescent */}
      <circle cx="33" cy="24" r="13" fill={BG} />
      {/* Star — 6-pointed, two triangles */}
      <polygon
        points="44,10 46.3,15.5 52,15.5 47.5,19 49.7,24.5 44,21 38.3,24.5 40.5,19 36,15.5 41.7,15.5"
        fill={G}
        opacity="0.95"
      />
    </svg>
  )
}

/** Geometric arabesque border band */
function ArabesqueBorder({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 18"
      className="w-full"
      preserveAspectRatio="none"
      style={{ display: "block", transform: flip ? "scaleY(-1)" : undefined }}
    >
      {/* repeating diamond chevron pattern */}
      {Array.from({ length: 20 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 20}, 0)`}>
          <polygon points="10,1 19,9 10,17 1,9" fill="none" stroke={G} strokeWidth="0.8" opacity="0.55" />
          <circle cx="10" cy="9" r="1.5" fill={G} opacity="0.4" />
        </g>
      ))}
    </svg>
  )
}

/** Mosque silhouette */
function MosqueSilhouette() {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 60" className="w-full max-w-xs mx-auto" fill={P} opacity="0.18">
      {/* main dome */}
      <ellipse cx="160" cy="36" rx="36" ry="30" />
      <rect x="124" y="36" width="72" height="24" />
      {/* left minaret */}
      <rect x="90" y="20" width="10" height="40" />
      <ellipse cx="95" cy="20" rx="5" ry="8" />
      {/* right minaret */}
      <rect x="220" y="20" width="10" height="40" />
      <ellipse cx="225" cy="20" rx="5" ry="8" />
      {/* small side domes */}
      <ellipse cx="95"  cy="20" rx="5" ry="5" fill={G} opacity="0.35" />
      <ellipse cx="225" cy="20" rx="5" ry="5" fill={G} opacity="0.35" />
      {/* ground line */}
      <rect x="70" y="58" width="180" height="2" />
    </svg>
  )
}

/** 8-pointed star background pattern tile (used as repeat) */
function StarPattern() {
  const ids = Array.from({ length: 60 }, (_, i) => i)
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <pattern id="stars" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          {/* 8-pointed star via two rotated squares */}
          <rect x="13" y="9"  width="6" height="14" fill={G} opacity="0.06" />
          <rect x="9"  y="13" width="14" height="6" fill={G} opacity="0.06" />
          <rect x="13" y="9"  width="6" height="14" fill={G} opacity="0.06" transform="rotate(45 16 16)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stars)" />
    </svg>
  )
}

/** Arabesque corner mandala */
function MandalaCorner({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      aria-hidden="true"
      width="60"
      height="60"
      viewBox="0 0 60 60"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      {/* concentric quarter-arcs */}
      <path d="M4,4 Q4,30 30,30" stroke={G} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M4,4 Q30,4 30,30" stroke={G} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M4,4 Q4,22 22,22" stroke={G} strokeWidth="0.8" fill="none" opacity="0.35" />
      <path d="M4,4 Q22,4 22,22" stroke={G} strokeWidth="0.8" fill="none" opacity="0.35" />
      {/* decorative dots */}
      <circle cx="4"  cy="4"  r="3.5" fill={G} opacity="0.7" />
      <circle cx="16" cy="4"  r="2"   fill={G} opacity="0.3" />
      <circle cx="4"  cy="16" r="2"   fill={G} opacity="0.3" />
      <circle cx="30" cy="30" r="2.5" fill={G} opacity="0.25" />
    </svg>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function IslamicSection({
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
          {/* Star background pattern */}
          <StarPattern />

          {/* Top arabesque band */}
          <div className="absolute inset-x-0 top-0 pointer-events-none z-10">
            <div style={{ backgroundColor: P, height: 6 }} />
            <div style={{ backgroundColor: BG, paddingTop: 2, paddingBottom: 2 }}>
              <ArabesqueBorder />
            </div>
            <div className="absolute top-0 left-0"><MandalaCorner rotate={0} /></div>
            <div className="absolute top-0 right-0"><MandallaCorner rotate={90} /></div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <CrescentStar size={72} />
            </Anim>

            <Anim variant="fadeIn" delay={160}>
              <p className="mt-4 mb-2 text-xs italic" style={{ color: P, opacity: 0.65 }}>
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: G, opacity: 0.8 }}>
                Undangan Pernikahan
              </p>
            </Anim>

            <Anim variant="fadeUp" delay={280}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: P, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>

            <Anim variant="scaleIn" delay={400}>
              <p className="my-3 text-xl font-light" style={{ color: G }}>&amp;</p>
            </Anim>

            <Anim variant="fadeUp" delay={460}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: P, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.brideName}
              </h1>
            </Anim>

            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={560}>
                <p className="mt-5 text-sm italic" style={{ color: TXT, opacity: 0.62 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}

            <Anim variant="fadeIn" delay={640}>
              <div className="mt-5 h-px w-24 mx-auto" style={{ backgroundColor: G, opacity: 0.4 }} />
              <p className="mt-3 text-sm" style={{ color: P, opacity: 0.7 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>
          </div>

          {/* Bottom: mosque silhouette + arabesque band */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10">
            <MosqueSilhouette />
            <div style={{ backgroundColor: BG, paddingTop: 2, paddingBottom: 2 }}>
              <ArabesqueBorder flip />
            </div>
            <div style={{ backgroundColor: P, height: 6 }} />
            <div className="absolute bottom-0 left-0"><MandallaCorner rotate={270} /></div>
            <div className="absolute bottom-0 right-0"><MandallaCorner rotate={180} /></div>
          </div>
        </section>
      )

    // ── Couple ────────────────────────────────────────────────────────────────
    case "couple": {
      const layout = (c.coupleLayout as string) ?? "side-by-side"

      const PersonCard = ({
        photo, name, parents, bio,
      }: { photo?: string; name: string; parents?: string; bio?: string }) => (
        <div className="space-y-3 text-center">
          <div
            className="mx-auto h-24 w-24 overflow-hidden"
            style={{
              border: `2px solid ${G}`,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {photo && (
              <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: P, fontFamily: "Cormorant Garamond, serif" }}>
            {name}
          </h2>
          {parents && <p className="text-sm opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && (
            <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: TXT }}>
              {bio}
            </p>
          )}
        </div>
      )

      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center overflow-hidden"
          style={{ backgroundColor: BG, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10 w-full">
            <Anim variant="fadeIn" delay={0}><CrescentStar size={38} /></Anim>
            <Anim variant="fadeIn" delay={60}>
              <p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.6 }}>
                Mempelai
              </p>
            </Anim>

            {layout === "side-by-side" ? (
              <div className="flex justify-center gap-10">
                <Anim variant="slideLeft" delay={150}>
                  <PersonCard
                    photo={c.groomPhoto as string} name={inv.groomName}
                    parents={c.groomParents as string} bio={c.groomBio as string}
                  />
                </Anim>
                <Anim variant="scaleIn" delay={300} className="self-center">
                  <span className="text-3xl font-light" style={{ color: G }}>&amp;</span>
                </Anim>
                <Anim variant="slideRight" delay={150}>
                  <PersonCard
                    photo={c.bridePhoto as string} name={inv.brideName}
                    parents={c.brideParents as string} bio={c.brideBio as string}
                  />
                </Anim>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <Anim variant="fadeUp" delay={150}>
                  <PersonCard
                    photo={c.groomPhoto as string} name={inv.groomName}
                    parents={c.groomParents as string} bio={c.groomBio as string}
                  />
                </Anim>
                <span className="text-3xl font-light" style={{ color: G }}>&amp;</span>
                <Anim variant="fadeUp" delay={300}>
                  <PersonCard
                    photo={c.bridePhoto as string} name={inv.brideName}
                    parents={c.brideParents as string} bio={c.brideBio as string}
                  />
                </Anim>
              </div>
            )}
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
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center overflow-hidden"
          style={{ backgroundColor: `${P}0c`, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10 max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><CrescentStar size={48} /></Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.62 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p
                className="mb-2 text-3xl font-bold"
                style={{ color: P, fontFamily: "Cormorant Garamond, serif" }}
              >
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={300}>
              <div>
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
                      className="rounded-lg px-5 py-4 text-center min-w-[120px]"
                      style={{ border: `1.5px solid ${G}60`, backgroundColor: `${P}08` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: G }}>
                        {ev.name || `Acara ${i + 1}`}
                      </p>
                      {ev.date && (
                        <p className="mt-1.5 text-sm font-medium" style={{ color: TXT }}>
                          {new Date(ev.date).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
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

    // ── Countdown ─────────────────────────────────────────────────────────────
    case "countdown":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center overflow-hidden"
          style={{ backgroundColor: BG, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.6 }}>
                Menghitung Hari
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={160}>
              <CountdownTimer eventDate={inv.eventDate} primaryColor={P} />
            </Anim>
            <Anim variant="scaleIn" delay={340}>
              <div className="mt-8"><CrescentStar size={32} /></div>
            </Anim>
          </div>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 overflow-hidden"
          style={{ backgroundColor: `${P}0c`, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10 max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><CrescentStar size={36} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={60}>
              <p className="mb-2 text-center text-[10px] tracking-[0.35em] uppercase" style={{ color: P, opacity: 0.62 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={160}>
              <p className="mb-6 text-center text-sm" style={{ color: TXT, opacity: 0.65 }}>
                Konfirmasi Kehadiran Anda
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={260}>
              <RsvpForm
                invitationId={inv.id}
                primaryColor={P}
                deadline={c.deadline as string | undefined}
              />
            </Anim>
          </div>
        </section>
      )

    // ── Quote ─────────────────────────────────────────────────────────────────
    case "quote":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center overflow-hidden"
          style={{ backgroundColor: BG, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}><CrescentStar size={40} /></Anim>
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
                <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: P, opacity: 0.6 }}>
                  — {c.source as string}
                </p>
              </Anim>
            )}
          </div>
        </section>
      )

    // ── Maps ──────────────────────────────────────────────────────────────────
    case "maps": {
      const lat = parseFloat(c.lat as string)
      const lng = parseFloat(c.lng as string)
      const hasCoords = !isNaN(lat) && !isNaN(lng)
      const gmapsUrl = hasCoords ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed` : null
      const dirUrl   = hasCoords ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-10 text-center overflow-hidden"
          style={{ backgroundColor: BG, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10 max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: P, opacity: 0.6 }}>
                {(c.label as string) || "Lokasi Acara"}
              </p>
            </Anim>
            {gmapsUrl && (
              <Anim variant="fadeUp" delay={150}>
                <div className="overflow-hidden rounded-lg" style={{ border: `1.5px solid ${G}60` }}>
                  <iframe
                    src={gmapsUrl} width="100%" height="280"
                    style={{ border: 0 }} loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Anim>
            )}
            {(c.address as string) && (
              <Anim variant="fadeIn" delay={280}>
                <p className="mt-3 text-sm opacity-65" style={{ color: TXT }}>{c.address as string}</p>
              </Anim>
            )}
            {dirUrl && (
              <Anim variant="fadeUp" delay={380}>
                <a
                  href={dirUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ border: `1.5px solid ${P}`, color: P }}
                >
                  <Navigation className="h-4 w-4" />
                  Petunjuk Arah
                </a>
              </Anim>
            )}
          </div>
        </section>
      )
    }

    // ── Closing ───────────────────────────────────────────────────────────────
    case "closing":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
          style={{ backgroundColor: `${P}0c`, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}><CrescentStar size={60} /></Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mx-auto max-w-xs text-base leading-relaxed mt-6" style={{ color: TXT, opacity: 0.72 }}>
                {(c.message as string) ||
                  "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={380}>
              <div className="mt-6 h-px w-24 mx-auto" style={{ backgroundColor: G, opacity: 0.45 }} />
            </Anim>
            <Anim variant="fadeIn" delay={460}>
              <p className="mt-4 text-xl font-bold" style={{ color: P, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.groomName} & {inv.brideName}
              </p>
            </Anim>
            <Anim variant="fadeIn" delay={580}>
              <p className="mt-3 text-sm italic" style={{ color: P, opacity: 0.55 }}>
                Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
              </p>
            </Anim>
          </div>
        </section>
      )

    // ── Gallery ───────────────────────────────────────────────────────────────
    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      if (images.length === 0) return null
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center py-12 text-center overflow-hidden"
          style={{ backgroundColor: BG, ...snap }}
        >
          <StarPattern />
          <div className="relative z-10 w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-[10px] tracking-[0.35em] uppercase" style={{ color: P, opacity: 0.6 }}>
                Gallery
              </p>
            </Anim>
            <div className="columns-2 gap-2 px-4 w-full max-w-sm mx-auto">
              {images.map((url, i) => (
                <div
                  key={i}
                  className="mb-2 overflow-hidden rounded"
                  style={{ border: `1.5px solid ${G}45` }}
                >
                  <Image
                    src={url} alt={`Gallery ${i + 1}`}
                    width={200} height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
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
                primaryColor={P}
                accentColor={G}
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

// Alias to fix typo in JSX (MandallaCorner used in hero, MandallaCorner = MandallaCorner)
const MandallaCorner = MandalaCorner

// ─── Main component ───────────────────────────────────────────────────────────

export function RamadanIslamicTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order)

  return (
    <>
      {sorted.map((section) => (
        <div
          key={section.id}
          onClick={() => onSectionClick?.(section.id)}
          className={onSectionClick ? "cursor-pointer" : ""}
          style={activeSection === section.id ? { outline: "2px solid rgba(0,0,0,0.25)", outlineOffset: "-2px" } : undefined}
        >
          <IslamicSection section={section} inv={inv} />
        </div>
      ))}
    </>
  )
}
