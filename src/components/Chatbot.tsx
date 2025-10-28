import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../services/chat'
import type { ChatMessage as Message } from '../services/chat'
import { mdToHtml } from '../utils/formatMarkdown'
// Chatbot uses /api/chat proxy -> Gemini. Set GEMINI_API_KEY in deployment environment (see api/README_CHAT.md).

// Use shared ChatMessage type from chat service

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldownMs, setCooldownMs] = useState(0)
  const [tick, setTick] = useState(0)
  const [offline, setOffline] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  async function handleSend() {
    if (!input.trim() || loading || cooldownMs > 0) return
    const next: Message[] = [...messages, { role: 'user', content: input.trim() }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const resp: any = await sendChat(next.slice(-8)) // keep last 8 turns
      if (resp?.rateLimited && typeof resp?.retryInMs === 'number') {
        setCooldownMs(resp.retryInMs)
        // Do not append a chat message on rate limit; banner below will inform the user.
        return
      }
      if (resp?.local) setOffline(true)
      if (resp?.reply) {
        setMessages([...next, { role: 'assistant', content: resp.reply } as Message])
      }
    } catch (e: any) {
      setMessages([...next, { role: 'assistant', content: 'Error: ' + e.message } as Message])
    } finally {
      setLoading(false)
    }
  }

  // Cooldown countdown
  useEffect(() => {
    if (cooldownMs <= 0) return
    const startedAt = Date.now()
    const t = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, cooldownMs - elapsed)
      setTick(remaining)
      if (remaining === 0) {
        setCooldownMs(0)
        clearInterval(t)
      }
    }, 250)
    return () => clearInterval(t)
  }, [cooldownMs])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="bg-indigo-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-indigo-500 transition" aria-label="Open chat">Chat</button>
      )}
      {open && (
        <div className="w-80 h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col shadow-2xl">
          <div className="p-2 flex justify-between items-center border-b dark:border-slate-700">
            <span className="font-semibold text-sm">Assistant</span>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" aria-label="Close chat">✕</button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m,i) => {
              const isUser = m.role === 'user'
              return (
                <div key={i} className={isUser ? 'text-right' : ''}>
                  {isUser ? (
                    <div className="inline-block px-3 py-2 rounded-lg max-w-[85%] bg-indigo-600 text-white whitespace-pre-wrap text-left">{m.content}</div>
                  ) : (
                    <div className="group relative inline-block rounded-lg max-w-[85%] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-3 py-2 text-left">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none markdown-body"
                        dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }}
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(m.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded px-1 py-0.5"
                        aria-label="Copy response"
                      >Copy</button>
                    </div>
                  )}
                </div>
              )
            })}
            {loading && <div className="text-xs text-slate-400">Thinking...</div>}
            {!messages.length && !loading && <div className="text-xs text-slate-400">Ask me about products, sizes, or general info.</div>}
          </div>
          <div className="p-2 border-t dark:border-slate-700">
            {offline && (
              <div className="mb-2 rounded-md border border-sky-300 bg-sky-50 text-sky-800 text-xs px-2 py-1">
                Assistant is in offline mode for now due to API limits. I’ll still answer basics like shipping, returns, sizing, and payments.
              </div>
            )}
            {cooldownMs > 0 && (
              <div className="mb-2 rounded-md border border-amber-300 bg-amber-50 text-amber-800 text-xs px-2 py-1">
                Chat is cooling down due to rate limits. Please wait {Math.ceil(tick / 1000)}s.
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, sizing, deals..."
                className="flex-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" disabled={loading || cooldownMs > 0} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1 rounded-md text-sm">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
