import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { Locale } from "@/lib/i18n/translations"

const { auth } = NextAuth(authConfig)

const SUPPORTED_LOCALES: Locale[] = ["id", "en"]
const DEFAULT_LOCALE: Locale = "id"

function detectLocale(req: Parameters<Parameters<typeof auth>[0]>[0]): Locale {
  // 1. Cookie takes priority
  const cookie = req.cookies.get("SELEMBAR_LOCALE")?.value as Locale | undefined
  if (cookie && SUPPORTED_LOCALES.includes(cookie)) return cookie
  // 2. Accept-Language header
  const acceptLang = req.headers.get("accept-language") ?? ""
  if (acceptLang.toLowerCase().startsWith("en")) return "en"
  return DEFAULT_LOCALE
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Protect admin routes — require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Attach detected locale as a request header for Server Components
  const locale = detectLocale(req)
  const response = NextResponse.next()
  response.headers.set("x-locale", locale)
  return response
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
}
