import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { invitations: true } },
    },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          {users.length} total users
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Role</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Tier</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Invitations</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Joined</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{user.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium ${
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
                <td className="px-5 py-3.5 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                    user.isSuspended
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {user.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <SuspendButton userId={user.id} isSuspended={user.isSuspended} />
                    <UpgradeButton userId={user.id} currentTier={user.tier} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SuspendButton({
  userId,
  isSuspended,
}: {
  userId: string
  isSuspended: boolean
}) {
  async function toggle() {
    "use server"
    await db.user.update({
      where: { id: userId },
      data: { isSuspended: !isSuspended },
    })
  }

  return (
    <form action={toggle}>
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

function UpgradeButton({
  userId,
  currentTier,
}: {
  userId: string
  currentTier: string
}) {
  async function upgrade() {
    "use server"
    const nextTier =
      currentTier === "FREE" ? "PRO" : currentTier === "PRO" ? "UNLIMITED" : "FREE"
    await db.user.update({
      where: { id: userId },
      data: { tier: nextTier as "FREE" | "PRO" | "UNLIMITED" },
    })
  }

  if (currentTier === "UNLIMITED") return null

  return (
    <form action={upgrade}>
      <button
        type="submit"
        className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
      >
        → {currentTier === "FREE" ? "PRO" : "UNLIMITED"}
      </button>
    </form>
  )
}
