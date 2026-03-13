"use client"

import { createContext, useContext } from "react"

interface GuestContextValue {
  guestName?: string
}

const GuestContext = createContext<GuestContextValue>({})

export function GuestContextProvider({
  children,
  guestName,
}: {
  children: React.ReactNode
  guestName?: string
}) {
  return <GuestContext.Provider value={{ guestName }}>{children}</GuestContext.Provider>
}

export function useGuestContext() {
  return useContext(GuestContext)
}
