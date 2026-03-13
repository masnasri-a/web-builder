"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Palette, Settings2, X } from "lucide-react"
import Image from "next/image"
import type { Section, ThemeConfig } from "@/types"
import { FONT_OPTIONS } from "@/types"
import { ImageUploader } from "./image-uploader"
import { GalleryManager } from "./gallery-manager"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const MapPicker = dynamic(
  () => import("@/components/map-picker").then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Memuat peta...
      </div>
    ),
  }
)

const PRESET_QUOTES: { group: string; items: { quote: string; source: string }[] }[] = [
  {
    group: "Islam",
    items: [
      {
        quote:
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang...",
        source: "QS. Ar-Rum: 21",
      },
      {
        quote: "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).",
        source: "QS. Az-Zariyat: 49",
      },
      {
        quote:
          "...dan bertaqwalah kepada Allah yang dengan nama-Nya kamu saling meminta, dan (peliharalah) hubungan kekeluargaan. Sesungguhnya Allah selalu menjaga dan mengawasimu.",
        source: "QS. An-Nisa: 1",
      },
    ],
  },
  {
    group: "Kristen / Katolik",
    items: [
      {
        quote:
          "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong...",
        source: "1 Korintus 13:4-7",
      },
      {
        quote:
          "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
        source: "Matius 19:6",
      },
      {
        quote:
          "Hendaklah kamu selalu rendah hati, lemah lembut, dan sabar. Tunjukkanlah kasihmu dalam hal saling membantu.",
        source: "Efesus 4:2",
      },
      {
        quote: "Tali tiga lembar tak mudah diputuskan.",
        source: "Pengkhotbah 4:12",
      },
    ],
  },
  {
    group: "Hindu",
    items: [
      {
        quote:
          "Wahai mempelai laki-laki dan perempuan, semoga kalian tetap bersatu dan tidak pernah terpisahkan. Semoga kalian mencapai usia tua, bersenang-senang di rumah sendiri bersama anak cucu kalian.",
        source: "Rgveda X.85.42",
      },
      {
        quote: "Maka dari itu jadilah kamu pasangan yang serasi, seia sekata, sehati, dan sejiwa.",
        source: "Atharvaveda VI.11.1",
      },
    ],
  },
  {
    group: "Sastra / Umum",
    items: [
      {
        quote:
          "Kalian dilahirkan bersama-sama, dan bersama-samalah kalian selamanya... namun biarlah ada ruang di antara kebersamaan itu.",
        source: "Kahlil Gibran",
      },
      {
        quote:
          "Aku ingin mencintaimu dengan sederhana; dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu.",
        source: "Sapardi Djoko Damono",
      },
    ],
  },
]

interface RightPanelProps {
  invitationId: string
  activeSection: string | null
  sections: Section[]
  themeConfig: ThemeConfig
  groomName: string
  brideName: string
  eventDate: string
  eventVenue: string
  eventAddress: string
  onUpdateContent: (id: string, content: Record<string, unknown>) => void
  onUpdateTheme: (config: Partial<ThemeConfig>) => void
  onSetField: (field: string, value: string) => void
}

export function RightPanel({
  invitationId,
  activeSection,
  sections,
  themeConfig,
  groomName,
  brideName,
  eventDate,
  eventVenue,
  eventAddress,
  onUpdateContent,
  onUpdateTheme,
  onSetField,
}: RightPanelProps) {
  const section = sections.find((s) => s.id === activeSection)

  return (
    <div className="flex w-80 flex-col border-l border-border bg-card pb-24">
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {activeSection ? "Section Config" : "Theme Config"}
        </p>
      </div>

      <ScrollArea className="flex-1 h-full">
        <div className="h-full p-4 space-y-5 overflow-y-auto">
          {/* Section-specific config */}
          {section ? (
            <SectionConfig
              invitationId={invitationId}
              section={section}
              groomName={groomName}
              brideName={brideName}
              eventDate={eventDate}
              eventVenue={eventVenue}
              eventAddress={eventAddress}
              onUpdateContent={onUpdateContent}
              onSetField={onSetField}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Click a section on the left to configure it.
            </p>
          )}

          <Separator />

          {/* Theme Variables */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Theme Colors
              </span>
            </div>
            <div className="space-y-3">
              <ColorField
                label="Primary Color"
                value={themeConfig.primaryColor}
                onChange={(v) => onUpdateTheme({ primaryColor: v })}
              />
              <ColorField
                label="Accent Color"
                value={themeConfig.accentColor}
                onChange={(v) => onUpdateTheme({ accentColor: v })}
              />
              <ColorField
                label="Background"
                value={themeConfig.bgColor}
                onChange={(v) => onUpdateTheme({ bgColor: v })}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl font-mono text-xs uppercase"
          maxLength={7}
        />
      </div>
    </div>
  )
}

interface SectionConfigProps {
  invitationId: string
  section: Section
  groomName: string
  brideName: string
  eventDate: string
  eventVenue: string
  eventAddress: string
  onUpdateContent: (id: string, content: Record<string, unknown>) => void
  onSetField: (field: string, value: string) => void
}

function SectionConfig({
  invitationId,
  section,
  groomName,
  brideName,
  eventDate,
  eventVenue,
  eventAddress,
  onUpdateContent,
  onSetField,
}: SectionConfigProps) {
  const { id, type, content } = section
  const c = content as Record<string, string>

  const field = (
    label: string,
    key: string,
    placeholder?: string,
    multiline = false
  ) => (
    <div key={key} className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {multiline ? (
        <Textarea
          value={c[key] ?? ""}
          onChange={(e) => onUpdateContent(id, { [key]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="rounded-xl text-sm"
        />
      ) : (
        <Input
          value={c[key] ?? ""}
          onChange={(e) => onUpdateContent(id, { [key]: e.target.value })}
          placeholder={placeholder}
          className="rounded-xl text-sm"
        />
      )}
    </div>
  )

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {type} settings
        </span>
      </div>
      <div className="space-y-3">
        {/* font picker for individual section */}
        <div className="space-y-1.5">
          <Label className="text-xs">Font</Label>
          <Select
            value={(c.fontFamily as string) || ""}
            onValueChange={(v) => onUpdateContent(id, { fontFamily: v })}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* per-section background image */}
        <div className="space-y-1.5">
          <Label className="text-xs">Background Image</Label>
          {c.bgImage && (
            <div className="relative">
              <Image
                src={c.bgImage as string}
                alt="Section background"
                width={240}
                height={135}
                className="w-full rounded-lg object-cover"
              />
              <button
                onClick={() => onUpdateContent(id, { bgImage: "" })}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <ImageUploader
            invitationId={invitationId}
            type="background"
            onUploaded={(url) => onUpdateContent(id, { bgImage: url })}
          />
        </div>

        {type === "hero" && (
          <>
            {field("Title", "title", "Wedding Invitation")}
            {field("Subtitle", "subtitle", "Together with their families")}
          </>
        )}
        {type === "couple" && (
          <>
            {/* Layout toggle */}
            <div className="space-y-1.5">
              <Label className="text-xs">Layout</Label>
              <div className="flex gap-2">
                {(["side-by-side", "top-bottom"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onUpdateContent(id, { coupleLayout: opt })}
                    className={`flex-1 rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                      (c.coupleLayout ?? "side-by-side") === opt
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {opt === "side-by-side" ? "Side by Side" : "Top & Bottom"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Groom&apos;s Name</Label>
              <Input
                value={groomName}
                onChange={(e) => onSetField("groomName", e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            {field("Groom's Bio", "groomBio", "About the groom...", true)}
            {field("Groom's Parents", "groomParents", "Son of Mr. & Mrs. ...")}
            {field("Groom's Instagram", "groomInstagram", "username (without @)")}
            <div className="space-y-1.5">
              <Label className="text-xs">Groom&apos;s Photo</Label>
              {c.groomPhoto && (
                <Image
                  src={c.groomPhoto as string}
                  alt="Groom"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              )}
              <ImageUploader
                invitationId={invitationId}
                type="profile"
                onUploaded={(url) => onUpdateContent(id, { groomPhoto: url })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Bride&apos;s Name</Label>
              <Input
                value={brideName}
                onChange={(e) => onSetField("brideName", e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            {field("Bride's Bio", "brideBio", "About the bride...", true)}
            {field("Bride's Parents", "brideParents", "Daughter of Mr. & Mrs. ...")}
            {field("Bride's Instagram", "brideInstagram", "username (without @)")}
            <div className="space-y-1.5">
              <Label className="text-xs">Bride&apos;s Photo</Label>
              {c.bridePhoto && (
                <Image
                  src={c.bridePhoto as string}
                  alt="Bride"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              )}
              <ImageUploader
                invitationId={invitationId}
                type="profile"
                onUploaded={(url) => onUpdateContent(id, { bridePhoto: url })}
              />
            </div>
          </>
        )}
        {type === "event" && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Venue Name</Label>
              <Input
                value={eventVenue}
                onChange={(e) => onSetField("eventVenue", e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Venue Address</Label>
              <Textarea
                value={eventAddress}
                onChange={(e) => onSetField("eventAddress", e.target.value)}
                rows={2}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Wedding Date</Label>
              <Input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => onSetField("eventDate", e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            {/* Dynamic events */}
            <EventsEditor
              events={(c.events as unknown as EventItem[]) ?? []}
              onChange={(events) => onUpdateContent(id, { events })}
            />
          </>
        )}
        {type === "rsvp" && (
          <>
            {field("Form Title", "title", "RSVP")}
            {field("RSVP Deadline", "deadline", "e.g. 1 July 2025")}
          </>
        )}
        {type === "closing" && (
          <>{field("Closing Message", "message", "We look forward to seeing you!", true)}</>
        )}
        {type === "countdown" && (
          <p className="text-xs text-muted-foreground">
            Countdown automatically uses the wedding date.
          </p>
        )}
        {type === "gallery" && (
          <GalleryManager
            invitationId={invitationId}
            images={(c.images as unknown as string[]) || []}
            onUpdateImages={(images) => onUpdateContent(id, { images })}
          />
        )}
        {type === "maps" && (
          <>
            {field("Label Lokasi", "label", "Lokasi Acara")}
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Pilih Lokasi</p>
              <MapPicker
                defaultAddress={c["address"] ?? ""}
                onSelect={(result) =>
                  onUpdateContent(id, {
                    lat: String(result.lat),
                    lng: String(result.lng),
                    address: result.address,
                    label: c["label"] || result.venue,
                  })
                }
              />
              {c["address"] && (
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  📍 {c["address"]}
                </p>
              )}
            </div>
          </>
        )}
        {type === "gift" && (
          <GiftSectionConfig
            content={content as Record<string, unknown>}
            invitationId={invitationId}
            onChange={(partial) => onUpdateContent(id, partial)}
          />
        )}
        {type === "quote" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Pilih Kutipan</Label>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {PRESET_QUOTES.map((group) => (
                  <div key={group.group}>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {group.group}
                    </p>
                    <div className="space-y-1.5">
                      {group.items.map((item) => {
                        const isActive = c["quote"] === item.quote
                        return (
                          <button
                            key={item.source}
                            type="button"
                            onClick={() =>
                              onUpdateContent(id, { quote: item.quote, source: item.source })
                            }
                            className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                              isActive
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <span className="font-semibold">{item.source}</span>
                            <span className="mt-0.5 block line-clamp-2 opacity-70">
                              {item.quote}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <p className="text-[11px] text-muted-foreground">Atau ketik kutipan sendiri:</p>
            {field("Kutipan", "quote", "Tulis kutipan di sini...", true)}
            {field("Sumber", "source", "Misal: QS. Ar-Rum: 21")}
          </>
        )}
      </div>
    </div>
  )
}

// ── Dynamic events editor ────────────────────────────────────────────────────

type EventItem = { name: string; date: string; time: string }

function EventsEditor({
  events,
  onChange,
}: {
  events: EventItem[]
  onChange: (events: EventItem[]) => void
}) {
  function update(index: number, field: keyof EventItem, value: string) {
    const next = events.map((ev, i) =>
      i === index ? { ...ev, [field]: value } : ev
    )
    onChange(next)
  }

  function add() {
    if (events.length >= 5) return
    onChange([...events, { name: "", date: "", time: "" }])
  }

  function remove(index: number) {
    onChange(events.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Rangkaian Acara</Label>
        <button
          type="button"
          onClick={add}
          disabled={events.length >= 5}
          className="rounded-lg border border-border px-2 py-0.5 text-[10px] font-medium hover:bg-muted disabled:opacity-40 bg-primary text-white"
        >
          + Tambah
        </button>
      </div>
      {events.map((ev, i) => (
        <div key={i} className="rounded-xl border border-border p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Acara {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <Input
            value={ev.name}
            onChange={(e) => update(i, "name", e.target.value)}
            placeholder="Nama acara (mis. Akad Nikah)"
            className="rounded-lg text-xs h-7"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={ev.date}
              onChange={(e) => update(i, "date", e.target.value)}
              className="rounded-lg text-xs h-7 flex-1"
            />
            <Input
              type="time"
              value={ev.time}
              onChange={(e) => update(i, "time", e.target.value)}
              className="rounded-lg text-xs h-7 w-24"
            />
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-[11px] text-muted-foreground">
          Belum ada acara. Klik + Tambah untuk menambahkan.
        </p>
      )}
    </div>
  )
}

// ── Gift section config ──────────────────────────────────────────────────────

interface BankAccount {
  id: string
  bank: string
  accountNumber: string
  accountName: string
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  )
}

function GiftSectionConfig({
  content,
  invitationId,
  onChange,
}: {
  content: Record<string, unknown>
  invitationId: string
  onChange: (partial: Record<string, unknown>) => void
}) {
  const banks = (content.banks as BankAccount[]) ?? []
  const showQris = !!content.showQris
  const allowTransferProof = !!content.allowTransferProof

  function addBank() {
    onChange({
      banks: [
        ...banks,
        { id: Date.now().toString(), bank: "", accountNumber: "", accountName: "" },
      ],
    })
  }

  function updateBank(index: number, field: keyof BankAccount, value: string) {
    onChange({
      banks: banks.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    })
  }

  function removeBank(index: number) {
    onChange({ banks: banks.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label className="text-xs">Judul Section</Label>
        <Input
          value={(content.title as string) ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Hadiah Pernikahan"
          className="rounded-xl text-sm"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-xs">Deskripsi</Label>
        <Textarea
          value={(content.description as string) ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Doa dan kehadiran Anda adalah hadiah terindah..."
          rows={2}
          className="rounded-xl text-sm"
        />
      </div>

      {/* Bank accounts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Rekening Bank</Label>
          <button
            type="button"
            onClick={addBank}
            disabled={banks.length >= 5}
            className="rounded-lg bg-primary px-2 py-0.5 text-[10px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            + Tambah
          </button>
        </div>
        {banks.map((bank, i) => (
          <div key={bank.id} className="rounded-xl border border-border p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Bank {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeBank(i)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <Input
              value={bank.bank}
              onChange={(e) => updateBank(i, "bank", e.target.value)}
              placeholder="BCA / Mandiri / BNI"
              className="rounded-lg text-xs h-7"
            />
            <Input
              value={bank.accountNumber}
              onChange={(e) => updateBank(i, "accountNumber", e.target.value)}
              placeholder="Nomor Rekening"
              className="rounded-lg text-xs h-7 font-mono"
            />
            <Input
              value={bank.accountName}
              onChange={(e) => updateBank(i, "accountName", e.target.value)}
              placeholder="Nama Pemilik Rekening"
              className="rounded-lg text-xs h-7"
            />
          </div>
        ))}
        {banks.length === 0 && (
          <p className="text-[11px] text-muted-foreground">
            Belum ada rekening. Klik + Tambah untuk menambahkan.
          </p>
        )}
      </div>

      {/* QRIS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tampilkan QRIS</Label>
          <Toggle checked={showQris} onChange={(v) => onChange({ showQris: v })} />
        </div>
        {showQris && (
          <div className="space-y-1.5">
            {(content.qrisImage as string) && (
              <div className="relative inline-block">
                <Image
                  src={content.qrisImage as string}
                  alt="QRIS"
                  width={100}
                  height={100}
                  className="rounded-xl object-contain border border-border"
                />
                <button
                  onClick={() => onChange({ qrisImage: null })}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <ImageUploader
              invitationId={invitationId}
              type="gallery"
              onUploaded={(url) => onChange({ qrisImage: url })}
            />
            <p className="text-[10px] text-muted-foreground">Upload foto QRIS kamu.</p>
          </div>
        )}
      </div>

      {/* Allow transfer proof */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">Izinkan Upload Bukti Transfer</Label>
        <Toggle
          checked={allowTransferProof}
          onChange={(v) => onChange({ allowTransferProof: v })}
        />
      </div>
    </div>
  )
}
