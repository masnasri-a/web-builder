import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: { value: string; positive: boolean }
  variant?: "default" | "teal" | "orange"
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm",
        variant === "teal" && "border-0 bg-primary text-primary-foreground",
        variant === "orange" && "border-0 bg-[oklch(0.698_0.187_44.6)] text-white",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-widest",
              variant === "default" ? "text-muted-foreground" : "opacity-75"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-sm",
                variant === "default" ? "text-muted-foreground" : "opacity-80"
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                variant === "default"
                  ? trend.positive
                    ? "text-emerald-600"
                    : "text-destructive"
                  : "opacity-80"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "rounded-xl p-2.5",
              variant === "default" && "bg-muted"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                variant === "default" ? "text-muted-foreground" : "opacity-90"
              )}
            />
          </div>
        )}
      </div>

      {/* Decorative star for teal variant */}
      {variant === "teal" && (
        <span className="absolute right-4 top-4 text-2xl opacity-60">✦</span>
      )}
    </div>
  )
}
