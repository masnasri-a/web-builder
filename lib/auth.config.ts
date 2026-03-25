import type { NextAuthConfig } from "next-auth"

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "INDIVIDUAL"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      tier: "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
      email: string
      name: string | null
      image: string | null
    }
  }

  interface User {
    role: UserRole
    tier: "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
  }
}

// Edge-compatible auth config — no Node.js-only imports (no Prisma, no bcrypt)
export const authConfig = {
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const t = token as Record<string, unknown>
        t.id = user.id!
        t.role = user.role as UserRole
        t.tier = user.tier as "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.tier = token.tier as "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Providers are added in lib/auth.ts
} satisfies NextAuthConfig
