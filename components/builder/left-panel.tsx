"use client"

import { useRef, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { GripVertical, Music, Layers, Palette, Lock } from "lucide-react"
import type { Section, ThemeConfig } from "@/types"
import type { TierConfigData } from "@/lib/tier"
import { ThemePickerModal } from "./theme-picker-modal"
import { MusicPickerModal } from "./music-picker-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SECTION_TIER_FLAGS: Record<string, keyof NonNullable<TierConfigData>> = {
  music: "allowMusic",
  gift: "allowGift",
  gallery: "allowGallery",
  rsvp: "allowRsvp",
  maps: "allowMaps",
  countdown: "allowCountdown",
  ucapan: "allowUcapan",
  quote: "allowQuote",
}

/* MusicSelector replaced by MusicPickerModal */

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
  gift: "Hadiah / Gift",
  ucapan: "Ucapan & Doa",
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
  tierConfig?: TierConfigData | null
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
  tierConfig,
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
              tierConfig={tierConfig}
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
            <TooltipProvider delayDuration={200}>
              <div className="space-y-1.5">
                {sorted.map((section) => {
                  const flag = SECTION_TIER_FLAGS[section.type]
                  const isLocked = tierConfig && flag ? !(tierConfig as Record<string, unknown>)[flag] : false

                  return (
                    <div
                      key={section.id}
                      draggable={!isLocked}
                      onDragStart={() => !isLocked && handleDragStart(section.id)}
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
                        isLocked
                          ? "opacity-50"
                          : activeSection === section.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing" />
                      <span className="flex-1 truncate">{SECTION_LABELS[section.type] ?? section.type}</span>
                      {isLocked ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                              <Lock className="h-3 w-3" />
                              PRO
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">Upgrade paket untuk mengaktifkan fitur ini</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Switch
                          checked={section.visible}
                          onCheckedChange={() => onToggleSection(section.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="scale-75"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </TooltipProvider>
          </div>

          <Separator />


          {/* Music */}
          {(!tierConfig || tierConfig.allowMusic) ? (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Music className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Background Music
                </span>
              </div>
              <MusicPickerModal
                value={musicUrl}
                onChange={onMusicChange}
              />
            </div>
          ) : (
            <div className="opacity-50">
              <div className="mb-2 flex items-center gap-2">
                <Music className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Background Music
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  PRO
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Upgrade untuk menambahkan musik latar</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
