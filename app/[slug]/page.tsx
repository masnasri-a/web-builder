import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { GuestPageClient } from "@/components/invitation/guest-page-client"
import type { Section, ThemeConfig } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://selembar.id"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const inv = await db.invitation.findUnique({
    where: { slug, isPublished: true },
  })

  if (!inv) return { title: "Invitation Not Found" }

  const title = `Undangan Pernikahan ${inv.groomName} & ${inv.brideName}`
  const description = `Dengan penuh kebahagiaan, kami mengundang Anda untuk menyaksikan pernikahan ${inv.groomName} dan ${inv.brideName} di ${inv.eventVenue}.`
  const url = `${BASE_URL}/${slug}`

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: `/api/og?slug=${slug}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function GuestPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ to?: string }>
}) {
  const [{ slug }, { to: guestName }] = await Promise.all([params, searchParams])

  const inv = await db.invitation.findUnique({
    where: { slug, isPublished: true },
    include: { theme: true },
  })

  if (!inv) notFound()

  const sections = inv.sections as Section[]
  const themeConfig = inv.themeConfig as ThemeConfig
  const visible = [...sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)

  const sectionFonts = visible
    .map((s) => (s.content as { fontFamily?: string }).fontFamily)
    .filter(Boolean) as string[]
  const fonts = [themeConfig.fontFamily, ...sectionFonts]

  // JSON-LD structured data for wedding event
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Wedding of ${inv.groomName} & ${inv.brideName}`,
    startDate: inv.eventDate.toISOString(),
    location: {
      "@type": "Place",
      name: inv.eventVenue,
      address: inv.eventAddress ?? inv.eventVenue,
    },
    organizer: {
      "@type": "Organization",
      name: "Selembar.id",
      url: BASE_URL,
    },
    url: `${BASE_URL}/${slug}`,
    description: `Wedding invitation for ${inv.groomName} & ${inv.brideName}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuestPageClient
        inv={{
          id: inv.id,
          groomName: inv.groomName,
          brideName: inv.brideName,
          eventDate: inv.eventDate.toISOString(),
          eventVenue: inv.eventVenue,
          eventAddress: inv.eventAddress,
        }}
        sections={visible}
        themeConfig={themeConfig}
        fonts={fonts}
        guestName={guestName}
        musicUrl={inv.musicUrl}
        themeSlug={inv.theme?.slug}
      />
    </>
  )
}
