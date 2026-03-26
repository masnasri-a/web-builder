"use client"

import Image, { type ImageProps } from "next/image"
import { useShowWatermark } from "@/components/invitation/guest-context"

/**
 * Drop-in replacement for next/image that adds a "selembar.id" watermark
 * overlay when the invitation owner is on the BASIC (free) tier.
 */
export function WatermarkedImage(props: ImageProps) {
  const showWatermark = useShowWatermark()

  if (!showWatermark) {
    return <Image {...props} />
  }

  // When `fill` is used, the parent already has position:relative and dimensions
  const isFill = props.fill

  return (
    <span
      className={isFill ? "absolute inset-0" : "relative inline-block"}
      style={isFill ? undefined : { display: "inline-block", width: "100%", height: "100%" }}
    >
      <Image {...props} />
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="select-none text-sm font-bold tracking-wider"
          style={{
            color: "rgba(255,255,255,0.45)",
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            transform: "rotate(-25deg)",
            whiteSpace: "nowrap",
            fontSize: "clamp(12px, 3vw, 18px)",
          }}
        >
          selembar.id
        </span>
      </span>
    </span>
  )
}
