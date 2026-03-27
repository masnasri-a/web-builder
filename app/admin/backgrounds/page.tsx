import { db } from "@/lib/db"
import { BackgroundsManager } from "./backgrounds-manager"

export default async function SuperAdminBackgroundsPage() {
  const backgrounds = await db.backgroundImage.findMany({
    where: { isPreset: true },
    orderBy: { createdAt: "desc" },
  })

  const serialized = backgrounds.map((b) => ({
    id: b.id,
    url: b.url,
    key: b.key,
    name: b.name,
    createdAt: b.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Background Manager</h1>
        <p className="text-muted-foreground">
          Kelola background preset yang bisa digunakan oleh semua user
        </p>
      </div>
      <BackgroundsManager initialBackgrounds={serialized} />
    </div>
  )
}
