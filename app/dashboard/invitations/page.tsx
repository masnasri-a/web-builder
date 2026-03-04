import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { InvitationCard } from "@/components/dashboard/invitation-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Plus } from "lucide-react"

export default async function InvitationsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const invitations = await db.invitation.findMany({
    where: { userId: session.user.id },
    include: {
      theme: { select: { name: true } },
      _count: { select: { guests: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="My Invitations"
        description="Manage and publish your wedding invitations"
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}
          </p>
          <Button asChild>
            <Link href="/dashboard/invitations/new">
              <Plus className="h-4 w-4" />
              New Invitation
            </Link>
          </Button>
        </div>

        {invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <Heart className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="mb-1 font-semibold">No invitations yet</p>
            <p className="mb-5 text-sm text-muted-foreground">
              Create your first digital wedding invitation
            </p>
            <Button asChild>
              <Link href="/dashboard/invitations/new">
                <Plus className="h-4 w-4" />
                Create Invitation
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                id={inv.id}
                slug={inv.slug}
                groomName={inv.groomName}
                brideName={inv.brideName}
                eventDate={inv.eventDate}
                isPublished={inv.isPublished}
                guestCount={inv._count.guests}
                themeName={inv.theme.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
