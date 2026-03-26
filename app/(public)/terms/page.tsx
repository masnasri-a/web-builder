import type { Metadata } from "next"
import Link from "next/link"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://selembar.id"
const LAST_UPDATED = "26 Maret 2026"

export const metadata: Metadata = {
  title: "Terms of Use — Syarat & Ketentuan | Selembar.id",
  description: "Syarat dan ketentuan penggunaan layanan undangan digital Selembar.id.",
  alternates: { canonical: `${BASE_URL}/terms` },
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Penerimaan Syarat",
    content: `Dengan mengakses atau menggunakan layanan Selembar.id ("Layanan"), Anda menyatakan telah membaca, memahami, dan menyetujui syarat dan ketentuan ini ("Syarat") beserta Kebijakan Privasi kami. Jika Anda tidak menyetujui Syarat ini, harap hentikan penggunaan Layanan.

Anda harus berusia minimal 17 tahun untuk menggunakan Layanan ini. Dengan mendaftar, Anda menyatakan bahwa Anda memenuhi persyaratan usia ini.`,
  },
  {
    id: "service",
    title: "2. Deskripsi Layanan",
    content: `Selembar.id adalah platform undangan pernikahan digital yang memungkinkan pengguna untuk:

• Membuat dan mempersonalisasi undangan digital dengan berbagai tema.
• Mengelola daftar tamu dan konfirmasi kehadiran (RSVP) secara online.
• Membagikan undangan melalui tautan unik kepada tamu.
• Mengakses fitur premium seperti galeri foto, musik latar, dan analitik tamu melalui paket berlangganan.

Kami berhak mengubah, menangguhkan, atau menghentikan fitur Layanan kapan saja dengan pemberitahuan yang wajar kepada pengguna aktif.`,
  },
  {
    id: "account",
    title: "3. Akun Pengguna",
    content: `**3.1 Pendaftaran**: Anda wajib menyediakan informasi yang akurat, lengkap, dan terkini saat mendaftar. Anda bertanggung jawab atas kerahasiaan kata sandi akun Anda.

**3.2 Keamanan akun**: Anda bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda. Segera beritahu kami jika terjadi akses tidak sah ke akun Anda.

**3.3 Satu akun per pengguna**: Setiap pengguna diperbolehkan memiliki satu akun. Pembuatan akun ganda untuk menghindari pembatasan atau sanksi tidak diperbolehkan.

**3.4 Penangguhan**: Kami berhak menangguhkan atau menghapus akun yang melanggar Syarat ini, melakukan penipuan, atau membahayakan keamanan platform.`,
  },
  {
    id: "content",
    title: "4. Konten Pengguna",
    content: `**4.1 Kepemilikan**: Anda mempertahankan semua hak atas konten yang Anda unggah (foto, teks, musik). Dengan menggunakan Layanan, Anda memberikan kami lisensi terbatas untuk menyimpan, memproses, dan menampilkan konten tersebut guna menyediakan Layanan.

**4.2 Larangan konten**: Anda dilarang mengunggah atau menyebarkan konten yang:
• Melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak lain.
• Mengandung materi ilegal, pornografi, SARA, atau yang merugikan pihak lain.
• Mengandung malware, virus, atau kode berbahaya.
• Bersifat menipu, memfitnah, atau melecehkan.

**4.3 Tanggung jawab konten**: Anda sepenuhnya bertanggung jawab atas konten yang Anda buat dan bagikan melalui platform kami.

**4.4 Musik yang diunggah**: Fitur musik latar memungkinkan Anda mengunggah berkas audio ke dalam undangan digital. Selembar.id **tidak** menyediakan, memiliki, atau melisensikan musik apa pun — semua berkas audio adalah konten yang diunggah sepenuhnya oleh pengguna. Anda bertanggung jawab penuh untuk memastikan bahwa musik yang Anda unggah bebas dari hak cipta pihak lain atau telah mendapatkan izin yang sah dari pemegang hak cipta yang bersangkutan. Selembar.id tidak bertanggung jawab atas klaim, tuntutan, atau kerugian yang timbul akibat penggunaan musik tanpa izin yang diunggah oleh pengguna.`,
  },
  {
    id: "payment",
    title: "5. Pembayaran dan Langganan",
    content: `**5.1 Paket berlangganan**: Paket berbayar tersedia dalam periode berlangganan tertentu (bulanan atau sesuai konfigurasi). Harga tercantum dalam Rupiah Indonesia (IDR) dan tidak termasuk pajak yang mungkin berlaku.

**5.2 Pembayaran**: Semua pembayaran diproses melalui gateway pembayaran pihak ketiga yang aman. Kami tidak menyimpan informasi kartu atau rekening bank Anda.

**5.3 Tidak ada refund otomatis**: Pembayaran yang telah berhasil dikonfirmasi umumnya tidak dapat dikembalikan kecuali terdapat kesalahan teknis dari pihak kami yang terdokumentasi. Hubungi tim kami dalam 3×24 jam jika mengalami masalah.

**5.4 Perpanjangan**: Langganan **tidak** diperpanjang secara otomatis. Anda perlu melakukan pembayaran baru untuk memperpanjang akses premium.

**5.5 Ekspirasi**: Setelah langganan habis, akun akan kembali ke fitur paket Gratis. Data dan undangan tetap tersimpan namun fitur premium tidak dapat diakses.`,
  },
  {
    id: "prohibited",
    title: "6. Penggunaan yang Dilarang",
    content: `Anda dilarang menggunakan Layanan untuk:

• Menyalin, mendistribusikan, atau menjual kembali Layanan tanpa izin tertulis kami.
• Melakukan reverse engineering, decompile, atau dekripsi perangkat lunak kami.
• Menggunakan bot, scraper, atau alat otomatis untuk mengakses atau mengumpulkan data dari platform.
• Mengirim spam atau komunikasi massal yang tidak diminta kepada tamu undangan.
• Mengganggu infrastruktur, server, atau jaringan yang terhubung dengan Layanan.
• Memalsukan identitas orang lain atau membuat undangan palsu untuk tujuan penipuan.`,
  },
  {
    id: "ip",
    title: "7. Kekayaan Intelektual",
    content: `Semua elemen Layanan yang tidak dibuat oleh pengguna — termasuk desain tema, antarmuka, logo, nama merek, dan kode perangkat lunak — adalah milik PT Nuratech Digital Nusantara dan dilindungi oleh hukum kekayaan intelektual Indonesia.

Anda tidak diperbolehkan menggunakan merek, logo, atau elemen desain kami tanpa izin tertulis sebelumnya.`,
  },
  {
    id: "copyright",
    title: "8. Hak Cipta & Status Selembar.id sebagai Penyedia Platform",
    content: `**8.1 Selembar.id sebagai penyedia platform**: Selembar.id beroperasi semata-mata sebagai penyedia platform teknologi (technology platform provider). Kami bukan pencipta, penerbit, distributor, maupun pemegang hak cipta atas konten yang dibuat atau diunggah oleh pengguna — termasuk namun tidak terbatas pada foto, teks, video, dan berkas audio/musik.

**8.2 Tanggung jawab hak cipta konten pengguna**: Seluruh tanggung jawab atas keabsahan hak cipta dan legalitas konten yang diunggah ke platform berada sepenuhnya pada pengguna yang mengunggah konten tersebut. Pengguna wajib memastikan bahwa mereka memiliki hak, lisensi, atau izin yang diperlukan sebelum mengunggah konten apa pun.

**8.3 Musik**: Musik yang diputar dalam undangan digital adalah berkas audio yang **diunggah dan dipilih sendiri oleh pengguna**. Selembar.id tidak menyediakan perpustakaan musik berlisensi, tidak mengkurasi, dan tidak memverifikasi status hak cipta berkas audio yang diunggah. Pengguna bertanggung jawab penuh untuk memperoleh izin dari pemegang hak cipta musik yang bersangkutan sebelum menggunakannya.

**8.4 Pelanggaran hak cipta (DMCA/Hak Cipta Indonesia)**: Jika Anda adalah pemegang hak cipta dan menemukan konten di platform kami yang melanggar hak Anda, silakan kirimkan pemberitahuan resmi ke **hello@selembar.id** dengan menyertakan identitas Anda, deskripsi karya yang dilanggar, dan tautan konten yang dimaksud. Kami akan menindaklanjuti laporan yang valid sesuai dengan Undang-Undang Hak Cipta Republik Indonesia (UU No. 28 Tahun 2014).`,
  },
  {
    id: "disclaimer",
    title: "9. Penafian dan Batasan Tanggung Jawab",
    content: `**8.1 Layanan "sebagaimana adanya"**: Layanan disediakan tanpa jaminan apapun, tersurat maupun tersirat, termasuk namun tidak terbatas pada jaminan ketersediaan, akurasi, atau kesesuaian untuk tujuan tertentu.

**8.2 Batasan tanggung jawab**: Sejauh diizinkan hukum, PT Nuratech Digital Nusantara tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan.

**8.3 Force majeure**: Kami tidak bertanggung jawab atas kegagalan layanan akibat bencana alam, pemadaman listrik, gangguan jaringan, atau kejadian di luar kendali kami.`,
  },
  {
    id: "termination",
    title: "10. Penghentian Layanan",
    content: `**9.1 Oleh pengguna**: Anda dapat menghapus akun Anda kapan saja melalui pengaturan akun atau dengan menghubungi tim kami. Penghapusan akun bersifat permanen.

**9.2 Oleh kami**: Kami berhak menangguhkan atau mengakhiri akun Anda dengan atau tanpa pemberitahuan jika Anda melanggar Syarat ini, melakukan penipuan, atau membahayakan pengguna lain.

**9.3 Efek penghentian**: Setelah penghentian, semua lisensi yang diberikan kepada Anda akan berakhir dan Anda harus berhenti menggunakan Layanan. Ketentuan yang secara alamiah seharusnya bertahan (seperti batasan tanggung jawab dan penyelesaian sengketa) akan tetap berlaku.`,
  },
  {
    id: "governing-law",
    title: "11. Hukum yang Berlaku",
    content: `Syarat ini diatur oleh dan ditafsirkan sesuai dengan hukum Negara Kesatuan Republik Indonesia. Setiap sengketa yang timbul dari atau berkaitan dengan Syarat ini akan diselesaikan melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta, Indonesia.`,
  },
  {
    id: "changes",
    title: "12. Perubahan Syarat",
    content: `Kami berhak memperbarui Syarat ini kapan saja. Perubahan material akan diberitahukan melalui email atau notifikasi dalam aplikasi setidaknya 7 hari sebelum berlaku. Penggunaan Layanan secara berkelanjutan setelah berlakunya perubahan dianggap sebagai penerimaan Syarat yang diperbarui.`,
  },
  {
    id: "contact",
    title: "13. Kontak",
    content: `Pertanyaan atau masukan mengenai Syarat ini dapat disampaikan kepada:

**PT Nuratech Digital Nusantara**
Email: hello@selembar.id
Website: https://nuratech.id`,
  },
]

export default function TermsPage() {
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
          Syarat &amp; <em>Ketentuan</em>
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
            Dokumen ini merupakan perjanjian hukum antara Anda dan <strong>PT Nuratech Digital Nusantara</strong>{" "}
            selaku pengelola platform <strong>Selembar.id</strong>. Harap baca dengan seksama sebelum
            menggunakan layanan kami.
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
                className="text-sm leading-relaxed whitespace-pre-line"
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
            Dengan menggunakan Selembar.id, Anda menyetujui syarat ini.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs underline underline-offset-2 transition-opacity hover:opacity-60"
              style={{ color: "var(--lp-800)", fontFamily: "system-ui, sans-serif" }}
            >
              Privacy Policy →
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
