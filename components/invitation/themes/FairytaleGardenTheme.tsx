"use client"

/**
 * Fairytale Garden Theme
 * Concept : Romantic fairytale — floral arches, dreamy landscape, classic elegance
 * Palette : Dusty Rose (#C4A0B0) · Mauve (#B48BA8) · Soft Pink (#F0D5DE) · Cream (#FFF8F2) · Dark text (#3A2230)
 * Inspired by Einve Demo 28
 */

import Image from "next/image"
import dynamic from "next/dynamic"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import { WatermarkedImage } from "@/components/invitation/watermarked-image"
import { useShowWatermark } from "@/components/invitation/guest-context"
import { Navigation, Instagram, MapPin } from "lucide-react"
import type { Section } from "@/types"
import type { ThemeTemplateProps } from "./index"
import type { GuestInvitation } from "@/components/invitation/guest-sections"
import { GiftSection } from "@/components/invitation/gift-section"
import { UcapanWall } from "@/components/invitation/ucapan-wall"
import { resolveThemeColors, sectionStyle } from "./theme-utils"

const Masonry = dynamic(
    () => import("@/components/ui/masonry").then((m) => ({ default: m.Masonry })),
    { ssr: false }
)

// ─── Palette ──────────────────────────────────────────────────────────────────
const DUSTY = "#C4A0B0"  // primary — dusty rose
const MAUVE = "#B48BA8"  // accent — soft mauve purple
const BLUSH = "#F0D5DE"  // highlight — soft pink
const TXT = "#3A2230"    // dark text
const PINK_BG = "#D4AAB4" // section background pink

// ─── Assets ───────────────────────────────────────────────────────────────────
const BG_HERO = "/themes/fairytale-garden/bg-hero.png"
const BG_GALLERY = "/themes/fairytale-garden/bg-gallery.png"

// ─── Reusable decorative divider ─────────────────────────────────────────────
function Divider({ color = DUSTY, width = 200 }: { color?: string; width?: number }) {
    return (
        <div className="flex items-center justify-center gap-3 my-4" style={{ width }}>
            <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.4 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />
            <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.4 }} />
        </div>
    )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PersonCard({ photo, name, parents, bio, instagram, fallbackBg = BLUSH, fallbackColor = DUSTY }: { photo?: string; name: string; parents?: string; bio?: string; instagram?: string; fallbackBg?: string; fallbackColor?: string }) {
    return (
        <div className="space-y-3 text-center">
            {/* Oval photo frame */}
            <div
                className="mx-auto overflow-hidden"
                style={{
                    width: 100,
                    height: 130,
                    borderRadius: "50%",
                    border: `3px solid white`,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.1)`,
                }}
            >
                {photo ? (
                    <WatermarkedImage src={photo} alt={name} width={100} height={130} className="object-cover w-full h-full" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${fallbackBg}60`, color: fallbackColor }}>
                        {name.charAt(0)}
                    </div>
                )}
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "white", fontFamily: "Cormorant Garamond, serif" }}>
                {name}
            </h2>
            {parents && <p className="text-xs opacity-80" style={{ color: "white" }}>{parents}</p>}
            {bio && <p className="mx-auto max-w-40 text-sm leading-relaxed opacity-80" style={{ color: "white" }}>{bio}</p>}
            {instagram && (
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs opacity-70" style={{ color: "white" }}>
                    <Instagram className="h-3 w-3" />@{instagram}
                </a>
            )}
        </div>
    )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function FairytaleSection({
    section,
    inv,
    _P = DUSTY,
    _ACC = MAUVE,
    _BG = PINK_BG,
    _TXT = TXT,
    _BORDER = BLUSH,
}: {
    section: Section
    inv: GuestInvitation
    _P?: string
    _ACC?: string
    _BG?: string
    _TXT?: string
    _BORDER?: string
}) {
    const c = section.content as Record<string, unknown>
    const showWatermark = useShowWatermark()

    switch (section.type) {

        // ── Hero ──────────────────────────────────────────────────────────────────
        case "hero":
            return (
                <section
                    id={section.id}
                    className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden text-center"
                    style={{ ...sectionStyle(section), color: _TXT }}
                >
                    {/* Full background image */}
                    <div className="absolute inset-0">
                        <Image
                            src={BG_HERO}
                            alt=""
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="relative z-10 px-8 py-16 flex flex-col items-center">
                        <Anim variant="fadeIn" delay={0}>
                            <p className="mb-4 text-sm tracking-[0.3em]" style={{ color: _TXT, fontFamily: "Cormorant Garamond, serif" }}>
                                The Wedding Of
                            </p>
                        </Anim>

                        {/* Oval couple photo — large, matching reference */}
                        <Anim variant="scaleIn" delay={150}>
                            <div
                                className="mx-auto overflow-hidden mb-6"
                                style={{
                                    width: 220,
                                    height: 300,
                                    borderRadius: "50%",
                                    border: "4px solid white",
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                                }}
                            >
                                {(c.heroPhoto as string) ? (
                                    <WatermarkedImage src={c.heroPhoto as string} alt="" width={220} height={300} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl" style={{ backgroundColor: `${_BORDER}40`, color: _P }}>
                                        {inv.groomName.charAt(0)}&{inv.brideName.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </Anim>

                        <Anim variant="fadeUp" delay={300}>
                            <h1 className="text-4xl font-bold leading-tight" style={{ color: _TXT, fontFamily: "Cormorant Garamond, Georgia, serif" }}>
                                {inv.groomName} <span className="italic font-light">&amp;</span> {inv.brideName}
                            </h1>
                        </Anim>

                        <Anim variant="fadeIn" delay={450}>
                            <p className="mt-4 text-sm" style={{ color: _TXT, fontFamily: "Cormorant Garamond, serif" }}>
                                {inv.eventDate
                                    ? new Date(inv.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                                    : "Wedding Date TBD"}
                            </p>
                        </Anim>

                        <Anim variant="fadeIn" delay={550}>
                            <p className="mt-4 text-sm font-semibold" style={{ color: _TXT }}>
                                Nama Tamu
                            </p>
                        </Anim>
                    </div>
                </section>
            )

        // ── Couple ────────────────────────────────────────────────────────────────
        case "couple": {
            return (
                <section
                    id={section.id}
                    className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
                    style={{ ...sectionStyle(section, _BG), color: _TXT }}
                >
                    <Anim variant="fadeIn" delay={0}>
                        <p className="mb-3 text-lg italic" style={{ color: "white", fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                            Kedua Mempelai
                        </p>
                    </Anim>
                    <Anim variant="fadeIn" delay={100}>
                        <p className="mb-8 max-w-xs mx-auto text-sm leading-relaxed" style={{ color: "white", opacity: 0.85 }}>
                            Maha suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan, Ya Allah rahmatilah pernikahan kami
                        </p>
                    </Anim>
                    <div className="flex flex-col gap-8 items-center">
                        <Anim variant="fadeUp" delay={200}>
                            <PersonCard
                                photo={c.groomPhoto as string}
                                name={inv.groomName}
                                parents={c.groomParents as string}
                                bio={c.groomBio as string}
                                instagram={c.groomInstagram as string}
                                fallbackBg={_BORDER}
                                fallbackColor={_P}
                            />
                        </Anim>
                        <Anim variant="scaleIn" delay={350}>
                            <span className="text-3xl italic font-light" style={{ color: "white" }}>&amp;</span>
                        </Anim>
                        <Anim variant="fadeUp" delay={400}>
                            <PersonCard
                                photo={c.bridePhoto as string}
                                name={inv.brideName}
                                parents={c.brideParents as string}
                                bio={c.brideBio as string}
                                instagram={c.brideInstagram as string}
                                fallbackBg={_BORDER}
                                fallbackColor={_P}
                            />
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
                    className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
                    style={{ ...sectionStyle(section, _BG), color: _TXT }}
                >
                    {/* Background image layer */}
                    <div className="absolute inset-0 opacity-30">
                        <Image src={BG_HERO} alt="" fill className="object-cover" />
                    </div>

                    {/* Content card */}
                    <div className="relative z-10 w-[calc(100%-48px)] max-w-md mx-auto">
                        <div
                            className="rounded-3xl px-6 py-10 text-center overflow-hidden relative"
                            style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}
                        >
                            {/* Faded background image inside card */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <Image src={BG_HERO} alt="" fill className="object-cover" />
                            </div>

                            <div className="relative z-10">
                                <Anim variant="fadeIn" delay={0}>
                                    <p className="text-2xl italic mb-6" style={{ color: _TXT, fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                                        Wedding Event
                                    </p>
                                </Anim>

                                {events.map((ev, i) => (
                                    <div key={i} className="mb-8 last:mb-0">
                                        <Anim variant="fadeUp" delay={100 + i * 150}>
                                            <h3 className="text-lg font-bold mb-2" style={{ color: _TXT, fontFamily: "Cormorant Garamond, serif" }}>
                                                {ev.name || `Acara ${i + 1}`}
                                            </h3>
                                            <Divider color={_TXT} width={200} />
                                            {ev.date && (
                                                <p className="text-sm font-semibold mt-2" style={{ color: _TXT }}>
                                                    {new Date(ev.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                                </p>
                                            )}
                                            {ev.time && <p className="text-sm mt-1" style={{ color: _TXT, opacity: 0.7 }}>{ev.time}</p>}

                                            <div className="flex items-center justify-center gap-3 mt-3">
                                                <div className="flex-1 h-px" style={{ backgroundColor: _TXT, opacity: 0.2 }} />
                                                <MapPin className="h-5 w-5" style={{ color: _TXT, opacity: 0.5 }} />
                                                <div className="flex-1 h-px" style={{ backgroundColor: _TXT, opacity: 0.2 }} />
                                            </div>

                                            <p className="text-sm font-medium mt-2" style={{ color: _TXT }}>{inv.eventVenue}</p>
                                            {inv.eventAddress && (
                                                <p className="text-xs mt-1 opacity-60" style={{ color: _TXT }}>{inv.eventAddress}</p>
                                            )}

                                            {i === 0 && (
                                                <button
                                                    className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
                                                    style={{ background: `linear-gradient(135deg, ${_P}, ${_ACC})` }}
                                                >
                                                    <MapPin className="h-4 w-4" />
                                                    Kunjungi Lokasi
                                                </button>
                                            )}
                                        </Anim>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                    className="relative min-h-dvh flex flex-col overflow-hidden"
                    style={{ ...sectionStyle(section, _BG), color: _TXT }}
                >
                    {/* Background image */}
                    <div className="absolute inset-0 opacity-30">
                        <Image src={BG_GALLERY} alt="" fill className="object-cover" />
                    </div>

                    <div className="relative z-10 px-4 py-12">
                        {/* Gallery card */}
                        <div
                            className="rounded-3xl px-4 py-8 overflow-hidden relative"
                            style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                        >
                            {/* Faded bg inside card */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <Image src={BG_GALLERY} alt="" fill className="object-cover" />
                            </div>

                            <div className="relative z-10">
                                <Anim variant="fadeIn" delay={0}>
                                    <p className="mb-2 text-center text-2xl italic" style={{ color: _TXT, fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                                        Our Gallery
                                    </p>
                                    <p className="mb-6 text-center text-sm italic max-w-xs mx-auto" style={{ color: _TXT, opacity: 0.6 }}>
                                        Kami bersyukur, dipertemukan Allah di waktu terbaik, kami menanti hari istimewa kami
                                    </p>
                                </Anim>
                                {images.length === 0 ? (
                                    <div className="flex h-32 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `${_BORDER}40` }}>
                                        Belum ada foto
                                    </div>
                                ) : (
                                    <Anim variant="fadeIn" delay={80}>
                                        <Masonry items={items} animateFrom="bottom" stagger={0.05} blurToFocus maxColumns={2} showWatermark={showWatermark} />
                                    </Anim>
                                )}
                            </div>
                        </div>
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
                    style={{ ...sectionStyle(section), color: _TXT }}
                >
                    {/* Background image */}
                    <div className="absolute inset-0">
                        <Image src={BG_GALLERY} alt="" fill className="object-cover" />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.6)" }} />

                    <div className="relative z-10">
                        <Anim variant="fadeIn" delay={0}>
                            <p className="text-2xl italic mb-2" style={{ color: _TXT, fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                                Menghitung Hari
                            </p>
                            <p className="mb-8 text-sm" style={{ color: _TXT, opacity: 0.7 }}>
                                {inv.eventDate
                                    ? new Date(inv.eventDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
                                    : ""}
                            </p>
                        </Anim>
                        <Anim variant="scaleIn" delay={200}>
                            <CountdownTimer eventDate={inv.eventDate} primaryColor={_P} />
                        </Anim>
                    </div>
                </section>
            )

        // ── RSVP ──────────────────────────────────────────────────────────────────
        case "rsvp":
            return (
                <section
                    id={section.id}
                    className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
                    style={{ ...sectionStyle(section, _BG), color: _TXT }}
                >
                    <div className="absolute inset-0 opacity-20">
                        <Image src={BG_HERO} alt="" fill className="object-cover" />
                    </div>
                    <div className="relative z-10 w-full max-w-sm px-8">
                        <Anim variant="fadeIn" delay={0}>
                            <p className="mb-6 text-center text-2xl italic" style={{ color: "white", fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                                {(c.title as string) || "RSVP"}
                            </p>
                        </Anim>
                        <RsvpForm invitationId={inv.id} primaryColor={_P} />
                    </div>
                </section>
            )

        // ── Closing ───────────────────────────────────────────────────────────────
        case "closing":
            return (
                <section
                    id={section.id}
                    className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center overflow-hidden"
                    style={{ ...sectionStyle(section), color: _TXT }}
                >
                    {/* Full background image */}
                    <div className="absolute inset-0">
                        <Image src={BG_HERO} alt="" fill className="object-cover" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Oval couple photo */}
                        <Anim variant="scaleIn" delay={0}>
                            <div
                                className="mx-auto overflow-hidden mb-6"
                                style={{
                                    width: 160,
                                    height: 210,
                                    borderRadius: "50%",
                                    border: "4px solid white",
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                                }}
                            >
                                <div className="w-full h-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${_BORDER}40`, color: _P }}>
                                    {inv.groomName.charAt(0)}&{inv.brideName.charAt(0)}
                                </div>
                            </div>
                        </Anim>

                        <Anim variant="fadeUp" delay={180}>
                            <p className="text-3xl font-bold" style={{ color: _TXT, fontFamily: "Cormorant Garamond, serif" }}>
                                {inv.groomName} &amp; {inv.brideName}
                            </p>
                        </Anim>
                        <Anim variant="fadeUp" delay={300}>
                            <p className="mx-auto max-w-xs text-sm leading-relaxed mt-5" style={{ color: _TXT, opacity: 0.8 }}>
                                {(c.message as string) || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
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
                    className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
                    style={{ ...sectionStyle(section, _BG), color: _TXT }}
                >
                    <div className="absolute inset-0 opacity-20">
                        <Image src={BG_HERO} alt="" fill className="object-cover" />
                    </div>
                    <div className="relative z-10 w-full max-w-lg px-8">
                        <Anim variant="fadeIn" delay={0}>
                            <p className="mb-4 text-center text-2xl italic" style={{ color: "white", fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                                {(c.label as string) || "Lokasi Acara"}
                            </p>
                        </Anim>
                        {gmapsUrl ? (
                            <Anim variant="fadeUp" delay={150}>
                                <div className="overflow-hidden rounded-2xl" style={{ border: "2px solid rgba(255,255,255,0.5)" }}>
                                    <iframe src={gmapsUrl} width="100%" height="240" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                </div>
                            </Anim>
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-xl text-sm opacity-40" style={{ backgroundColor: `rgba(255,255,255,0.3)`, color: "white" }}>
                                Pilih lokasi di panel kanan
                            </div>
                        )}
                        {gmapsUrl && (
                            <Anim variant="fadeIn" delay={280}>
                                <a
                                    href={`https://maps.google.com/?q=${lat},${lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 flex items-center justify-center gap-1.5 text-xs"
                                    style={{ color: "white", opacity: 0.8 }}
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
                    className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center overflow-hidden"
                    style={{ ...sectionStyle(section), color: _TXT }}
                >
                    {/* Background */}
                    <div className="absolute inset-0">
                        <Image src={BG_GALLERY} alt="" fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.55)" }} />

                    <div className="relative z-10">
                        <Anim variant="fadeUp" delay={100}>
                            <blockquote
                                className="mx-auto max-w-sm text-base italic leading-relaxed"
                                style={{ color: _TXT, fontFamily: "Cormorant Garamond, serif" }}
                            >
                                &ldquo;{c.quote as string}&rdquo;
                            </blockquote>
                        </Anim>
                        {!!c.source && (
                            <Anim variant="fadeIn" delay={300}>
                                <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: _P }}>
                                    — {c.source as string}
                                </p>
                            </Anim>
                        )}
                    </div>
                </section>
            )

        // ── Gift ──────────────────────────────────────────────────────────────────
        case "gift": {
            const banks = (c.banks as import("@/components/invitation/gift-section").BankAccount[]) ?? []
            return (
                <section
                    id={section.id}
                    className="relative min-h-dvh flex flex-col items-center justify-center px-8 py-16 overflow-hidden"
                    style={{ ...sectionStyle(section, _BG), color: _TXT }}
                >
                    <div className="absolute inset-0 opacity-20">
                        <Image src={BG_HERO} alt="" fill className="object-cover" />
                    </div>
                    <div className="relative z-10 max-w-sm mx-auto w-full">
                        <Anim variant="fadeUp" delay={0}>
                            <GiftSection
                                invitationId={inv.id}
                                title={c.title as string | undefined}
                                description={c.description as string | undefined}
                                showQris={c.showQris as boolean | undefined}
                                qrisImage={c.qrisImage as string | null | undefined}
                                banks={banks}
                                allowTransferProof={c.allowTransferProof as boolean | undefined}
                                primaryColor={_P}
                                accentColor={_BORDER}
                            />
                        </Anim>
                    </div>
                </section>
            )
        }

        // ── Ucapan ────────────────────────────────────────────────────────────────
        case "ucapan":
            return (
                <section
                    id={section.id}
                    className="relative min-h-dvh flex flex-col items-center justify-center py-12 overflow-hidden"
                    style={{ ...sectionStyle(section), color: _TXT }}
                >
                    <div className="absolute inset-0">
                        <Image src={BG_GALLERY} alt="" fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.7)" }} />

                    <div className="relative z-10 w-full max-w-sm px-8">
                        <Anim variant="fadeIn" delay={0}>
                            <p className="mb-6 text-center text-2xl italic" style={{ color: _TXT, fontFamily: "Great Vibes, Cormorant Garamond, cursive" }}>
                                {(c.title as string) || "Ucapan & Doa"}
                            </p>
                        </Anim>
                        <Anim variant="fadeUp" delay={120}>
                            <UcapanWall invitationId={inv.id} primaryColor={_P} />
                        </Anim>
                    </div>
                </section>
            )

        default:
            return null
    }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function FairytaleGardenTheme({ inv, sections, themeConfig, activeSection, onSectionClick }: ThemeTemplateProps) {
    const tc = resolveThemeColors(themeConfig, { primary: DUSTY, accent: MAUVE, bg: "#FFF0F5", text: TXT, border: BLUSH })
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
                    <FairytaleSection section={s} inv={inv} _P={tc.primary} _ACC={tc.accent} _BG={tc.bg} _TXT={tc.text} _BORDER={tc.border} />
                </div>
            ))}
        </>
    )
}
