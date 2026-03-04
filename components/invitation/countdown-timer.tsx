"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  eventDate: string
  primaryColor: string
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ eventDate, primaryColor }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    function calculate() {
      const target = new Date(eventDate).getTime()
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    calculate()
    const id = setInterval(calculate, 1000)
    return () => clearInterval(id)
  }, [eventDate])

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="flex justify-center gap-4">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            {String(value).padStart(2, "0")}
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-widest opacity-60">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
