"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, ImagePlus, X } from "lucide-react"
import Image from "next/image"

interface GalleryManagerProps {
  invitationId: string
  images: string[]
  onUpdateImages: (images: string[]) => void
}

export function GalleryManager({
  invitationId,
  images,
  onUpdateImages,
}: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of Array.from(fileList)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} melebihi 5 MB, dilewati.`)
          continue
        }

        const fd = new FormData()
        fd.append("file", file)
        fd.append("invitationId", invitationId)
        fd.append("uploadType", "gallery")

        const res = await fetch("/api/s3/image-upload", {
          method: "POST",
          body: fd,
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          toast.error(`Gagal: ${file.name} — ${data.error || res.statusText}`)
          continue
        }

        const { url } = await res.json()
        newUrls.push(url)
      }

      if (newUrls.length > 0) {
        onUpdateImages([...images, ...newUrls])
        toast.success(`${newUrls.length} gambar berhasil diupload!`)
      }
    } catch (err) {
      toast.error("Upload error: " + (err as Error).message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index)
    onUpdateImages(updated)
  }

  return (
    <div className="space-y-3">
      <Label className="text-xs">Gallery ({images.length} foto)</Label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={url}
                alt={`Gallery ${i + 1}`}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 hidden rounded-full bg-black/60 p-1 text-white hover:bg-red-600 group-hover:block"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="sr-only"
          id={`gallery-upload-${invitationId}`}
        />
        <Button
          size="sm"
          variant="default"
          disabled={uploading}
          className="rounded-xl text-xs w-full"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImagePlus className="h-3.5 w-3.5" />
          )}
          {uploading ? "Mengupload..." : "Tambah Foto"}
        </Button>
      </div>
    </div>
  )
}
