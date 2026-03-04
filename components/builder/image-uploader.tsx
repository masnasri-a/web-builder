"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, Upload } from "lucide-react"

interface ImageUploaderProps {
  invitationId: string
  type: "background" | "profile" | "gallery"
  accept?: string
  onUploaded: (url: string) => void
}

export function ImageUploader({
  invitationId,
  type,
  accept = "image/*",
  onUploaded,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File terlalu besar. Maksimum 5 MB.")
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("invitationId", invitationId)
      fd.append("uploadType", type)

      const res = await fetch("/api/s3/image-upload", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Upload gagal (${res.status})`)
      }

      const { url } = await res.json()
      onUploaded(url)
      toast.success("Gambar berhasil diupload!")
    } catch (err) {
      toast.error("Upload gagal: " + (err as Error).message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="sr-only"
        id={`upload-${type}-${invitationId}`}
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
          <Upload className="h-3.5 w-3.5" />
        )}
        {uploading ? "Mengupload..." : "Pilih Gambar"}
      </Button>
    </div>
  )
}
