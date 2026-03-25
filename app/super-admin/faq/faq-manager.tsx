"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Plus, Trash2, Loader2, ToggleLeft, ToggleRight,
  GripVertical, Pencil, Check, X, MessageSquare, Phone, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Faq = { id: string; question: string; answer: string; order: number; isActive: boolean }
type Config = { id: string; waNumber: string; waMessage: string }

export function FaqManager({
  initialFaqs,
  initialConfig,
}: {
  initialFaqs: Faq[]
  initialConfig: Config
}) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [config, setConfig] = useState(initialConfig)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<{ question: string; answer: string }>({ question: "", answer: "" })

  // ── Create FAQ ──────────────────────────────────────────
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch("/api/super-admin/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: fd.get("question"),
        answer: fd.get("answer"),
        order: faqs.length,
      }),
    })
    setLoading(false)

    if (!res.ok) { toast.error("Gagal membuat FAQ"); return }
    const created = await res.json()
    setFaqs(prev => [...prev, created])
    toast.success("FAQ berhasil ditambahkan")
    setShowForm(false)
    ;(e.target as HTMLFormElement).reset()
  }

  // ── Toggle active ───────────────────────────────────────
  async function handleToggle(faq: Faq) {
    const res = await fetch(`/api/super-admin/faq/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !faq.isActive }),
    })
    if (!res.ok) { toast.error("Gagal"); return }
    setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, isActive: !f.isActive } : f))
  }

  // ── Inline edit ─────────────────────────────────────────
  function startEdit(faq: Faq) {
    setEditingId(faq.id)
    setEditDraft({ question: faq.question, answer: faq.answer })
  }

  async function saveEdit(id: string) {
    if (!editDraft.question.trim() || !editDraft.answer.trim()) {
      toast.error("Pertanyaan dan jawaban tidak boleh kosong")
      return
    }
    const res = await fetch(`/api/super-admin/faq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    })
    if (!res.ok) { toast.error("Gagal menyimpan"); return }
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...editDraft } : f))
    setEditingId(null)
    toast.success("FAQ diperbarui")
  }

  // ── Delete ──────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Hapus FAQ ini?")) return
    const res = await fetch(`/api/super-admin/faq/${id}`, { method: "DELETE" })
    if (!res.ok) { toast.error("Gagal"); return }
    setFaqs(prev => prev.filter(f => f.id !== id))
    toast.success("FAQ dihapus")
  }

  // ── Sync to Pinecone ────────────────────────────────────
  async function handleSync() {
    setSyncing(true)
    const res = await fetch("/api/super-admin/faq-sync", { method: "POST" })
    setSyncing(false)
    if (!res.ok) { toast.error("Sync gagal"); return }
    const { synced } = await res.json()
    toast.success(`${synced} FAQ berhasil disinkronkan ke Pinecone`)
  }

  // ── Save support config ─────────────────────────────────
  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault()
    setSavingConfig(true)
    const res = await fetch("/api/super-admin/support-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ waNumber: config.waNumber, waMessage: config.waMessage }),
    })
    setSavingConfig(false)
    if (!res.ok) { toast.error("Gagal menyimpan"); return }
    toast.success("Konfigurasi support disimpan")
  }

  return (
    <div className="space-y-8">
      {/* ── Support Config ── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Phone className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Kontak Support WhatsApp</h2>
        </div>
        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Nomor WhatsApp</Label>
            <Input
              value={config.waNumber}
              onChange={e => setConfig(c => ({ ...c, waNumber: e.target.value }))}
              placeholder="6281234567890 (tanpa + atau spasi)"
              required
            />
            <p className="text-xs text-muted-foreground">Format: 62xxxxxxxxxx (kode negara tanpa +)</p>
          </div>
          <div className="space-y-1.5">
            <Label>Pesan Default</Label>
            <Input
              value={config.waMessage}
              onChange={e => setConfig(c => ({ ...c, waMessage: e.target.value }))}
              placeholder="Halo, saya butuh bantuan..."
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={savingConfig}>
              {savingConfig && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Konfigurasi
            </Button>
          </div>
        </form>
      </div>

      {/* ── FAQ List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Daftar FAQ ({faqs.length})</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSync} disabled={syncing}>
              {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Sync ke Pinecone
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4" />
              Tambah FAQ
            </Button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold">FAQ Baru</h3>
            <div className="space-y-1.5">
              <Label>Pertanyaan</Label>
              <Input name="question" placeholder="Bagaimana cara membuat undangan?" required />
            </div>
            <div className="space-y-1.5">
              <Label>Jawaban</Label>
              <textarea
                name="answer"
                rows={3}
                placeholder="Kamu bisa membuat undangan dengan mengklik tombol 'Buat Undangan'..."
                required
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {faqs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
              Belum ada FAQ. Tambahkan pertanyaan pertama!
            </div>
          )}
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className={`rounded-2xl border bg-card p-4 shadow-sm transition-opacity ${!faq.isActive ? "opacity-50" : ""}`}
            >
              {editingId === faq.id ? (
                <div className="space-y-2">
                  <Input
                    value={editDraft.question}
                    onChange={e => setEditDraft(d => ({ ...d, question: e.target.value }))}
                    className="font-medium"
                  />
                  <textarea
                    value={editDraft.answer}
                    onChange={e => setEditDraft(d => ({ ...d, answer: e.target.value }))}
                    rows={3}
                    className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(faq.id)} className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700">
                      <Check className="h-3.5 w-3.5" /> Simpan
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" /> Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground mr-2">#{idx + 1}</span>
                        {faq.question}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleToggle(faq)} title={faq.isActive ? "Nonaktifkan" : "Aktifkan"}>
                          {faq.isActive
                            ? <ToggleRight className="h-4 w-4 text-green-500" />
                            : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                        </button>
                        <button onClick={() => startEdit(faq)} className="text-muted-foreground hover:text-primary p-0.5">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(faq.id)} className="text-muted-foreground hover:text-destructive p-0.5">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
