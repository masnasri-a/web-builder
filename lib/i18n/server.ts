import { cookies, headers } from "next/headers"
import { type Locale, DEFAULT_LOCALE, SUPPORTED_LOCALES, translations, t as rawT } from "./translations"

/**
 * Get the current locale from the request headers (set by middleware).
 * Falls back to DEFAULT_LOCALE.
 * For use in Server Components only.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const h = await headers()
    const locale = h.get("x-locale") as Locale | null
    if (locale && SUPPORTED_LOCALES.includes(locale)) return locale
  } catch {
    // headers() may not be available in some contexts
  }
  try {
    const c = await cookies()
    const locale = c.get("SELEMBAR_LOCALE")?.value as Locale | undefined
    if (locale && SUPPORTED_LOCALES.includes(locale)) return locale
  } catch {
    // cookies() may not be available in some contexts
  }
  return DEFAULT_LOCALE
}

/**
 * Returns a translator function bound to the current server locale.
 * Usage:
 *   const t = await getT()
 *   t("landing.hero.badge")
 */
export async function getT() {
  const locale = await getLocale()
  return (key: string) => rawT(locale, key)
}

export { translations, type Locale }
