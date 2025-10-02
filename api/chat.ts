// Vercel-style serverless function for Gemini chat proxy.
// If deploying on Netlify or another platform adjust signature accordingly.
// PLACEHOLDER: Put your Gemini API key in environment variable GEMINI_API_KEY (NOT a VITE_ prefixed key!).
// After deployment set GEMINI_API_KEY in the platform's dashboard.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface IncomingMessage { role: 'user' | 'assistant'; content: string }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY missing' })

  try {
    const { messages } = req.body as { messages?: IncomingMessage[] }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' })
    }

    // Basic guardrail: limit total prompt length.
    const limited = messages.slice(-10)

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = limited
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n') + '\nAssistant:'

    const result = await model.generateContent(prompt)
    const reply = result.response.text()
    res.status(200).json({ reply })
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('Gemini chat error', e)
    res.status(500).json({ error: 'Gemini request failed' })
  }
}
