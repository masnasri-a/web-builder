"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Viewport = "mobile" | "tablet" | "desktop"

const VIEWPORTS: { id: Viewport; label: string; icon: React.ElementType; width: string; frameClass: string }[] = [
  {
    id: "mobile",
    label: "Mobile",
    icon: Smartphone,
    width: "390px",
    frameClass:
      "w-[390px] rounded-[2.5rem] border-[8px] border-neutral-800 shadow-2xl ring-1 ring-neutral-700",
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: Tablet,
    width: "768px",
    frameClass:
      "w-[768px] rounded-3xl border-[6px] border-neutral-800 shadow-2xl ring-1 ring-neutral-700",
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    width: "100%",
    frameClass: "w-full rounded-xl border border-neutral-700 shadow-xl",
  },
]

interface PreviewViewportProps {
  builderId: string
  children: React.ReactNode
}

export function PreviewViewport({ builderId, children }: PreviewViewportProps) {
  const [viewport, setViewport] = useState<Viewport>("mobile")
  const current = VIEWPORTS.find((v) => v.id === viewport)!

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950">
      {/* Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 px-5">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-neutral-300 hover:text-white"
          asChild
        >
          <a href={`/dashboard/invitations/${builderId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </a>
        </Button>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-1">
          {VIEWPORTS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewport(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                viewport === id
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Spacer to keep switcher centered */}
        <div className="w-32" />
      </header>

      {/* Preview area */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto py-8 px-6">
        <div
          className={cn(
            "overflow-hidden bg-white transition-all duration-300",
            current.frameClass
          )}
          style={{ maxWidth: current.width, width: viewport === "desktop" ? "100%" : current.width }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: viewport !== "desktop" ? "82vh" : undefined }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
