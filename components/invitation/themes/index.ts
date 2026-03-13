/**
 * Wedding Invitation Theme Templates — Index
 * Exports all theme components, shared types, and helpers.
 */

import type { GuestInvitation } from "@/components/invitation/guest-sections"
import type { Section, ThemeConfig } from "@/types"

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface ThemeTemplateProps {
  /** Core invitation data (names, date, venue) */
  inv: GuestInvitation
  /** Visible sections, pre-sorted by order */
  sections: Section[]
  /** Current theme config (colors, font) — themes may use fontFamily from this */
  themeConfig: ThemeConfig
  /** Builder only: currently selected section id for highlight */
  activeSection?: string | null
  /** Builder only: callback when a section is clicked */
  onSectionClick?: (sectionId: string) => void
}

/** Returns the first visible section matching the given type, or undefined */
export function getSectionByType(
  sections: Section[],
  type: string
): Section | undefined {
  return sections.find((s) => s.type === type)
}

// ─── Theme exports ────────────────────────────────────────────────────────────

export { ChineseStyleTheme } from "./ChineseStyleTheme"
export { RamadanIslamicTheme } from "./RamadanIslamicTheme"
export { RomanticFloralTheme } from "./RomanticFloralTheme"
export { RoyalGlamourTheme } from "./RoyalGlamourTheme"
export { PhinisiMaroonTheme } from "./PhinisiMaroonTheme"
export { ChestnutArtTheme } from "./ChestnutArtTheme"
export { BungaBungaTheme } from "./BungaBungaTheme"
export { BlueJavaTheme } from "./BlueJavaTheme"
export { CelestiaTheme } from "./CelestiaTheme"
export { PremiumBlueTheme } from "./PremiumBlueTheme"
export { SerenityBlossomTheme } from "./SerenityBlossomTheme"
export { PastelRoseTheme } from "./PastelRoseTheme"
