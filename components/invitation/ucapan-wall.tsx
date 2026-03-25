"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Loader2, Send, Heart, MessageCircle } from "lucide-react"

interface Wish {
  id: string
  name: string
  message: string
  createdAt: string
}

interface UcapanWallProps {
  invitationId: string
  primaryColor: string
  title?: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "baru saja"
  if (m < 60) return `${m} mnt lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  return `${Math.floor(h / 24)} hari lalu`
}

export function UcapanWall({ invitationId, primaryColor }: UcapanWallProps) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const MSG_MAX = 300
  const remaining = MSG_MAX - message.length

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch(`/api/ucapan?invitationId=${invitationId}`)
      if (res.ok) setWishes(await res.json())
    } finally {
      setLoadingList(false)
    }
  }, [invitationId])

  useEffect(() => {
    fetchWishes()
  }, [fetchWishes])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)

    const res = await fetch("/api/ucapan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, name: name.trim(), message: message.trim() }),
    })

    setSubmitting(false)

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error ?? "Gagal mengirim ucapan")
      return
    }

    const newWish: Wish = await res.json()
    setWishes((prev) => [newWish, ...prev])
    setName("")
    setMessage("")
    toast.success("Ucapan terkirim! 🎉")
  }

  return (
    <div className="space-y-5">
      {/* Submit form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          required
          maxLength={100}
          className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none focus:ring-2"
          style={
            {
              borderColor: `${primaryColor}40`,
              "--tw-ring-color": primaryColor,
            } as React.CSSProperties
          }
        />

        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan ucapan dan doa terbaik kamu..."
            required
            rows={3}
            maxLength={MSG_MAX}
            className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 pb-6 text-sm placeholder:opacity-50 focus:outline-none"
            style={{ borderColor: `${primaryColor}40` }}
          />
          <span
            className={`absolute bottom-2.5 right-3 text-[10px] opacity-40 ${
              remaining < 30 ? "opacity-80" : ""
            }`}
            style={remaining < 30 ? { color: primaryColor } : undefined}
          >
            {remaining}
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: primaryColor }}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {submitting ? "Mengirim..." : "Kirim Ucapan"}
        </button>
      </form>

      {/* Wishes list */}
      <div>
        {loadingList ? (
          <div className="flex justify-center py-4">
            <Loader2
              className="h-4 w-4 animate-spin opacity-40"
              style={{ color: primaryColor }}
            />
          </div>
        ) : wishes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center opacity-40">
            <MessageCircle className="h-6 w-6" />
            <p className="text-xs">Belum ada ucapan. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="rounded-xl border p-3"
                style={{
                  borderColor: `${primaryColor}20`,
                  backgroundColor: `${primaryColor}08`,
                }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="flex items-center gap-1 text-xs font-semibold">
                    <Heart
                      className="h-3 w-3 shrink-0"
                      style={{ color: primaryColor }}
                    />
                    {w.name}
                  </p>
                  <span className="text-[10px] opacity-40">{relativeTime(w.createdAt)}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-75">{w.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
