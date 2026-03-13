import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { LocaleProvider } from "@/components/locale-provider"
import { Toaster } from "sonner"
import { getLocale } from "@/lib/i18n/server"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://selembar.id"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Selembar.id — Undangan Pernikahan Digital",
    template: "%s | Selembar.id",
  },
  description:
    "Buat undangan pernikahan digital yang indah dalam hitungan menit. Pantau RSVP, pilih dari berbagai tema eksklusif, dan bagikan ke semua tamu.",
  keywords: [
    "undangan pernikahan digital",
    "digital wedding invitation",
    "undangan online",
    "RSVP online",
    "selembar",
    "undangan nikah",
    "wedding invitation Indonesia",
  ],
  authors: [{ name: "Nuratech.id", url: "https://nuratech.id" }],
  creator: "Nuratech.id",
  publisher: "Selembar.id",
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: BASE_URL,
    siteName: "Selembar.id",
    title: "Selembar.id — Undangan Pernikahan Digital",
    description:
      "Buat undangan pernikahan digital yang indah dalam hitungan menit. Pantau RSVP, pilih dari berbagai tema eksklusif, dan bagikan ke semua tamu.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Selembar.id — Undangan Pernikahan Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selembar.id — Undangan Pernikahan Digital",
    description:
      "Buat undangan pernikahan digital yang indah dalam hitungan menit.",
    images: ["/og-image.png"],
    creator: "@nuratech_id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "id-ID": BASE_URL,
      "en-US": BASE_URL,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale} className="scroll-smooth">
      <body className={`${geist.variable} antialiased font-sans`}>
        <Providers>
          <LocaleProvider initialLocale={locale}>
            {children}
          </LocaleProvider>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
