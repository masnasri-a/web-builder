"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FREE_TIER_LIMIT, PRO_TIER_LIMIT } from "@/types"

interface GuestLimitBarProps {
  used: number
  tier: "FREE" | "PRO" | "UNLIMITED"
}

export function GuestLimitBar({ used, tier }: GuestLimitBarProps) {
  if (tier === "UNLIMITED") return null

  const limit = tier === "FREE" ? FREE_TIER_LIMIT : PRO_TIER_LIMIT
  const percent = Math.min((used / limit) * 100, 100)
  const isNearLimit = percent >= 80

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">RSVP Slots</span>
        </div>
        <span
          className={`text-sm font-semibold ${isNearLimit ? "text-destructive" : "text-foreground"}`}
        >
          {used}/{limit}
        </span>
      </div>

      <Progress
        value={percent}
        className={`mt-3 h-2 ${isNearLimit ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`}
      />

      {isNearLimit && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {tier === "FREE"
              ? "Upgrade to Pro for 100 slots"
              : "Upgrade for unlimited slots"}
          </p>
          <Button asChild size="sm" className="h-7 rounded-lg text-xs">
            <Link href="/dashboard/billing">Upgrade</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
