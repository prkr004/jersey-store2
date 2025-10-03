import { marked } from 'marked'

// Configure marked for safe basic output.
marked.use({
  breaks: true,
  gfm: true,
})

export function mdToHtml(md: string): string {
  try {
    return marked.parse(md) as string
  } catch (e) {
    return md // fallback plain text
  }
}
