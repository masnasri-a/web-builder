"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Music, Pause, Play, Upload } from "lucide-react"

function TrackRow({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.play()
      setPlaying(true)
    }
  }

  const name = decodeURIComponent(url.split("/").pop() ?? url).replace(/^\d+-/, "")

  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-80"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <span className="flex-1 truncate text-xs font-medium" title={name}>
          {name}
        </span>
        <Music className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        className="w-full h-7"
        controls
        preload="none"
      />
    </li>
  )
}

export function MusicManager() {
  const [files, setFiles] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const fetchList = async () => {
    const res = await fetch("/api/s3/music-list")
    const data = await res.json()
    if (data.files) setFiles(data.files)
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/s3/music-upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Server returned ${res.status}`)
      }

      const { url } = await res.json()
      setFiles((f) => [...f, url])
      e.target.value = ""
    } catch (err) {
      console.error(err)
      alert("Upload error: " + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex justify-between">
        <h2 className="mb-4 font-semibold">Manage Music</h2>
      <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              id="musicUpload"
              type="file"
              accept="audio/*"
              onChange={handleFile}
              className="sr-only"
            />
            <label htmlFor="musicUpload">
              <Button size="sm" variant="default" disabled={uploading} asChild>
                <span className="flex items-center gap-2">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Upload New Music"}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        

        <div>
          <h3 className="text-sm font-medium mb-2">
            Existing tracks{files.length > 0 && <span className="ml-1.5 text-muted-foreground font-normal">({files.length})</span>}
          </h3>
          {files.length === 0 ? (
            <p className="text-xs text-muted-foreground">No music uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {files.map((url) => (
                <TrackRow key={url} url={url} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
