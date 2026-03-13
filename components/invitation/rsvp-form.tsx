"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useGuestContext } from "@/components/invitation/guest-context"

interface RsvpFormProps {
  invitationId: string
  primaryColor: string
  deadline?: string
}

export function RsvpForm({ invitationId, primaryColor, deadline }: RsvpFormProps) {
  const { guestName } = useGuestContext()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)

    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invitationId,
        name: guestName ?? fd.get("name"),
        phone: fd.get("phone"),
        attendance: fd.get("attendance"),
        guestCount: Number(fd.get("guestCount") ?? 1),
        message: fd.get("message"),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error ?? "Failed to submit RSVP")
      return
    }

    setSubmitted(true)
    toast.success("RSVP submitted! Thank you.")
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border p-8 text-center"
        style={{ borderColor: `${primaryColor}30` }}
      >
        <p className="text-2xl">🎉</p>
        <p className="font-semibold" style={{ color: primaryColor }}>
          Thank you for your response!
        </p>
        <p className="text-sm opacity-60">We look forward to celebrating with you.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {deadline && (
        <p className="text-center text-xs opacity-60">
          Please respond by {deadline}
        </p>
      )}

      {guestName ? (
        <div
          className="flex items-center rounded-xl border px-4 py-3 text-sm"
          style={{ borderColor: `${primaryColor}30` }}
        >
          <span className="opacity-50 mr-2">Konfirmasi sebagai:</span>
          <span className="font-medium">{guestName}</span>
        </div>
      ) : (
        <input
          name="name"
          required
          placeholder="Nama kamu"
          className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none focus:ring-2"
          style={
            {
              borderColor: `${primaryColor}30`,
              "--tw-ring-color": primaryColor,
            } as React.CSSProperties
          }
        />
      )}

      <input
        name="phone"
        type="tel"
        placeholder="Phone Number (optional)"
        className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none focus:ring-2"
        style={
          {
            borderColor: `${primaryColor}30`,
            "--tw-ring-color": primaryColor,
          } as React.CSSProperties
        }
      />

      {/* Attendance */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "ATTENDING", label: "✓ Attending" },
          { value: "NOT_ATTENDING", label: "✗ Not Attending" },
        ].map(({ value, label }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center justify-center rounded-xl border py-2.5 text-sm font-medium transition-all has-[:checked]:text-white"
            style={
              {
                borderColor: `${primaryColor}30`,
              } as React.CSSProperties
            }
          >
            <input
              type="radio"
              name="attendance"
              value={value}
              required
              className="sr-only"
              onChange={(e) => {
                const label = e.target.closest("label")
                if (label) {
                  label.style.backgroundColor = primaryColor
                  label.style.borderColor = primaryColor
                }
              }}
            />
            {label}
          </label>
        ))}
      </div>

      <input
        name="guestCount"
        type="number"
        min={1}
        max={10}
        defaultValue={1}
        placeholder="Number of guests"
        className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none"
        style={{ borderColor: `${primaryColor}30` }}
      />

      <textarea
        name="message"
        placeholder="Leave a message for the couple (optional)"
        rows={3}
        className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none"
        style={{ borderColor: `${primaryColor}30` }}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: primaryColor }}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Submitting..." : "Send RSVP"}
      </button>
    </form>
  )
}
