import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { BuilderShell } from "@/components/builder/builder-shell"
import type { InvitationWithRelations } from "@/types"

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const inv = await db.invitation.findFirst({
    where: { id, userId: session.user.id },
    include: {
      theme: true,
      guests: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  })

  if (!inv) notFound()

  // Cast DB types to our typed shape
  const invitation: InvitationWithRelations = {
    ...inv,
    sections: inv.sections as InvitationWithRelations["sections"],
    themeConfig: inv.themeConfig as InvitationWithRelations["themeConfig"],
    theme: {
      ...inv.theme,
      config: inv.theme.config as InvitationWithRelations["theme"]["config"],
    },
    guests: inv.guests.map((g) => ({
      ...g,
      attendance: g.attendance as "PENDING" | "ATTENDING" | "NOT_ATTENDING",
    })),
  }

  return <BuilderShell invitation={invitation} />
}
