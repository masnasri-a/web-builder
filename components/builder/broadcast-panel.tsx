"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import {
  Send,
  Plus,
  Trash2,
  Download,
  Upload,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ─── Types ───────────────────────────────────────────────────────────────────

type Contact = {
  id: string
  name: string
  phone: string
  status: "pending" | "sent"
}

type Template = {
  id: string
  label: string
  body: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  {
    id: "islami",
    label: "Islami",
    body: `Assalamualaikum Wr. Wb. ✨

Yth. {name},

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami:

💍 *Pernikahan {groomName} & {brideName}* 💍

📲 Undangan Digital:
{link}

🗓️ *Waktu & Tempat*
- Hari/Tgl : {date}
- Tempat   : {venue}{address}{mapsBlock}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami. 🤍

Wassalamualaikum Wr. Wb.`,
  },
  {
    id: "formal",
    label: "Formal",
    body: `Kepada Yth. {name},

Dengan penuh kebahagiaan 🎉, kami mengundang kehadiran Bapak/Ibu/Saudara/i pada pernikahan kami:

💍 *{groomName} & {brideName}* 💍

📲 Undangan Digital:
{link}

🗓️ *Detail Acara*
- Hari/Tgl : {date}
- Tempat   : {venue}{address}{mapsBlock}

Atas kehadiran dan doa restu Anda, kami mengucapkan terima kasih 🙏`,
  },
  {
    id: "casual",
    label: "Kasual",
    body: `Halo {name}! 👋

Kamu diundang ke pernikahan kami! 🎉🎊

💍 *{groomName} & {brideName}* 💍

Cek undangan digitalnya 👇
{link}

🗓️ {date}
📍 {venue}{address}{mapsBlock}

Sampai jumpa di hari bahagia kami! ❤️`,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.startsWith("0")) return "62" + digits.slice(1)
  if (digits.startsWith("62")) return digits
  return "62" + digits
}

/** Slugify a guest name for the ?to= URL parameter */
function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&+]/g, "dan")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function buildMessage(
  template: string,
  name: string,
  groomName: string,
  brideName: string,
  link: string,
  date: string,
  venue: string,
  address: string,
  mapsUrl: string
): string {
  const mapsBlock = mapsUrl ? `\n- Maps    : ${mapsUrl}` : ""
  return template
    .replace(/{name}/g, name)
    .replace(/{groomName}/g, groomName)
    .replace(/{brideName}/g, brideName)
    .replace(/{link}/g, link)
    .replace(/{date}/g, date)
    .replace(/{venue}/g, venue)
    .replace(/{address}/g, address ? `\n             ${address}` : "")
    .replace(/{mapsBlock}/g, mapsBlock)
}

function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

function downloadTemplate() {
  const csv =
    "Name,Phone\nBudi Santoso,081234567890\nSiti Rahayu,082345678901\nAhmad Fauzi,085678901234"
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "broadcast-template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

function parseCSV(text: string): Omit<Contact, "id" | "status">[] {
  const lines = text.trim().split(/\r?\n/)
  const contacts: Omit<Contact, "id" | "status">[] = []
  // skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",")
    const name = cols[0]?.trim()
    const phone = cols[1]?.trim()
    if (name && phone) {
      contacts.push({ name, phone: normalizePhone(phone) })
    }
  }
  return contacts
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface BroadcastPanelProps {
  invitationId: string
  slug: string
  groomName: string
  brideName: string
  isPublished: boolean
  eventDate: string
  eventVenue: string
  eventAddress?: string | null
  mapsUrl?: string | null
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BroadcastPanel({
  invitationId,
  slug,
  groomName,
  brideName,
  isPublished,
  eventDate,
  eventVenue,
  eventAddress,
  mapsUrl,
}: BroadcastPanelProps) {
  const storageKey = `broadcast_contacts_${invitationId}`

  const [contacts, setContacts] = useState<Contact[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [templateId, setTemplateId] = useState("islami")
  const [customBody, setCustomBody] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastIndex, setBroadcastIndex] = useState(0)
  const [broadcastQueue, setBroadcastQueue] = useState<Contact[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const baseUrl = `${origin}/${slug}`

  /** Build a personalized URL for a specific guest name */
  function guestUrl(contactName: string) {
    const slug = slugifyName(contactName)
    return slug ? `${baseUrl}?to=${slug}` : baseUrl
  }

  const formattedDate = formatDate(eventDate)
  const venue = eventVenue
  const address = eventAddress ?? ""
  const maps = mapsUrl ?? ""

  const activeTemplate =
    templateId === "custom"
      ? customBody
      : TEMPLATES.find((t) => t.id === templateId)?.body ?? ""

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setContacts(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [storageKey])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(contacts))
  }, [contacts, storageKey])

  function addContact() {
    if (!name.trim() || !phone.trim()) return
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: normalizePhone(phone.trim()),
      status: "pending",
    }
    setContacts((prev) => [...prev, newContact])
    setName("")
    setPhone("")
  }

  function removeContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function clearAll() {
    setContacts([])
    setSelected(new Set())
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === contacts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(contacts.map((c) => c.id)))
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      const newContacts: Contact[] = parsed.map((c) => ({
        ...c,
        id: crypto.randomUUID(),
        status: "pending",
      }))
      setContacts((prev) => [...prev, ...newContacts])
      toast.success(`${newContacts.length} contacts imported`)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(baseUrl)
    setHasCopied(true)
    toast.success("URL copied!")
    setTimeout(() => setHasCopied(false), 2000)
  }

  function sendSingle(contact: Contact) {
    const link = guestUrl(contact.name)
    const msg = buildMessage(activeTemplate, contact.name, groomName, brideName, link, formattedDate, venue, address, maps)
    window.open(buildWaUrl(contact.phone, msg), "_blank")
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, status: "sent" } : c))
    )
  }

  function startBroadcast() {
    const queue = contacts.filter((c) => selected.has(c.id))
    if (!queue.length) return
    setBroadcastQueue(queue)
    setBroadcastIndex(0)
    setBroadcastOpen(true)
  }

  function broadcastNext() {
    const current = broadcastQueue[broadcastIndex]
    // mark as sent
    setContacts((prev) =>
      prev.map((c) => (c.id === current.id ? { ...c, status: "sent" } : c))
    )
    if (broadcastIndex + 1 < broadcastQueue.length) {
      setBroadcastIndex((i) => i + 1)
    } else {
      setBroadcastOpen(false)
      toast.success("Broadcast selesai!")
    }
  }

  function openCurrentWa() {
    const current = broadcastQueue[broadcastIndex]
    if (!current) return
    const link = guestUrl(current.name)
    const msg = buildMessage(activeTemplate, current.name, groomName, brideName, link, formattedDate, venue, address, maps)
    window.open(buildWaUrl(current.phone, msg), "_blank")
  }

  const currentBroadcastContact = broadcastQueue[broadcastIndex]

  // Preview uses first contact or placeholder
  const previewName = contacts[0]?.name ?? "Nama Tamu"
  const previewLink = contacts[0] ? guestUrl(contacts[0].name) : `${baseUrl}?to=nama-tamu`
  const previewMsg = buildMessage(activeTemplate, previewName, groomName, brideName, previewLink, formattedDate, venue, address, maps)

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <Link
          href={`/dashboard/invitations/${invitationId}`}
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Builder
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">WhatsApp Broadcast</h1>
            <p className="text-sm text-muted-foreground">
              {groomName} &amp; {brideName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Live" : "Draft"}
            </Badge>
            {isPublished && (
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {hasCopied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span className="max-w-[240px] truncate">{baseUrl}</span>
              </button>
            )}
          </div>
        </div>
        {!isPublished && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Undangan belum dipublish. Publish terlebih dahulu agar link dapat dibuka tamu.
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Left: Contacts */}
        <div className="flex w-[420px] shrink-0 flex-col gap-4">
          {/* Add Contact */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold">Tambah Kontak</p>
            <div className="flex gap-2">
              <Input
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addContact()}
                className="rounded-xl"
              />
              <Input
                placeholder="No. WA (08...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addContact()}
                className="rounded-xl"
              />
              <Button size="sm" className="rounded-xl shrink-0" onClick={addContact}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Import / Template */}
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs"
                onClick={downloadTemplate}
              >
                <Download className="h-3.5 w-3.5" />
                Template CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl text-xs"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Import CSV
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card overflow-hidden">
            {/* List Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={contacts.length > 0 && selected.size === contacts.length}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {contacts.length} kontak · {selected.size} dipilih
                </span>
              </div>
              {contacts.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus semua
                </button>
              )}
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Belum ada kontak</p>
                  <p className="text-xs opacity-70">
                    Tambah manual atau import dari CSV
                  </p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 border-b border-border/50 px-4 py-2.5 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(contact.id)}
                      onChange={() => toggleSelect(contact.id)}
                      className="rounded shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">+{contact.phone}</p>
                    </div>
                    <Badge
                      variant={contact.status === "sent" ? "default" : "secondary"}
                      className="shrink-0 text-[10px]"
                    >
                      {contact.status === "sent" ? "Terkirim" : "Pending"}
                    </Badge>
                    <button
                      onClick={() => sendSingle(contact)}
                      className="shrink-0 rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      title="Kirim ke kontak ini"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Message Template */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Template Selector */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-semibold">Template Pesan</p>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    templateId === t.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={() => setTemplateId("custom")}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                  templateId === "custom"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Custom
              </button>
            </div>

            {templateId === "custom" && (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Variabel: {"{name}"} {"{groomName}"} {"{brideName}"} {"{link}"} {"{date}"} {"{venue}"} {"{address}"} {"{mapsBlock}"}
                </Label>
                <Textarea
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Tulis pesan kamu di sini..."
                  className="rounded-xl text-sm"
                  rows={8}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Preview Pesan</p>
              <span className="text-xs text-muted-foreground">URL unik per tamu</span>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
                {previewMsg}
              </pre>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Setiap tamu mendapat link unik dengan namanya (contoh: <code className="bg-muted px-1 rounded">{previewLink}</code>)
            </p>
          </div>

          {/* Broadcast Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{selected.size}</span> kontak dipilih
            </p>
            <Button
              size="sm"
              className="rounded-xl gap-2"
              disabled={selected.size === 0 || !activeTemplate}
              onClick={startBroadcast}
            >
              <Send className="h-3.5 w-3.5" />
              Mulai Broadcast ({selected.size})
            </Button>
          </div>
        </div>
      </div>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Broadcast WhatsApp
            </DialogTitle>
          </DialogHeader>

          {currentBroadcastContact ? (
            <div className="flex flex-col gap-4">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Kontak {broadcastIndex + 1} dari {broadcastQueue.length}
                </span>
                <div className="flex gap-1">
                  {broadcastQueue.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-5 rounded-full ${
                        i < broadcastIndex
                          ? "bg-green-500"
                          : i === broadcastIndex
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="rounded-xl bg-muted/50 px-4 py-3">
                <p className="font-semibold">{currentBroadcastContact.name}</p>
                <p className="text-xs text-muted-foreground">
                  +{currentBroadcastContact.phone}
                </p>
                <p className="mt-1 text-xs text-muted-foreground truncate">
                  🔗 {guestUrl(currentBroadcastContact.name)}
                </p>
              </div>

              {/* Message preview */}
              <div className="max-h-52 overflow-y-auto rounded-xl border border-border bg-card p-3">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed font-sans text-muted-foreground">
                  {buildMessage(
                    activeTemplate,
                    currentBroadcastContact.name,
                    groomName,
                    brideName,
                    guestUrl(currentBroadcastContact.name),
                    formattedDate,
                    venue,
                    address,
                    maps
                  )}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    openCurrentWa()
                    broadcastNext()
                  }}
                >
                  <Send className="h-3.5 w-3.5" />
                  Buka WhatsApp
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={broadcastNext}
                >
                  Lewati
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Klik &ldquo;Buka WhatsApp&rdquo; → kirim pesan → kembali ke sini
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-semibold">Broadcast selesai!</p>
              <p className="text-sm text-muted-foreground">
                Semua kontak telah diproses.
              </p>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setBroadcastOpen(false)}
              >
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
