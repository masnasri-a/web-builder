"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"

export function DashboardSidebar() {
  return (
    <AppSidebar
      section="dashboard"
      actionButton={{ href: "/dashboard/invitations/new", label: "New Invitation" }}
    />
  )
}
