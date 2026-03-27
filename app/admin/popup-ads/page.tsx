import { db } from "@/lib/db"
import { PopupAdsManager } from "./popup-ads-manager"

export default async function AdminPopupAdsPage() {
  const ads = await db.popupAd.findMany({
    orderBy: { createdAt: "desc" },
  })

  const serialized = ads.map((a) => ({
    id: a.id,
    title: a.title,
    headline: a.headline,
    body: a.body,
    bannerUrl: a.bannerUrl,
    ctaLabel: a.ctaLabel,
    ctaUrl: a.ctaUrl,
    isActive: a.isActive,
    startAt: a.startAt?.toISOString() ?? null,
    endAt: a.endAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Popup Ad Manager</h1>
        <p className="text-muted-foreground">
          Kelola popup iklan / promo yang muncul di landing page
        </p>
      </div>
      <PopupAdsManager initialAds={serialized} />
    </div>
  )
}
