import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/popup-ads/active — returns the currently active popup ad (if any)
// No auth required — public route for the landing page
export async function GET() {
  const now = new Date()

  const ad = await db.popupAd.findFirst({
    where: {
      isActive: true,
      OR: [
        { startAt: null, endAt: null },
        { startAt: null, endAt: { gte: now } },
        { startAt: { lte: now }, endAt: null },
        { startAt: { lte: now }, endAt: { gte: now } },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      headline: true,
      body: true,
      bannerUrl: true,
      ctaLabel: true,
      ctaUrl: true,
    },
  })

  if (!ad) {
    return NextResponse.json(null)
  }

  return NextResponse.json(ad)
}
