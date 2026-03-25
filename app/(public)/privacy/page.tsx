import type { Metadata } from "next"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://selembar.id"
const LAST_UPDATED = "26 Maret 2026"

export const metadata: Metadata = {
  title: "Privacy Policy — Kebijakan Privasi | Selembar.id",
  description: "Kebijakan privasi Selembar.id — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  alternates: { canonical: `${BASE_URL}/privacy` },
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    id: "data-collected",
    title: "1. Data yang Kami Kumpulkan",
    content: `Kami mengumpulkan informasi yang Anda berikan secara langsung, antara lain:

• **Data akun**: nama, alamat email, dan kata sandi (disimpan dalam bentuk hash terenkripsi).
• **Data undangan**: nama pasangan, tanggal dan lokasi acara, foto, serta konten lain yang Anda masukkan ke dalam editor undangan.
• **Data tamu (RSVP)**: nama tamu, nomor telepon, alamat email, dan konfirmasi kehadiran yang diisi oleh tamu undangan.
• **Data pembayaran**: catatan transaksi berupa jumlah, tanggal, dan status pembayaran. Kami tidak menyimpan detail kartu kredit atau rekening bank.
• **Data penggunaan**: log aktivitas, alamat IP, jenis perangkat, browser, serta halaman yang dikunjungi untuk keperluan analitik internal.`,
  },
  {
    id: "data-use",
    title: "2. Cara Kami Menggunakan Data",
    content: `Data Anda digunakan untuk:

• Menyediakan, mengoperasikan, dan meningkatkan layanan Selembar.id.
• Memproses pembayaran dan mengelola langganan paket Anda.
• Mengirimkan notifikasi penting terkait akun dan layanan (bukan iklan pihak ketiga).
• Mendeteksi dan mencegah penyalahgunaan, penipuan, atau pelanggaran keamanan.
• Memenuhi kewajiban hukum yang berlaku di Indonesia.`,
  },
  {
    id: "data-sharing",
    title: "3. Berbagi Data dengan Pihak Ketiga",
    content: `Kami **tidak menjual** data pribadi Anda kepada pihak mana pun. Data dapat dibagikan hanya dalam kondisi berikut:

• **Penyedia layanan**: mitra teknis seperti penyedia hosting, database cloud, dan gateway pembayaran yang membantu operasional platform kami, tunduk pada perjanjian kerahasiaan.
• **Kewajiban hukum**: bila diwajibkan oleh hukum, peraturan, atau perintah pengadilan yang berlaku di Indonesia.
• **Perlindungan hak**: untuk melindungi hak, properti, atau keselamatan Selembar.id, pengguna kami, atau masyarakat.`,
  },
  {
    id: "cookies",
    title: "4. Cookie dan Teknologi Pelacak",
    content: `Kami menggunakan cookie dan penyimpanan lokal untuk:

• Menjaga sesi login Anda tetap aktif dan aman.
• Menyimpan preferensi tampilan (tema, bahasa).
• Menganalisis penggunaan platform secara agregat dan anonim.

Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur layanan mungkin tidak berfungsi optimal.`,
  },
  {
    id: "data-security",
    title: "5. Keamanan Data",
    content: `Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar, termasuk:

• Enkripsi HTTPS pada semua komunikasi data.
• Kata sandi disimpan sebagai hash bcrypt — tidak pernah dalam bentuk teks biasa.
• Akses ke database dibatasi hanya untuk personel yang berwenang.
• Pemantauan sistem secara rutin untuk mendeteksi ancaman.

Meskipun demikian, tidak ada sistem yang 100% aman. Kami menyarankan Anda menggunakan kata sandi yang kuat dan tidak membagikan kredensial akun Anda.`,
  },
  {
    id: "user-rights",
    title: "6. Hak Pengguna",
    content: `Sesuai dengan peraturan perlindungan data yang berlaku, Anda berhak untuk:

• **Mengakses** data pribadi yang kami simpan tentang Anda.
• **Memperbaiki** data yang tidak akurat atau tidak lengkap.
• **Menghapus** akun dan data Anda (dengan menghubungi tim kami).
• **Membatasi** atau **menolak** pemrosesan data dalam kondisi tertentu.
• **Portabilitas data** — meminta ekspor data Anda dalam format yang dapat dibaca mesin.

Untuk menggunakan hak-hak ini, hubungi kami di **hello@selembar.id**.`,
  },
  {
    id: "data-retention",
    title: "7. Retensi Data",
    content: `Kami menyimpan data Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan. Setelah akun dihapus:

• Data akun dan undangan dihapus dalam waktu 30 hari.
• Data log dan analitik agregat dapat disimpan hingga 2 tahun dalam bentuk anonim.
• Data pembayaran disimpan selama 5 tahun sesuai ketentuan perpajakan Indonesia.`,
  },
  {
    id: "children",
    title: "8. Privasi Anak-Anak",
    content: `Layanan Selembar.id ditujukan untuk pengguna berusia 17 tahun ke atas. Kami tidak secara sengaja mengumpulkan data dari anak-anak di bawah usia 17 tahun. Jika Anda mengetahui bahwa seorang anak telah mendaftar tanpa izin orang tua, silakan hubungi kami untuk segera menghapus data tersebut.`,
  },
  {
    id: "changes",
    title: "9. Perubahan Kebijakan",
    content: `Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan akan kami beritahukan melalui email atau notifikasi dalam aplikasi setidaknya 7 hari sebelum berlaku. Penggunaan layanan secara berkelanjutan setelah tanggal berlaku perubahan dianggap sebagai penerimaan kebijakan yang diperbarui.`,
  },
  {
    id: "contact",
    title: "10. Hubungi Kami",
    content: `Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan privasi ini, silakan hubungi:

**PT Nuratech Karya Indonesia**
Email: hello@selembar.id
Website: https://nuratech.id`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="px-6 py-20 text-center lg:px-12"
        style={{ background: "linear-gradient(160deg, var(--lp-950) 0%, var(--lp-900) 100%)" }}
      >
        <p
          className="lp-tag mb-4 tracking-[.22em]"
          style={{ color: "var(--lp-gold)", fontFamily: "system-ui, sans-serif" }}
        >
          Legal
        </p>
        <h1
          className="lp-serif text-4xl font-light md:text-5xl"
          style={{ color: "var(--lp-cream-light)" }}
        >
          Kebijakan <em>Privasi</em>
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ color: "rgba(245,239,230,0.5)", fontFamily: "system-ui, sans-serif" }}
        >
          Terakhir diperbarui: {LAST_UPDATED}
        </p>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-14 lg:px-8">

        {/* Intro */}
        <div
          className="mb-10 rounded-2xl p-6"
          style={{ background: "rgba(27,58,45,0.04)", border: "1px solid rgba(27,58,45,0.1)" }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(27,58,45,0.75)", fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
          >
            Selamat datang di <strong>Selembar.id</strong>, layanan undangan digital pernikahan premium yang
            dioperasikan oleh PT Nuratech Karya Indonesia. Kebijakan Privasi ini menjelaskan bagaimana
            kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda ketika
            menggunakan layanan kami. Dengan menggunakan Selembar.id, Anda menyetujui praktik yang
            dijelaskan dalam kebijakan ini.
          </p>
        </div>

        {/* Table of contents */}
        <div className="mb-10">
          <p
            className="lp-tag mb-3"
            style={{ color: "var(--lp-600)", fontFamily: "system-ui, sans-serif" }}
          >
            Daftar Isi
          </p>
          <ul className="space-y-1.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{ color: "var(--lp-900)", fontFamily: "system-ui, sans-serif" }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <h2
                className="lp-serif mb-4 text-2xl font-semibold"
                style={{ color: "var(--lp-950)" }}
              >
                {s.title}
              </h2>
              <div
                className="space-y-2 text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(27,58,45,0.75)", fontFamily: "system-ui, sans-serif", lineHeight: "1.85" }}
                dangerouslySetInnerHTML={{
                  __html: s.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/• /g, "• "),
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div
          className="mt-14 border-t pt-8 flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "rgba(27,58,45,0.1)" }}
        >
          <p
            className="text-xs"
            style={{ color: "rgba(27,58,45,0.45)", fontFamily: "system-ui, sans-serif" }}
          >
            Dokumen ini berlaku untuk semua pengguna Selembar.id di Indonesia.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-xs underline underline-offset-2 transition-opacity hover:opacity-60"
              style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif" }}
            >
              Terms of Use →
            </Link>
            <Link
              href="/contact"
              className="text-xs underline underline-offset-2 transition-opacity hover:opacity-60"
              style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif" }}
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
