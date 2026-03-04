import type { NextAuthConfig } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
      tier: "FREE" | "PRO" | "UNLIMITED"
      email: string
      name: string | null
      image: string | null
    }
  }

  interface User {
    role: "USER" | "ADMIN"
    tier: "FREE" | "PRO" | "UNLIMITED"
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
        t.role = user.role as "USER" | "ADMIN"
        t.tier = user.tier as "FREE" | "PRO" | "UNLIMITED"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as "USER" | "ADMIN"
        session.user.tier = token.tier as "FREE" | "PRO" | "UNLIMITED"
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
