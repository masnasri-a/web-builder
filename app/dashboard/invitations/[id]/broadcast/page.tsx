import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { BroadcastPanel } from "@/components/builder/broadcast-panel"

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

  return (
    <div className="flex h-full flex-col">
      <BroadcastPanel
        invitationId={inv.id}
        slug={inv.slug}
        groomName={inv.groomName}
        brideName={inv.brideName}
        isPublished={inv.isPublished}
      />
    </div>
  )
}
