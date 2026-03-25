"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MessageCircle, X, Send, ExternalLink, RotateCcw } from "lucide-react"

type Faq = { id: string; question: string; answer: string }
type SupportConfig = { waNumber: string; waMessage: string }
type HistoryItem = { role: "user" | "assistant"; content: string }

type Message =
  | { id: string; role: "bot"; type: "text"; text: string; streaming?: boolean }
  | { id: string; role: "bot"; type: "faqs"; faqs: Faq[] }
  | { id: string; role: "user"; text: string }

const GREETING =
  "Halo! 👋 Selamat datang di Selembar.id.\nAda yang bisa saya bantu? Pilih pertanyaan di bawah atau ketik langsung ya!"

function uid() {
  return Math.random().toString(36).slice(2)
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [support, setSupport] = useState<SupportConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [input, setInput] = useState("")
  const [unread, setUnread] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // ── Initial data fetch ────────────────────────────────────
  useEffect(() => {
    const safeFetch = async (url: string, fallback: unknown) => {
      try {
        const r = await fetch(url)
        if (!r.ok) return fallback
        return r.json()
      } catch {
        return fallback
      }
    }
    Promise.all([
      safeFetch("/api/faq", []),
      safeFetch("/api/support-config", { waNumber: "", waMessage: "" }),
    ]).then(([faqData, supportData]) => {
      setFaqs(faqData as Faq[])
      setSupport(supportData as SupportConfig)
    })
  }, [])

  // ── Open chat: init messages ──────────────────────────────
  useEffect(() => {
    if (open && messages.length === 0) {
      const msgs: Message[] = [
        { id: uid(), role: "bot", type: "text", text: GREETING },
      ]
      if (faqs.length > 0) {
        msgs.push({ id: uid(), role: "bot", type: "faqs", faqs })
      }
      setMessages(msgs)
      setUnread(0)
    }
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, faqs, messages.length])

  // ── Unread badge ─────────────────────────────────────────
  useEffect(() => {
    if (faqs.length === 0) return
    const t = setTimeout(() => { if (!open) setUnread(1) }, 3500)
    return () => clearTimeout(t)
  }, [faqs.length, open])

  // ── Scroll to bottom ──────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Stream chat from Groq via /api/chat ───────────────────
  const streamChat = useCallback(async (userText: string) => {
    if (isStreaming) return

    const userMsg: Message = { id: uid(), role: "user", text: userText }
    const botId = uid()
    const botMsg: Message = { id: botId, role: "bot", type: "text", text: "", streaming: true }

    setMessages(prev => [...prev, userMsg, botMsg])
    setHistory(prev => [...prev, { role: "user", content: userText }])
    setIsStreaming(true)

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
        signal: abort.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error("stream failed")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        setMessages(prev =>
          prev.map(m =>
            m.id === botId && m.role === "bot" && m.type === "text"
              ? { ...m, text: full }
              : m
          )
        )
      }

      // Mark done
      setMessages(prev =>
        prev.map(m =>
          m.id === botId && m.role === "bot" && m.type === "text"
            ? { ...m, streaming: false }
            : m
        )
      )
      setHistory(prev => [...prev, { role: "assistant", content: full }])
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMessages(prev =>
        prev.map(m =>
          m.id === botId && m.role === "bot" && m.type === "text"
            ? { ...m, text: "Maaf, terjadi gangguan. Silakan coba lagi.", streaming: false }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [isStreaming, history])

  // ── FAQ quick reply ───────────────────────────────────────
  function handleFaqClick(faq: Faq) {
    if (isStreaming) return
    streamChat(faq.question)
  }

  // ── Send typed message ────────────────────────────────────
  function handleSend() {
    const q = input.trim()
    if (!q || isStreaming) return
    setInput("")
    streamChat(q)
  }

  // ── Reset conversation ────────────────────────────────────
  function handleReset() {
    if (abortRef.current) abortRef.current.abort()
    setMessages([])
    setHistory([])
    setIsStreaming(false)
  }

  const waUrl =
    support?.waNumber
      ? `https://wa.me/${support.waNumber}?text=${encodeURIComponent(support.waMessage || "Halo, saya butuh bantuan")}`
      : null

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Buka chat support"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[350px] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          style={{ maxHeight: "min(560px, calc(100dvh - 120px))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3 shrink-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Selembar Support</p>
              <p className="text-[11px] text-white/70 flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300" />
                Aktif sekarang
              </p>
            </div>
            <button
              onClick={handleReset}
              title="Reset percakapan"
              className="text-white/60 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-muted/20">
            {messages.map(msg => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-white shadow-sm">
                      {msg.text}
                    </div>
                  </div>
                )
              }

              if (msg.type === "text") {
                return (
                  <div key={msg.id} className="flex items-end gap-2">
                    <BotAvatar />
                    <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-card border border-border px-3.5 py-2.5 text-sm text-foreground shadow-sm whitespace-pre-line">
                      {msg.text || (msg.streaming && <TypingDots />)}
                      {msg.streaming && msg.text && (
                        <span className="inline-block w-0.5 h-3.5 bg-primary/70 ml-0.5 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                )
              }

              if (msg.type === "faqs") {
                return (
                  <div key={msg.id} className="flex items-end gap-2">
                    <BotAvatar />
                    <div className="flex-1 space-y-1.5">
                      {msg.faqs.map(faq => (
                        <button
                          key={faq.id}
                          onClick={() => handleFaqClick(faq)}
                          disabled={isStreaming}
                          className="block w-full rounded-xl border border-primary/25 bg-card px-3 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {faq.question}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }

              return null
            })}
            <div ref={bottomRef} />
          </div>

          {/* WA shortcut bar */}
          {waUrl && (
            <div className="flex items-center gap-2 px-3 py-2 border-t border-border/60 bg-card shrink-0">
              <span className="text-xs text-muted-foreground flex-1">Butuh bantuan lebih lanjut?</span>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                WhatsApp
              </a>
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={isStreaming ? "Mengetik..." : "Ketik pertanyaanmu..."}
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-35 transition-opacity hover:opacity-90"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function BotAvatar() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold self-end mb-0.5">
      S
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 h-4">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
