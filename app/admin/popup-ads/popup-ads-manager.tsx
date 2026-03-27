"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import {
  Loader2, Trash2, Plus, Save, ImageIcon, X, Eye, EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface PopupAdItem {
  id: string
  title: string
  headline: string | null
  body: string | null
  bannerUrl: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  isActive: boolean
  startAt: string | null
  endAt: string | null
  createdAt: string
}

export function PopupAdsManager({
  initialAds,
}: {
  initialAds: PopupAdItem[]
}) {
  const [ads, setAds] = useState(initialAds)
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // New ad form state
  const [form, setForm] = useState({
    title: "",
    headline: "",
    body: "",
    ctaLabel: "",
    ctaUrl: "",
    isActive: false,
    startAt: "",
    endAt: "",
  })
  const newBannerRef = useRef<HTMLInputElement>(null)

  async function handleCreate() {
    if (!form.title.trim()) {
      toast.error("Title wajib diisi")
      return
    }

    setCreating(true)
    try {
      const fd = new FormData()
      fd.append("title", form.title)
      fd.append("headline", form.headline)
      fd.append("body", form.body)
      fd.append("ctaLabel", form.ctaLabel)
      fd.append("ctaUrl", form.ctaUrl)
      fd.append("isActive", String(form.isActive))
      if (form.startAt) fd.append("startAt", form.startAt)
      if (form.endAt) fd.append("endAt", form.endAt)

      const file = newBannerRef.current?.files?.[0]
      if (file) fd.append("banner", file)

      const res = await fetch("/api/super-admin/popup-ads", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Gagal membuat popup")
        return
      }

      const ad = await res.json()
      setAds((prev) => [ad, ...prev])
      setForm({ title: "", headline: "", body: "", ctaLabel: "", ctaUrl: "", isActive: false, startAt: "", endAt: "" })
      if (newBannerRef.current) newBannerRef.current.value = ""
      setShowForm(false)
      toast.success("Popup Ad berhasil dibuat")
    } catch {
      toast.error("Gagal membuat popup")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/super-admin/popup-ads/${id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("Gagal menghapus")
        return
      }
      setAds((prev) => prev.filter((a) => a.id !== id))
      toast.success("Popup Ad dihapus")
    } catch {
      toast.error("Gagal menghapus")
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    setSavingId(id)
    try {
      const fd = new FormData()
      fd.append("isActive", String(!isActive))

      const res = await fetch(`/api/super-admin/popup-ads/${id}`, {
        method: "PATCH",
        body: fd,
      })

      if (!res.ok) {
        toast.error("Gagal update status")
        return
      }

      const updated = await res.json()
      setAds((prev) => prev.map((a) => (a.id === id ? updated : a)))
      toast.success(updated.isActive ? "Popup diaktifkan" : "Popup dinonaktifkan")
    } catch {
      toast.error("Gagal update status")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Buat Popup Baru
        </Button>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Popup Ad Baru</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title (internal)</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Promo Lebaran 2026"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                value={form.headline}
                onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                placeholder="e.g. Diskon 50% Semua Paket!"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Body / Deskripsi</Label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Tulis detail promo, kode voucher, dll..."
              rows={3}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>CTA Label</Label>
              <Input
                value={form.ctaLabel}
                onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
                placeholder="e.g. Claim Sekarang"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA URL</Label>
              <Input
                value={form.ctaUrl}
                onChange={(e) => setForm((f) => ({ ...f, ctaUrl: e.target.value }))}
                placeholder="e.g. /register atau https://..."
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Mulai Tampil</Label>
              <Input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Berhenti Tampil</Label>
              <Input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Banner Image</Label>
            <Input
              ref={newBannerRef}
              type="file"
              accept="image/*"
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Maks 10 MB, akan di-compress ke Full HD
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="rounded"
              />
              Langsung aktif
            </label>
          </div>

          <Button onClick={handleCreate} disabled={creating} className="rounded-xl">
            {creating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan
          </Button>
        </div>
      )}

      {/* Existing Ads */}
      {ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-muted-foreground">
          <ImageIcon className="mb-2 h-10 w-10" />
          <p>Belum ada popup ad</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <PopupAdCard
              key={ad.id}
              ad={ad}
              isSaving={savingId === ad.id}
              isDeleting={deletingId === ad.id}
              onToggle={() => handleToggle(ad.id, ad.isActive)}
              onDelete={() => handleDelete(ad.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PopupAdCard({
  ad,
  isSaving,
  isDeleting,
  onToggle,
  onDelete,
}: {
  ad: PopupAdItem
  isSaving: boolean
  isDeleting: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Banner preview */}
        <div className="relative h-40 w-full shrink-0 bg-muted md:h-auto md:w-56">
          {ad.bannerUrl ? (
            <Image
              src={ad.bannerUrl}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="224px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{ad.title}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  ad.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {ad.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            {ad.headline && (
              <p className="text-sm font-medium text-primary">{ad.headline}</p>
            )}
            {ad.body && (
              <p className="line-clamp-2 text-xs text-muted-foreground">{ad.body}</p>
            )}
            {ad.ctaLabel && (
              <p className="text-xs">
                CTA: <span className="font-medium">{ad.ctaLabel}</span>
                {ad.ctaUrl && (
                  <span className="ml-1 text-muted-foreground">→ {ad.ctaUrl}</span>
                )}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">
              {ad.startAt
                ? `Mulai: ${new Date(ad.startAt).toLocaleDateString("id-ID")}`
                : "Tanpa tanggal mulai"}
              {" · "}
              {ad.endAt
                ? `Sampai: ${new Date(ad.endAt).toLocaleDateString("id-ID")}`
                : "Tanpa batas waktu"}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              disabled={isSaving}
              className="rounded-xl"
            >
              {isSaving ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : ad.isActive ? (
                <EyeOff className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <Eye className="mr-1.5 h-3.5 w-3.5" />
              )}
              {ad.isActive ? "Nonaktifkan" : "Aktifkan"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="rounded-xl text-destructive hover:bg-destructive/10"
            >
              {isDeleting ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
