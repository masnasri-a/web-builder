"use client"

import { useRef, useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { GripVertical, Music, Layers, Palette } from "lucide-react"
import type { Section, ThemeConfig } from "@/types"
import { ThemePickerModal } from "./theme-picker-modal"

function MusicSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [list, setList] = useState<string[]>([])
  const [custom, setCustom] = useState(false)

  useEffect(() => {
    fetch("/api/s3/music-list")
      .then((r) => r.json())
      .then((d) => {
        if (d.files) setList(d.files)
      })
  }, [])

  return (
    <div className="space-y-1.5">
      <select
        value={custom ? "custom" : value}
        onChange={(e) => {
          const v = e.target.value
          if (v === "custom") {
            setCustom(true)
            onChange("")
          } else {
            setCustom(false)
            onChange(v)
          }
        }}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">(none)</option>
        {list.map((url) => (
          <option key={url} value={url}>
            {url.split("/").pop()}
          </option>
        ))}
        <option value="custom">Custom URL...</option>
      </select>
      {custom && (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      )}
    </div>
  )
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Cover / Hero",
  couple: "Couple Story",
  event: "Event Details",
  gallery: "Photo Gallery",
  countdown: "Countdown Timer",
  rsvp: "RSVP Form",
  closing: "Closing Message",
  maps: "Lokasi / Maps",
  quote: "Kutipan / Quote",
}

interface LeftPanelProps {
  sections: Section[]
  musicUrl: string
  themeSlug: string
  themeConfig: ThemeConfig
  activeSection: string | null
  onToggleSection: (id: string) => void
  onSelectSection: (id: string) => void
  onReorderSections: (sections: Section[]) => void
  onMusicChange: (url: string) => void
  onThemeChange: (slug: string) => void
  onThemeConfigChange: (config: Partial<ThemeConfig>) => void
}

export function LeftPanel({
  sections,
  musicUrl,
  themeSlug,
  themeConfig,
  activeSection,
  onToggleSection,
  onSelectSection,
  onReorderSections,
  onMusicChange,
  onThemeChange,
  onThemeConfigChange,
}: LeftPanelProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order)

  const draggingId = useRef<string | null>(null)
  const dragOverId = useRef<string | null>(null)
  const [draggingActive, setDraggingActive] = useState<string | null>(null)
  const [dragOverActive, setDragOverActive] = useState<string | null>(null)

  function handleDragStart(id: string) {
    draggingId.current = id
    setDraggingActive(id)
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    dragOverId.current = id
    setDragOverActive(id)
  }

  function handleDrop() {
    const fromId = draggingId.current
    const toId = dragOverId.current
    if (!fromId || !toId || fromId === toId) {
      cleanup()
      return
    }
    const from = sorted.findIndex((s) => s.id === fromId)
    const to = sorted.findIndex((s) => s.id === toId)
    const reordered = [...sorted]
    reordered.splice(to, 0, reordered.splice(from, 1)[0])
    onReorderSections(reordered.map((s, i) => ({ ...s, order: i })))
    cleanup()
  }

  function cleanup() {
    draggingId.current = null
    dragOverId.current = null
    setDraggingActive(null)
    setDragOverActive(null)
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Builder
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Theme picker */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Theme
              </span>
            </div>
            <ThemePickerModal
              themeSlug={themeSlug}
              themeConfig={themeConfig}
              onThemeChange={onThemeChange}
              onThemeConfigChange={onThemeConfigChange}
            />
          </div>

          <Separator />

          {/* Sections */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sections
              </span>
            </div>
            <div className="space-y-1.5">
              {sorted.map((section) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(section.id)}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDrop={handleDrop}
                  onDragEnd={cleanup}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSection(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelectSection(section.id)
                    }
                  }}
                  className={`flex w-full cursor-pointer items-center gap-1.5 rounded-xl px-2 py-2.5 text-sm transition-all ${
                    draggingActive === section.id
                      ? "opacity-40"
                      : dragOverActive === section.id && draggingActive !== section.id
                      ? "border-2 border-primary"
                      : "border-2 border-transparent"
                  } ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing" />
                  <span className="flex-1 truncate">{SECTION_LABELS[section.type] ?? section.type}</span>
                  <Switch
                    checked={section.visible}
                    onCheckedChange={() => onToggleSection(section.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="scale-75"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />


          {/* Music */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Music className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Background Music
              </span>
            </div>
            <MusicSelector
              value={musicUrl}
              onChange={onMusicChange}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
