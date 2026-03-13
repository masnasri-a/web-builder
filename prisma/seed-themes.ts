/**
 * seed-themes.ts
 * Upsert 12 wedding invitation themes into the Theme table.
 * Run with: npm run db:seed-themes
 */

import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"
import "dotenv/config"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db      = new PrismaClient({ adapter })

const NEW_THEMES = [
  {
    name: "Chinese Style",
    slug: "chinese-style",
    config: {
      primaryColor:   "#C0392B",
      secondaryColor: "#FFF8E7",
      accentColor:    "#D4AF37",
      fontFamily:     "Cinzel",
      bgColor:        "#FFF8E7",
    },
  },
  {
    name: "Ramadan Islamic",
    slug: "ramadan-islamic",
    config: {
      primaryColor:   "#1A5C38",
      secondaryColor: "#FAF6EE",
      accentColor:    "#C9A84C",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#FAF6EE",
    },
  },
  {
    name: "Romantic Floral",
    slug: "romantic-floral",
    config: {
      primaryColor:   "#C47C8A",
      secondaryColor: "#FFFAF5",
      accentColor:    "#A8C5A0",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#FFFAF5",
    },
  },
  {
    name: "Royal Glamour",
    slug: "royal-glamour",
    config: {
      primaryColor:   "#C9A84C",
      secondaryColor: "#F5E6C8",
      accentColor:    "#6B0F1A",
      fontFamily:     "Cinzel",
      bgColor:        "#0D1B4B",
    },
  },

  // ── Satu Momen–inspired ───────────────────────────────────────────────────
  {
    name: "Phinisi Maroon",
    slug: "phinisi-maroon",
    config: {
      primaryColor:   "#7D1535",
      secondaryColor: "#F9F1E8",
      accentColor:    "#C49A45",
      fontFamily:     "Cinzel",
      bgColor:        "#F9F1E8",
    },
  },
  {
    name: "Chestnut Art",
    slug: "chestnut-art",
    config: {
      primaryColor:   "#8B4513",
      secondaryColor: "#FDF5EE",
      accentColor:    "#C4683A",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#FDF5EE",
    },
  },
  {
    name: "Bunga Bunga",
    slug: "bunga-bunga",
    config: {
      primaryColor:   "#D4456C",
      secondaryColor: "#FFFBF0",
      accentColor:    "#2D8B4E",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#FFFBF0",
    },
  },

  // ── New themes ──────────────────────────────────────────────────────────────
  {
    name: "Blue Java",
    slug: "blue-java",
    config: {
      primaryColor:   "#1E3566",
      secondaryColor: "#F5F0E6",
      accentColor:    "#C8A84B",
      fontFamily:     "Cinzel",
      bgColor:        "#F5F0E6",
    },
  },
  {
    name: "Celestia",
    slug: "celestia",
    config: {
      primaryColor:   "#C8D4E0",
      secondaryColor: "#0E1F42",
      accentColor:    "#E8C547",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#080E1C",
    },
  },
  {
    name: "Premium Blue",
    slug: "premium-blue",
    config: {
      primaryColor:   "#1B3A7A",
      secondaryColor: "#EEF2FF",
      accentColor:    "#C9A84C",
      fontFamily:     "Cinzel",
      bgColor:        "#F8F4EE",
    },
  },
  {
    name: "Serenity Blossom",
    slug: "serenity-blossom",
    config: {
      primaryColor:   "#E8849A",
      secondaryColor: "#FAFAF5",
      accentColor:    "#9B8EC4",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#FAFAF5",
    },
  },
  {
    name: "Pastel Rose",
    slug: "pastel-rose",
    config: {
      primaryColor:   "#E8A0B0",
      secondaryColor: "#F5C8D0",
      accentColor:    "#B8C8B8",
      fontFamily:     "Cormorant Garamond",
      bgColor:        "#FFF8F6",
    },
  },
]

async function main() {
  console.log("Seeding new themes...\n")

  for (const theme of NEW_THEMES) {
    await db.theme.upsert({
      where:  { slug: theme.slug },
      update: { config: theme.config, name: theme.name },
      create: theme,
    })
    console.log(`  ✓ ${theme.name}  (slug: ${theme.slug})`)
  }

  console.log("\n✅ seed-themes complete!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
