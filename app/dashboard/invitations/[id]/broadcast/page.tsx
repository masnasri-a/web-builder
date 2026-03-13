import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { BroadcastPanel } from "@/components/builder/broadcast-panel"
import type { Section } from "@/types"

export default async function BroadcastPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const inv = await db.invitation.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!inv) notFound()

  // Extract maps URL from the maps section (if coordinates are set)
  const sections = inv.sections as Section[]
  const mapsSection = sections.find((s) => s.type === "maps")
  const mapsContent = mapsSection?.content as { lat?: string; lng?: string } | undefined
  const lat = parseFloat(mapsContent?.lat ?? "")
  const lng = parseFloat(mapsContent?.lng ?? "")
  const mapsUrl =
    !isNaN(lat) && !isNaN(lng)
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : null

  return (
    <div className="flex h-full flex-col">
      <BroadcastPanel
        invitationId={inv.id}
        slug={inv.slug}
        groomName={inv.groomName}
        brideName={inv.brideName}
        isPublished={inv.isPublished}
        eventDate={inv.eventDate.toISOString()}
        eventVenue={inv.eventVenue}
        eventAddress={inv.eventAddress}
        mapsUrl={mapsUrl}
      />
    </div>
  )
}
