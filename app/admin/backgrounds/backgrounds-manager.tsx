"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Loader2, Upload, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface BgItem {
  id: string
  url: string
  key: string
  name: string | null
  createdAt: string
}

export function BackgroundsManager({
  initialBackgrounds,
}: {
  initialBackgrounds: BgItem[]
}) {
  const [items, setItems] = useState(initialBackgrounds)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      toast.error("Pilih file gambar terlebih dahulu")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      if (name.trim()) formData.append("name", name.trim())

      const res = await fetch("/api/super-admin/backgrounds", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Upload gagal")
        return
      }

      const bg = await res.json()
      setItems((prev) => [bg, ...prev])
      setName("")
      if (fileRef.current) fileRef.current.value = ""
      toast.success("Background preset berhasil di-upload")
    } catch {
      toast.error("Upload gagal")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch("/api/super-admin/backgrounds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Gagal menghapus")
        return
      }

      setItems((prev) => prev.filter((b) => b.id !== id))
      toast.success("Background preset dihapus")
    } catch {
      toast.error("Gagal menghapus")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Upload Background Preset</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label className="text-sm">Nama (opsional)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Floral Blue"
              className="rounded-xl"
            />
          </div>

          <div className="flex-1 space-y-2">
            <Label className="text-sm">File Gambar</Label>
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="rounded-xl"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-xl"
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Gambar akan di-compress otomatis menjadi Full HD (maks 1920×1080). Format output: JPEG.
        </p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
          <ImageIcon className="mb-2 h-10 w-10" />
          <p>Belum ada background preset</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((bg) => (
            <div
              key={bg.id}
              className="group relative overflow-hidden rounded-xl border bg-muted/30 shadow-sm"
            >
              <div className="aspect-video relative">
                <Image
                  src={bg.url}
                  alt={bg.name || "background"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs font-medium">
                  {bg.name || bg.key.split("/").pop()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  disabled={deletingId === bg.id}
                  onClick={() => handleDelete(bg.id)}
                >
                  {deletingId === bg.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
