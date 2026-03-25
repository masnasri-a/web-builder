"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) { router.replace("/login"); return }

    const role = session.user.role
    if (role === "SUPER_ADMIN") router.replace("/super-admin")
    else if (role === "VENDOR") router.replace("/vendor")
    else if (role === "INDIVIDUAL") router.replace("/individual")
    else if (role === "ADMIN") router.replace("/admin")
    else router.replace("/dashboard")
  }, [session, status, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
