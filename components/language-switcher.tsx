"use client"

import { useLocale } from "@/components/locale-provider"
import type { Locale } from "@/lib/i18n/translations"

// ── SVG Flags ────────────────────────────────────────────────────────────────

function IDFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bahasa Indonesia"
    >
      <rect width="30" height="10" fill="#CE1126" />
      <rect y="10" width="30" height="10" fill="#FFFFFF" />
    </svg>
  )
}

function ENFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="English"
    >
      {/* Blue background */}
      <rect width="30" height="20" fill="#012169" />
      {/* St Andrew's cross — white diagonals */}
      <line x1="0" y1="0" x2="30" y2="20" stroke="white" strokeWidth="4" />
      <line x1="30" y1="0" x2="0" y2="20" stroke="white" strokeWidth="4" />
      {/* St Patrick's cross — red counter-diagonals (simplified, offset) */}
      <line x1="0" y1="0" x2="30" y2="20" stroke="#C8102E" strokeWidth="2.4" strokeDasharray="15,30" strokeDashoffset="8" />
      <line x1="30" y1="0" x2="0" y2="20" stroke="#C8102E" strokeWidth="2.4" strokeDasharray="15,30" strokeDashoffset="-8" />
      {/* St George's cross — white */}
      <rect x="12" y="0" width="6" height="20" fill="white" />
      <rect x="0" y="7" width="30" height="6" fill="white" />
      {/* St George's cross — red */}
      <rect x="13" y="0" width="4" height="20" fill="#C8102E" />
      <rect x="0" y="8" width="30" height="4" fill="#C8102E" />
    </svg>
  )
}

// ── Flag map ──────────────────────────────────────────────────────────────────

const FLAG_MAP: Record<Locale, { Flag: typeof IDFlag; label: string; short: string }> = {
  id: { Flag: IDFlag, label: "Bahasa Indonesia", short: "ID" },
  en: { Flag: ENFlag, label: "English", short: "EN" },
}

// ── Switcher ──────────────────────────────────────────────────────────────────

interface LanguageSwitcherProps {
  /** Compact mode: just flag + short code (default). Full mode shows label */
  compact?: boolean
  className?: string
}

export function LanguageSwitcher({ compact = true, className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale()
  const next: Locale = locale === "id" ? "en" : "id"
  const { Flag, short, label } = FLAG_MAP[next]

  return (
    <button
      onClick={() => setLocale(next)}
      title={`Switch to ${label}`}
      className={`flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground ${className ?? ""}`}
    >
      <Flag className="h-3.5 w-5 rounded-[2px]" />
      {compact ? <span>{short}</span> : <span>{label}</span>}
    </button>
  )
}
