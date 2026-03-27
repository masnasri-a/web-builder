"use client"

import { useState } from "react"
import { MusicPickerModal } from "@/components/builder/music-picker-modal"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

export function MusicManager() {
  const [selectedUrl, setSelectedUrl] = useState("")

  const selectedName = selectedUrl
    ? decodeURIComponent(selectedUrl.split("/").pop() ?? selectedUrl).replace(/^\d+-/, "")
    : null

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">Manage Music</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Browse, preview, dan upload musik untuk undangan.
      </p>
      <MusicPickerModal
        value={selectedUrl}
        onChange={setSelectedUrl}
        trigger={
          <Button variant="outline" className="w-full rounded-xl gap-2 justify-start">
            <Music className="h-4 w-4" />
            {selectedName || "Buka Library Musik"}
          </Button>
        }
      />
      {selectedUrl && (
        <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground mb-1">Preview</p>
          <audio src={selectedUrl} controls className="w-full h-8" preload="none" />
        </div>
      )}
    </div>
  )
}
