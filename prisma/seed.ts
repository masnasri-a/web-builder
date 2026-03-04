import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const THEMES = [
  {
    name: "Classic Elegance",
    slug: "classic-elegance",
    config: {
      primaryColor: "#14B8A6",
      secondaryColor: "#F9F5F0",
      accentColor: "#D4A853",
      fontFamily: "Playfair Display",
      bgColor: "#FFF9F0",
    },
  },
  {
    name: "Modern Minimal",
    slug: "modern-minimal",
    config: {
      primaryColor: "#1E293B",
      secondaryColor: "#F8FAFC",
      accentColor: "#94A3B8",
      fontFamily: "Geist Sans",
      bgColor: "#F8FAFC",
    },
  },
  {
    name: "Floral Romance",
    slug: "floral-romance",
    config: {
      primaryColor: "#EC4899",
      secondaryColor: "#FFF1F2",
      accentColor: "#F9A8D4",
      fontFamily: "Cormorant Garamond",
      bgColor: "#FFF1F2",
    },
  },
  {
    name: "Rustic Garden",
    slug: "rustic-garden",
    config: {
      primaryColor: "#65A30D",
      secondaryColor: "#FFFBEB",
      accentColor: "#D97706",
      fontFamily: "Lora",
      bgColor: "#FFFBEB",
    },
  },
  {
    name: "Royal Navy",
    slug: "royal-navy",
    config: {
      primaryColor: "#1E40AF",
      secondaryColor: "#F0F4FF",
      accentColor: "#C2A459",
      fontFamily: "Cinzel",
      bgColor: "#F0F4FF",
    },
  },
  {
    name: "Sunset Gold",
    slug: "sunset-gold",
    config: {
      primaryColor: "#D97706",
      secondaryColor: "#FFFBF0",
      accentColor: "#F97316",
      fontFamily: "Great Vibes",
      bgColor: "#FFFBF0",
    },
  },
]

async function main() {
  console.log("Seeding themes...")
  for (const theme of THEMES) {
    await db.theme.upsert({
      where: { slug: theme.slug },
      update: { config: theme.config },
      create: theme,
    })
    console.log(`  ✓ ${theme.name}`)
  }

  console.log("\nCreating admin user...")
  const adminHash = await bcrypt.hash("admin123456", 12)
  await db.user.upsert({
    where: { email: "admin@undangan.io" },
    update: {},
    create: {
      email: "admin@undangan.io",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      tier: "UNLIMITED",
    },
  })
  console.log("  ✓ admin@undangan.io (password: admin123456)")

  console.log("\nCreating demo user...")
  const demoHash = await bcrypt.hash("demo123456", 12)
  await db.user.upsert({
    where: { email: "demo@undangan.io" },
    update: {},
    create: {
      email: "demo@undangan.io",
      name: "Demo User",
      passwordHash: demoHash,
      role: "USER",
      tier: "FREE",
    },
  })
  console.log("  ✓ demo@undangan.io (password: demo123456)")

  console.log("\n✅ Seed complete!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
