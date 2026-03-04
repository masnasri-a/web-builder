import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { GuestLimitBar } from "@/components/dashboard/guest-limit-bar"
import { InvitationCard } from "@/components/dashboard/invitation-card"
import { Heart, Users, BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      invitations: {
        include: {
          theme: { select: { name: true } },
          _count: { select: { guests: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) redirect("/login")

  const totalGuests = user.invitations.reduce(
    (acc, inv) => acc + inv._count.guests,
    0
  )
  const liveInvitations = user.invitations.filter((i) => i.isPublished).length
  const recentGuests = await db.guest.findMany({
    where: { invitation: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { invitation: { select: { groomName: true, brideName: true } } },
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Dashboard"
        description={`Welcome back, ${user.name ?? "there"}!`}
      />

      <div className="p-6 space-y-6">
        {/* Bento Grid — Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Invitations"
            value={liveInvitations}
            subtitle={`${user.invitations.length} total`}
            icon={Heart}
          />
          <StatCard
            title="Total RSVPs"
            value={totalGuests}
            subtitle="All invitations"
            icon={Users}
            trend={
              totalGuests > 0
                ? { value: `${totalGuests} guests`, positive: true }
                : undefined
            }
          />
          <StatCard
            title="Themes Available"
            value="12+"
            subtitle="Choose your style"
            icon={Sparkles}
          />
          <StatCard
            title="Upgrade Plan"
            value="$9.99"
            subtitle="Per Month"
            variant="teal"
          />
        </div>

        {/* Guest Limit Bar */}
        <GuestLimitBar
          used={totalGuests}
          tier={user.tier as "FREE" | "PRO" | "UNLIMITED"}
        />

        {/* Recent Invitations */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Invitations</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/invitations">View all</Link>
            </Button>
          </div>

          {user.invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
              <Heart className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium">No invitations yet</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first digital wedding invitation
              </p>
              <Button asChild>
                <Link href="/dashboard/invitations/new">
                  Create Invitation
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {user.invitations.map((inv) => (
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
        </section>

        {/* Recent RSVPs */}
        {recentGuests.length > 0 && (
          <section>
            <h2 className="mb-4 text-base font-semibold">Recent RSVPs</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Guest
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Invitation
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3.5 font-medium">{guest.name}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {guest.invitation.groomName} &{" "}
                        {guest.invitation.brideName}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                            guest.attendance === "ATTENDING"
                              ? "bg-emerald-50 text-emerald-700"
                              : guest.attendance === "NOT_ATTENDING"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {guest.attendance === "ATTENDING"
                            ? "Attending"
                            : guest.attendance === "NOT_ATTENDING"
                              ? "Not Attending"
                              : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-muted-foreground">
                        {guest.guestCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
