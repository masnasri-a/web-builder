"use client"

import dynamic from "next/dynamic"

// dynamic import client-only music manager
const MusicManager = dynamic(
  () => import("@/components/admin/music-manager").then((m) => m.MusicManager),
  { ssr: false }
)

export function MusicManagerWrapper() {
  return <MusicManager />
}
