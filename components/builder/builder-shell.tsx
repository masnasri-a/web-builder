"use client"

import { useEffect, useCallback, useState } from "react"
import { toast } from "sonner"
import { Smartphone, Monitor, Save, Globe, Eye, Copy, Check, Send } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LeftPanel } from "./left-panel"
import { CenterPreview } from "./center-preview"
import { RightPanel } from "./right-panel"
import { useBuilder } from "@/hooks/use-builder"
import type { InvitationWithRelations } from "@/types"
import { getThemeBySlug } from "@/lib/themeRegistry"

interface BuilderShellProps {
  invitation: InvitationWithRelations
}

export function BuilderShell({ invitation }: BuilderShellProps) {
  const {
    state,
    setField,
    toggleSection,
    updateSectionContent,
    updateThemeConfig,
    selectSection,
    togglePreviewMode,
    reorderSections,
    save,
  } = useBuilder({
    id: invitation.id,
    slug: invitation.slug,
    groomName: invitation.groomName,
    brideName: invitation.brideName,
    eventDate: invitation.eventDate.toISOString().slice(0, 16),
    eventVenue: invitation.eventVenue,
    eventAddress: invitation.eventAddress ?? "",
    eventTime: invitation.eventTime ?? "",
    musicUrl: invitation.musicUrl ?? "",
    themeSlug: invitation.theme.slug,
    sections: invitation.sections,
    themeConfig: invitation.themeConfig,
  })

  function handleThemeChange(slug: string) {
    setField("themeSlug", slug)
    const entry = getThemeBySlug(slug)
    if (entry) updateThemeConfig(entry.defaultConfig)
  }

  const [isPublished, setIsPublished] = useState(invitation.isPublished)
  const [hasCopied, setHasCopied] = useState(false)
  const [origin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  )

  // Auto-save on Ctrl/Cmd+S
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        save().then(() => toast.success("Saved!"))
      }
    },
    [save]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  async function handleSave() {
    await save()
    toast.success("Invitation saved!")
  }

  async function handlePreview() {
    if (state.isDirty) {
      await save()
      toast.success("Saved!")
    }
    window.open(`/dashboard/invitations/${state.id}/preview`, "_blank")
  }

  async function handlePublish() {
    await save()
    const newValue = !isPublished
    const res = await fetch(`/api/invitations/${state.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: newValue }),
    })
    if (res.ok) {
      setIsPublished(newValue)
      toast.success(newValue ? "Invitation is now live!" : "Invitation unpublished")
    }
  }

  async function handleCopyUrl() {
    const url = `${origin}/${state.slug}`
    await navigator.clipboard.writeText(url)
    setHasCopied(true)
    toast.success("URL copied!")
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Builder Toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-sm">
            {state.groomName || "Groom"} & {state.brideName || "Bride"}
          </p>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Live" : "Draft"}
          </Badge>
          {isPublished && origin && (
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              title="Click to copy public URL"
            >
              {hasCopied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="max-w-[220px] truncate">
                {origin}/{state.slug}
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Preview toggle */}
          <div className="flex items-center rounded-xl border border-border bg-muted p-1">
            <button
              onClick={() => !state.isMobilePreview && togglePreviewMode()}
              className={`rounded-lg p-1.5 transition-colors ${
                state.isMobilePreview
                  ? "bg-card shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => state.isMobilePreview && togglePreviewMode()}
              className={`rounded-lg p-1.5 transition-colors ${
                !state.isMobilePreview
                  ? "bg-card shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>

          {/* View live */}
          {isPublished && (
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <a href={`/${state.slug}`} target="_blank">
                <Globe className="h-3.5 w-3.5" />
                Live
              </a>
            </Button>
          )}

          {/* Broadcast */}
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link href={`/dashboard/invitations/${state.id}/broadcast`}>
              <Send className="h-3.5 w-3.5" />
              Broadcast
            </Link>
          </Button>

          {/* Preview — auto-saves first */}
          <Button variant="outline" size="sm" className="rounded-xl" onClick={handlePreview}>
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={handleSave}
            disabled={state.isSaving || !state.isDirty}
          >
            <Save className="h-3.5 w-3.5" />
            {state.isSaving ? "Saving..." : "Save"}
          </Button>

          <Button size="sm" className="rounded-xl" onClick={handlePublish}>
            <Globe className="h-3.5 w-3.5" />
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          sections={state.sections}
          musicUrl={state.musicUrl}
          themeSlug={state.themeSlug}
          themeConfig={state.themeConfig}
          activeSection={state.activeSection}
          onToggleSection={toggleSection}
          onSelectSection={selectSection}
          onReorderSections={reorderSections}
          onMusicChange={(url) => setField("musicUrl", url)}
          onThemeChange={handleThemeChange}
          onThemeConfigChange={updateThemeConfig}
        />

        <CenterPreview
          isMobile={state.isMobilePreview}
          invitationId={state.id}
          groomName={state.groomName}
          brideName={state.brideName}
          eventDate={state.eventDate}
          eventVenue={state.eventVenue}
          eventAddress={state.eventAddress}
          sections={state.sections}
          themeConfig={state.themeConfig}
          themeSlug={state.themeSlug}
          activeSection={state.activeSection}
          musicUrl={state.musicUrl}
          onSelectSection={selectSection}
          onUpdateContent={updateSectionContent}
        />

        <RightPanel
          invitationId={state.id}
          activeSection={state.activeSection}
          sections={state.sections}
          themeConfig={state.themeConfig}
          groomName={state.groomName}
          brideName={state.brideName}
          eventDate={state.eventDate}
          eventVenue={state.eventVenue}
          eventAddress={state.eventAddress}
          onUpdateContent={updateSectionContent}
          onUpdateTheme={updateThemeConfig}
          onSetField={(field, value) =>
            setField(field as keyof typeof state, value)
          }
        />
      </div>
    </div>
  )
}
