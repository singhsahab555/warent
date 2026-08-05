'use client'

import { useState } from 'react'

export default function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-bold text-ink-900">{question}</span>
        <span
          className={`ml-4 shrink-0 text-brand-600 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
        >
          ＋
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  )
}
