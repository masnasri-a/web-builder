"use client"

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { gsap } from "gsap"

export interface MasonryItem {
  id: string
  img: string
  height?: number // optional — if omitted, natural image ratio is used
}

interface MasonryProps {
  items: MasonryItem[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random"
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
  /** Cap the responsive column count (e.g. 2 for gallery sections) */
  maxColumns?: number
}

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number
): number => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue

  const [value, setValue] = useState(get)

  useEffect(() => {
    const handler = () => setValue(get)
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler))
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler)
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries])

  return value
}

const useMeasure = (): [
  React.RefObject<HTMLDivElement | null>,
  { width: number; height: number },
] => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size]
}

interface GridItem extends MasonryItem {
  x: number
  y: number
  w: number
  h: number
}

export function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  maxColumns,
}: MasonryProps) {
  const rawColumns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1
  )
  const columns = maxColumns ? Math.min(rawColumns, maxColumns) : rawColumns

  const [containerRef, { width }] = useMeasure()
  const [imageSizes, setImageSizes] = useState<Map<string, { w: number; h: number }>>(new Map())
  const [imagesReady, setImagesReady] = useState(false)

  // Preload images and detect natural dimensions simultaneously
  useEffect(() => {
    if (items.length === 0) {
      setImagesReady(true)
      return
    }
    const sizes = new Map<string, { w: number; h: number }>()
    let loaded = 0

    const done = () => {
      loaded++
      if (loaded === items.length) {
        setImageSizes(new Map(sizes))
        setImagesReady(true)
      }
    }

    items.forEach((item) => {
      const img = new Image()
      img.src = item.img
      img.onload = () => {
        sizes.set(item.id, { w: img.naturalWidth, h: img.naturalHeight })
        done()
      }
      img.onerror = () => done()
    })
  }, [items])

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction = animateFrom
    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"] as const
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 }
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 }
      case "left":
        return { x: -200, y: item.y }
      case "right":
        return { x: window.innerWidth + 200, y: item.y }
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [] as GridItem[], totalHeight: 0 }

    const colHeights = new Array(columns).fill(0) as number[]
    const columnWidth = width / columns

    const grid: GridItem[] = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const y = colHeights[col]

      // Use natural aspect ratio if available, otherwise fallback to provided height or 300
      const natSize = imageSizes.get(child.id)
      const height = natSize
        ? columnWidth * (natSize.h / natSize.w)
        : (child.height ?? 300)

      colHeights[col] += height

      return { ...child, x, y, w: columnWidth, h: height }
    })

    return { grid, totalHeight: Math.max(...colHeights, 0) }
  }, [columns, items, width, imageSizes])

  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    if (!imagesReady) return

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      }

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item)
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        }

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        })
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: "auto",
        })
      }
    })

    hasMounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease])

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: GridItem) => {
    const element = e.currentTarget
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, { scale: hoverScale, duration: 0.3, ease: "power2.out" })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".masonry-color-overlay")
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 })
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, item: GridItem) => {
    const element = e.currentTarget
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, { scale: 1, duration: 0.3, ease: "power2.out" })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".masonry-color-overlay")
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 })
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: totalHeight || "auto" }}
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          style={{
            position: "absolute",
            willChange: "transform, width, height, opacity",
            padding: "6px",
            cursor: "default",
            top: 0,
            left: 0,
          }}
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={(e) => handleMouseLeave(e, item)}
        >
          <div
            style={{
              position: "relative",
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              boxShadow: "0px 10px 50px -10px rgba(0,0,0,0.2)",
            }}
          >
            {colorShiftOnHover && (
              <div
                className="masonry-color-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))",
                  opacity: 0,
                  pointerEvents: "none",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
