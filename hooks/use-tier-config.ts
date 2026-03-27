"use client"

import { useEffect, useState } from "react"
import type { TierConfigData } from "@/lib/tier"

export function useTierConfig() {
  const [tierConfig, setTierConfig] = useState<TierConfigData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/tier-config")
      .then((r) => r.json())
      .then((data) => setTierConfig(data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return { tierConfig, isLoading }
}
