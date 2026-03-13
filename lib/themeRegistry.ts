/**
 * Theme Registry
 * Maps theme slugs (matching Theme.slug in DB) to React components + metadata.
 * Used in CenterPreview (builder) and GuestPageClient (public page).
 */

import type { ComponentType } from "react"
import type { ThemeConfig } from "@/types"
import type { ThemeTemplateProps } from "@/components/invitation/themes"
import {
  ChineseStyleTheme,
  RamadanIslamicTheme,
  RomanticFloralTheme,
  RoyalGlamourTheme,
  PhinisiMaroonTheme,
  ChestnutArtTheme,
  BungaBungaTheme,
  BlueJavaTheme,
  CelestiaTheme,
  PremiumBlueTheme,
  SerenityBlossomTheme,
  PastelRoseTheme,
} from "@/components/invitation/themes"

export interface ThemeRegistryEntry {
  /** Must match Theme.slug in the database */
  id: string
  name: string
  tags: string[]
  /** Hex colour used as swatch in the admin dropdown */
  previewColor: string
  component: ComponentType<ThemeTemplateProps>
  defaultConfig: ThemeConfig
}

export const themeRegistry: ThemeRegistryEntry[] = [
  {
    id: "chinese-style",
    name: "Chinese Style",
    tags: ["tionghoa", "chinese", "tradisional", "imlek"],
    previewColor: "#C0392B",
    component: ChineseStyleTheme,
    defaultConfig: {
      primaryColor: "#C0392B",
      secondaryColor: "#FFF8E7",
      accentColor: "#D4AF37",
      fontFamily: "Cinzel",
      bgColor: "#FFF8E7",
    },
  },
  {
    id: "ramadan-islamic",
    name: "Ramadan Islamic",
    tags: ["islami", "akad", "nikah", "ramadan"],
    previewColor: "#1A5C38",
    component: RamadanIslamicTheme,
    defaultConfig: {
      primaryColor: "#1A5C38",
      secondaryColor: "#FAF6EE",
      accentColor: "#C9A84C",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FAF6EE",
    },
  },
  {
    id: "romantic-floral",
    name: "Romantic Floral",
    tags: ["romantic", "garden", "floral", "feminine"],
    previewColor: "#C47C8A",
    component: RomanticFloralTheme,
    defaultConfig: {
      primaryColor: "#C47C8A",
      secondaryColor: "#FFFAF5",
      accentColor: "#A8C5A0",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FFFAF5",
    },
  },
  {
    id: "royal-glamour",
    name: "Royal Glamour",
    tags: ["formal", "mewah", "gala", "elegant"],
    previewColor: "#C9A84C",
    component: RoyalGlamourTheme,
    defaultConfig: {
      primaryColor: "#C9A84C",
      secondaryColor: "#F5E6C8",
      accentColor: "#6B0F1A",
      fontFamily: "Cinzel",
      bgColor: "#0D1B4B",
    },
  },

  // ── Satu Momen–inspired ───────────────────────────────────────────────────
  {
    id: "phinisi-maroon",
    name: "Phinisi Maroon",
    tags: ["bugis", "makassar", "heritage", "coastal", "maritim"],
    previewColor: "#7D1535",
    component: PhinisiMaroonTheme,
    defaultConfig: {
      primaryColor: "#7D1535",
      secondaryColor: "#F9F1E8",
      accentColor: "#C49A45",
      fontFamily: "Cinzel",
      bgColor: "#F9F1E8",
    },
  },
  {
    id: "chestnut-art",
    name: "Chestnut Art",
    tags: ["bohemian", "artistic", "earthy", "gallery", "natural"],
    previewColor: "#8B4513",
    component: ChestnutArtTheme,
    defaultConfig: {
      primaryColor: "#8B4513",
      secondaryColor: "#FDF5EE",
      accentColor: "#C4683A",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FDF5EE",
    },
  },
  {
    id: "bunga-bunga",
    name: "Bunga Bunga",
    tags: ["tropical", "floral", "colorful", "festive", "garden"],
    previewColor: "#D4456C",
    component: BungaBungaTheme,
    defaultConfig: {
      primaryColor: "#D4456C",
      secondaryColor: "#FFFBF0",
      accentColor: "#2D8B4E",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FFFBF0",
    },
  },

  // ── New themes ────────────────────────────────────────────────────────────
  {
    id: "blue-java",
    name: "Blue Java",
    tags: ["batik", "jawa", "indigo", "tradisional", "heritage"],
    previewColor: "#1E3566",
    component: BlueJavaTheme,
    defaultConfig: {
      primaryColor: "#1E3566",
      secondaryColor: "#F5F0E6",
      accentColor: "#C8A84B",
      fontFamily: "Cinzel",
      bgColor: "#F5F0E6",
    },
  },
  {
    id: "celestia",
    name: "Celestia",
    tags: ["celestial", "malam", "bintang", "mewah", "gelap"],
    previewColor: "#E8C547",
    component: CelestiaTheme,
    defaultConfig: {
      primaryColor: "#C8D4E0",
      secondaryColor: "#0E1F42",
      accentColor: "#E8C547",
      fontFamily: "Cormorant Garamond",
      bgColor: "#080E1C",
    },
  },
  {
    id: "premium-blue",
    name: "Premium Blue",
    tags: ["premium", "formal", "royal", "navy", "elegant"],
    previewColor: "#1B3A7A",
    component: PremiumBlueTheme,
    defaultConfig: {
      primaryColor: "#1B3A7A",
      secondaryColor: "#EEF2FF",
      accentColor: "#C9A84C",
      fontFamily: "Cinzel",
      bgColor: "#F8F4EE",
    },
  },
  {
    id: "serenity-blossom",
    name: "Serenity Blossom",
    tags: ["sakura", "lavender", "japanese", "soft", "floral"],
    previewColor: "#E8849A",
    component: SerenityBlossomTheme,
    defaultConfig: {
      primaryColor: "#E8849A",
      secondaryColor: "#FAFAF5",
      accentColor: "#9B8EC4",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FAFAF5",
    },
  },
  {
    id: "pastel-rose",
    name: "Pastel Rose",
    tags: ["pastel", "rose", "lembut", "modern", "romantic"],
    previewColor: "#E8A0B0",
    component: PastelRoseTheme,
    defaultConfig: {
      primaryColor: "#E8A0B0",
      secondaryColor: "#F5C8D0",
      accentColor: "#B8C8B8",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FFF8F6",
    },
  },
]

/** Returns the registry entry matching the given theme slug, or undefined. */
export function getThemeBySlug(slug: string): ThemeRegistryEntry | undefined {
  return themeRegistry.find((t) => t.id === slug)
}
