import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { PreviewViewport } from "@/components/builder/preview-viewport"
import { GuestSections } from "@/components/invitation/guest-sections"
import { FontLoader } from "@/components/invitation/font-loader"
import type { Section, ThemeConfig } from "@/types"

export default async function InvitationPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const inv = await db.invitation.findFirst({
    where: { id, userId: session.user.id },
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

  const bodyStyle = {
    backgroundColor: themeConfig.bgColor,
    backgroundImage: themeConfig.bgImage ? `url(${themeConfig.bgImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: `"${themeConfig.fontFamily}", Georgia, serif`,
    minHeight: "100%",
  } as React.CSSProperties

  return (
    <PreviewViewport builderId={id}>
      <FontLoader fontFamily={fonts} />
      <div style={bodyStyle}>
        {inv.musicUrl && (
          <audio src={inv.musicUrl} autoPlay loop className="hidden" />
        )}
        <div className="mx-auto max-w-lg">
          <GuestSections
            sections={visible}
            inv={{
              id: inv.id,
              groomName: inv.groomName,
              brideName: inv.brideName,
              eventDate: inv.eventDate.toISOString(),
              eventVenue: inv.eventVenue,
              eventAddress: inv.eventAddress,
            }}
            themeConfig={themeConfig}
          />
        </div>
      </div>
    </PreviewViewport>
  )
}

