"use client"

import { useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Smartphone, Monitor, Save, Globe, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LeftPanel } from "./left-panel"
import { CenterPreview } from "./center-preview"
import { RightPanel } from "./right-panel"
import { useBuilder } from "@/hooks/use-builder"
import type { InvitationWithRelations } from "@/types"

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
    sections: invitation.sections,
    themeConfig: invitation.themeConfig,
  })

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

  async function handlePublish() {
    await save()
    const res = await fetch(`/api/invitations/${state.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !invitation.isPublished }),
    })
    if (res.ok) {
      toast.success(
        invitation.isPublished ? "Invitation unpublished" : "Invitation is now live!"
      )
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Builder Toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-sm">
            {state.groomName || "Groom"} & {state.brideName || "Bride"}
          </p>
          <Badge variant={invitation.isPublished ? "default" : "secondary"}>
            {invitation.isPublished ? "Live" : "Draft"}
          </Badge>
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
          {invitation.isPublished && (
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <a href={`/${state.slug}`} target="_blank">
                <Globe className="h-3.5 w-3.5" />
                Live
              </a>
            </Button>
          )}

          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <a href={`/dashboard/invitations/${state.id}/preview`} target="_blank">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </a>
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
            {invitation.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          sections={state.sections}
          musicUrl={state.musicUrl}
          activeSection={state.activeSection}
          onToggleSection={toggleSection}
          onSelectSection={selectSection}
          onReorderSections={reorderSections}
          onMusicChange={(url) => setField("musicUrl", url)}
        />

        <CenterPreview
          isMobile={state.isMobilePreview}
          groomName={state.groomName}
          brideName={state.brideName}
          eventDate={state.eventDate}
          eventVenue={state.eventVenue}
          eventAddress={state.eventAddress}
          sections={state.sections}
          themeConfig={state.themeConfig}
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
