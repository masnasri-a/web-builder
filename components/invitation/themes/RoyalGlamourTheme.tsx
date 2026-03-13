"use client"

/**
 * Royal Glamour Theme
 * Palette : Deep Navy (#0D1B4B) · Burgundy (#6B0F1A) · Gold (#C9A84C) · Champagne (#F5E6C8)
 * Use case: Formal black-tie wedding, gala dinner, mewah / luxury wedding
 */

import Image from "next/image"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { Navigation } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"

// ─── Palette constants ────────────────────────────────────────────────────────
const NAVY  = "#0D1B4B" // deep navy   — background
const BURG  = "#6B0F1A" // burgundy    — secondary dark
const G     = "#C9A84C" // gold        — primary accent
const CHAMP = "#F5E6C8" // champagne   — light text
const TXT   = "#E8D5B0" // warm champagne for body text

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── Inline SVG decorations ───────────────────────────────────────────────────

/** Ornate art-deco frame border (full-page overlay) */
function OrnateFrame() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 360 640"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* outer border rectangle */}
      <rect x="6"  y="6"  width="348" height="628" fill="none" stroke={G} strokeWidth="1.2" opacity="0.5" />
      <rect x="12" y="12" width="336" height="616" fill="none" stroke={G} strokeWidth="0.5" opacity="0.3" />

      {/* corner ornaments — top-left */}
      <path d="M6,40 L6,6 L40,6"   stroke={G} strokeWidth="2.5" fill="none" opacity="0.9" />
      <path d="M6,30 L6,6 L30,6"   stroke={G} strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="6"  cy="6"  r="4" fill={G} opacity="0.9" />
      {/* diamond ornament */}
      <rect x="22" y="-4" width="12" height="12" fill={G} opacity="0.6" transform="rotate(45 28 8)" rx="1" />

      {/* corner ornaments — top-right */}
      <path d="M354,40 L354,6 L320,6" stroke={G} strokeWidth="2.5" fill="none" opacity="0.9" />
      <path d="M354,30 L354,6 L330,6" stroke={G} strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="354" cy="6"  r="4" fill={G} opacity="0.9" />
      <rect x="320" y="-4" width="12" height="12" fill={G} opacity="0.6" transform="rotate(45 326 8)" rx="1" />

      {/* corner ornaments — bottom-left */}
      <path d="M6,600 L6,634 L40,634"  stroke={G} strokeWidth="2.5" fill="none" opacity="0.9" />
      <path d="M6,610 L6,634 L30,634"  stroke={G} strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="6"  cy="634" r="4" fill={G} opacity="0.9" />
      <rect x="22" y="628" width="12" height="12" fill={G} opacity="0.6" transform="rotate(45 28 634)" rx="1" />

      {/* corner ornaments — bottom-right */}
      <path d="M354,600 L354,634 L320,634" stroke={G} strokeWidth="2.5" fill="none" opacity="0.9" />
      <path d="M354,610 L354,634 L330,634" stroke={G} strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="354" cy="634" r="4" fill={G} opacity="0.9" />
      <rect x="320" y="628" width="12" height="12" fill={G} opacity="0.6" transform="rotate(45 326 634)" rx="1" />

      {/* mid-side ornaments */}
      <circle cx="6"   cy="320" r="4" fill={G} opacity="0.5" />
      <circle cx="354" cy="320" r="4" fill={G} opacity="0.5" />
      <circle cx="180" cy="6"   r="4" fill={G} opacity="0.5" />
      <circle cx="180" cy="634" r="4" fill={G} opacity="0.5" />
    </svg>
  )
}

/** Royal crown */
function Crown({ size = 56 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size * 0.7} viewBox="0 0 56 40">
      {/* base band */}
      <rect x="4" y="28" width="48" height="10" rx="2" fill={G} opacity="0.9" />
      {/* crown body */}
      <polygon points="4,28 4,12 14,22 28,4 42,22 52,12 52,28" fill={G} opacity="0.85" />
      {/* jewel accents */}
      <circle cx="28" cy="8"  r="3" fill={CHAMP} opacity="0.9" />
      <circle cx="14" cy="24" r="2" fill={CHAMP} opacity="0.8" />
      <circle cx="42" cy="24" r="2" fill={CHAMP} opacity="0.8" />
      <circle cx="4"  cy="30" r="2" fill={BURG}  opacity="0.7" />
      <circle cx="52" cy="30" r="2" fill={BURG}  opacity="0.7" />
      <circle cx="28" cy="31" r="2.5" fill={BURG} opacity="0.8" />
    </svg>
  )
}

/** Laurel wreath (left or right half) */
function LaurelHalf({ side = "left" }: { side?: "left" | "right" }) {
  const flip = side === "right"
  return (
    <svg
      aria-hidden="true"
      width="50"
      height="60"
      viewBox="0 0 50 60"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* main stem */}
      <path d="M40,55 Q30,40 25,20 Q22,10 24,4" stroke={G} strokeWidth="1.2" fill="none" opacity="0.65" />
      {/* leaves left of stem */}
      <ellipse cx="32" cy="46" rx="9" ry="3.5" fill={G} opacity="0.45" transform="rotate(-40 32 46)" />
      <ellipse cx="28" cy="35" rx="9" ry="3.5" fill={G} opacity="0.45" transform="rotate(-50 28 35)" />
      <ellipse cx="25" cy="24" rx="8" ry="3"   fill={G} opacity="0.4"  transform="rotate(-55 25 24)" />
      <ellipse cx="24" cy="14" rx="7" ry="2.8" fill={G} opacity="0.35" transform="rotate(-60 24 14)" />
      {/* berries */}
      <circle cx="36" cy="50" r="2"   fill={G} opacity="0.6" />
      <circle cx="22" cy="27" r="1.8" fill={G} opacity="0.5" />
    </svg>
  )
}

/** Art-deco horizontal rule */
function DecorRule() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 w-full" aria-hidden="true">
      <div className="h-px flex-1" style={{ backgroundColor: G, opacity: 0.4 }} />
      <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
        <polygon points="12,1 23,11 1,11" fill="none" stroke={G} strokeWidth="1" opacity="0.7" />
      </svg>
      <div className="h-px flex-1" style={{ backgroundColor: G, opacity: 0.4 }} />
    </div>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function RoyalSection({
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
          style={{ backgroundColor: NAVY, color: CHAMP, ...snap }}
        >
          {/* Ornate frame overlay */}
          <OrnateFrame />

          {/* Content */}
          <div className="relative z-10 px-12 py-24">
            <Anim variant="scaleIn" delay={0}>
              <Crown size={64} />
            </Anim>

            <Anim variant="fadeIn" delay={160}>
              <p className="mb-4 mt-3 text-[10px] tracking-[0.55em] uppercase" style={{ color: G, opacity: 0.8 }}>
                The Wedding of
              </p>
            </Anim>

            <Anim variant="fadeUp" delay={280}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: CHAMP, fontFamily: "Cinzel, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>

            <Anim variant="scaleIn" delay={400}>
              <p className="my-3 text-2xl font-light" style={{ color: G }}>&amp;</p>
            </Anim>

            <Anim variant="fadeUp" delay={460}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: CHAMP, fontFamily: "Cinzel, Georgia, serif" }}
              >
                {inv.brideName}
              </h1>
            </Anim>

            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={560}>
                <p className="mt-5 text-sm italic" style={{ color: TXT, opacity: 0.7 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}

            <Anim variant="fadeIn" delay={640}>
              <DecorRule />
              <p className="text-sm tracking-widest" style={{ color: G, opacity: 0.75 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>

            {/* Laurel wreath flanking names */}
            <Anim variant="scaleIn" delay={720}>
              <div className="mt-6 flex justify-center gap-2 items-center">
                <LaurelHalf side="left" />
                <Crown size={32} />
                <LaurelHalf side="right" />
              </div>
            </Anim>
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
            className="mx-auto h-24 w-24 overflow-hidden rounded-full"
            style={{ border: `2.5px solid ${G}`, boxShadow: `0 0 0 4px ${G}25` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: CHAMP, fontFamily: "Cinzel, serif" }}>{name}</h2>
          {parents && <p className="text-sm opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: TXT }}>{bio}</p>}
        </div>
      )

      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center overflow-hidden"
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10 w-full">
            <Anim variant="fadeIn" delay={0}><Crown size={40} /></Anim>
            <Anim variant="fadeIn" delay={60}>
              <p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: G, opacity: 0.7 }}>
                The Couple
              </p>
            </Anim>

            {layout === "side-by-side" ? (
              <div className="flex justify-center gap-10">
                <Anim variant="slideLeft" delay={150}>
                  <PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} />
                </Anim>
                <Anim variant="scaleIn" delay={300} className="self-center">
                  <span className="text-3xl font-light" style={{ color: G }}>&amp;</span>
                </Anim>
                <Anim variant="slideRight" delay={150}>
                  <PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} />
                </Anim>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <Anim variant="fadeUp" delay={150}>
                  <PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} />
                </Anim>
                <span className="text-3xl font-light" style={{ color: G }}>&amp;</span>
                <Anim variant="fadeUp" delay={300}>
                  <PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} />
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10 max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><Crown size={44} /></Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mt-3 mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: G, opacity: 0.72 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mb-2 text-3xl font-bold" style={{ color: CHAMP, fontFamily: "Cinzel, serif" }}>
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
                      style={{ border: `1.5px solid ${G}50`, backgroundColor: `${G}10` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: G }}>
                        {ev.name || `Acara ${i + 1}`}
                      </p>
                      {ev.date && (
                        <p className="mt-1.5 text-sm font-medium" style={{ color: CHAMP }}>
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: G, opacity: 0.7 }}>
                Menghitung Hari
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={160}>
              <CountdownTimer eventDate={inv.eventDate} primaryColor={G} />
            </Anim>
            <Anim variant="scaleIn" delay={340}>
              <div className="mt-8 w-48 mx-auto"><DecorRule /></div>
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10 max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><Crown size={36} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={60}>
              <p className="mb-2 text-center text-[10px] tracking-[0.35em] uppercase" style={{ color: G, opacity: 0.72 }}>
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
                primaryColor={G}
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <p className="text-4xl leading-none" style={{ color: G }}>&ldquo;</p>
            </Anim>
            <Anim variant="fadeUp" delay={160}>
              <blockquote
                className="mx-auto max-w-sm text-base italic leading-relaxed mt-3"
                style={{ color: TXT, opacity: 0.9 }}
              >
                {c.quote as string}
              </blockquote>
            </Anim>
            {!!c.source && (
              <Anim variant="fadeIn" delay={360}>
                <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: G, opacity: 0.65 }}>
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10 max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: G, opacity: 0.7 }}>
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
                  style={{ border: `1.5px solid ${G}`, color: G }}
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center gap-2 items-center">
                <LaurelHalf side="left" />
                <Crown size={48} />
                <LaurelHalf side="right" />
              </div>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mx-auto max-w-xs text-base leading-relaxed mt-6" style={{ color: TXT, opacity: 0.75 }}>
                {(c.message as string) ||
                  "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={380}>
              <div className="mt-6 mx-auto max-w-xs"><DecorRule /></div>
            </Anim>
            <Anim variant="fadeIn" delay={480}>
              <p className="text-xl font-bold" style={{ color: CHAMP, fontFamily: "Cinzel, serif" }}>
                {inv.groomName} & {inv.brideName}
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
          style={{ backgroundColor: NAVY, ...snap }}
        >
          <OrnateFrame />
          <div className="relative z-10 w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-[10px] tracking-[0.35em] uppercase" style={{ color: G, opacity: 0.7 }}>
                Gallery
              </p>
            </Anim>
            <div className="columns-2 gap-2 px-4 w-full max-w-sm mx-auto">
              {images.map((url, i) => (
                <div
                  key={i}
                  className="mb-2 overflow-hidden rounded-sm"
                  style={{ border: `1.5px solid ${G}50` }}
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

    default:
      return null
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RoyalGlamourTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <RoyalSection section={section} inv={inv} />
        </div>
      ))}
    </>
  )
}
