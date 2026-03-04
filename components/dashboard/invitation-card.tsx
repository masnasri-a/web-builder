import Link from "next/link"
import { formatDistanceToNow } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ExternalLink, Pencil } from "lucide-react"

interface InvitationCardProps {
  id: string
  slug: string
  groomName: string
  brideName: string
  eventDate: Date
  isPublished: boolean
  guestCount: number
  themeName: string
}

export function InvitationCard({
  id,
  slug,
  groomName,
  brideName,
  eventDate,
  isPublished,
  guestCount,
  themeName,
}: InvitationCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Couple initials avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
          {groomName[0]}
          {brideName[0]}
        </div>

        <div>
          <p className="font-semibold">
            {groomName} & {brideName}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(eventDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {themeName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 sm:flex">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{guestCount}</span>
        </div>

        <Badge
          variant={isPublished ? "default" : "secondary"}
          className="rounded-lg"
        >
          {isPublished ? "Live" : "Draft"}
        </Badge>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" asChild>
            <Link href={`/dashboard/invitations/${id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          {isPublished && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" asChild>
              <Link href={`/${slug}`} target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
