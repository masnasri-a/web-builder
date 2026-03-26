import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Cormorant_Garamond } from "next/font/google"
import { Check, ArrowRight, Star, ChevronRight } from "lucide-react"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { AnimateOnScroll } from "@/components/landing/animate-on-scroll"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://selembar.id"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
})

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Selembar.id — Undangan Digital Pernikahan Premium & Eksklusif",
    description: "Buat undangan pernikahan digital yang elegan dan personal. Pilih dari ratusan tema premium, kelola RSVP tamu, dan bagikan kenangan indah dalam satu lembar digital.",
    keywords: ["undangan digital", "undangan pernikahan", "wedding invitation", "digital invitation", "RSVP online", "undangan online"],
    authors: [{ name: "Selembar.id by Nuratech" }],
    openGraph: {
      type: "website",
      url: BASE_URL,
      title: "Selembar.id — Undangan Digital Premium",
      description: "Kurasi pengalaman editorial yang tak tertandingi untuk hari istimewa Anda.",
      siteName: "Selembar.id",
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Selembar.id" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Selembar.id — Undangan Digital Premium",
      description: "Undangan yang melampaui batas fisik—elegan, personal, dan benar-benar eksklusif.",
    },
    alternates: { canonical: BASE_URL },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Selembar.id",
  url: BASE_URL,
  description: "Platform undangan digital pernikahan premium Indonesia",
  potentialAction: { "@type": "SearchAction", target: `${BASE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
}

const THEMES = [
  { name: "Classic Elegance", sub: "Timeless Sophistication", primary: "#2B5740", accent: "#C8A96E", bg: "#F5EFE6", text: "#1B3A2D", sample: ["Ahmad & Sari", "24 · 12 · 2026"] },
  { name: "Modern Minimal", sub: "Avant-Garde Simplicity", primary: "#1E293B", accent: "#94A3B8", bg: "#F8FAFC", text: "#0F172A", sample: ["AHMAD & SARI", "24 · 12 · 2026"] },
  { name: "Floral Romance", sub: "Natural Whimsy", primary: "#9D4E6A", accent: "#F9A8D4", bg: "#FFF1F2", text: "#831843", sample: ["Ahmad & Sari", "December 24, 2026"] },
]

const STEPS = [
  { num: "01", title: "Pilih Tema", desc: "Eksplorasi koleksi desain eksklusif kami dan temukan yang paling mewakili kisah cinta Anda.", icon: "✦" },
  { num: "02", title: "Isi Data", desc: "Lengkapi detail acara, foto, dan musik pilihan Anda melalui editor yang intuitif.", icon: "✎" },
  { num: "03", title: "Sebar Undangan", desc: "Dapatkan link undangan unik Anda dan bagikan kepada kerabat melalui berbagai platform.", icon: "✉" },
]

const FEATURES = [
  { title: "Desain Menakjubkan", desc: "Pilih dari ratusan desain yang menakjubkan untuk hari spesial Anda." },
  { title: "Responsif", desc: "Undangan responsif di semua perangkat ponsel dan tablet." },
  { title: "RSVP Inteligensi", desc: "Pantau daftar tamu dan konfirmasi kehadiran secara real time dengan dasbor eksklusif." },
  { title: "Integrasi Presisi", desc: "Lokasi acara yang akurat membantu tamu menemukan tempat dengan navigasi premium." },
]

const TESTIMONIALS = [
  { quote: "Prosesnya sangat cepat dan hasilnya luar biasa elegan. Semua tamu memuji keindahan undangan kami. Terima kasih Selembar.id!", name: "Budi & Melati", date: "12 Juni 2024", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { quote: "Fitur RSVP-nya sangat membantu kami mengelola daftar tamu dengan rapi. Sangat direkomendasikan untuk pasangan milenial!", name: "Reza & Amanda", date: "15 Mei 2024", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
]

function buildFeatures(cfg: {
  maxInvitations: number; maxRsvpGuests: number; maxGalleryImages: number
  allowMusic: boolean; allowCustomDomain: boolean; allowAnalytics: boolean
  allThemes: boolean; allowBroadcast: boolean; allowGift: boolean
}) {
  const feats: string[] = []
  if (cfg.maxInvitations === 0) feats.push("Undangan tak terbatas")
  else feats.push(`${cfg.maxInvitations} Undangan`)
  if (cfg.maxRsvpGuests === 0) feats.push("RSVP tak terbatas")
  else feats.push(`Reservasi Tamu (RSVP)`)
  if (cfg.maxGalleryImages > 0) feats.push(`Galeri ${cfg.maxGalleryImages} Foto`)
  else if (cfg.maxGalleryImages === 0) feats.push("Galeri Unlimited")
  if (cfg.allThemes) feats.push("Semua Tema Pro")
  if (cfg.allowMusic) feats.push("Musik Latar Eksklusif")
  if (cfg.allowCustomDomain) feats.push("Custom Domain Eksklusif")
  if (cfg.allowAnalytics) feats.push("Analytics Dashboard")
  if (cfg.allowBroadcast) feats.push("Broadcast WhatsApp")
  if (cfg.allowGift) feats.push("Fitur Gift & Transfer")
  return feats
}

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  const [tiers, latestInvitation] = await Promise.all([
    db.tierConfig.findMany({
      where: { roleType: "USER", isVisible: true },
      orderBy: { price: "asc" },
    }),
    db.invitation.findFirst({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
      select: { groomName: true, brideName: true, eventVenue: true, eventDate: true },
    }),
  ])

  const heroCard = latestInvitation
    ? {
        names: `${latestInvitation.groomName} & ${latestInvitation.brideName}`,
        venue: latestInvitation.eventVenue,
        date: new Date(latestInvitation.eventDate).toLocaleDateString("id-ID", {
          day: "numeric", month: "short", year: "numeric",
        }),
      }
    : { names: "Ahmad & Sari", venue: "The Grand Ballroom", date: "24 Dec 2024" }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        :root {
          --lp-950: #0D2119;
          --lp-900: #1B3A2D;
          --lp-800: #2B5740;
          --lp-600: #3D7A56;
          --lp-400: #6DAB83;
          --lp-gold: #C8A96E;
          --lp-gold-light: #E8D5A8;
          --lp-cream: #F5EFE6;
          --lp-cream-light: #FDFAF5;
        }
        .font-serif-lp { font-family: var(--font-cormorant), 'Georgia', serif; }
        [data-anim] { opacity: 0; transform: translateY(28px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
        [data-anim="fade"] { transform: none; }
        [data-anim="scale"] { transform: scale(0.95); }
        [data-anim="left"] { transform: translateX(-28px); }
        [data-anim="right"] { transform: translateX(28px); }
        [data-anim].in-view { opacity: 1; transform: none !important; }
        .lp-btn-primary { background: var(--lp-900); color: white; border-radius: 9999px; padding: 0.75rem 2rem; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.025em; transition: background 0.2s, transform 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; }
        .lp-btn-primary:hover { background: var(--lp-800); transform: translateY(-1px); }
        .lp-btn-outline { border: 1px solid var(--lp-900); color: var(--lp-900); border-radius: 9999px; padding: 0.75rem 2rem; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.025em; transition: background 0.2s, transform 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; }
        .lp-btn-outline:hover { background: var(--lp-cream); transform: translateY(-1px); }
        .lp-tag { display: inline-block; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lp-gold); }
        .theme-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(27,58,45,0.12); }
        .theme-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .pricing-card:hover { transform: translateY(-4px); }
        .pricing-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .nav-link { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--lp-900); opacity: 0.7; transition: opacity 0.2s; }
        .nav-link:hover { opacity: 1; }
        .hero-float { animation: heroFloat 6s ease-in-out infinite; }
        @keyframes heroFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .gold-line { width: 40px; height: 1px; background: var(--lp-gold); display: inline-block; }
      `}</style>

      <div className={`${cormorant.variable} min-h-screen`} style={{ background: "var(--lp-cream-light)", color: "var(--lp-900)" }}>
        <AnimateOnScroll />

        {/* ── NAV ──────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(253,250,245,0.9)", borderColor: "rgba(27,58,45,0.08)" }}>
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif-lp text-xl font-semibold tracking-tight" style={{ color: "var(--lp-900)" }}>Selembar.id</span>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              {[["#", "Home"], ["#themes", "Collections"], ["#features", "The Experience"], ["#pricing", "Concierge"]].map(([href, label]) => (
                <a key={label} href={href} className="nav-link">{label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="nav-link hidden md:block" style={{ opacity: 0.7 }}>Login</Link>
              <Link href="/register" className="lp-btn-primary text-sm">Mulai Gratis</Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 lg:px-12" style={{ background: "var(--lp-cream-light)", minHeight: "92vh", display: "flex", alignItems: "center" }}>
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 py-20 lg:grid-cols-2 lg:items-center lg:gap-20">
            {/* Left */}
            <div>
              <div className="mb-6 flex items-center gap-3" data-anim="fade">
                <span className="gold-line" />
                <span className="lp-tag">Bespoke Digital Invitations</span>
              </div>
              <h1 className="font-serif-lp mb-6 leading-[1.1] tracking-tight" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", color: "var(--lp-950)", fontWeight: 400 }} data-anim data-delay="100">
                Momen<br />
                Berharga dalam<br />
                <em style={{ color: "var(--lp-800)", fontStyle: "italic" }}>Satu Lembar</em><br />
                Digital.
              </h1>
              <p className="mb-10 max-w-md text-base leading-relaxed" style={{ color: "var(--lp-800)", opacity: 0.8 }} data-anim data-delay="200">
                Kurasi pengalaman editorial yang tak tertandingi untuk hari istimewa Anda. Undangan yang melampaui batas fisik—elegan, personal, dan benar-benar eksklusif.
              </p>
              <div className="flex flex-wrap items-center gap-4" data-anim data-delay="300">
                <Link href="/register" className="lp-btn-primary">
                  Mulai Perjalanan Anda <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#themes" className="lp-btn-outline">Lihat Koleksi</a>
              </div>
              {/* Social proof */}
              <div className="mt-12 flex items-center gap-6" data-anim data-delay="400">
                <div className="flex -space-x-2">
                  {["bg-emerald-200", "bg-amber-200", "bg-rose-200", "bg-sky-200"].map((c, i) => (
                    <div key={i} className={`h-8 w-8 rounded-full border-2 border-white ${c} flex items-center justify-center text-xs font-semibold text-gray-600`}>
                      {["B", "R", "A", "D"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--lp-800)", opacity: 0.7 }}>Dipercaya 1.200+ pasangan</p>
                </div>
              </div>
            </div>

            {/* Right — photo + floating card */}
            <div className="relative flex justify-center" data-anim="right" data-delay="150">
              <div className="relative h-[500px] w-full max-w-[480px] overflow-hidden rounded-3xl shadow-2xl lg:h-[600px]">
                <Image
                  src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1400&q=80"
                  alt="Wedding venue decoration"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,33,25,0.4) 0%, transparent 60%)" }} />
              </div>
              {/* Floating invitation card */}
              <div className="hero-float absolute -bottom-4 -left-4 rounded-2xl border p-5 shadow-xl backdrop-blur-md md:-left-12" style={{ background: "rgba(253,250,245,0.95)", borderColor: "rgba(200,169,110,0.3)", minWidth: 200 }}>
                <p className="font-serif-lp mb-1 text-xs tracking-widest uppercase" style={{ color: "var(--lp-gold)" }}>Wedding Invitation</p>
                <p className="font-serif-lp text-xl font-semibold" style={{ color: "var(--lp-950)" }}>{heroCard.names}</p>
                <div className="my-2 h-px w-full" style={{ background: "var(--lp-gold)", opacity: 0.4 }} />
                <p className="text-xs" style={{ color: "var(--lp-800)", opacity: 0.8 }}>{heroCard.venue} · {heroCard.date}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ──────────────────────────────────────── */}
        <section id="themes" className="px-6 py-24 lg:px-12" style={{ background: "var(--lp-cream)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center" data-anim>
              <span className="lp-tag">The Curated Gallery</span>
              <h2 className="font-serif-lp mt-3 text-4xl font-light lg:text-5xl" style={{ color: "var(--lp-950)" }}>Pilih Gaya Cerita Anda</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: "var(--lp-800)", opacity: 0.75 }}>
                Setiap desain adalah kanvas kosong yang menunggu sentuhan personalitas unik Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {THEMES.map((t, i) => (
                <div key={t.name} className="theme-card overflow-hidden rounded-2xl shadow-sm" style={{ background: "white" }} data-anim data-delay={String(i * 100)}>
                  <div className="flex h-52 flex-col items-center justify-center gap-2 px-6" style={{ background: t.bg }}>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: t.primary, opacity: 0.6 }}>The Wedding Of</p>
                      <p className="font-serif-lp text-xl font-semibold" style={{ color: t.primary }}>{t.sample[0]}</p>
                    <div className="h-px w-12" style={{ background: t.accent, opacity: 0.6 }} />
                    <p className="text-xs" style={{ color: t.primary, opacity: 0.6 }}>{t.sample[1]}</p>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm" style={{ color: "var(--lp-950)" }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--lp-800)", opacity: 0.65 }}>{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center" data-anim>
              <Link href="/register" className="lp-btn-outline" style={{ borderColor: "var(--lp-800)", color: "var(--lp-800)" }}>
                Lihat Semua Koleksi <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 3 STEPS ──────────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-12" style={{ background: "var(--lp-cream-light)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center" data-anim>
              <h2 className="font-serif-lp text-4xl font-light lg:text-5xl" style={{ color: "var(--lp-950)" }}>
                Buat Undangan Anda<br /><em>dalam 3 Langkah Mudah</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <div key={s.num} className="relative" data-anim data-delay={String(i * 120)}>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl" style={{ background: "var(--lp-cream)", color: "var(--lp-800)" }}>
                      {s.icon}
                    </div>
                    <span className="font-serif-lp text-4xl font-light" style={{ color: "var(--lp-gold)", opacity: 0.6 }}>Step {s.num}</span>
                  </div>
                  <h3 className="font-serif-lp mb-2 text-2xl font-semibold" style={{ color: "var(--lp-950)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--lp-800)", opacity: 0.75 }}>{s.desc}</p>
                  {i < 2 && (
                    <div className="absolute -right-4 top-7 hidden md:block" style={{ color: "var(--lp-gold)", opacity: 0.4 }}>
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────── */}
        <section id="features" className="px-6 py-24 lg:px-12" style={{ background: "var(--lp-cream)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Photo */}
              <div className="relative" data-anim="left">
                <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80"
                    alt="Happy couple"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Stat badge */}
                <div className="absolute -right-6 top-12 rounded-2xl p-5 shadow-xl" style={{ background: "var(--lp-900)", color: "white" }}>
                  <p className="font-serif-lp text-3xl font-semibold">1.2k+</p>
                  <p className="text-xs opacity-80">Pasangan Bahagia</p>
                </div>
              </div>

              {/* Features */}
              <div data-anim="right">
                <span className="lp-tag">The Luxury Advantage</span>
                <h2 className="font-serif-lp mt-3 mb-4 text-4xl font-light lg:text-5xl" style={{ color: "var(--lp-950)" }}>
                  Fitur Eksklusif untuk<br /><em>Hari Sempurna</em>
                </h2>
                <p className="mb-10 text-sm leading-relaxed" style={{ color: "var(--lp-800)", opacity: 0.8 }}>
                  Lebih dari sekadar undangan digital. Kami menyediakan instrumen kurasi yang dirancang untuk menyempurnakan setiap detail perayaan mewah Anda.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {FEATURES.map((f, i) => (
                    <div key={f.title} data-anim data-delay={String(i * 80)}>
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(27,58,45,0.08)" }}>
                        <Check className="h-4 w-4" style={{ color: "var(--lp-600)" }} />
                      </div>
                      <h4 className="mb-1 font-semibold text-sm" style={{ color: "var(--lp-950)" }}>{f.title}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--lp-800)", opacity: 0.75 }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section className="px-6 py-24 lg:px-12" style={{ background: "var(--lp-950)", color: "white" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center" data-anim>
              <span className="lp-tag">Testimoni dari Pasangan Kami</span>
              <h2 className="font-serif-lp mt-3 text-4xl font-light lg:text-5xl" style={{ color: "var(--lp-cream-light)" }}>
                Kisah Bahagia Bersama<br /><em style={{ color: "var(--lp-gold)" }}>Selembar.id</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} data-anim data-delay={String(i * 100)}>
                  <div className="mb-4 flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                  <p className="font-serif-lp mb-6 text-lg italic leading-relaxed" style={{ color: "rgba(253,250,245,0.9)" }}>&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--lp-cream-light)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--lp-gold)", opacity: 0.8 }}>{t.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────── */}
        <section id="pricing" className="px-6 py-24 lg:px-12" style={{ background: "var(--lp-cream-light)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center" data-anim>
              <span className="lp-tag">Simple Pricing</span>
              <h2 className="font-serif-lp mt-3 text-4xl font-light lg:text-5xl" style={{ color: "var(--lp-950)" }}>
                Investasi untuk<br /><em>Kenangan Abadi</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map((tier, i) => {
                const features = buildFeatures(tier)
                const isFeatured = tier.isPopular
                return (
                  <div
                    key={tier.tier}
                    className="pricing-card relative rounded-2xl p-6"
                    style={{
                      background: isFeatured ? "var(--lp-900)" : "white",
                      border: isFeatured ? "none" : "1px solid rgba(27,58,45,0.1)",
                      boxShadow: isFeatured ? "0 20px 60px rgba(27,58,45,0.3)" : "0 2px 8px rgba(27,58,45,0.06)",
                    }}
                    data-anim data-delay={String(i * 80)}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full px-3 py-1 text-[10px] font-semibold" style={{ background: "var(--lp-gold)", color: "var(--lp-950)" }}>
                          Pilihan Terlaris
                        </span>
                      </div>
                    )}
                    <p className="font-serif-lp mb-0.5 text-lg font-semibold" style={{ color: isFeatured ? "var(--lp-cream-light)" : "var(--lp-950)" }}>
                      {tier.label || tier.tier}
                    </p>
                    {tier.description && (
                      <p className="mb-3 text-xs" style={{ color: isFeatured ? "rgba(245,239,230,0.65)" : "rgba(43,87,64,0.65)" }}>{tier.description}</p>
                    )}
                    {tier.originalPrice > 0 && tier.originalPrice > tier.price && (
                      <p className="mb-0.5 text-sm font-light line-through" style={{ color: isFeatured ? "rgba(245,239,230,0.45)" : "rgba(43,87,64,0.4)" }}>
                        Rp {Math.floor(tier.originalPrice / 1000)}k
                      </p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <p className="font-serif-lp mb-0.5 text-3xl font-light" style={{ color: isFeatured ? "white" : "var(--lp-950)" }}>
                        {tier.price === 0 ? "Gratis" : `Rp ${Math.floor(tier.price / 1000)}k`}
                      </p>
                      {tier.originalPrice > 0 && tier.originalPrice > tier.price && tier.price > 0 && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: isFeatured ? "var(--lp-gold)" : "var(--lp-600)", color: isFeatured ? "var(--lp-950)" : "white" }}>
                          -{Math.round(((tier.originalPrice - tier.price) / tier.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="mb-6 text-xs" style={{ color: isFeatured ? "rgba(245,239,230,0.55)" : "rgba(43,87,64,0.55)" }}>
                      {tier.price === 0 ? "selamanya" : "/ bulan"}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {features.slice(0, 5).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: isFeatured ? "var(--lp-gold)" : "var(--lp-600)" }} />
                          <span style={{ color: isFeatured ? "rgba(245,239,230,0.85)" : "rgba(27,58,45,0.8)" }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/register?plan=${tier.tier.toLowerCase()}`}
                      className="block w-full rounded-full py-2.5 text-center text-xs font-semibold tracking-wide transition-all"
                      style={{
                        background: isFeatured ? "var(--lp-gold)" : "transparent",
                        color: isFeatured ? "var(--lp-950)" : "var(--lp-800)",
                        border: isFeatured ? "none" : "1px solid var(--lp-800)",
                      }}
                    >
                      {tier.ctaLabel || "Pilih Paket"}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer className="px-6 py-16 lg:px-12" style={{ background: "var(--lp-950)", color: "var(--lp-cream)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <p className="font-serif-lp mb-3 text-2xl font-semibold" style={{ color: "var(--lp-cream-light)" }}>Selembar.id</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(245,239,230,0.55)" }}>
                  Mewujudkan momen sakral Anda dalam satu lembar digital yang elegan, abadi, dan tak terlupakan.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <p className="lp-tag mb-4">Navigation</p>
                <ul className="space-y-2">
                  {["Home", "Collections", "Experience", "Pricing"].map((l) => (
                    <li key={l}><a href="#" className="text-xs transition-opacity hover:opacity-100" style={{ color: "rgba(245,239,230,0.6)" }}>{l}</a></li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <p className="lp-tag mb-4">Support</p>
                <ul className="space-y-2">
                  {[
                    { label: "FAQs", href: "/faq" },
                    { label: "Contact Us", href: "/contact" },
                  ].map(({ label, href }) => (
                    <li key={label}><Link href={href} className="text-xs transition-opacity hover:opacity-100" style={{ color: "rgba(245,239,230,0.6)" }}>{label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <p className="lp-tag mb-4">Connect</p>
                <ul className="space-y-2">
                  {["Instagram", "WhatsApp", "TikTok"].map((l) => (
                    <li key={l}><a href="#" className="text-xs transition-opacity hover:opacity-100" style={{ color: "rgba(245,239,230,0.6)" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs md:flex-row" style={{ borderColor: "rgba(245,239,230,0.08)", color: "rgba(245,239,230,0.4)" }}>
              <p>© {new Date().getFullYear()} Selembar.id. Crafted for The Discerning Couple.</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:opacity-80 transition-opacity">Privacy Policy</Link>
                <Link href="/terms" className="hover:opacity-80 transition-opacity">Terms of Use</Link>
                <a href="https://nuratech.id" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">BY NURATECH</a>
              </div>
            </div>
          </div>
        </footer>

        <ChatbotWidget />
      </div>
    </>
  )
}
