"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  type Locale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  t as rawT,
} from "@/lib/i18n/translations"

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
})

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    if (!SUPPORTED_LOCALES.includes(next)) return
    setLocaleState(next)
    // Persist to cookie (1 year)
    document.cookie = `SELEMBAR_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`
    // Refresh the page so server components re-render with the new locale
    window.location.reload()
  }, [])

  const t = useCallback((key: string) => rawT(locale, key), [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

/** Convenience hook — returns just the translator function */
export function useT() {
  return useContext(LocaleContext).t
}
