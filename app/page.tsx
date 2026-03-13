import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Sparkles, Heart, Users, Globe, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  BuilderIcon,
  RsvpIcon,
  MusicIcon,
  CountdownIcon,
  MobileIcon,
  LinkIcon,
} from "@/components/icons/feature-icons"
import { getLocale, getT } from "@/lib/i18n/server"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://selembar.id"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return {
    title: `Selembar.id — ${t("landing.hero.badge")}`,
    description: t("landing.hero.subtitle"),
    openGraph: {
      url: BASE_URL,
      title: `Selembar.id — ${t("landing.hero.badge")}`,
      description: t("landing.hero.subtitle"),
    },
    alternates: { canonical: BASE_URL },
  }
}

const THEMES = [
  { name: "Classic Elegance", primary: "#14B8A6", accent: "#D4A853", bg: "#FFF9F0" },
  { name: "Modern Minimal", primary: "#1E293B", accent: "#94A3B8", bg: "#F8FAFC" },
  { name: "Floral Romance", primary: "#EC4899", accent: "#F9A8D4", bg: "#FFF1F2" },
  { name: "Rustic Garden", primary: "#65A30D", accent: "#D97706", bg: "#FFFBEB" },
  { name: "Royal Navy", primary: "#1E40AF", accent: "#C2A459", bg: "#F0F4FF" },
  { name: "Sunset Gold", primary: "#D97706", accent: "#F97316", bg: "#FFFBF0" },
]

const PRICING_EN = [
  {
    name: "Free",
    price: "Rp 0",
    period: "forever",
    features: ["1 invitation", "Up to 10 RSVP slots", "3 themes", "Basic sections"],
    cta: "Get Started",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "Rp 99k",
    period: "/ month",
    features: ["5 invitations", "Up to 100 RSVP slots", "All themes", "Custom domain", "Background music", "Analytics"],
    cta: "Upgrade to Pro",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Unlimited",
    price: "Rp 199k",
    period: "/ month",
    features: ["Unlimited invitations", "Unlimited RSVP slots", "All themes + custom", "Priority support", "White-label option"],
    cta: "Go Unlimited",
    href: "/register?plan=unlimited",
    featured: false,
  },
]

const PRICING_ID = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    features: ["1 undangan", "Maks 10 slot RSVP", "3 tema", "Section dasar"],
    cta: "Mulai Sekarang",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "Rp 99k",
    period: "/ bulan",
    features: ["5 undangan", "Maks 100 slot RSVP", "Semua tema", "Domain kustom", "Musik latar", "Analitik"],
    cta: "Upgrade ke Pro",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Unlimited",
    price: "Rp 199k",
    period: "/ bulan",
    features: ["Undangan tak terbatas", "Slot RSVP tak terbatas", "Semua tema + kustom", "Dukungan prioritas", "Opsi white-label"],
    cta: "Pilih Unlimited",
    href: "/register?plan=unlimited",
    featured: false,
  },
]

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  const locale = await getLocale()
  const t = await getT()
  const PRICING = locale === "id" ? PRICING_ID : PRICING_EN

  const featureItems = [
    { Icon: BuilderIcon, title: t("landing.features.builder.title"), desc: t("landing.features.builder.desc") },
    { Icon: RsvpIcon, title: t("landing.features.rsvp.title"), desc: t("landing.features.rsvp.desc") },
    { Icon: MusicIcon, title: t("landing.features.music.title"), desc: t("landing.features.music.desc") },
    { Icon: CountdownIcon, title: t("landing.features.countdown.title"), desc: t("landing.features.countdown.desc") },
    { Icon: MobileIcon, title: t("landing.features.mobile.title"), desc: t("landing.features.mobile.desc") },
    { Icon: LinkIcon, title: t("landing.features.url.title"), desc: t("landing.features.url.desc") },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Selembar.id</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/login">{t("landing.nav.signIn")}</Link>
          </Button>
          <Button asChild>
            <Link href="/register">{t("landing.nav.getStarted")}</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center lg:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t("landing.hero.badge")}
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
            {t("landing.hero.title1")}
            <br />
            <span className="text-primary">{t("landing.hero.title2")}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            {t("landing.hero.subtitle")}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="rounded-xl px-8">
              <Link href="/register">
                {t("landing.hero.cta.start")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-xl px-8">
              <Link href="#themes">{t("landing.hero.cta.themes")}</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span>{t("landing.social.couples")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{t("landing.social.rsvps")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>{t("landing.social.seo")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Showcase */}
      <section id="themes" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">{t("landing.themes.title")}</h2>
            <p className="text-muted-foreground">{t("landing.themes.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {THEMES.map((theme) => (
              <div
                key={theme.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <div
                  className="flex h-40 flex-col items-center justify-center gap-2"
                  style={{ backgroundColor: theme.bg }}
                >
                  <p className="text-xs tracking-widest uppercase" style={{ color: theme.primary, opacity: 0.6 }}>
                    Wedding Invitation
                  </p>
                  <p className="text-xl font-bold" style={{ color: theme.primary }}>
                    Ahmad & Sari
                  </p>
                  <div className="h-px w-12" style={{ backgroundColor: theme.accent, opacity: 0.5 }} />
                  <p className="text-xs" style={{ color: theme.primary, opacity: 0.5 }}>
                    15 September 2025
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{theme.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">{t("landing.features.title")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureItems.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-1 font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">{t("landing.pricing.title")}</h2>
            <p className="text-muted-foreground">{t("landing.pricing.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 ${
                  plan.featured
                    ? "border-primary bg-primary text-primary-foreground shadow-xl"
                    : "border-border bg-card shadow-sm"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className="mb-1 font-semibold">{plan.name}</p>
                <p className="mb-1 text-3xl font-bold">{plan.price}</p>
                <p className={`mb-6 text-sm ${plan.featured ? "opacity-75" : "text-muted-foreground"}`}>
                  {plan.period}
                </p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 shrink-0 ${plan.featured ? "opacity-90" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.featured ? "secondary" : "default"} className="w-full rounded-xl">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          {t("landing.footer")}{" "}
          <a href="https://nuratech.id" className="hover:underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
            A product by Nuratech.id
          </a>
        </p>
      </footer>
    </div>
  )
}
