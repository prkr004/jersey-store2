// Chat service calls the serverless endpoint /api/chat (see api/chat.ts).
// PLACEHOLDER: Ensure GEMINI_API_KEY is set in deployment (never expose as VITE_ var).
// Endpoint returns { reply: string }.
// For a temporary dev-only direct Gemini call, you could add code here referencing import.meta.env.VITE_DEV_GEMINI_KEY (NOT recommended for prod) and guard it.

export interface ChatMessage { role: 'user' | 'assistant'; content: string }

export async function sendChat(messages: ChatMessage[]) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })
  if (!res.ok) {
    throw new Error('Chat endpoint failed: ' + res.status)
  }
  return res.json() as Promise<{ reply: string }>
}
