import Link from "next/link"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()
  return (
    <div
      className={cormorant.variable}
      style={
        {
          "--lp-950": "#1B3A2D",
          "--lp-900": "#2B5740",
          "--lp-800": "#3D6B52",
          "--lp-600": "#5C8A70",
          "--lp-gold": "#C8A96E",
          "--lp-cream": "#F5EFE6",
          "--lp-cream-light": "#FAF6F0",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          background: "var(--lp-cream-light)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        } as React.CSSProperties
      }
    >
      <style>{`
        .lp-serif { font-family: var(--font-cormorant), Georgia, serif; }
        .lp-tag {
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--lp-600);
          font-family: system-ui, sans-serif;
        }
      `}</style>

      {/* ── Nav ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "rgba(250,246,240,0.92)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(27,58,45,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link
            href="/"
            className="lp-serif text-xl font-semibold tracking-tight"
            style={{ color: "var(--lp-950)" }}
          >
            Selembar.id
          </Link>

          <nav className="hidden gap-7 md:flex">
            {[
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs tracking-widest uppercase transition-opacity hover:opacity-60"
                style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif", fontWeight: 500 }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs tracking-wide transition-opacity hover:opacity-70"
              style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif" }}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all hover:opacity-90"
              style={{
                background: "var(--lp-950)",
                color: "var(--lp-cream)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer
        className="px-6 py-14 lg:px-12"
        style={{ background: "var(--lp-950)", color: "var(--lp-cream)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <p className="lp-serif mb-3 text-xl font-semibold" style={{ color: "var(--lp-cream-light)" }}>
                Selembar.id
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(245,239,230,0.55)" }}>
                Mewujudkan momen sakral Anda dalam satu lembar digital yang elegan dan abadi.
              </p>
            </div>
            <div>
              <p className="lp-tag mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/", label: "Home" },
                  { href: "/register", label: "Get Started" },
                  { href: "/login", label: "Sign In" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs transition-opacity hover:opacity-100"
                      style={{ color: "rgba(245,239,230,0.6)", fontFamily: "system-ui, sans-serif" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="lp-tag mb-4">Support</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/faq", label: "FAQs" },
                  { href: "/contact", label: "Contact Us" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs transition-opacity hover:opacity-100"
                      style={{ color: "rgba(245,239,230,0.6)", fontFamily: "system-ui, sans-serif" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="lp-tag mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Use" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs transition-opacity hover:opacity-100"
                      style={{ color: "rgba(245,239,230,0.6)", fontFamily: "system-ui, sans-serif" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-8 text-xs md:flex-row"
            style={{
              borderColor: "rgba(245,239,230,0.08)",
              color: "rgba(245,239,230,0.35)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <p>© {year} Selembar.id. Crafted for The Discerning Couple.</p>
            <a
              href="https://nuratech.id"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-60"
            >
              BY NURATECH
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
