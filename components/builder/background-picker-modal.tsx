"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ImageIcon,
  Upload,
  Loader2,
  Check,
  Trash2,
  X,
} from "lucide-react"

interface BackgroundItem {
  id: string
  url: string
  name: string | null
  isPreset: boolean
}

interface BackgroundPickerModalProps {
  invitationId: string
  value?: string
  onChange: (url: string) => void
  trigger?: React.ReactNode
}

export function BackgroundPickerModal({
  invitationId,
  value,
  onChange,
  trigger,
}: BackgroundPickerModalProps) {
  const [open, setOpen] = useState(false)
  const [presets, setPresets] = useState<BackgroundItem[]>([])
  const [userBgs, setUserBgs] = useState<BackgroundItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState<"preset" | "mine">("preset")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/backgrounds?invitationId=${invitationId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.presets) setPresets(d.presets)
        if (d.userBackgrounds) setUserBgs(d.userBackgrounds)
      })
      .catch(() => toast.error("Gagal memuat background"))
      .finally(() => setLoading(false))
  }, [open, invitationId])

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

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File terlalu besar. Maksimum 10 MB.")
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("invitationId", invitationId)
      const res = await fetch("/api/backgrounds", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Upload gagal (${res.status})`)
      }
      const bg = await res.json()
      setUserBgs((prev) => [bg, ...prev])
      setTab("mine")
      toast.success("Background berhasil diupload!")
    } catch (err) {
      toast.error("Upload gagal: " + (err as Error).message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/backgrounds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Delete gagal")
      setUserBgs((prev) => prev.filter((bg) => bg.id !== id))
      toast.success("Background dihapus")
    } catch {
      toast.error("Gagal menghapus background")
    }
  }

  const displayList = tab === "preset" ? presets : userBgs

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 text-xs">
            <ImageIcon className="h-3.5 w-3.5" />
            Pilih Background
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4" />
            Pilih Background
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-2">
          {/* Tab switcher */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setTab("preset")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === "preset"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              Preset ({presets.length})
            </button>
            <button
              onClick={() => setTab("mine")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === "mine"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload Saya ({userBgs.length})
            </button>

            <div className="flex-1" />

            {/* Upload button */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5 text-xs"
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
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {/* Remove current background */}
          {value && (
            <button
              onClick={handleRemove}
              className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
              Hapus background saat ini
            </button>
          )}
        </div>

        <ScrollArea className="h-80 px-5 pb-5">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : displayList.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground py-12">
              <ImageIcon className="h-8 w-8 opacity-30" />
              <p className="text-sm">
                {tab === "preset"
                  ? "Belum ada background preset"
                  : "Belum ada background yang kamu upload"}
              </p>
              {tab === "mine" && (
                <p className="text-xs opacity-70">
                  Klik tombol Upload untuk menambahkan background
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayList.map((bg) => {
                const isSelected = value === bg.url
                return (
                  <div
                    key={bg.id}
                    onClick={() => handleSelect(bg.url)}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:shadow-md ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Image
                      src={bg.url}
                      alt={bg.name || "Background"}
                      width={240}
                      height={135}
                      className="aspect-video w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    {/* Delete button for user's own backgrounds */}
                    {!bg.isPreset && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(bg.id)
                        }}
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                    {bg.name && (
                      <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4 text-[10px] text-white truncate">
                        {bg.name}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
