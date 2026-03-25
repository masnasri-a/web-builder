import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { MessageCircle, Mail, Clock, HelpCircle } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://selembar.id"

export const metadata: Metadata = {
  title: "Contact Us — Hubungi Kami | Selembar.id",
  description: "Butuh bantuan? Hubungi tim Selembar.id melalui WhatsApp atau email. Kami siap membantu Anda kapan saja.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact Us | Selembar.id",
    description: "Hubungi tim Selembar.id — kami siap membantu.",
    url: `${BASE_URL}/contact`,
  },
}

export default async function ContactPage() {
  const support = await db.supportConfig.findFirst().catch(() => null)

  const waNumber = support?.waNumber ?? ""
  const waMessage = support?.waMessage ?? "Halo, saya butuh bantuan terkait Selembar.id"
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`
    : null

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="px-6 py-24 text-center lg:px-12"
        style={{ background: "linear-gradient(160deg, var(--lp-950) 0%, var(--lp-900) 100%)" }}
      >
        <p
          className="lp-tag mb-4 tracking-[.22em]"
          style={{ color: "var(--lp-gold)", fontFamily: "system-ui, sans-serif" }}
        >
          Get in Touch
        </p>
        <h1
          className="lp-serif mx-auto max-w-xl text-4xl font-light leading-tight md:text-5xl"
          style={{ color: "var(--lp-cream-light)" }}
        >
          Kami Siap
          <br />
          <em>Membantu Anda</em>
        </h1>
        <p
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed"
          style={{ color: "rgba(245,239,230,0.6)", fontFamily: "system-ui, sans-serif" }}
        >
          Pertanyaan, masukan, atau butuh panduan membuat undangan? Jangan ragu untuk menghubungi kami.
        </p>
      </section>

      {/* ── Contact cards ──────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">

          {/* WhatsApp */}
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:shadow-lg"
              style={{
                borderColor: "rgba(27,58,45,0.12)",
                background: "white",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "#25D366" }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="lp-serif text-xl font-semibold" style={{ color: "var(--lp-950)" }}>
                  WhatsApp
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: "rgba(27,58,45,0.65)", fontFamily: "system-ui, sans-serif" }}
                >
                  Respon tercepat. Chat langsung dengan tim kami melalui WhatsApp.
                </p>
              </div>
              <span
                className="mt-auto inline-block rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-opacity group-hover:opacity-80"
                style={{
                  background: "#25D366",
                  color: "white",
                  fontFamily: "system-ui, sans-serif",
                  width: "fit-content",
                }}
              >
                Mulai Chat →
              </span>
            </a>
          ) : (
            <div
              className="flex flex-col gap-4 rounded-2xl border p-6"
              style={{ borderColor: "rgba(27,58,45,0.12)", background: "white" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "var(--lp-600)" }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="lp-serif text-xl font-semibold" style={{ color: "var(--lp-950)" }}>WhatsApp</p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "rgba(27,58,45,0.65)", fontFamily: "system-ui, sans-serif" }}
                >
                  Segera tersedia. Nomor WA sedang dikonfigurasi.
                </p>
              </div>
            </div>
          )}

          {/* Email */}
          <a
            href="mailto:hello@selembar.id"
            className="group flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:shadow-lg"
            style={{ borderColor: "rgba(27,58,45,0.12)", background: "white" }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: "var(--lp-900)" }}
            >
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="lp-serif text-xl font-semibold" style={{ color: "var(--lp-950)" }}>
                Email
              </p>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: "rgba(27,58,45,0.65)", fontFamily: "system-ui, sans-serif" }}
              >
                Kirim pertanyaan detail atau laporan masalah ke tim kami via email.
              </p>
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: "var(--lp-900)", fontFamily: "system-ui, sans-serif" }}
              >
                hello@selembar.id
              </p>
            </div>
            <span
              className="mt-auto inline-block rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all group-hover:bg-muted"
              style={{
                borderColor: "var(--lp-900)",
                color: "var(--lp-900)",
                fontFamily: "system-ui, sans-serif",
                width: "fit-content",
              }}
            >
              Kirim Email →
            </span>
          </a>
        </div>

        {/* ── Info strip ─────────────────────────────────────────── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div
            className="flex items-start gap-3 rounded-2xl p-5"
            style={{ background: "rgba(27,58,45,0.04)", border: "1px solid rgba(27,58,45,0.08)" }}
          >
            <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--lp-600)" }} />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif" }}
              >
                Jam Operasional
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(27,58,45,0.7)", fontFamily: "system-ui, sans-serif" }}
              >
                Senin – Sabtu: 08.00 – 21.00 WIB
                <br />
                Minggu & Hari Libur: 09.00 – 18.00 WIB
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-3 rounded-2xl p-5"
            style={{ background: "rgba(27,58,45,0.04)", border: "1px solid rgba(27,58,45,0.08)" }}
          >
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--lp-600)" }} />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif" }}
              >
                Sebelum Menghubungi
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(27,58,45,0.7)", fontFamily: "system-ui, sans-serif" }}
              >
                Cek{" "}
                <Link
                  href="/faq"
                  className="underline underline-offset-2"
                  style={{ color: "var(--lp-900)" }}
                >
                  halaman FAQ
                </Link>{" "}
                kami — mungkin pertanyaan Anda sudah terjawab di sana.
              </p>
            </div>
          </div>
        </div>

        {/* ── Divider + address ─────────────────────────────────── */}
        <div
          className="mt-12 border-t pt-10 text-center"
          style={{ borderColor: "rgba(27,58,45,0.1)" }}
        >
          <p
            className="lp-serif text-2xl font-light"
            style={{ color: "var(--lp-950)" }}
          >
            PT Nuratech Karya Indonesia
          </p>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(27,58,45,0.55)", fontFamily: "system-ui, sans-serif" }}
          >
            Indonesia · hello@selembar.id
          </p>
          <p className="mt-6">
            <a
              href="https://nuratech.id"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-tag transition-opacity hover:opacity-60"
              style={{ color: "var(--lp-600)" }}
            >
              nuratech.id ↗
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
