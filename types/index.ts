export type SectionType =
  | "hero"
  | "couple"
  | "event"
  | "gallery"
  | "countdown"
  | "rsvp"
  | "closing"
  | "maps"
  | "quote"
  | "gift"

export type Section = {
  id: string
  type: SectionType
  visible: boolean
  order: number
  // sections may include arbitrary content fields (subtitle, photos, etc.)
  // we also reserve `fontFamily` for an optional per‑section font override.
  content: Record<string, unknown> & { fontFamily?: string }
}

export type ThemeConfig = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  bgColor: string
  bgImage?: string
}

export type InvitationWithRelations = {
  id: string
  slug: string
  groomName: string
  brideName: string
  eventDate: Date
  eventVenue: string
  eventAddress: string | null
  eventTime: string | null
  sections: Section[]
  themeConfig: ThemeConfig
  musicUrl: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  theme: {
    id: string
    name: string
    slug: string
    previewImage: string | null
    config: ThemeConfig
  }
  guests: GuestRecord[]
  _count?: { guests: number }
}

export type GuestRecord = {
  id: string
  name: string
  phone: string | null
  email: string | null
  attendance: "PENDING" | "ATTENDING" | "NOT_ATTENDING"
  guestCount: number
  message: string | null
  createdAt: Date
}

export const FREE_TIER_LIMIT = 10
export const PRO_TIER_LIMIT = 100

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: "hero",
    type: "hero",
    visible: true,
    order: 0,
    content: {
      title: "Wedding Invitation",
      subtitle: "Together with their families",
      textX: 50,
      textY: 50,
    },
  },
  {
    id: "couple",
    type: "couple",
    visible: true,
    order: 1,
    content: {
      groomBio: "",
      brideBio: "",
      groomPhoto: "",
      bridePhoto: "",
      groomParents: "",
      brideParents: "",
      coupleLayout: "side-by-side",
      groomInstagram: "",
      brideInstagram: "",
    },
  },
  {
    id: "event",
    type: "event",
    visible: true,
    order: 2,
    content: {
      events: [
        { name: "Akad Nikah", date: "", time: "" },
        { name: "Resepsi", date: "", time: "" },
      ],
    },
  },
  {
    id: "gallery",
    type: "gallery",
    visible: false,
    order: 3,
    content: { images: [] },
  },
  {
    id: "countdown",
    type: "countdown",
    visible: true,
    order: 4,
    content: {},
  },
  {
    id: "rsvp",
    type: "rsvp",
    visible: true,
    order: 5,
    content: {
      title: "RSVP",
      deadline: "",
    },
  },
  {
    id: "closing",
    type: "closing",
    visible: true,
    order: 6,
    content: {
      message:
        "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
    },
  },
  {
    id: "maps",
    type: "maps",
    visible: false,
    order: 7,
    content: {
      embedUrl: "",
      label: "Lokasi Acara",
    },
  },
  {
    id: "quote",
    type: "quote",
    visible: false,
    order: 8,
    content: {
      quote:
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya...",
      source: "QS. Ar-Rum: 21",
    },
  },
  {
    id: "gift",
    type: "gift",
    visible: false,
    order: 9,
    content: {
      title: "Hadiah Pernikahan",
      description: "Doa dan kehadiran Anda adalah hadiah terindah bagi kami.",
      showQris: false,
      qrisImage: null,
      banks: [],
      allowTransferProof: false,
    },
  },
]

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primaryColor: "#14B8A6",
  secondaryColor: "#F9F5F0",
  accentColor: "#D4A853",
  fontFamily: "Playfair Display",
  bgColor: "#FFF9F0",
}

export const FONT_OPTIONS = [
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond" },
  { label: "Great Vibes", value: "Great Vibes" },
  { label: "Lora", value: "Lora" },
  { label: "Cinzel", value: "Cinzel" },
  { label: "Dancing Script", value: "Dancing Script" },
  { label: "Geist Sans", value: "Geist Sans" },
]
