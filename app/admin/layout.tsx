import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { isAdminRole } from "@/lib/utils"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || !isAdminRole(session.user.role)) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar section="admin" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
