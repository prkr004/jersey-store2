// Centralized pricing utility for consistent random prices across the app
// Generates session-stable prices between 1000-3000 based on product ID

const MIN_PRICE = 1000
const MAX_PRICE = 3000

// Session seed for consistent randomization within the session
let sessionSeed: string | null = null

const getSessionSeed = () => {
  if (!sessionSeed) {
    sessionSeed = Math.floor(Math.random() * 1_000_000_000).toString(36)
  }
  return sessionSeed
}

// Simple FNV-1a 32-bit hash variant for deterministic pseudo-randomness
const hash = (s: string) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h >>> 0
}

// Generate a random price for a product ID between MIN_PRICE and MAX_PRICE
export const getRandomPrice = (productId: string): number => {
  const seed = getSessionSeed()
  const h = hash(productId + ':' + seed)
  const frac = h / 0xffffffff // 0..1
  return Math.round(MIN_PRICE + frac * (MAX_PRICE - MIN_PRICE))
}

// Price range constants for filters
export const PRICE_RANGE = {
  MIN: MIN_PRICE,
  MAX: MAX_PRICE
}