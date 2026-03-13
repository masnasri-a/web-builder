"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { Anim } from "@/components/invitation/anim"
import { CountdownTimer } from "@/components/invitation/countdown-timer"
import { RsvpForm } from "@/components/invitation/rsvp-form"
import type { Section, ThemeConfig } from "@/types"
import { Instagram, Navigation } from "lucide-react"
import { GiftSection } from "@/components/invitation/gift-section"

const Masonry = dynamic(
  () => import("@/components/ui/masonry").then((m) => ({ default: m.Masonry })),
  { ssr: false }
)

export interface GuestInvitation {
  id: string
  groomName: string
  brideName: string
  /** ISO string — serializable from server to client */
  eventDate: string
  eventVenue: string
  eventAddress: string | null
}

interface GuestSectionsProps {
  sections: Section[]
  inv: GuestInvitation
  themeConfig: ThemeConfig
}

export function GuestSections({ sections, inv, themeConfig }: GuestSectionsProps) {
  return (
    <>
      {sections.map((section) => (
        <AnimatedSection
          key={section.id}
          section={section}
          inv={inv}
          themeConfig={themeConfig}
        />
      ))}
    </>
  )
}

function AnimatedSection({
  section,
  inv,
  themeConfig,
}: {
  section: Section
  inv: GuestInvitation
  themeConfig: ThemeConfig
}) {
  const c = section.content as Record<string, unknown>
  const primary = themeConfig.primaryColor
  const accent = themeConfig.accentColor
  const sectionFont = (section.content as { fontFamily?: string }).fontFamily as string | undefined
  const sectionBg = (section.content as { bgImage?: string }).bgImage as string | undefined
  const fontStyle: React.CSSProperties = {
    ...(sectionFont ? { fontFamily: `"${sectionFont}", serif` } : {}),
    ...(sectionBg
      ? { backgroundImage: `url(${sectionBg})`, backgroundSize: "cover", backgroundPosition: "center" }
      : {}),
  }

  // Shared snap + id styles for every section
  const sectionId = section.id
  const snapStyle: React.CSSProperties = {
    scrollSnapAlign: "start",
    scrollSnapStop: "always",
  }

  switch (section.type) {
    case "hero": {
      const textX = (c.textX as number) ?? 50
      const textY = (c.textY as number) ?? 50
      const isCentered = textX === 50 && textY === 50

      return (
        <section
          id={sectionId}
          className="min-h-dvh relative"
          style={{ ...fontStyle, ...snapStyle }}
        >
          {isCentered ? (
            // Default: flexbox centered
            <div className="flex min-h-dvh flex-col items-center justify-center px-8 py-16 text-center">
              <Anim variant="fadeIn" delay={0}>
                <p className="mb-3 text-xs tracking-[0.4em] uppercase" style={{ color: primary, opacity: 0.7 }}>
                  The Wedding of
                </p>
              </Anim>
              <Anim variant="fadeUp" delay={160}>
                <h1 className="mb-6 text-5xl font-bold leading-tight" style={{ color: primary }}>
                  {inv.groomName}
                  <br />
                  <span style={{ color: accent, opacity: 0.8 }}>&</span>
                  <br />
                  {inv.brideName}
                </h1>
              </Anim>
              {(c.subtitle as string) && (
                <Anim variant="fadeUp" delay={300}>
                  <p className="text-base" style={{ opacity: 0.7 }}>{c.subtitle as string}</p>
                </Anim>
              )}
              <Anim variant="scaleIn" delay={420}>
                <div className="mt-8 h-px w-32" style={{ backgroundColor: primary, opacity: 0.3 }} />
              </Anim>
              <Anim variant="fadeIn" delay={520}>
                <p className="mt-4 text-sm" style={{ opacity: 0.6 }}>
                  {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Anim>
            </div>
          ) : (
            // Custom position
            <div
              className="absolute text-center"
              style={{
                left: `${textX}%`,
                top: `${textY}%`,
                transform: "translate(-50%, -50%)",
                width: "80%",
              }}
            >
              <Anim variant="fadeIn" delay={0}>
                <p className="mb-3 text-xs tracking-[0.4em] uppercase" style={{ color: primary, opacity: 0.7 }}>
                  The Wedding of
                </p>
              </Anim>
              <Anim variant="fadeUp" delay={160}>
                <h1 className="mb-6 text-5xl font-bold leading-tight" style={{ color: primary }}>
                  {inv.groomName}
                  <br />
                  <span style={{ color: accent, opacity: 0.8 }}>&</span>
                  <br />
                  {inv.brideName}
                </h1>
              </Anim>
              {(c.subtitle as string) && (
                <Anim variant="fadeUp" delay={300}>
                  <p className="text-base" style={{ opacity: 0.7 }}>{c.subtitle as string}</p>
                </Anim>
              )}
            </div>
          )}
        </section>
      )
    }

    case "couple": {
      const layout = (c.coupleLayout as string) ?? "side-by-side"
      const groomInstagram = c.groomInstagram as string | undefined
      const brideInstagram = c.brideInstagram as string | undefined

      const groomCard = (
        <div className="space-y-3 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gray-100">
            {(c.groomPhoto as string) && (
              <Image src={c.groomPhoto as string} alt="Groom" width={96} height={96} className="h-full w-full object-cover" />
            )}
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: primary }}>{inv.groomName}</h2>
          {(c.groomParents as string) && (
            <p className="text-sm" style={{ opacity: 0.6 }}>{c.groomParents as string}</p>
          )}
          {(c.groomBio as string) && (
            <p className="mx-auto max-w-xs text-sm leading-relaxed" style={{ opacity: 0.75 }}>{c.groomBio as string}</p>
          )}
          {groomInstagram && (
            <a
              href={`https://instagram.com/${groomInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm"
              style={{ color: primary, opacity: 0.7 }}
            >
              <Instagram className="h-3.5 w-3.5" />@{groomInstagram}
            </a>
          )}
        </div>
      )

      const brideCard = (
        <div className="space-y-3 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gray-100">
            {(c.bridePhoto as string) && (
              <Image src={c.bridePhoto as string} alt="Bride" width={96} height={96} className="h-full w-full object-cover" />
            )}
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: primary }}>{inv.brideName}</h2>
          {(c.brideParents as string) && (
            <p className="text-sm" style={{ opacity: 0.6 }}>{c.brideParents as string}</p>
          )}
          {(c.brideBio as string) && (
            <p className="mx-auto max-w-xs text-sm leading-relaxed" style={{ opacity: 0.75 }}>{c.brideBio as string}</p>
          )}
          {brideInstagram && (
            <a
              href={`https://instagram.com/${brideInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm"
              style={{ color: primary, opacity: 0.7 }}
            >
              <Instagram className="h-3.5 w-3.5" />@{brideInstagram}
            </a>
          )}
        </div>
      )

      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-8 text-xs tracking-[0.3em] uppercase" style={{ color: primary, opacity: 0.6 }}>
                The Couple
              </p>
            </Anim>
            {layout === "side-by-side" ? (
              <div className="flex justify-center gap-10">
                <Anim variant="slideLeft" delay={150}>{groomCard}</Anim>
                <Anim variant="scaleIn" delay={300} className="self-center">
                  <div className="text-3xl font-light" style={{ color: accent, opacity: 0.5 }}>&</div>
                </Anim>
                <Anim variant="slideRight" delay={150}>{brideCard}</Anim>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <Anim variant="fadeUp" delay={150}>{groomCard}</Anim>
                <Anim variant="scaleIn" delay={300}>
                  <div className="text-3xl font-light" style={{ color: accent, opacity: 0.5 }}>&</div>
                </Anim>
                <Anim variant="fadeUp" delay={450}>{brideCard}</Anim>
              </div>
            )}
          </div>
        </section>
      )
    }

    case "event": {
      type EventItem = { name: string; date: string; time: string }
      const events = (c.events as unknown as EventItem[]) ?? []
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-6 text-xs tracking-[0.3em] uppercase" style={{ color: primary, opacity: 0.6 }}>
                Save The Date
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={150}>
              <p className="mb-4 text-3xl font-bold" style={{ color: primary }}>
                {new Date(inv.eventDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={260}>
              <>
                <p className="mb-1 text-lg font-medium">{inv.eventVenue}</p>
                {inv.eventAddress && (
                  <p className="text-sm" style={{ opacity: 0.65 }}>{inv.eventAddress}</p>
                )}
              </>
            </Anim>
            {events.length > 0 && (
              <Anim variant="fadeUp" delay={380}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {events.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border px-5 py-4 text-center min-w-[120px]"
                      style={{ borderColor: `${primary}30` }}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: primary, opacity: 0.7 }}>
                        {ev.name || `Acara ${i + 1}`}
                      </p>
                      {ev.date && (
                        <p className="mt-1.5 text-sm font-medium">
                          {new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                      {ev.time && (
                        <p className="text-sm" style={{ opacity: 0.65 }}>{ev.time}</p>
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

    case "countdown":
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p className="mb-6 text-xs tracking-[0.3em] uppercase" style={{ color: primary, opacity: 0.6 }}>
              Counting Down
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={160}>
            <CountdownTimer eventDate={inv.eventDate} primaryColor={primary} />
          </Anim>
        </section>
      )

    case "rsvp":
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-2 text-center text-xs tracking-[0.3em] uppercase" style={{ color: primary, opacity: 0.6 }}>
                {(c.title as string) || "RSVP"}
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={120}>
              <p className="mb-6 text-center text-sm" style={{ opacity: 0.65 }}>
                Kindly confirm your attendance
              </p>
            </Anim>
            <Anim variant="fadeUp" delay={240}>
              <RsvpForm invitationId={inv.id} primaryColor={primary} deadline={c.deadline as string | undefined} />
            </Anim>
          </div>
        </section>
      )

    case "quote":
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-12 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <Anim variant="scaleIn" delay={0}>
            <p className="mb-4 text-xs" style={{ color: primary, opacity: 0.5 }}>✦</p>
          </Anim>
          <Anim variant="fadeUp" delay={160}>
            <blockquote
              className="mx-auto max-w-sm text-base italic leading-relaxed"
              style={{ color: primary, opacity: 0.85 }}
            >
              &ldquo;{c.quote as string}&rdquo;
            </blockquote>
          </Anim>
          {!!c.source && (
            <Anim variant="fadeIn" delay={360}>
              <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: primary, opacity: 0.55 }}>
                — {c.source as string}
              </p>
            </Anim>
          )}
        </section>
      )

    case "maps": {
      const lat = parseFloat(c.lat as string)
      const lng = parseFloat(c.lng as string)
      const hasCoords = !isNaN(lat) && !isNaN(lng)
      const gmapsUrl = hasCoords
        ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        : null
      const directionsUrl = hasCoords
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : null
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-10 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <div className="max-w-lg mx-auto w-full">
            <Anim variant="fadeIn" delay={0}>
              <p className="mb-4 text-xs uppercase tracking-widest" style={{ color: primary, opacity: 0.6 }}>
                {(c.label as string) || "Lokasi Acara"}
              </p>
            </Anim>
            {gmapsUrl && (
              <Anim variant="fadeUp" delay={150}>
                <div className="overflow-hidden rounded-2xl">
                  <iframe
                    src={gmapsUrl}
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Anim>
            )}
            {(c.address as string) && (
              <Anim variant="fadeIn" delay={280}>
                <p className="mt-3 text-sm" style={{ opacity: 0.65 }}>{c.address as string}</p>
              </Anim>
            )}
            {directionsUrl && (
              <Anim variant="fadeUp" delay={380}>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ borderColor: primary, color: primary }}
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </Anim>
            )}
          </div>
        </section>
      )
    }

    case "closing":
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-20 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <Anim variant="fadeUp" delay={0}>
            <p className="mx-auto max-w-xs text-base leading-relaxed" style={{ opacity: 0.7 }}>
              {(c.message as string) || "We look forward to celebrating with you."}
            </p>
          </Anim>
          <Anim variant="scaleIn" delay={220}>
            <p className="mt-8 text-xl font-semibold" style={{ color: primary }}>
              {inv.groomName} & {inv.brideName}
            </p>
          </Anim>
        </section>
      )

    case "gallery": {
      const images = (section.content as { images?: string[] }).images ?? []
      if (images.length === 0) return null
      const galleryItems = images.map((url, i) => ({
        id: String(i),
        img: url,
      }))
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center py-12 text-center"
          style={{ ...fontStyle, ...snapStyle }}
        >
          <Anim variant="fadeIn" delay={0}>
            <p
              className="mb-6 text-xs tracking-[0.3em] uppercase"
              style={{ color: primary, opacity: 0.6 }}
            >
              Gallery
            </p>
          </Anim>
          <div className="w-full px-4">
            <Masonry
              items={galleryItems}
              animateFrom="bottom"
              stagger={0.05}
              blurToFocus={true}
              maxColumns={2}
            />
          </div>
        </section>
      )
    }

    case "gift": {
      const banks = (c.banks as import("@/components/invitation/gift-section").BankAccount[]) ?? []
      return (
        <section
          id={sectionId}
          className="min-h-dvh flex flex-col items-center justify-center px-8 py-16"
          style={{ ...fontStyle, ...snapStyle }}
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
                primaryColor={primary}
                accentColor={accent}
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
