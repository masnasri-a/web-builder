import { db } from "@/lib/db"
import { StatCard } from "@/components/dashboard/stat-card"
import { Users, Heart, CreditCard, TrendingUp } from "lucide-react"
import { MusicManagerWrapper } from "@/components/admin/music-manager-wrapper"

export default async function AdminPage() {
  const [totalUsers, totalInvitations, liveInvitations, totalGuests] =
    await Promise.all([
      db.user.count(),
      db.invitation.count(),
      db.invitation.count({ where: { isPublished: true } }),
      db.guest.count(),
    ])

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      name: true,
      email: true,
      tier: true,
      role: true,
      isSuspended: true,
      createdAt: true,
      _count: { select: { invitations: true } },
    },
  })

  const recentInvitations = await db.invitation.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { guests: true } },
    },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview</p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          trend={{ value: "Platform total", positive: true }}
        />
        <StatCard
          title="Live Invitations"
          value={liveInvitations}
          subtitle={`${totalInvitations} total`}
          icon={Heart}
        />
        <StatCard
          title="Total RSVPs"
          value={totalGuests}
          icon={TrendingUp}
        />
        <StatCard
          title="Pro Subscribers"
          value={0}
          subtitle="Coming soon"
          icon={CreditCard}
          variant="teal"
        />
      </div>

      {/* Music Upload */}
      <section>
        <MusicManagerWrapper />
      </section>

      {/* Recent Users */}
      <section>
        <h2 className="mb-4 text-base font-semibold">Recent Users</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Tier</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Invitations</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{user.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                      user.tier === "UNLIMITED"
                        ? "bg-primary/10 text-primary"
                        : user.tier === "PRO"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {user._count.invitations}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                      user.isSuspended
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <UserActionButton userId={user.id} isSuspended={user.isSuspended} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Invitations */}
      <section>
        <h2 className="mb-4 text-base font-semibold">Recent Invitations</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Couple</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Owner</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">RSVPs</th>
              </tr>
            </thead>
            <tbody>
              {recentInvitations.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5 font-medium">
                    {inv.groomName} & {inv.brideName}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {inv.user.name ?? inv.user.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                      inv.isPublished
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {inv.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">
                    {inv._count.guests}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

// Simple server action button for suspend/unsuspend
function UserActionButton({
  userId,
  isSuspended,
}: {
  userId: string
  isSuspended: boolean
}) {
  async function toggleSuspend() {
    "use server"
    await db.user.update({
      where: { id: userId },
      data: { isSuspended: !isSuspended },
    })
  }

  return (
    <form action={toggleSuspend}>
      <button
        type="submit"
        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
          isSuspended
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-red-50 text-red-700 hover:bg-red-100"
        }`}
      >
        {isSuspended ? "Unsuspend" : "Suspend"}
      </button>
    </form>
  )
}
