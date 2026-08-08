import { NextRequest, NextResponse } from 'next/server'
import { SUPPORT_CONTEXT } from '@/lib/support-context'

export async function POST(req: NextRequest) {
  const { message, history } = await req.json()

  if (!message || typeof message !== 'string' || message.length > 500) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Support chat is not configured yet. Please use the Contact page.' },
      { status: 503 }
    )
  }

  try {
    const contents = [
      ...(Array.isArray(history) ? history.slice(-6) : []), // last 3 exchanges for context, keep it light
      { role: 'user', parts: [{ text: message }] },
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SUPPORT_CONTEXT }] },
          contents,
          generationConfig: {
            // Gemini 3.x: don't override temperature/top_p/top_k — Google
            // explicitly recommends leaving these at default for 3.x models.
            maxOutputTokens: 300,
            thinkingConfig: { thinkingLevel: 'minimal' }, // fastest/cheapest — right fit for a quick FAQ bot, not deep reasoning
          },
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', errText)
      return NextResponse.json(
        { error: 'Something went wrong. Please try the Contact page instead.' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm not sure about that — please reach out through our Contact page and our team will help."

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Support chat error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try the Contact page instead.' },
      { status: 500 }
    )
  }
}
