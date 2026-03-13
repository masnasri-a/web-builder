/**
 * i18n Translations
 * Selembar.id — Indonesian (id) and English (en)
 */

export type Locale = "id" | "en"

export interface Translations {
  landing: {
    nav: { signIn: string; getStarted: string }
    hero: {
      badge: string
      title1: string
      title2: string
      subtitle: string
      cta: { start: string; themes: string }
    }
    social: { couples: string; rsvps: string; seo: string }
    themes: { title: string; subtitle: string }
    features: {
      title: string
      builder: { title: string; desc: string }
      rsvp: { title: string; desc: string }
      music: { title: string; desc: string }
      countdown: { title: string; desc: string }
      mobile: { title: string; desc: string }
      url: { title: string; desc: string }
    }
    pricing: { title: string; subtitle: string }
    footer: string
  }
  auth: {
    login: {
      title: string
      subtitle: string
      email: string
      password: string
      submit: string
      loading: string
      noAccount: string
      signUp: string
    }
    register: {
      title: string
      subtitle: string
      name: string
      email: string
      password: string
      submit: string
      loading: string
      hasAccount: string
      signIn: string
    }
  }
  dashboard: {
    nav: {
      dashboard: string
      invitations: string
      analytics: string
      settings: string
    }
    newInvitation: string
    logOut: string
  }
  builder: {
    sections: {
      hero: string
      couple: string
      event: string
      gallery: string
      countdown: string
      rsvp: string
      closing: string
      maps: string
      quote: string
    }
    theme: {
      choose: string
      preset: string
      custom: string
      apply: string
    }
  }
  invitation: {
    splash: { open: string }
    rsvp: {
      title: string
      name: string
      attendance: string
      attending: string
      notAttending: string
      guestCount: string
      message: string
      submit: string
      success: string
    }
    countdown: {
      days: string
      hours: string
      minutes: string
      seconds: string
    }
    maps: { openMap: string }
    music: { play: string; pause: string }
  }
  common: {
    cancel: string
    save: string
    loading: string
    error: string
    close: string
  }
}

export const translations: Record<Locale, Translations> = {
  id: {
    landing: {
      nav: { signIn: "Masuk", getStarted: "Mulai Gratis" },
      hero: {
        badge: "Undangan Pernikahan Digital",
        title1: "Undangan Cantik,",
        title2: "Dibuat dengan Mudah",
        subtitle:
          "Buat undangan pernikahan digital yang memukau dalam hitungan menit. Kustomisasi tema, pantau RSVP, dan bagikan ke semua tamu — semua dalam satu platform.",
        cta: { start: "Mulai Gratis", themes: "Lihat Tema" },
      },
      social: {
        couples: "500+ pasangan",
        rsvps: "10.000+ RSVP terlacak",
        seo: "URL yang mudah diingat",
      },
      themes: {
        title: "Pilih Gaya Kamu",
        subtitle:
          "Tema eksklusif untuk setiap selera. Kustomisasi warna, font, dan tata letak dengan visual builder.",
      },
      features: {
        title: "Semua yang Kamu Butuhkan",
        builder: {
          title: "Visual Builder",
          desc: "Susun section secara drag-and-drop, preview real-time, dan kustomisasi instan.",
        },
        rsvp: {
          title: "Pantau RSVP",
          desc: "Kumpulkan RSVP secara real-time dengan jumlah kehadiran dan pesan personal.",
        },
        music: {
          title: "Musik Latar",
          desc: "Tambahkan lagu romantis yang otomatis diputar saat tamu membuka undanganmu.",
        },
        countdown: {
          title: "Hitung Mundur",
          desc: "Countdown langsung menuju hari spesialmu membuat tamu semakin antusias.",
        },
        mobile: {
          title: "Mobile First",
          desc: "Undangan tampil sempurna di semua perangkat — ponsel, tablet, dan desktop.",
        },
        url: {
          title: "URL Kustom",
          desc: "Bagikan di selembar.id/nama-kamu — bersih, mudah diingat, dan mudah disebarkan.",
        },
      },
      pricing: {
        title: "Harga Transparan",
        subtitle: "Mulai gratis, upgrade sesuai kebutuhan.",
      },
      footer:
        "© 2025 Selembar.id — Dibuat dengan ❤️ untuk pasangan Indonesia.",
    },
    auth: {
      login: {
        title: "Masuk ke Selembar.id",
        subtitle: "Selamat datang kembali! Masukkan kredensialmu.",
        email: "Email",
        password: "Kata Sandi",
        submit: "Masuk",
        loading: "Sedang masuk...",
        noAccount: "Belum punya akun?",
        signUp: "Daftar",
      },
      register: {
        title: "Buat Akun Selembar.id",
        subtitle: "Mulai buat undangan pernikahan digitalmu.",
        name: "Nama Lengkap",
        email: "Email",
        password: "Kata Sandi",
        submit: "Buat Akun",
        loading: "Membuat akun...",
        hasAccount: "Sudah punya akun?",
        signIn: "Masuk",
      },
    },
    dashboard: {
      nav: {
        dashboard: "Dashboard",
        invitations: "Undangan Saya",
        analytics: "Analitik",
        settings: "Pengaturan",
      },
      newInvitation: "Undangan Baru",
      logOut: "Keluar",
    },
    builder: {
      sections: {
        hero: "Hero",
        couple: "Mempelai",
        event: "Acara",
        gallery: "Galeri",
        countdown: "Hitung Mundur",
        rsvp: "RSVP",
        closing: "Penutup",
        maps: "Lokasi / Maps",
        quote: "Kutipan / Ayat",
      },
      theme: {
        choose: "Pilih Tema",
        preset: "Tema Preset",
        custom: "Kustom",
        apply: "Terapkan",
      },
    },
    invitation: {
      splash: { open: "Buka Undangan" },
      rsvp: {
        title: "Konfirmasi Kehadiran",
        name: "Nama Kamu",
        attendance: "Apakah kamu akan hadir?",
        attending: "Ya, saya akan hadir!",
        notAttending: "Maaf, tidak bisa hadir",
        guestCount: "Jumlah tamu yang dibawa",
        message: "Pesan untuk mempelai (opsional)",
        submit: "Kirim RSVP",
        success: "Terima kasih! Sampai jumpa di hari pernikahan. 🎉",
      },
      countdown: {
        days: "Hari",
        hours: "Jam",
        minutes: "Menit",
        seconds: "Detik",
      },
      maps: { openMap: "Buka Google Maps" },
      music: { play: "Putar Musik", pause: "Jeda Musik" },
    },
    common: {
      cancel: "Batal",
      save: "Simpan",
      loading: "Memuat...",
      error: "Terjadi kesalahan",
      close: "Tutup",
    },
  },

  en: {
    landing: {
      nav: { signIn: "Sign In", getStarted: "Get Started Free" },
      hero: {
        badge: "Digital Wedding Invitations",
        title1: "Beautiful Invitations,",
        title2: "Effortlessly Made",
        subtitle:
          "Create stunning digital wedding invitations in minutes. Customize themes, track RSVPs, and share with your guests — all in one place.",
        cta: { start: "Start Free", themes: "See Themes" },
      },
      social: {
        couples: "500+ couples",
        rsvps: "10,000+ RSVPs tracked",
        seo: "SEO-friendly URLs",
      },
      themes: {
        title: "Choose Your Style",
        subtitle:
          "Handcrafted themes for every aesthetic. Customize colors, fonts, and layout with the visual builder.",
      },
      features: {
        title: "Everything You Need",
        builder: {
          title: "Visual Builder",
          desc: "Drag-and-drop sections, real-time preview, and instant customization.",
        },
        rsvp: {
          title: "RSVP Tracking",
          desc: "Collect RSVPs in real-time with attendance count and personal messages.",
        },
        music: {
          title: "Background Music",
          desc: "Add a romantic song to play automatically when guests open your invitation.",
        },
        countdown: {
          title: "Countdown Timer",
          desc: "A live countdown to your big day keeps guests excited and informed.",
        },
        mobile: {
          title: "Mobile First",
          desc: "Invitations look stunning on every device — mobile, tablet, and desktop.",
        },
        url: {
          title: "Custom URL",
          desc: "Share at selembar.id/your-name — clean, memorable, and shareable.",
        },
      },
      pricing: {
        title: "Simple Pricing",
        subtitle: "Start free, upgrade when you need more.",
      },
      footer:
        "© 2025 Selembar.id — Built with ❤️ for Indonesian couples.",
    },
    auth: {
      login: {
        title: "Sign in to Selembar.id",
        subtitle: "Welcome back! Enter your credentials.",
        email: "Email",
        password: "Password",
        submit: "Sign In",
        loading: "Signing in...",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
      },
      register: {
        title: "Create your Selembar.id account",
        subtitle: "Start creating beautiful digital wedding invitations.",
        name: "Full Name",
        email: "Email",
        password: "Password",
        submit: "Create Account",
        loading: "Creating account...",
        hasAccount: "Already have an account?",
        signIn: "Sign in",
      },
    },
    dashboard: {
      nav: {
        dashboard: "Dashboard",
        invitations: "My Invitations",
        analytics: "Analytics",
        settings: "Settings",
      },
      newInvitation: "New Invitation",
      logOut: "Log Out",
    },
    builder: {
      sections: {
        hero: "Hero",
        couple: "Couple",
        event: "Event",
        gallery: "Gallery",
        countdown: "Countdown",
        rsvp: "RSVP",
        closing: "Closing",
        maps: "Location / Maps",
        quote: "Quote / Verse",
      },
      theme: {
        choose: "Choose Theme",
        preset: "Preset Themes",
        custom: "Custom",
        apply: "Apply",
      },
    },
    invitation: {
      splash: { open: "Open Invitation" },
      rsvp: {
        title: "RSVP",
        name: "Your Name",
        attendance: "Will you attend?",
        attending: "Yes, I'll be there!",
        notAttending: "Sorry, can't make it",
        guestCount: "Number of guests",
        message: "Your message (optional)",
        submit: "Send RSVP",
        success: "Thank you! See you at the wedding. 🎉",
      },
      countdown: {
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
      },
      maps: { openMap: "Open Google Maps" },
      music: { play: "Play Music", pause: "Pause Music" },
    },
    common: {
      cancel: "Cancel",
      save: "Save",
      loading: "Loading...",
      error: "Something went wrong",
      close: "Close",
    },
  },
}

/**
 * Get a nested translation value using dot notation.
 * e.g. t("landing.hero.badge")
 */
export function t(locale: Locale, key: string): string {
  const keys = key.split(".")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let val: any = translations[locale]
  for (const k of keys) {
    val = val?.[k]
  }
  return typeof val === "string" ? val : key
}

/** Default locale for the app */
export const DEFAULT_LOCALE: Locale = "id"

/** All supported locales */
export const SUPPORTED_LOCALES: Locale[] = ["id", "en"]
