"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Pencil, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Vendor = {
  id: string
  shopName: string
  description: string | null
  discount: number
  isActive: boolean
  user: { id: string; name: string | null; email: string }
}

export function VendorsManager({ initialVendors }: { initialVendors: Vendor[] }) {
  const [vendors, setVendors] = useState(initialVendors)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDiscount, setEditDiscount] = useState("")

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch("/api/super-admin/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        shopName: fd.get("shopName"),
        description: fd.get("description") || undefined,
        discount: parseFloat(fd.get("discount") as string) || 5,
      }),
    })
    setLoading(false)

    if (!res.ok) {
      const { error } = await res.json()
      toast.error(error)
      return
    }

    toast.success("Vendor created")
    setShowForm(false)
    window.location.reload()
  }

  async function handleToggle(vendor: Vendor) {
    const res = await fetch(`/api/super-admin/vendors/${vendor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !vendor.isActive }),
    })
    if (!res.ok) { toast.error("Failed"); return }
    setVendors(v => v.map(x => x.id === vendor.id ? { ...x, isActive: !x.isActive } : x))
  }

  async function handleSaveDiscount(id: string) {
    const discount = parseFloat(editDiscount)
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Discount must be 0–100")
      return
    }
    const res = await fetch(`/api/super-admin/vendors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discount }),
    })
    if (!res.ok) { toast.error("Failed"); return }
    setVendors(v => v.map(x => x.id === id ? { ...x, discount } : x))
    setEditingId(null)
    toast.success("Discount updated")
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this vendor? Their role will revert to USER.")) return
    const res = await fetch(`/api/super-admin/vendors/${id}`, { method: "DELETE" })
    if (!res.ok) { toast.error("Failed"); return }
    setVendors(v => v.filter(x => x.id !== id))
    toast.success("Vendor removed")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-semibold">Promote User to Vendor</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>User Email</Label>
              <Input name="email" type="email" placeholder="user@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label>Shop Name</Label>
              <Input name="shopName" placeholder="My Wedding Studio" required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input name="description" placeholder="Optional description" />
            </div>
            <div className="space-y-1.5">
              <Label>Default Discount (%)</Label>
              <Input name="discount" type="number" min="0" max="100" step="0.5" defaultValue="5" required />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Vendor
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium">Shop / User</th>
              <th className="text-left px-4 py-3 font-medium">Discount</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">No vendors yet</td>
              </tr>
            )}
            {vendors.map(v => (
              <tr key={v.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{v.shopName}</p>
                  <p className="text-xs text-muted-foreground">{v.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  {editingId === v.id ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        className="h-7 w-20 text-xs"
                        value={editDiscount}
                        onChange={e => setEditDiscount(e.target.value)}
                        type="number" min="0" max="100" step="0.5"
                      />
                      <button onClick={() => handleSaveDiscount(v.id)} className="text-green-600 hover:text-green-700">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(v.id); setEditDiscount(String(v.discount)) }}
                      className="flex items-center gap-1.5 hover:text-primary"
                    >
                      {v.discount}%
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(v)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${v.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                  >
                    {v.isActive ? "Active" : "Inactive"}
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
