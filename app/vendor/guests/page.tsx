import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { RsvpViewer } from "@/components/guests/rsvp-viewer"

export default async function VendorGuestsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const invitations = await db.invitation.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true, slug: true },
    orderBy: { createdAt: "desc" },
  })

  if (invitations.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground text-sm">
        Belum ada undangan. Buat undangan terlebih dahulu.
      </div>
    )
  }

  return <RsvpViewer invitations={invitations} />
}
