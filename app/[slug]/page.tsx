import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { GuestPageClient } from "@/components/invitation/guest-page-client"
import type { Section, ThemeConfig } from "@/types"

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

  return {
    title: `${inv.groomName} & ${inv.brideName} — Wedding Invitation`,
    description: `Join us for the wedding of ${inv.groomName} and ${inv.brideName} at ${inv.eventVenue}.`,
    openGraph: {
      title: `${inv.groomName} & ${inv.brideName}`,
      description: `You're invited to celebrate our wedding!`,
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

  return (
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
    />
  )
}
