import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"
import { checkAndExpireSubscription } from "@/lib/subscription"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // NextAuth v5 + PrismaAdapter + JWT strategy causes PKCE cookie/DB mismatch.
      // Use state-based CSRF instead (still secure, PKCE is optional for server-side flows).
      checks: ["state"],
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null
        if (user.isSuspended) throw new Error("Account suspended")

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as "USER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "INDIVIDUAL",
          tier: user.tier as "BASIC" | "PRO" | "PLATINUM" | "LUXURY",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!

        // Check and expire any overdue subscription before storing tier in token.
        // This runs only on sign-in so it's cheap: one extra query per login.
        await checkAndExpireSubscription(user.id!)

        // For Credentials, role/tier come from authorize()
        // For Google OAuth, we fetch them from DB (PrismaAdapter creates the user)
        if (user.role) {
          token.role = user.role as "USER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "INDIVIDUAL"
          // Re-read tier from DB in case expiry just downgraded it
          const dbUser = await db.user.findUnique({
            where: { id: user.id! },
            select: { tier: true },
          })
          token.tier = (dbUser?.tier ?? "BASIC") as "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
        } else {
          // OAuth user — fetch role/tier from DB
          const dbUser = await db.user.findUnique({
            where: { id: user.id! },
            select: { role: true, tier: true },
          })
          token.role = (dbUser?.role ?? "USER") as "USER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "INDIVIDUAL"
          token.tier = (dbUser?.tier ?? "BASIC") as "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as "USER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "INDIVIDUAL"
        session.user.tier = token.tier as "BASIC" | "PRO" | "PLATINUM" | "LUXURY"
      }
      return session
    },
  },
})
