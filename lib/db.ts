import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/lib/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })
}

// In dev, always recreate to pick up schema changes after prisma generate
const db = process.env.NODE_ENV !== "production"
  ? (() => {
      if (globalForPrisma.prisma) {
        void globalForPrisma.prisma.$disconnect()
        globalForPrisma.prisma = undefined
      }
      globalForPrisma.prisma = createPrismaClient()
      return globalForPrisma.prisma
    })()
  : (globalForPrisma.prisma ?? createPrismaClient())

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export { db }
