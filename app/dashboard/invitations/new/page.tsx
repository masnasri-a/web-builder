"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Heart, MapPin, Check } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugify } from "@/lib/utils"
import { themeRegistry } from "@/lib/themeRegistry"
import dynamic from "next/dynamic"

const MapPicker = dynamic(
  () => import("@/components/map-picker").then((m) => m.MapPicker),
  { ssr: false, loading: () => <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memuat peta...</div> }
)

export default function NewInvitationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [groomName, setGroomName] = useState("")
  const [brideName, setBrideName] = useState("")
  const [slug, setSlug] = useState("")
  const [eventVenue, setEventVenue] = useState("")
  const [eventAddress, setEventAddress] = useState("")
  const [mapLat, setMapLat] = useState<number | null>(null)
  const [mapLng, setMapLng] = useState<number | null>(null)
  const [selectedThemeSlug, setSelectedThemeSlug] = useState(themeRegistry[0]?.id ?? "")

  function handleCoupleChange(groom: string, bride: string) {
    setGroomName(groom)
    setBrideName(bride)
    if (groom && bride) {
      setSlug(slugify(`${groom}-dan-${bride}`))
    }
  }

  function handleMapSelect(result: { lat: number; lng: number; address: string; venue: string }) {
    setEventAddress(result.address)
    setMapLat(result.lat)
    setMapLng(result.lng)
    if (!eventVenue) setEventVenue(result.venue)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groomName: fd.get("groomName"),
        brideName: fd.get("brideName"),
        eventDate: fd.get("eventDate"),
        eventVenue,
        eventAddress,
        mapLat,
        mapLng,
        themeSlug: selectedThemeSlug,
        slug: fd.get("slug"),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error ?? "Failed to create invitation")
      return
    }

    const data = await res.json()
    toast.success("Invitation created!")
    router.push(`/dashboard/invitations/${data.id}`)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="New Invitation"
        description="Fill in the details to create your invitation"
      />

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {/* Couple Info */}
          <div className="flex gap-5">
            <div className="w-full space-y-3">
              <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold">Couple Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="groomName">Groom&apos;s Name</Label>
                    <Input
                      id="groomName"
                      name="groomName"
                      placeholder="Ahmad"
                      required
                      value={groomName}
                      onChange={(e) =>
                        handleCoupleChange(e.target.value, brideName)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="brideName">Bride&apos;s Name</Label>
                    <Input
                      id="brideName"
                      name="brideName"
                      placeholder="Sari"
                      required
                      value={brideName}
                      onChange={(e) =>
                        handleCoupleChange(groomName, e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <Label htmlFor="slug">
                    Invitation URL{" "}
                    <span className="text-muted-foreground">
                      (selembar.id/
                      <span className="text-foreground">{slug || "your-slug"}</span>
                      )
                    </span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="ahmad-dan-sari"
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                  />
                </div>
              </div>
              {/* Event Details */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="mb-4 font-semibold">Event Details</h2>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="eventDate">Wedding Date</Label>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="datetime-local"
                      required
                    />
                  </div>

                  {/* Venue Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="eventVenue">Venue Name</Label>
                    <Input
                      id="eventVenue"
                      placeholder="Grand Ballroom Hotel Mulia"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      required
                    />
                  </div>

                  {/* Map Picker */}
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Lokasi Venue
                    </Label>
                    <MapPicker onSelect={handleMapSelect} />
                    {eventAddress && (
                      <Input
                        value={eventAddress}
                        onChange={(e) => setEventAddress(e.target.value)}
                        className="rounded-xl text-sm"
                        placeholder="Alamat lengkap..."
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 font-semibold">Choose Theme</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {themeRegistry.map((entry) => {
                  const isSelected = entry.id === selectedThemeSlug
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setSelectedThemeSlug(entry.id)}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all ${isSelected
                        ? "border-primary shadow-md"
                        : "border-border hover:border-muted-foreground/40 hover:shadow-sm"
                        }`}
                    >
                      {/* Color preview */}
                      <div
                        className="h-20 w-full relative"
                        style={{ backgroundColor: entry.defaultConfig.bgColor }}
                      >
                        {/* Color swatches */}
                        <div className="absolute bottom-2 left-2 flex gap-1.5">
                          <span
                            className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: entry.defaultConfig.primaryColor }}
                          />
                          <span
                            className="h-5 w-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: entry.defaultConfig.accentColor }}
                          />
                        </div>
                        {/* Selected check */}
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-2.5">
                        <p className="text-xs font-semibold leading-tight">{entry.name}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                          {entry.tags.slice(0, 2).join(" · ")}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>





          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
