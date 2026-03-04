"use client"

import { useEffect, useRef, useState } from "react"

export type AnimVariant = "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight"

export function Anim({
  children,
  delay = 0,
  variant = "fadeUp",
  className,
}: {
  children: React.ReactNode
  delay?: number
  variant?: AnimVariant
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const hidden: Record<AnimVariant, React.CSSProperties> = {
    fadeUp:     { opacity: 0, transform: "translateY(24px)" },
    fadeIn:     { opacity: 0 },
    scaleIn:    { opacity: 0, transform: "scale(0.82)" },
    slideLeft:  { opacity: 0, transform: "translateX(-28px)" },
    slideRight: { opacity: 0, transform: "translateX(28px)" },
  }

  const shown: React.CSSProperties = { opacity: 1, transform: "none" }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(visible ? shown : hidden[variant]),
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}
