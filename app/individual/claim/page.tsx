"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Gift, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ClaimedVoucher = {
  voucher: {
    code: string
    type: string
    discountPercent: number | null
    description: string | null
    expiresAt: string | null
    vendorProfile: { shopName: string } | null
  }
}

export default function ClaimVoucherPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [claimed, setClaimed] = useState<ClaimedVoucher | null>(null)

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)

    const res = await fetch("/api/vouchers/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    })

    setLoading(false)

    if (!res.ok) {
      const { error } = await res.json()
      toast.error(error)
      return
    }

    const data = await res.json()
    setClaimed(data)
    toast.success("Voucher claimed successfully!")
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Claim Voucher</h1>
        <p className="text-muted-foreground">Enter a voucher code to claim your discount</p>
      </div>

      {!claimed ? (
        <form onSubmit={handleClaim} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <Label>Voucher Code</Label>
            <Input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WEDDING50"
              className="font-mono text-lg tracking-widest"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
            {loading ? "Claiming..." : "Claim Voucher"}
          </Button>
        </form>
      ) : (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold text-green-800">Voucher Claimed!</h2>
          <code className="text-2xl font-mono font-bold text-primary block">{claimed.voucher.code}</code>
          <div className="text-sm text-green-700 space-y-1">
            <p>{claimed.voucher.vendorProfile?.shopName ?? "Platform Voucher"}</p>
            {claimed.voucher.type === "DISCOUNT" && claimed.voucher.discountPercent !== null && (
              <p className="font-semibold text-lg">{claimed.voucher.discountPercent}% Discount</p>
            )}
            {claimed.voucher.type === "FREE" && <p className="font-semibold text-lg">Free Voucher</p>}
            {claimed.voucher.description && <p>{claimed.voucher.description}</p>}
            {claimed.voucher.expiresAt && (
              <p>Valid until {new Date(claimed.voucher.expiresAt).toLocaleDateString()}</p>
            )}
          </div>
          <Button variant="outline" className="mt-4" onClick={() => { setClaimed(null); setCode("") }}>
            Claim Another
          </Button>
        </div>
      )}
    </div>
  )
}
