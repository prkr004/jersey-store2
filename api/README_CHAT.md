# Chat Function Deployment

This project includes a serverless function at `api/chat.ts` that proxies requests from the frontend chat widget to Gemini.

## 1. Environment Variable (Required)
Set the secret key in your deployment platform (DO NOT put this in `.env` with a VITE_ prefix):

```
GEMINI_API_KEY=your_real_key_here
```

Locally (optional for quick test ONLY), you can create a `.env.local` (not committed) in the project root if using Vercel CLI:

```
GEMINI_API_KEY=sk-your-test-key
```

## 2. Frontend Usage
The frontend calls `fetch('/api/chat', { method: 'POST', body: { messages } })` via `sendChat()`.

`messages` format:
```json
[
  { "role": "user", "content": "Hi" },
  { "role": "assistant", "content": "Hello!" }
]
```

## 3. Local Testing (Vercel)
Install Vercel CLI and run:
```
vercel dev
```
Then open: http://localhost:3000

Test endpoint manually:
```
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## 4. Security Notes
- Do not expose GEMINI_API_KEY to the browser. (No `VITE_` prefix.)
- The function trims history to last 10 messages to control token size.
- Add rate limiting or auth gating later if abuse is a concern.

## 5. Extending
To move to streaming responses:
- Use `model.generateContentStream()` from the `@google/generative-ai` SDK.
- Change response to chunked (Node 18 edge/runtime or custom streaming logic).

To include product context:
- Prepend a system prompt with product catalog summary.
- Or fetch product details by keyword before generating.

## 6. Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| 500 error JSON { error: 'Server misconfigured...' } | Missing GEMINI_API_KEY | Set env var in platform dashboard |
| 405 Method not allowed | Not using POST | Use POST with JSON body |
| reply empty string | Model returned blank | Log `result.response` for debugging |

## 7. Next Enhancements
- Add simple profanity filter before sending prompt.
- Persist chat turns to Supabase (table `chat_logs`).
- Provide suggested quick prompts in the UI.

---
This file is a deployment helper; safe to keep in repo.
