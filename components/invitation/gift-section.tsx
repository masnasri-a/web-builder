"use client"

import { useState } from "react"
import { Copy, CheckCircle, Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export interface BankAccount {
  id: string
  bank: string
  accountNumber: string
  accountName: string
}

interface GiftSectionProps {
  invitationId: string
  title?: string
  description?: string
  showQris?: boolean
  qrisImage?: string | null
  banks?: BankAccount[]
  allowTransferProof?: boolean
  primaryColor: string
  accentColor: string
}

function CopyButton({ text, primaryColor }: { text: string; primaryColor: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy nomor rekening"
      className="ml-2 inline-flex shrink-0 transition-opacity hover:opacity-70"
    >
      {copied ? (
        <CheckCircle className="h-4 w-4" style={{ color: primaryColor }} />
      ) : (
        <Copy className="h-4 w-4 opacity-40" />
      )}
    </button>
  )
}

export function GiftSection({
  invitationId,
  title = "Hadiah Pernikahan",
  description,
  showQris,
  qrisImage,
  banks = [],
  allowTransferProof,
  primaryColor,
}: GiftSectionProps) {
  const [showQrisModal, setShowQrisModal] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [proofForm, setProofForm] = useState({
    guestName: "",
    amount: "",
    bankFrom: "",
    note: "",
  })
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleProofSubmit() {
    if (!proofFile || !proofForm.guestName.trim()) return
    setSubmitting(true)

    const fd = new FormData()
    fd.append("invitationId", invitationId)
    fd.append("guestName", proofForm.guestName)
    fd.append("amount", proofForm.amount)
    fd.append("bankFrom", proofForm.bankFrom)
    fd.append("note", proofForm.note)
    fd.append("proofFile", proofFile)

    const res = await fetch("/api/gift-proof", { method: "POST", body: fd })
    setSubmitting(false)

    if (!res.ok) {
      toast.error("Gagal mengirim bukti transfer")
      return
    }

    toast.success("Bukti transfer berhasil dikirim! 🎉")
    setShowProofModal(false)
    setProofForm({ guestName: "", amount: "", bankFrom: "", note: "" })
    setProofFile(null)
  }

  const hasBanks = banks.length > 0
  const hasQris = showQris && qrisImage

  if (!hasBanks && !hasQris && !allowTransferProof) return null

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: primaryColor, opacity: 0.6 }}
          >
            {title}
          </p>
          {description && (
            <p className="text-sm mx-auto max-w-xs leading-relaxed" style={{ opacity: 0.65 }}>
              {description}
            </p>
          )}
        </div>

        {/* Bank accounts */}
        {hasBanks && (
          <div className="space-y-3">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="rounded-2xl border p-4"
                style={{ borderColor: `${primaryColor}28` }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: primaryColor, opacity: 0.55 }}
                >
                  {bank.bank}
                </p>
                <div className="flex items-center">
                  <span
                    className="text-lg font-mono font-semibold tracking-wider"
                    style={{ color: primaryColor }}
                  >
                    {bank.accountNumber}
                  </span>
                  <CopyButton text={bank.accountNumber} primaryColor={primaryColor} />
                </div>
                <p className="text-sm mt-1" style={{ opacity: 0.6 }}>
                  a.n. {bank.accountName}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* QRIS */}
        {hasQris && (
          <button
            onClick={() => setShowQrisModal(true)}
            className="w-full rounded-2xl border p-4 flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
            style={{ borderColor: `${primaryColor}28` }}
          >
            <Image
              src={qrisImage!}
              alt="QRIS"
              width={130}
              height={130}
              className="rounded-xl object-contain"
            />
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: primaryColor, opacity: 0.6 }}
            >
              Tap untuk perbesar QRIS
            </p>
          </button>
        )}

        {/* Upload transfer proof */}
        {allowTransferProof && (
          <button
            onClick={() => setShowProofModal(true)}
            className="w-full rounded-full border py-2.5 text-sm font-medium transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <Upload className="h-4 w-4" />
            Kirim Bukti Transfer
          </button>
        )}
      </div>

      {/* QRIS full-screen modal */}
      {showQrisModal && qrisImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setShowQrisModal(false)}
        >
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowQrisModal(false)}
              className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
            <Image
              src={qrisImage}
              alt="QRIS"
              width={500}
              height={500}
              className="w-full rounded-2xl shadow-xl"
            />
          </div>
        </div>
      )}

      {/* Transfer proof modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Kirim Bukti Transfer</h3>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nama Kamu *</Label>
                <Input
                  placeholder="Ahmad Fauzi"
                  value={proofForm.guestName}
                  onChange={(e) => setProofForm((p) => ({ ...p, guestName: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bank Pengirim</Label>
                <Input
                  placeholder="BCA, Mandiri, dll."
                  value={proofForm.bankFrom}
                  onChange={(e) => setProofForm((p) => ({ ...p, bankFrom: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jumlah Transfer (Rp)</Label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={proofForm.amount}
                  onChange={(e) => setProofForm((p) => ({ ...p, amount: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bukti Transfer *</Label>
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-6 cursor-pointer hover:bg-muted/30 transition-colors">
                  {proofFile ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{proofFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(proofFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Tap untuk upload foto bukti</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Maks. 5 MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Pesan (opsional)</Label>
                <Textarea
                  placeholder="Semoga bahagia selalu..."
                  value={proofForm.note}
                  onChange={(e) => setProofForm((p) => ({ ...p, note: e.target.value }))}
                  className="rounded-xl"
                  rows={2}
                />
              </div>
            </div>

            <Button
              onClick={handleProofSubmit}
              disabled={!proofForm.guestName.trim() || !proofFile || submitting}
              className="w-full rounded-xl"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Mengirim..." : "Kirim Bukti Transfer"}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
