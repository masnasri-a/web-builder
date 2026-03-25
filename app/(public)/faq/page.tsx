import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { FaqAccordion } from "./faq-accordion"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://selembar.id"

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan yang Sering Diajukan | Selembar.id",
  description: "Temukan jawaban atas pertanyaan umum seputar undangan digital Selembar.id — cara kerja, pembayaran, tema, RSVP, dan lainnya.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "FAQ | Selembar.id",
    description: "Pertanyaan yang sering diajukan seputar layanan undangan digital Selembar.id.",
    url: `${BASE_URL}/faq`,
  },
}

// Fallback FAQs for when the DB is empty
const FALLBACK_FAQS = [
  {
    id: "f1",
    question: "Apa itu Selembar.id?",
    answer: "Selembar.id adalah platform undangan digital premium untuk pernikahan. Kami menyediakan ratusan tema elegan, fitur RSVP online, galeri foto, musik latar, dan berbagai fitur interaktif untuk membuat undangan Anda benar-benar berkesan.",
  },
  {
    id: "f2",
    question: "Berapa lama undangan dapat diakses tamu?",
    answer: "Undangan Anda aktif selama masa berlangganan paket Anda. Paket Gratis memberikan akses tidak terbatas untuk 1 undangan. Paket berbayar memberikan durasi akses sesuai periode langganan.",
  },
  {
    id: "f3",
    question: "Apakah bisa mengganti tema setelah undangan dibuat?",
    answer: "Ya, Anda dapat mengganti tema kapan saja melalui editor undangan. Semua data yang sudah diisi akan tetap tersimpan, hanya tampilannya yang berubah mengikuti tema baru.",
  },
  {
    id: "f4",
    question: "Bagaimana cara kerja fitur RSVP?",
    answer: "Tamu mengklik link undangan Anda dan mengisi formulir RSVP langsung di halaman undangan. Konfirmasi kehadiran dan jumlah tamu tersimpan otomatis di dashboard Anda dan dapat diunduh sebagai daftar tamu.",
  },
  {
    id: "f5",
    question: "Apakah undangan bisa dibuka di semua perangkat?",
    answer: "Ya, semua undangan Selembar.id didesain responsif — tampil sempurna di ponsel, tablet, maupun komputer dengan berbagai ukuran layar.",
  },
  {
    id: "f6",
    question: "Bagaimana cara melakukan pembayaran upgrade paket?",
    answer: "Pembayaran dilakukan melalui QRIS yang dapat di-scan dari aplikasi mobile banking atau dompet digital mana pun. Upgrade berlaku instan setelah pembayaran dikonfirmasi.",
  },
  {
    id: "f7",
    question: "Apakah data pribadi saya aman?",
    answer: "Keamanan data Anda adalah prioritas kami. Semua data disimpan terenkripsi di server yang aman. Kami tidak pernah menjual data pengguna kepada pihak ketiga. Baca kebijakan privasi kami untuk informasi lebih lengkap.",
  },
  {
    id: "f8",
    question: "Bisakah saya mencoba sebelum membayar?",
    answer: "Tentu! Paket Gratis tersedia tanpa batas waktu dan tanpa kartu kredit. Anda bisa membuat satu undangan lengkap dan upgrade ke paket berbayar kapan saja bila membutuhkan fitur tambahan.",
  },
]

export default async function FaqPage() {
  const dbFaqs = await db.faqItem.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, question: true, answer: true },
  }).catch(() => [])

  const faqs = dbFaqs.length > 0 ? dbFaqs : FALLBACK_FAQS

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        className="px-6 py-24 text-center lg:px-12"
        style={{ background: "linear-gradient(160deg, var(--lp-950) 0%, var(--lp-900) 100%)" }}
      >
        <p
          className="lp-tag mb-4 tracking-[.22em]"
          style={{ color: "var(--lp-gold)", fontFamily: "system-ui, sans-serif" }}
        >
          Help Center
        </p>
        <h1
          className="lp-serif mx-auto max-w-2xl text-4xl font-light leading-tight md:text-5xl"
          style={{ color: "var(--lp-cream-light)" }}
        >
          Pertanyaan yang Sering
          <br />
          <em>Diajukan</em>
        </h1>
        <p
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed"
          style={{ color: "rgba(245,239,230,0.6)", fontFamily: "system-ui, sans-serif" }}
        >
          Tidak menemukan jawaban yang Anda cari?{" "}
          <Link href="/contact" className="underline underline-offset-2 hover:opacity-80">
            Hubungi kami
          </Link>
          .
        </p>
      </section>

      {/* ── FAQ list ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <FaqAccordion faqs={faqs} />

        {/* CTA */}
        <div
          className="mt-16 rounded-2xl p-8 text-center"
          style={{ background: "var(--lp-900)" }}
        >
          <p
            className="lp-serif mb-2 text-2xl font-semibold"
            style={{ color: "var(--lp-cream-light)" }}
          >
            Masih ada pertanyaan?
          </p>
          <p
            className="mb-6 text-sm"
            style={{ color: "rgba(245,239,230,0.65)", fontFamily: "system-ui, sans-serif" }}
          >
            Tim kami siap membantu Anda kapan saja.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90"
            style={{
              background: "var(--lp-gold)",
              color: "var(--lp-950)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  )
}
