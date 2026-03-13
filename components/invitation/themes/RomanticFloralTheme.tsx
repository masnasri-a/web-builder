"use client"

/**
 * Romantic Floral Theme
 * Palette : Blush Pink (#F4A7B9) · Dusty Rose (#C47C8A) · Ivory (#FFFAF5) · Sage Green (#A8C5A0)
 * Use case: Romantic / feminine wedding, garden party, outdoor ceremony
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
const P    = "#C47C8A" // dusty rose — primary / text headings
const BLSH = "#F4A7B9" // blush pink — accent fills
const BG   = "#FFFAF5" // ivory      — background
const SAGE = "#A8C5A0" // sage green — leaf accents
const TXT  = "#4A2D34" // warm dark for body text

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── Inline SVG decorations ───────────────────────────────────────────────────

/** Stylised rose / peony bloom */
function Rose({ size = 48, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" style={{ opacity }}>
      {/* outer petals */}
      <ellipse cx="24" cy="18" rx="7"  ry="11" fill={BLSH} opacity="0.65" />
      <ellipse cx="24" cy="18" rx="7"  ry="11" fill={BLSH} opacity="0.65" transform="rotate(72  24 24)" />
      <ellipse cx="24" cy="18" rx="7"  ry="11" fill={BLSH} opacity="0.65" transform="rotate(144 24 24)" />
      <ellipse cx="24" cy="18" rx="7"  ry="11" fill={BLSH} opacity="0.65" transform="rotate(216 24 24)" />
      <ellipse cx="24" cy="18" rx="7"  ry="11" fill={BLSH} opacity="0.65" transform="rotate(288 24 24)" />
      {/* inner petals */}
      <ellipse cx="24" cy="20" rx="4.5" ry="7" fill={P} opacity="0.55" />
      <ellipse cx="24" cy="20" rx="4.5" ry="7" fill={P} opacity="0.55" transform="rotate(90  24 24)" />
      <ellipse cx="24" cy="20" rx="4.5" ry="7" fill={P} opacity="0.55" transform="rotate(180 24 24)" />
      <ellipse cx="24" cy="20" rx="4.5" ry="7" fill={P} opacity="0.55" transform="rotate(270 24 24)" />
      {/* centre */}
      <circle cx="24" cy="24" r="5" fill={P} opacity="0.8" />
      <circle cx="24" cy="24" r="2.5" fill={BLSH} />
    </svg>
  )
}

/** Leaf / branch sprig */
function Leaves({ size = 60, flip = false }: { size?: number; flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size * 0.6}
      viewBox="0 0 60 36"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* main branch */}
      <path d="M5,30 Q20,20 35,18 Q50,16 58,12" stroke={SAGE} strokeWidth="1.4" fill="none" opacity="0.7" />
      {/* leaves */}
      <ellipse cx="18" cy="24" rx="7" ry="3.5" fill={SAGE} opacity="0.5" transform="rotate(-20 18 24)" />
      <ellipse cx="32" cy="19" rx="7" ry="3.5" fill={SAGE} opacity="0.5" transform="rotate(-30 32 19)" />
      <ellipse cx="46" cy="14" rx="7" ry="3.5" fill={SAGE} opacity="0.5" transform="rotate(-40 46 14)" />
      <ellipse cx="12" cy="28" rx="5" ry="2.5" fill={SAGE} opacity="0.35" transform="rotate(-10 12 28)" />
      <ellipse cx="38" cy="17" rx="5" ry="2.5" fill={SAGE} opacity="0.35" transform="rotate(-45 38 17)" />
    </svg>
  )
}

/** Corner bouquet: cluster of roses + leaves */
function CornerBouquet({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      aria-hidden="true"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      {/* leaves behind */}
      <ellipse cx="20" cy="60" rx="18" ry="6" fill={SAGE} opacity="0.4" transform="rotate(-55 20 60)" />
      <ellipse cx="30" cy="64" rx="14" ry="5" fill={SAGE} opacity="0.35" transform="rotate(-70 30 64)" />
      <ellipse cx="10" cy="50" rx="12" ry="4" fill={SAGE} opacity="0.35" transform="rotate(-30 10 50)" />
      {/* roses */}
      <g transform="translate(10 10) scale(0.55)"><Rose size={48} opacity={0.85} /></g>
      <g transform="translate(28 4)  scale(0.5)"><Rose size={48} opacity={0.75} /></g>
      <g transform="translate(4 28)  scale(0.45)"><Rose size={48} opacity={0.7} /></g>
      {/* tiny bud */}
      <circle cx="44" cy="16" r="4" fill={BLSH} opacity="0.55" />
      <circle cx="16" cy="44" r="3.5" fill={BLSH} opacity="0.45" />
    </svg>
  )
}

/** Soft gradient band divider */
function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3" aria-hidden="true">
      <Leaves size={48} />
      <Rose size={28} />
      <Leaves size={48} flip />
    </div>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function FloralSection({
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
          style={{
            background: `linear-gradient(160deg, #FFF0F3 0%, ${BG} 50%, #F0F7EE 100%)`,
            color: TXT,
            ...snap,
          }}
        >
          {/* Corner bouquets */}
          <div className="absolute top-0 left-0 pointer-events-none"><CornerBouquet rotate={0} /></div>
          <div className="absolute top-0 right-0 pointer-events-none"><CornerBouquet rotate={90} /></div>
          <div className="absolute bottom-0 left-0 pointer-events-none"><CornerBouquet rotate={270} /></div>
          <div className="absolute bottom-0 right-0 pointer-events-none"><CornerBouquet rotate={180} /></div>

          {/* Centre content */}
          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <Rose size={64} />
            </Anim>

            <Anim variant="fadeIn" delay={140}>
              <p className="mb-4 mt-3 text-[10px] tracking-[0.5em] uppercase" style={{ color: P, opacity: 0.65 }}>
                The Wedding of
              </p>
            </Anim>

            <Anim variant="fadeUp" delay={260}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: P, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>

            <Anim variant="scaleIn" delay={380}>
              <p className="my-3 text-2xl font-light italic" style={{ color: BLSH }}>&amp;</p>
            </Anim>

            <Anim variant="fadeUp" delay={440}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: P, fontFamily: "Cormorant Garamond, Georgia, serif" }}
              >
                {inv.brideName}
              </h1>
            </Anim>

            {(c.subtitle as string) && (
              <Anim variant="fadeUp" delay={560}>
                <p className="mt-5 text-sm italic" style={{ color: TXT, opacity: 0.6 }}>
                  {c.subtitle as string}
                </p>
              </Anim>
            )}

            <Anim variant="fadeIn" delay={640}>
              <FloralDivider />
              <p className="text-sm" style={{ color: P, opacity: 0.7 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
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
            style={{ border: `2.5px solid ${BLSH}`, boxShadow: `0 0 0 4px ${BLSH}30` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />
            )}
          </div>
          <h2
            className="text-2xl font-bold"
            style={{ color: P, fontFamily: "Cormorant Garamond, serif" }}
          >
            {name}
          </h2>
          {parents && <p className="text-sm opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: TXT }}>{bio}</p>}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ background: `linear-gradient(180deg, ${BG} 0%, #FFF0F3 100%)`, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}><Rose size={40} /></Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.6 }}>
              The Couple
            </p>
          </Anim>

          {layout === "side-by-side" ? (
            <div className="flex justify-center gap-10">
              <Anim variant="slideLeft" delay={150}>
                <PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} />
              </Anim>
              <Anim variant="scaleIn" delay={300} className="self-center">
                <span className="text-3xl italic font-light" style={{ color: BLSH }}>&amp;</span>
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
              <span className="text-3xl italic font-light" style={{ color: BLSH }}>&amp;</span>
              <Anim variant="fadeUp" delay={300}>
                <PersonCard photo={c.bridePhoto as string} name={inv.brideName} parents={c.brideParents as string} bio={c.brideBio as string} />
              </Anim>
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
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ background: `linear-gradient(160deg, #FFF0F3 0%, ${BG} 100%)`, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><Rose size={44} /></Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mt-3 mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.62 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mb-2 text-3xl font-bold" style={{ color: P, fontFamily: "Cormorant Garamond, serif" }}>
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
                      className="rounded-2xl px-5 py-4 text-center min-w-[120px]"
                      style={{ border: `1.5px solid ${BLSH}80`, backgroundColor: `${BLSH}14` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: P }}>
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
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center"
          style={{ background: `linear-gradient(180deg, ${BG} 0%, #F0F7EE 100%)`, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.6 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={P} />
          </Anim>
          <Anim variant="scaleIn" delay={340}>
            <div className="mt-8"><FloralDivider /></div>
          </Anim>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16"
          style={{ background: `linear-gradient(160deg, #FFF0F3 0%, ${BG} 100%)`, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><Rose size={36} /></div>
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
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center"
          style={{ background: `linear-gradient(180deg, #FFF0F3 0%, ${BG} 100%)`, ...snap }}
        >
          <Anim variant="scaleIn" delay={0}><Rose size={40} /></Anim>
          <Anim variant="fadeUp" delay={160}>
            <blockquote
              className="mx-auto max-w-sm text-base italic leading-relaxed mt-5"
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
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-10 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-[10px] uppercase tracking-widest" style={{ color: P, opacity: 0.6 }}>
                {(c.label as string) || "Lokasi Acara"}
              </p>
            </Anim>
            {gmapsUrl && (
              <Anim variant="fadeUp" delay={150}>
                <div className="overflow-hidden rounded-2xl" style={{ border: `1.5px solid ${BLSH}80` }}>
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
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
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
          style={{ background: `linear-gradient(160deg, #FFF0F3 0%, ${BG} 60%, #F0F7EE 100%)`, ...snap }}
        >
          {/* corner bouquets faint */}
          <div className="absolute bottom-0 left-0 opacity-40 pointer-events-none"><CornerBouquet rotate={270} /></div>
          <div className="absolute bottom-0 right-0 opacity-40 pointer-events-none"><CornerBouquet rotate={180} /></div>

          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}><Rose size={60} /></Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mx-auto max-w-xs text-base leading-relaxed mt-6" style={{ color: TXT, opacity: 0.72 }}>
                {(c.message as string) ||
                  "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
              </p>
            </Anim>
            <Anim variant="scaleIn" delay={380}>
              <FloralDivider />
            </Anim>
            <Anim variant="fadeIn" delay={480}>
              <p className="text-xl font-bold" style={{ color: P, fontFamily: "Cormorant Garamond, serif" }}>
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
          className="min-h-dvh flex flex-col items-center justify-center py-12 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.35em] uppercase" style={{ color: P, opacity: 0.6 }}>
              Gallery
            </p>
          </Anim>
          <div className="columns-2 gap-2 px-4 w-full max-w-sm mx-auto">
            {images.map((url, i) => (
              <div
                key={i}
                className="mb-2 overflow-hidden rounded-xl"
                style={{ border: `1.5px solid ${BLSH}60` }}
              >
                <Image
                  src={url} alt={`Gallery ${i + 1}`}
                  width={200} height={200}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
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
                accentColor={BLSH}
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

// ─── Main component ───────────────────────────────────────────────────────────

export function RomanticFloralTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <FloralSection section={section} inv={inv} />
        </div>
      ))}
    </>
  )
}
