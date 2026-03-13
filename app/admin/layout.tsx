import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Palette,
  Heart,
  Sparkles,
} from "lucide-react"

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/invitations", label: "Invitations", icon: Heart },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Admin Sidebar */}
      <aside className="flex h-full w-60 flex-col border-r border-border bg-card px-4 py-6">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Selembar.id</p>
            <p className="text-[10px] text-muted-foreground">Admin CMS</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Control Center
          </p>
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
