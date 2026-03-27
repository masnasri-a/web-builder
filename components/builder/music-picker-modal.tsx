"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Music,
  Play,
  Pause,
  Upload,
  Loader2,
  Check,
  Search,
  Link2,
  X,
} from "lucide-react"

// ─── TrackRow with preview ────────────────────────────────────────────────────

function TrackRow({
  url,
  isSelected,
  onSelect,
}: {
  url: string
  isSelected: boolean
  onSelect: (url: string) => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const name = decodeURIComponent(url.split("/").pop() ?? url).replace(
    /^\d+-/,
    ""
  )

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      // Stop all other audio elements first
      document.querySelectorAll("audio").forEach((a) => {
        if (a !== el) {
          a.pause()
          a.currentTime = 0
        }
      })
      el.play()
      setPlaying(true)
    }
  }

  return (
    <div
      onClick={() => onSelect(url)}
      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all hover:bg-muted/50 ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border"
      }`}
    >
      {/* Play/Pause */}
      <button
        onClick={toggle}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
          playing
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5 translate-x-0.5" />
        )}
      </button>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium" title={name}>
          {name}
        </p>
        <audio
          ref={audioRef}
          src={url}
          preload="none"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
        />
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface MusicPickerModalProps {
  value: string
  onChange: (url: string) => void
  /** Display trigger variant */
  trigger?: React.ReactNode
}

export function MusicPickerModal({
  value,
  onChange,
  trigger,
}: MusicPickerModalProps) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")
  const [customUrl, setCustomUrl] = useState("")
  const [showCustom, setShowCustom] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Fetch music list when modal opens
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch("/api/s3/music-list")
      .then((r) => r.json())
      .then((d) => {
        if (d.files) setList(d.files)
      })
      .catch(() => toast.error("Gagal memuat daftar musik"))
      .finally(() => setLoading(false))
  }, [open])

  const filtered = list.filter((url) => {
    if (!search) return true
    const name = decodeURIComponent(url.split("/").pop() ?? "").toLowerCase()
    return name.includes(search.toLowerCase())
  })

  function handleSelect(url: string) {
    onChange(url)
    setOpen(false)
  }

  function handleRemove() {
    onChange("")
    setOpen(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File terlalu besar. Maksimum 15 MB.")
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/s3/music-upload", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Upload gagal (${res.status})`)
      }
      const { url } = await res.json()
      setList((prev) => [url, ...prev])
      toast.success("Musik berhasil diupload!")
    } catch (err) {
      toast.error("Upload gagal: " + (err as Error).message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  function handleCustomSelect() {
    if (!customUrl.trim()) return
    onChange(customUrl.trim())
    setOpen(false)
  }

  const selectedName = value
    ? decodeURIComponent(value.split("/").pop() ?? value).replace(/^\d+-/, "")
    : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted">
            <Music className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-left">
              {selectedName || "Pilih musik..."}
            </span>
            {value && (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  onChange("")
                }}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl p-0 gap-0 max-h-[85vh] flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Pilih Musik
          </DialogTitle>
        </DialogHeader>

        {/* Search + Upload bar */}
        <div className="flex gap-2 px-5 pb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari musik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl pl-9 text-sm"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            className="sr-only"
          />
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 shrink-0"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {/* Track list */}
        <ScrollArea className="flex-1 min-h-0 px-5">
          <div className="space-y-2 pb-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {search
                  ? "Tidak ada musik yang cocok"
                  : "Belum ada musik. Upload untuk menambahkan."}
              </div>
            ) : (
              filtered.map((url) => (
                <TrackRow
                  key={url}
                  url={url}
                  isSelected={value === url}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer: custom URL + remove */}
        <div className="border-t border-border px-5 py-3 space-y-2">
          {showCustom ? (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/music.mp3"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="rounded-xl text-sm flex-1"
              />
              <Button
                size="sm"
                className="rounded-xl"
                onClick={handleCustomSelect}
                disabled={!customUrl.trim()}
              >
                Pilih
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setShowCustom(false)}
              >
                Batal
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowCustom(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Link2 className="h-3 w-3" />
                Custom URL
              </button>
              {value && (
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
                >
                  <X className="h-3 w-3" />
                  Hapus musik
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
