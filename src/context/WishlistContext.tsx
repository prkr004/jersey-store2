import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../data/product'
import { getSportCover } from '../data/product'

export type WishSnapshot = Pick<Product, 'id' | 'name' | 'price' | 'images' | 'team' | 'sport' | 'sizes' | 'description'>

type WishlistContextType = {
  items: WishSnapshot[]
  add: (snap: WishSnapshot) => void
  remove: (id: string) => void
  toggle: (snap: WishSnapshot) => void
  contains: (id: string) => boolean
  clear: () => void
  count: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)
const STORAGE_KEY = 'jerseyx_wishlist'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishSnapshot[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items])

  const contains = (id: string) => items.some(i => i.id === id)

  const add = (snap: WishSnapshot) => {
    setItems(prev => {
      if (prev.some(i => i.id === snap.id)) return prev
      const cover = getSportCover((snap as any).sport || 'Football')
      const images = snap.images && snap.images.length ? snap.images : [cover, cover]
      return [...prev, { ...snap, images }]
    })
  }

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const toggle = (snap: WishSnapshot) => {
    setItems(prev => prev.some(i => i.id === snap.id) ? prev.filter(i => i.id !== snap.id) : [...prev, {
      ...snap,
      images: (snap.images && snap.images.length ? snap.images : [getSportCover((snap as any).sport || 'Football'), getSportCover((snap as any).sport || 'Football')])
    }])
  }

  const clear = () => setItems([])
  const count = useMemo(() => items.length, [items])

  const value: WishlistContextType = { items, add, remove, toggle, contains, clear, count }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
