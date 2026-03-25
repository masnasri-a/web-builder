"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type FaqItem = { id: string; question: string; answer: string }

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <div className="divide-y" style={{ borderColor: "rgba(27,58,45,0.1)" }}>
      {faqs.map((faq) => {
        const isOpen = open === faq.id
        return (
          <div key={faq.id}>
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="lp-serif pr-6 text-lg font-medium leading-snug"
                style={{ color: "var(--lp-950)" }}
              >
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                style={{ color: "var(--lp-600)" }}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[600px] pb-5 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(27,58,45,0.75)",
                  fontFamily: "system-ui, sans-serif",
                  lineHeight: "1.8",
                }}
              >
                {faq.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
