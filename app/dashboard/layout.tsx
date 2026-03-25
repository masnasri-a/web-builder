import { auth } from "@/lib/auth"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { checkAndExpireSubscription } from "@/lib/subscription"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const role = session?.user?.role

  // Silently expire any overdue subscription on every dashboard load.
  // Server Components always read tier from DB directly, so the UI updates immediately
  // even though the JWT token will reflect the correct tier only on next sign-in.
  if (session?.user?.id) {
    await checkAndExpireSubscription(session.user.id)
  }

  const sidebar =
    role === "VENDOR" ? (
      <AppSidebar section="vendor" />
    ) : role === "INDIVIDUAL" ? (
      <AppSidebar section="individual" />
    ) : (
      <DashboardSidebar />
    )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex">{sidebar}</div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
