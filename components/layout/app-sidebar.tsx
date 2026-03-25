"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LogOut, Sparkles, Plus,
  LayoutDashboard, Users, Palette, Heart,
  Tag, MessageCircle, Settings2, Mail,
  Gift, CreditCard, BarChart3, Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type NavItem = { href: string; label: string; icon: React.ElementType }

// All nav configs live here in the client component — icons are never serialized
const NAV_CONFIGS: Record<string, NavItem[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/themes", label: "Themes", icon: Palette },
  ],
  "super-admin": [
    { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/super-admin/vendors", label: "Vendors", icon: Users },
    { href: "/super-admin/vouchers", label: "Vouchers", icon: Tag },
    { href: "/super-admin/tiers", label: "Tier Config", icon: Settings2 },
    { href: "/super-admin/faq", label: "FAQ & Support", icon: MessageCircle },
  ],
  vendor: [
    { href: "/vendor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/invitations", label: "Undangan", icon: Mail },
    { href: "/vendor/vouchers", label: "My Vouchers", icon: Tag },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  ],
  individual: [
    { href: "/individual", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/invitations", label: "Undangan", icon: Mail },
    { href: "/individual/claim", label: "Claim Voucher", icon: Gift },
    { href: "/individual/my-vouchers", label: "My Vouchers", icon: Tag },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  ],
  dashboard: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/invitations", label: "Invitations", icon: Heart },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/billing", label: "Billing & Upgrade", icon: CreditCard },
  ],
}

const SECTION_LABELS: Record<string, string> = {
  admin: "Admin CMS",
  "super-admin": "Super Admin",
  vendor: "Vendor Portal",
  individual: "Individual",
  dashboard: "Dashboard",
}

export function AppSidebar({
  section,
  actionButton,
}: {
  section: keyof typeof NAV_CONFIGS
  actionButton?: { href: string; label: string }
}) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = NAV_CONFIGS[section] ?? []
  const sectionLabel = SECTION_LABELS[section] ?? ""

  const initials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : (session?.user?.email?.[0]?.toUpperCase() ?? "U")

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-card px-4 py-6">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Selembar.id</p>
          <p className="text-[10px] text-muted-foreground leading-tight">{sectionLabel}</p>
        </div>
      </Link>

      {/* Optional action button */}
      {actionButton && (
        <Button asChild size="sm" className="mb-6 w-full rounded-xl">
          <Link href={actionButton.href}>
            <Plus className="h-4 w-4" />
            {actionButton.label}
          </Link>
        </Button>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === pathname ||
            (href !== "/" &&
              pathname.startsWith(href) &&
              (pathname[href.length] === "/" || pathname.length === href.length))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{session?.user?.name ?? "User"}</p>
            <p className="truncate text-[11px] text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
