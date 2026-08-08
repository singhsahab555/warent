'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = { role: 'user' | 'model'; text: string }

const SUGGESTIONS = [
  'How do refunds work?',
  'How is pricing calculated?',
  'Who maintains the warehouse?',
]

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const nextMessages: Message[] = [...messages, { role: 'user', text: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(0, -1).map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: data.error ?? 'Something went wrong — please try the Contact page.' },
        ])
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Connection issue — please try again or use the Contact page.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg shadow-brand-600/40 transition hover:scale-105 hover:bg-brand-700"
        aria-label="Open support chat"
      >
        {open ? (
          '✕'
        ) : (
          <>
            💬
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent-400 animate-pulse-ring" />
          </>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="animate-fade-in-up fixed bottom-24 right-6 z-40 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl shadow-ink-900/20">
          <div className="flex items-center gap-2.5 bg-ink-900 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm">🤖</div>
            <div>
              <p className="text-sm font-bold text-white">WARENT Assistant</p>
              <p className="text-[11px] text-white/50">Usually replies instantly</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div>
                <p className="rounded-2xl rounded-tl-sm bg-gray-100 px-3.5 py-2.5 text-sm text-ink-900">
                  Hi! I can answer quick questions about bookings, pricing, and refunds. What can I help with?
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-brand-600 text-white'
                      : 'rounded-tl-sm bg-gray-100 text-ink-900'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-black/5 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
              >
                →
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              Need a human?{' '}
              <Link href="/contact" className="font-semibold text-brand-600 underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
