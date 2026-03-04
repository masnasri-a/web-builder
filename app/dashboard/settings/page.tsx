import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { db } from "@/lib/db"

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, tier: true, createdAt: true },
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Settings" />
      <div className="p-6 max-w-lg space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">Account Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{user?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plan</dt>
              <dd>
                <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {user?.tier}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
