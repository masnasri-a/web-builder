"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Search, X } from "lucide-react"

// Dynamically import Leaflet to avoid SSR issues
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet"

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    quarter?: string
    suburb?: string
    city?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
  }
}

interface MapPickerProps {
  onSelect: (result: { lat: number; lng: number; address: string; venue: string }) => void
  defaultAddress?: string
}

export function MapPicker({ onSelect, defaultAddress }: MapPickerProps) {
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress ?? "")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Init Leaflet map only on client
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet")

    // Fix default icon paths broken by webpack
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })

    const map = L.map(containerRef.current, {
      center: [-6.2088, 106.8456], // Jakarta default
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Click on map to drop pin
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng
      placeMarker(L, map, lat, lng)

      // Reverse geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
          { headers: { "Accept-Language": "id" } }
        )
        const data: NominatimResult = await res.json()
        const address = data.display_name
        const venue = deriveVenue(data)
        setSelectedAddress(address)
        onSelect({ lat, lng, address, venue })
      } catch {
        // ignore
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function placeMarker(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any,
    map: LeafletMap,
    lat: number,
    lng: number
  ) {
    if (markerRef.current) markerRef.current.remove()
    markerRef.current = L.marker([lat, lng]).addTo(map)
  }

  function deriveVenue(data: NominatimResult): string {
    const a = data.address
    return (
      a.road ||
      a.quarter ||
      a.suburb ||
      a.city ||
      data.display_name.split(",")[0]
    )
  }

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setShowResults(false); return }
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&countrycodes=id`,
        { headers: { "Accept-Language": "id" } }
      )
      const data: NominatimResult[] = await res.json()
      setResults(data)
      setShowResults(true)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 400)
  }

  function handleSelect(result: NominatimResult) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet")
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16, { animate: true })
      placeMarker(L, mapRef.current, lat, lng)
    }

    const address = result.display_name
    const venue = deriveVenue(result)
    setSelectedAddress(address)
    setQuery(result.display_name.split(",")[0])
    setShowResults(false)
    onSelect({ lat, lng, address, venue })
  }

  return (
    <div className="space-y-2">
      {/* Search box */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Cari venue, alamat, atau nama tempat..."
          className="rounded-xl pl-9 pr-8 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setShowResults(false) }}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown results */}
        {showResults && results.length > 0 && (
          <ul className="absolute z-1000 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            {results.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="line-clamp-2 leading-snug">{r.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-xl border border-border">
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <div ref={containerRef} style={{ height: 280 }} />
      </div>

      {/* Selected address */}
      {selectedAddress && (
        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">{selectedAddress}</p>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Cari lokasi atau klik langsung di peta untuk memilih koordinat.
      </p>
    </div>
  )
}
