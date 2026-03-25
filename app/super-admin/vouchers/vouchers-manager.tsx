"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Voucher = {
  id: string
  code: string
  type: "FREE" | "DISCOUNT"
  description: string | null
  discountPercent: number | null
  isActive: boolean
  expiresAt: string | null
  maxClaims: number | null
  vendorProfile: { shopName: string } | null
  _count: { claims: number }
}

export function VouchersManager({
  initialVouchers,
  role,
}: {
  initialVouchers: Voucher[]
  role: "SUPER_ADMIN" | "VENDOR"
}) {
  const [vouchers, setVouchers] = useState(initialVouchers)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const type = fd.get("type") as string
    const expiresAt = fd.get("expiresAt") as string
    const maxClaims = fd.get("maxClaims") as string

    const res = await fetch("/api/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: fd.get("code"),
        type,
        description: fd.get("description") || undefined,
        discountPercent: type === "DISCOUNT" ? parseFloat(fd.get("discountPercent") as string) : undefined,
        expiresAt: expiresAt || undefined,
        maxClaims: maxClaims ? parseInt(maxClaims) : undefined,
      }),
    })
    setLoading(false)

    if (!res.ok) {
      const { error } = await res.json()
      toast.error(error)
      return
    }

    toast.success("Voucher created")
    setShowForm(false)
    window.location.reload()
  }

  async function handleToggle(v: Voucher) {
    const res = await fetch(`/api/vouchers/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !v.isActive }),
    })
    if (!res.ok) { toast.error("Failed"); return }
    setVouchers(list => list.map(x => x.id === v.id ? { ...x, isActive: !x.isActive } : x))
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this voucher?")) return
    const res = await fetch(`/api/vouchers/${id}`, { method: "DELETE" })
    if (!res.ok) { toast.error("Failed"); return }
    setVouchers(list => list.filter(x => x.id !== id))
    toast.success("Deleted")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Create Voucher
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-semibold">New Voucher</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input name="code" placeholder="WEDDING50" required />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select name="type" className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm" required>
                {role === "SUPER_ADMIN" && <option value="FREE">FREE</option>}
                <option value="DISCOUNT">DISCOUNT</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Discount % (if DISCOUNT type)</Label>
              <Input name="discountPercent" type="number" min="0" max="100" step="0.5" placeholder="10" />
            </div>
            <div className="space-y-1.5">
              <Label>Max Claims (optional)</Label>
              <Input name="maxClaims" type="number" min="1" placeholder="100" />
            </div>
            <div className="space-y-1.5">
              <Label>Expires At (optional)</Label>
              <Input name="expiresAt" type="datetime-local" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input name="description" placeholder="Optional description" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium">Code</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Discount</th>
              <th className="text-left px-4 py-3 font-medium">Claims</th>
              <th className="text-left px-4 py-3 font-medium">Expires</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">No vouchers yet</td>
              </tr>
            )}
            {vouchers.map(v => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <code className="font-mono font-bold text-primary">{v.code}</code>
                  {v.description && <p className="text-xs text-muted-foreground">{v.description}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.type === "FREE" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {v.type}
                  </span>
                </td>
                <td className="px-4 py-3">{v.discountPercent !== null ? `${v.discountPercent}%` : "—"}</td>
                <td className="px-4 py-3">
                  {v._count.claims}{v.maxClaims ? `/${v.maxClaims}` : ""}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {v.expiresAt ? new Date(v.expiresAt).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(v)} className="text-muted-foreground hover:text-foreground">
                    {v.isActive
                      ? <ToggleRight className="h-5 w-5 text-green-500" />
                      : <ToggleLeft className="h-5 w-5" />}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(v.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
