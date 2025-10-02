import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../services/chat'
// Chatbot uses /api/chat proxy -> Gemini. Set GEMINI_API_KEY in deployment environment (see api/README_CHAT.md).

interface Message { role: 'user' | 'assistant'; content: string }

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  async function handleSend() {
    if (!input.trim() || loading) return
    const next = [...messages, { role: 'user', content: input.trim() }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const resp = await sendChat(next.slice(-8)) // keep last 8 turns
      setMessages([...next, { role: 'assistant', content: resp.reply }])
    } catch (e: any) {
      setMessages([...next, { role: 'assistant', content: 'Error: ' + e.message }])
    } finally {
      setLoading(false)
    }
  }

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
            {messages.map((m,i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}>{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400">Thinking...</div>}
            {!messages.length && !loading && <div className="text-xs text-slate-400">Ask me about products, sizes, or general info.</div>}
          </div>
          <div className="p-2 border-t dark:border-slate-700">
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1 rounded-md text-sm">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
