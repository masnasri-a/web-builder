"use client"

import { createContext, useContext } from "react"

interface GuestContextValue {
  guestName?: string
  guestId?: string
  ownerTier?: string
}

const GuestContext = createContext<GuestContextValue>({})

export function GuestContextProvider({
  children,
  guestName,
  guestId,
  ownerTier,
}: {
  children: React.ReactNode
  guestName?: string
  guestId?: string
  ownerTier?: string
}) {
  return (
    <GuestContext.Provider value={{ guestName, guestId, ownerTier }}>
      {children}
    </GuestContext.Provider>
  )
}

export function useGuestContext() {
  return useContext(GuestContext)
}

/** Returns true when the invitation owner is on BASIC tier (watermark required) */
export function useShowWatermark(): boolean {
  const { ownerTier } = useGuestContext()
  return ownerTier === "BASIC"
}
