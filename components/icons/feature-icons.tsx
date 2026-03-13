/**
 * Minimalist SVG feature icons for the landing page.
 * Each icon is a simple 24×24 SVG outline.
 */

interface IconProps {
  className?: string
}

export function BuilderIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Two stacked layers */}
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M2 14l10 5 10-5" />
      <path d="M2 19l10 5 10-5" opacity="0.4" />
    </svg>
  )
}

export function RsvpIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Envelope with check */}
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 8l10 7 10-7" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  )
}

export function MusicIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Music note */}
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function CountdownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Clock face */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <path d="M9.5 3.5l1 1.5" opacity="0.4" />
      <path d="M14.5 3.5l-1 1.5" opacity="0.4" />
    </svg>
  )
}

export function MobileIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Smartphone */}
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M10 18h4" />
      <line x1="6" y1="6" x2="18" y2="6" />
      <line x1="6" y1="15" x2="18" y2="15" />
    </svg>
  )
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Chain link */}
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
