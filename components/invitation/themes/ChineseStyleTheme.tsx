"use client"

/**
 * Chinese Style Theme
 * Palette : Deep Red (#C0392B) · Gold (#D4AF37) · Ivory (#FFF8E7)
 * Use case: Traditional Chinese / Tionghoa wedding, Lunar New Year wedding
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
const P   = "#C0392B" // deep red — primary
const G   = "#D4AF37" // gold    — accent
const BG  = "#FFF8E7" // ivory   — background
const TXT = "#3B0C0C" // dark red for body text

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── Inline SVG decorations ───────────────────────────────────────────────────

/** Repeating cloud-wave border band */
function CloudWave({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 20"
      className="w-full"
      preserveAspectRatio="none"
      style={flip ? { transform: "scaleY(-1)", display: "block" } : { display: "block" }}
    >
      <path
        d="M0,10 C16,1 32,19 48,10 C64,1 80,19 96,10
           C112,1 128,19 144,10 C160,1 176,19 192,10
           C208,1 224,19 240,10 C256,1 272,19 288,10
           C304,1 320,19 336,10 C352,1 368,19 384,10
           C392,5 400,10 400,10 L400,20 L0,20 Z"
        fill={P}
        opacity="0.18"
      />
    </svg>
  )
}

/** Stylised lotus flower */
function Lotus({ size = 44 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 44 44">
      {/* back petals */}
      <ellipse cx="22" cy="26" rx="7" ry="14" fill={G} opacity="0.35" transform="rotate(-25 22 26)" />
      <ellipse cx="22" cy="26" rx="7" ry="14" fill={G} opacity="0.35" transform="rotate(25 22 26)" />
      {/* front petal */}
      <path d="M22,40 C22,40 10,30 12,19 C13,12 18,9 22,13 C26,9 31,12 32,19 C34,30 22,40 22,40 Z" fill={P} opacity="0.65" />
      {/* side petals */}
      <path d="M22,34 C22,34 6,26 8,16 C9,10 16,9 22,14 Z" fill={P} opacity="0.45" />
      <path d="M22,34 C22,34 38,26 36,16 C35,10 28,9 22,14 Z" fill={P} opacity="0.45" />
      {/* centre */}
      <circle cx="22" cy="20" r="4.5" fill={G} />
      <circle cx="22" cy="20" r="2"   fill={P} />
    </svg>
  )
}

/** Double-happiness 囍 character */
function DoubleHappiness({ size = 80 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 80 80">
      <text
        x="40" y="62"
        textAnchor="middle"
        fontSize="58"
        fontFamily="serif"
        fill={G}
        opacity="0.92"
      >
        囍
      </text>
    </svg>
  )
}

/** L-shaped ornamental corner (rotate for each quadrant) */
function CornerOrnament({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      aria-hidden="true"
      width="56"
      height="56"
      viewBox="0 0 56 56"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      {/* outer L */}
      <path d="M4,4 L4,52" stroke={G} strokeWidth="1.4" fill="none" opacity="0.7" />
      <path d="M4,4 L52,4" stroke={G} strokeWidth="1.4" fill="none" opacity="0.7" />
      {/* cloud dots along edges */}
      <circle cx="4" cy="18" r="3" fill="none" stroke={G} strokeWidth="1" opacity="0.55" />
      <circle cx="4" cy="32" r="3" fill="none" stroke={G} strokeWidth="1" opacity="0.55" />
      <circle cx="18" cy="4" r="3" fill="none" stroke={G} strokeWidth="1" opacity="0.55" />
      <circle cx="32" cy="4" r="3" fill="none" stroke={G} strokeWidth="1" opacity="0.55" />
      {/* corner jewel */}
      <circle cx="4" cy="4" r="4.5" fill={G} opacity="0.85" />
      <circle cx="4" cy="4" r="2"   fill={P} />
      {/* inner L */}
      <path d="M12,12 L12,44" stroke={P} strokeWidth="0.7" fill="none" opacity="0.3" />
      <path d="M12,12 L44,12" stroke={P} strokeWidth="0.7" fill="none" opacity="0.3" />
    </svg>
  )
}

/** Horizontal ornamental divider */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <div className="h-px flex-1" style={{ backgroundColor: G, opacity: 0.35 }} />
      <Lotus size={24} />
      <div className="h-px flex-1" style={{ backgroundColor: G, opacity: 0.35 }} />
    </div>
  )
}

// ─── Per-section renderer ─────────────────────────────────────────────────────

function ChineseSection({
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
          {/* Top red band + cloud wave + corners */}
          <div className="absolute inset-x-0 top-0 pointer-events-none">
            <div style={{ backgroundColor: P, height: 7 }} />
            <CloudWave />
            <div className="absolute top-0 left-0"><CornerOrnament rotate={0} /></div>
            <div className="absolute top-0 right-0"><CornerOrnament rotate={90} /></div>
          </div>

          {/* Centre content */}
          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <DoubleHappiness size={100} />
            </Anim>

            <Anim variant="fadeIn" delay={140}>
              <p className="mb-4 text-[10px] tracking-[0.55em] uppercase" style={{ color: P, opacity: 0.65 }}>
                — The Wedding of —
              </p>
            </Anim>

            <Anim variant="fadeUp" delay={260}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: P, fontFamily: "Cinzel, Georgia, serif" }}
              >
                {inv.groomName}
              </h1>
            </Anim>

            <Anim variant="scaleIn" delay={380}>
              <p className="my-3 text-2xl font-light" style={{ color: G }}>与</p>
            </Anim>

            <Anim variant="fadeUp" delay={440}>
              <h1
                className="text-5xl font-bold leading-tight"
                style={{ color: P, fontFamily: "Cinzel, Georgia, serif" }}
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

            <Anim variant="fadeIn" delay={620}>
              <div className="mt-5 h-px w-28 mx-auto" style={{ backgroundColor: G, opacity: 0.45 }} />
              <p className="mt-3 text-sm tracking-widest" style={{ color: P, opacity: 0.72 }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </Anim>
          </div>

          {/* Side lotus accents */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
            <Lotus size={52} />
          </div>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none"
            style={{ transform: "translateY(-50%) scaleX(-1)" }}
          >
            <Lotus size={52} />
          </div>

          {/* Bottom red band + cloud wave + corners */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <CloudWave flip />
            <div style={{ backgroundColor: P, height: 7 }} />
            <div className="absolute bottom-0 left-0"><CornerOrnament rotate={270} /></div>
            <div className="absolute bottom-0 right-0"><CornerOrnament rotate={180} /></div>
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
            style={{ border: `2.5px solid ${G}` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={96} height={96} className="h-full w-full object-cover" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: P, fontFamily: "Cinzel, serif" }}>{name}</h2>
          {parents && <p className="text-sm opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-[180px] text-sm leading-relaxed opacity-72" style={{ color: TXT }}>{bio}</p>}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}><Lotus size={38} /></Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mt-4 mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.6 }}>
              The Couple
            </p>
          </Anim>

          {layout === "side-by-side" ? (
            <div className="flex justify-center gap-10">
              <Anim variant="slideLeft" delay={150}>
                <PersonCard
                  photo={c.groomPhoto as string}
                  name={inv.groomName}
                  parents={c.groomParents as string}
                  bio={c.groomBio as string}
                />
              </Anim>
              <Anim variant="scaleIn" delay={300} className="self-center">
                <span className="text-3xl font-light" style={{ color: G }}>与</span>
              </Anim>
              <Anim variant="slideRight" delay={150}>
                <PersonCard
                  photo={c.bridePhoto as string}
                  name={inv.brideName}
                  parents={c.brideParents as string}
                  bio={c.brideBio as string}
                />
              </Anim>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <Anim variant="fadeUp" delay={150}>
                <PersonCard
                  photo={c.groomPhoto as string}
                  name={inv.groomName}
                  parents={c.groomParents as string}
                  bio={c.groomBio as string}
                />
              </Anim>
              <span className="text-3xl font-light" style={{ color: G }}>与</span>
              <Anim variant="fadeUp" delay={300}>
                <PersonCard
                  photo={c.bridePhoto as string}
                  name={inv.brideName}
                  parents={c.brideParents as string}
                  bio={c.brideBio as string}
                />
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
          style={{ backgroundColor: `${P}0d`, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}><DoubleHappiness size={52} /></Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.62 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="mb-2 text-3xl font-bold" style={{ color: P, fontFamily: "Cinzel, serif" }}>
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
                      style={{ border: `2px solid ${G}`, backgroundColor: `${P}07` }}
                    >
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: G }}
                      >
                        {ev.name || `Acara ${i + 1}`}
                      </p>
                      {ev.date && (
                        <p className="mt-1.5 text-sm font-medium" style={{ color: TXT }}>
                          {new Date(ev.date).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      )}
                      {ev.time && (
                        <p className="text-sm opacity-65" style={{ color: TXT }}>{ev.time}</p>
                      )}
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
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: P, opacity: 0.6 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={P} />
          </Anim>
          <Anim variant="scaleIn" delay={300}>
            <div className="mt-8"><Divider /></div>
          </Anim>
        </section>
      )

    // ── RSVP ──────────────────────────────────────────────────────────────────
    case "rsvp":
      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16"
          style={{ backgroundColor: `${P}0d`, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><Lotus size={36} /></div>
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
          style={{ backgroundColor: BG, ...snap }}
        >
          <Anim variant="scaleIn" delay={0}>
            <p className="text-4xl leading-none" style={{ color: G }}>&ldquo;</p>
          </Anim>
          <Anim variant="fadeUp" delay={160}>
            <blockquote
              className="mx-auto max-w-sm text-base italic leading-relaxed mt-3"
              style={{ color: TXT, opacity: 0.85 }}
            >
              {c.quote as string}
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
      const gmapsUrl   = hasCoords ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed` : null
      const dirUrl     = hasCoords ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null
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
                <div className="overflow-hidden rounded-lg" style={{ border: `2px solid ${G}` }}>
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
                  style={{ border: `2px solid ${P}`, color: P }}
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
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center"
          style={{ backgroundColor: `${P}0d`, ...snap }}
        >
          <Anim variant="scaleIn" delay={0}><DoubleHappiness size={72} /></Anim>
          <Anim variant="fadeUp" delay={200}>
            <p className="mx-auto max-w-xs text-base leading-relaxed mt-4" style={{ color: TXT, opacity: 0.72 }}>
              {(c.message as string) ||
                "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir."}
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={380}>
            <div className="mt-6 h-px w-24 mx-auto" style={{ backgroundColor: G, opacity: 0.5 }} />
          </Anim>
          <Anim variant="fadeIn" delay={460}>
            <p className="mt-4 text-xl font-bold" style={{ color: P, fontFamily: "Cinzel, serif" }}>
              {inv.groomName} & {inv.brideName}
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={560}>
            <div className="mt-6 flex gap-4 justify-center">
              <Lotus size={30} />
              <Lotus size={30} />
              <Lotus size={30} />
            </div>
          </Anim>
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
                className="mb-2 overflow-hidden rounded"
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

// ─── Main component ───────────────────────────────────────────────────────────

export function ChineseStyleTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <ChineseSection section={section} inv={inv} />
        </div>
      ))}
    </>
  )
}
