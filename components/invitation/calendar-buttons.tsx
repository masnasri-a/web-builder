"use client"

import { Calendar, Download } from "lucide-react"

interface CalendarButtonsProps {
  eventDate: string      // ISO string from DB
  eventTime: string | null  // "HH:MM" e.g. "09:00"
  eventVenue: string
  eventAddress: string | null
  groomName: string
  brideName: string
  primaryColor: string
}

function toGcalDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  )
}

function toIcsDate(d: Date): string {
  // Use UTC for ICS to avoid timezone ambiguity
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  )
}

export function CalendarButtons({
  eventDate,
  eventTime,
  eventVenue,
  eventAddress,
  groomName,
  brideName,
  primaryColor,
}: CalendarButtonsProps) {
  const title = `Pernikahan ${groomName} & ${brideName}`
  const location = [eventVenue, eventAddress].filter(Boolean).join(", ")
  const details = `Anda diundang ke pernikahan ${groomName} & ${brideName} di ${eventVenue}.`

  function buildDates() {
    const start = new Date(eventDate)
    if (eventTime) {
      const [h, m] = eventTime.split(":").map(Number)
      start.setHours(h, m, 0, 0)
    } else {
      start.setHours(8, 0, 0, 0)
    }
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000)
    return { start, end }
  }

  function handleGoogleCalendar() {
    const { start, end } = buildDates()
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${toGcalDate(start)}/${toGcalDate(end)}`,
      details,
      location,
    })
    window.open(
      `https://calendar.google.com/calendar/render?${params.toString()}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  function handleIcsDownload() {
    const { start, end } = buildDates()
    const uid = `${Date.now()}@selembar.id`
    const now = toIcsDate(new Date())
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Selembar.id//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${details}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `undangan-${groomName.toLowerCase().replace(/\s+/g, "-")}-${brideName.toLowerCase().replace(/\s+/g, "-")}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <button
        onClick={handleGoogleCalendar}
        className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide shadow-sm transition-all hover:scale-105 active:scale-95"
        style={{
          background: primaryColor,
          color: "#fff",
          border: `1px solid ${primaryColor}`,
        }}
      >
        <Calendar className="h-3.5 w-3.5" />
        Tambah ke Google Calendar
      </button>

      <button
        onClick={handleIcsDownload}
        className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide shadow-sm transition-all hover:scale-105 active:scale-95"
        style={{
          background: "transparent",
          color: primaryColor,
          border: `1.5px solid ${primaryColor}`,
        }}
      >
        <Download className="h-3.5 w-3.5" />
        Simpan ke Kalender (ICS)
      </button>
    </div>
  )
}
