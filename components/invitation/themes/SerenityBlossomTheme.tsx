"use client"

/**
 * Serenity Blossom Theme
 * Concept : Cherry blossom serenity — Japanese-inspired soft sakura with lavender
 * Palette : Sakura (#E8849A) · Lavender (#9B8EC4) · Sage (#7BA898) · Ivory BG (#FAFAF5) · Deep purple-brown text (#3D2B4A) · Petal (#F4B8C8)
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
const SAKURA   = "#E8849A"
const LAVENDER = "#9B8EC4"
const SAGE     = "#7BA898"
const BG       = "#FAFAF5"
const TXT      = "#3D2B4A"
const PETAL    = "#F4B8C8"

const snap: React.CSSProperties = {
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
}

// ─── SVG Decorations ──────────────────────────────────────────────────────────

/** CherryBlossom — 5-petal blossom with ellipses rotated around center */
function CherryBlossom({ size = 40, opacity = 1, cx = 20, cy = 20, r = 16 }: { size?: number; opacity?: number; cx?: number; cy?: number; r?: number }) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 72) - 90
    return angle
  })
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
      {petals.map((angle, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - r * 0.55}
          rx={r * 0.32}
          ry={r * 0.5}
          fill={i % 2 === 0 ? SAKURA : PETAL}
          opacity="0.8"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      {/* center */}
      <circle cx={cx} cy={cy} r={r * 0.18} fill={LAVENDER} opacity="0.9" />
      <circle cx={cx} cy={cy} r={r * 0.08} fill="#fff" opacity="0.7" />
    </svg>
  )
}

/** FallingPetal — single small ellipse, slightly rotated */
function FallingPetal({ x = 0, y = 0, rotate = 20, size = 10, opacity = 0.5 }: { x?: number; y?: number; rotate?: number; size?: number; opacity?: number }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={size * 0.55}
      ry={size * 0.35}
      fill={PETAL}
      opacity={opacity}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  )
}

/** BlossomBranch — curved branch path with 3-4 CherryBlossom flowers at tips */
function BlossomBranch({ width = 160, height = 120, flip = false, opacity = 1 }: { width?: number; height?: number; flip?: boolean; opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ opacity, display: "block", transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* main branch */}
      <path d="M10,110 Q40,80 60,50 Q80,25 100,15" stroke={SAGE} strokeWidth="1.5" fill="none" opacity="0.65" />
      {/* secondary branches */}
      <path d="M60,50 Q75,40 90,55" stroke={SAGE} strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M80,30 Q95,20 110,30" stroke={SAGE} strokeWidth="1" fill="none" opacity="0.5" />
      {/* blossoms at branch tips */}
      <g transform="translate(82, 4)"><CherryBlossom size={26} cx={13} cy={13} r={11} opacity={0.9} /></g>
      <g transform="translate(84, 44)"><CherryBlossom size={22} cx={11} cy={11} r={9} opacity={0.8} /></g>
      <g transform="translate(32, 32)"><CherryBlossom size={20} cx={10} cy={10} r={8} opacity={0.75} /></g>
      {/* scattered petals */}
      <svg viewBox="0 0 160 120">
        <FallingPetal x={50} y={70} rotate={-15} size={8} opacity={0.4} />
        <FallingPetal x={120} y={60} rotate={30} size={7} opacity={0.35} />
        <FallingPetal x={140} y={90} rotate={-45} size={6} opacity={0.3} />
      </svg>
    </svg>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function SerenityBlossomSection({ section, inv }: { section: Section; inv: GuestInvitation }) {
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
          {/* top-left blossom branch */}
          <div className="absolute top-0 left-0 pointer-events-none">
            <BlossomBranch width={160} height={130} opacity={0.75} />
          </div>
          {/* bottom-right blossom branch (flipped) */}
          <div className="absolute bottom-0 right-0 pointer-events-none" style={{ transform: "rotate(180deg)" }}>
            <BlossomBranch width={140} height={110} opacity={0.6} />
          </div>
          {/* scattered falling petals */}
          <svg aria-hidden="true" className="absolute inset-0 pointer-events-none w-full h-full">
            <FallingPetal x={80} y={120} rotate={20} size={9} opacity={0.25} />
            <FallingPetal x={300} y={200} rotate={-35} size={8} opacity={0.2} />
            <FallingPetal x={200} y={350} rotate={50} size={7} opacity={0.22} />
            <FallingPetal x={50} y={400} rotate={-20} size={10} opacity={0.18} />
          </svg>

          <div className="relative z-10 px-8 py-24">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><CherryBlossom size={64} cx={32} cy={32} r={26} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={120}>
              <p className="mb-3 text-[10px] tracking-[0.5em] uppercase" style={{ color: LAVENDER, opacity: 0.75 }}>
                The Wedding of
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={240}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: SAKURA, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                {inv.groomName}
              </h1>
            </Anim>
            <Anim variant="scaleIn" delay={360}>
              <p className="my-3 text-3xl font-light italic" style={{ color: LAVENDER }}>&amp;</p>
            </Anim>
            <Anim variant="fadeUp" delay={420}>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: SAKURA, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
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
              <p className="mt-5 text-sm" style={{ color: TXT, opacity: 0.6 }}>
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
            style={{ border: `2.5px solid ${SAKURA}`, boxShadow: `0 0 0 4px ${PETAL}60` }}
          >
            {photo && (
              <Image src={photo} alt={name} width={80} height={80} className="object-cover w-full h-full" />
            )}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: SAKURA, fontFamily: "Cormorant Garamond, serif" }}>
            {name}
          </h2>
          {parents && <p className="text-xs opacity-60" style={{ color: TXT }}>{parents}</p>}
          {bio && <p className="mx-auto max-w-40 text-sm leading-relaxed opacity-70" style={{ color: TXT }}>{bio}</p>}
          {instagram && (
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs opacity-60" style={{ color: LAVENDER }}>
              <Instagram className="h-3 w-3" />@{instagram}
            </a>
          )}
        </div>
      )

      return (
        <section
          id={section.id}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ background: `linear-gradient(160deg, ${BG} 0%, ${PETAL}30 100%)`, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <div className="flex justify-center mb-4"><CherryBlossom size={48} cx={24} cy={24} r={20} /></div>
          </Anim>
          <Anim variant="fadeIn" delay={60}>
            <p className="mb-8 text-[10px] tracking-[0.45em] uppercase" style={{ color: LAVENDER, opacity: 0.75 }}>
              The Couple
            </p>
          </Anim>
          <div className="flex justify-center gap-8 items-center">
            <Anim variant="slideLeft" delay={150}>
              <PersonCard photo={c.groomPhoto as string} name={inv.groomName} parents={c.groomParents as string} bio={c.groomBio as string} instagram={c.groomInstagram as string} />
            </Anim>
            <Anim variant="scaleIn" delay={300}>
              <span className="text-3xl italic font-light" style={{ color: LAVENDER }}>&amp;</span>
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
          style={{ background: `linear-gradient(180deg, ${BG} 0%, ${LAVENDER}15 100%)`, ...snap }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center gap-2 mb-4">
                <CherryBlossom size={28} cx={14} cy={14} r={11} opacity={0.7} />
                <CherryBlossom size={28} cx={14} cy={14} r={11} opacity={0.9} />
                <CherryBlossom size={28} cx={14} cy={14} r={11} opacity={0.7} />
              </div>
            </Anim>
            <Anim variant="fadeIn" delay={100}>
              <p className="mb-4 text-[10px] tracking-[0.45em] uppercase" style={{ color: LAVENDER, opacity: 0.75 }}>
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
                      style={{ border: `1.5px solid ${SAKURA}50`, backgroundColor: `${PETAL}30` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: SAKURA }}>
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
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: SAKURA }}>
                Gallery
              </p>
            </Anim>
            {images.length === 0 ? (
              <div className="mx-4 flex h-32 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${PETAL}40` }}>
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
          style={{ background: `linear-gradient(180deg, ${BG} 0%, ${PETAL}25 100%)`, ...snap }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-[10px] tracking-[0.45em] uppercase" style={{ color: LAVENDER, opacity: 0.75 }}>
              Menghitung Hari
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={SAKURA} />
          </Anim>
          <Anim variant="fadeIn" delay={340}>
            <div className="mt-8 flex justify-center gap-3">
              <CherryBlossom size={24} cx={12} cy={12} r={10} opacity={0.5} />
              <CherryBlossom size={24} cx={12} cy={12} r={10} opacity={0.7} />
              <CherryBlossom size={24} cx={12} cy={12} r={10} opacity={0.5} />
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
          style={{ background: `linear-gradient(160deg, ${PETAL}20 0%, ${BG} 100%)`, color: TXT, ...snap }}
        >
          <div className="w-full max-w-sm px-8">
            <Anim variant="fadeIn" delay={0}>
              <div className="flex justify-center mb-4"><CherryBlossom size={48} cx={24} cy={24} r={20} /></div>
            </Anim>
            <Anim variant="fadeIn" delay={80}>
              <p className="mb-6 text-center text-[10px] tracking-[0.4em] uppercase" style={{ color: LAVENDER, opacity: 0.75 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <RsvpForm invitationId={inv.id} primaryColor={SAKURA} />
          </div>
        </section>
      )

    // ── Closing ───────────────────────────────────────────────────────────────
    case "closing":
      return (
        <section
          id={section.id}
          className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${BG} 0%, ${PETAL}35 60%, ${LAVENDER}20 100%)`, ...snap }}
        >
          <div className="absolute top-0 left-0 pointer-events-none opacity-60">
            <BlossomBranch width={130} height={100} />
          </div>
          <div className="absolute bottom-0 right-0 pointer-events-none opacity-55" style={{ transform: "rotate(180deg)" }}>
            <BlossomBranch width={120} height={90} />
          </div>
          <div className="relative z-10">
            <Anim variant="scaleIn" delay={0}>
              <div className="flex justify-center mb-4"><CherryBlossom size={60} cx={30} cy={30} r={24} /></div>
            </Anim>
            <Anim variant="fadeUp" delay={200}>
              <p className="text-3xl font-bold" style={{ color: SAKURA, fontFamily: "Cormorant Garamond, serif" }}>
                {inv.groomName} &amp; {inv.brideName}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={340}>
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
                <div className="overflow-hidden rounded-xl" style={{ border: `1.5px solid ${SAKURA}50` }}>
                  <iframe src={gmapsUrl} width="100%" height="240" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </Anim>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${PETAL}40` }}>
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
          style={{ background: `linear-gradient(180deg, ${BG} 0%, ${LAVENDER}18 100%)`, ...snap }}
        >
          <Anim variant="scaleIn" delay={0}>
            <div className="flex justify-center gap-2 mb-2">
              <CherryBlossom size={28} cx={14} cy={14} r={11} opacity={0.65} />
              <CherryBlossom size={28} cx={14} cy={14} r={11} opacity={0.85} />
              <CherryBlossom size={28} cx={14} cy={14} r={11} opacity={0.65} />
            </div>
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
              <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: LAVENDER, opacity: 0.7 }}>
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
                primaryColor={SAKURA}
                accentColor={LAVENDER}
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

export function SerenityBlossomTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
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
          <SerenityBlossomSection section={s} inv={inv} />
        </div>
      ))}
    </>
  )
}
