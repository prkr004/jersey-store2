// Direct Gemini client-side call (no server proxy) — NOTE: This exposes your API key in the built bundle.
// Only do this for quick prototypes. For production, ALWAYS use a server / edge function.
// 1. Add to .env.local (and .env if you want) ->  VITE_GEMINI_API_KEY=your_key_here
// 2. Restart dev server so Vite injects it.

import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ChatMessage { role: 'user' | 'assistant'; content: string }

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const CHAT_MODE = ((import.meta.env.VITE_CHAT_MODE as string | undefined)?.toLowerCase() || 'remote') as 'remote' | 'local'
if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('[chat] VITE_GEMINI_API_KEY is not set. Chatbot will fail until you add it to .env')
}

// Reuse a single model instance.
let _modelCache: { name: string; model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> } | null = null
let _cooldownUntil = 0 // ms timestamp until which we should not send requests
const STORAGE_BLOCK_KEY = 'jerseyx_chat_block_until'

const envModel = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim()
// Broader candidate list (order matters; fastest + cheaper first)
const MODEL_CANDIDATES = [
  envModel,
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-pro-latest'
].filter(Boolean) as string[]

function makeClientModel(name: string) {
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY')
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: name })
}

async function generateWithFallback(prompt: string) {
  // If cached model exists try it first
  if (_modelCache) {
    try {
      const result = await _modelCache.model.generateContent([{ text: prompt }])
      return { reply: result.response.text() || '(No response)', model: _modelCache.name }
    } catch (e: any) {
      // If 404 or unsupported now, clear cache & proceed
      if (e?.message?.includes('404')) {
        _modelCache = null
      } else {
        // Other errors bubble later after trying fallbacks
      }
    }
  }

  let lastErr: any = null
  for (const name of MODEL_CANDIDATES) {
    try {
      const model = makeClientModel(name)
      const result = await model.generateContent([{ text: prompt }])
      const reply = result.response.text() || '(No response)'
      _modelCache = { name, model }
      return { reply, model: name }
    } catch (e: any) {
      lastErr = e
      // Try next on 404 model not found or unsupported method
      if (e?.message?.includes('404') || e?.message?.includes('not found')) continue
      // If rate limit / auth error, break early (no point trying others)
      if (/(permission|unauthorized|quota|rate)/i.test(e?.message || '')) break
    }
  }
  throw lastErr || new Error('Unknown Gemini error (no models succeeded)')
}

function answerLocally(messages: ChatMessage[]) {
  const last = messages[messages.length - 1]?.content.toLowerCase() || ''
  const has = (w: string) => last.includes(w)
  // Very light offline responses for common store questions
  if (has('shipping') || has('deliver')) return { reply: 'We ship in 2–5 business days. You’ll see an ETA on the order confirmation screen. Standard shipping is free on orders over ₹2,499.' , local: true }
  if (has('return') || has('refund') || has('exchange')) return { reply: 'Returns are accepted within 7 days for damaged or incorrect items. Customized jerseys are non‑returnable. Reach us at support@jerseyx.in to start a return.', local: true }
  if (has('size') || has('sizing') || has('fit')) return { reply: 'Most jerseys are true‑to‑size. If between sizes, we recommend the larger fit for comfort over layers. Size options: XS–XXL depending on the product.', local: true }
  if (has('payment') || has('upi') || has('card') || has('wallet')) return { reply: 'We accept UPI, cards, netbanking and popular wallets. Payments are processed securely via trusted gateways.', local: true }
  if (has('contact') || has('support') || has('help')) return { reply: 'You can reach us at support@jerseyx.in. We typically respond within one business day.', local: true }
  return { reply: 'I’m in a limited mode right now but can still help with basics: shipping, returns, sizing, payments, or contact info. Try asking about one of those.', local: true }
}

function getBlockedUntil(): number {
  try { return Number(localStorage.getItem(STORAGE_BLOCK_KEY) || '0') } catch { return 0 }
}

function setBlockedFor(ms: number) {
  const until = Date.now() + ms
  try { localStorage.setItem(STORAGE_BLOCK_KEY, String(until)) } catch {}
  return until
}

export async function sendChat(messages: ChatMessage[]) {
  if (!messages.length) return { reply: 'Ask me something about the store or products.' }

  const limited = messages.slice(-10) // trim context
  // Build a simple conversational transcript.
  const prompt = limited
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n') + '\nAssistant:'

  try {
    // Local/offline mode (forced or auto‑enabled)
    const blockedUntil = getBlockedUntil()
    const now = Date.now()
    if (CHAT_MODE === 'local' || now < blockedUntil) {
      return answerLocally(messages)
    }
    // Respect cooldown if previously rate-limited
    if (now < _cooldownUntil) {
      const retryInMs = _cooldownUntil - now
      const secs = Math.ceil(retryInMs / 1000)
      return { reply: `I’m getting a lot of requests right now. Please try again in about ${secs}s.`, rateLimited: true, retryInMs }
    }
    const { reply, model } = await generateWithFallback(prompt)
    return { reply, model }
  } catch (e: any) {
    const raw = e?.message || String(e)
    // Detect rate limit and set a cooldown to prevent spamming the API
    if (/rate|quota|429|RATE_LIMIT_EXCEEDED/i.test(raw)) {
      const cooldownMs = 30_000
      _cooldownUntil = Date.now() + cooldownMs
      // Additionally disable remote calls for a longer window to avoid repeated console 429s
      setBlockedFor(60 * 60 * 1000) // 1 hour
      // Provide an immediate offline reply instead of surfacing technical errors
      return answerLocally(messages)
    }
    const suggestions = `Troubleshooting:\n1. Confirm the Generative Language API is enabled for your Google Cloud project.\n2. Verify the key in .env.local matches the project with access.\n3. Try setting VITE_GEMINI_MODEL=gemini-pro or gemini-1.0-pro.\n4. Regenerate an API key if issues persist.`
    return { reply: `Error contacting model: ${raw}\n\n${suggestions}` }
  }
}
