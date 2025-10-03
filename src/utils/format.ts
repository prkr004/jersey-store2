// Currency formatter now targeting Indian Rupees with Indian numbering system.
export const currency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

// Helper to generate a lightweight order id (not cryptographically secure)
export function genOrderId() {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `ORD-${ts}-${rand}`.toUpperCase()
}