import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../data/product'
import { productsById, getSportCover } from '../data/product'
// NOTE: Session-only auth and no backend storage currently; do not sync cart to DB.

export type ProductSnapshot = Pick<Product, 'id' | 'name' | 'price' | 'images' | 'team' | 'sport' | 'sizes' | 'description'>
export type CartItem = {
  id: string // product id (slug or legacy id)
  size: string
  qty: number
  product?: ProductSnapshot // snapshot to avoid relying solely on in-memory catalogs
}

type CartContextType = {
  items: CartItem[]
  add: (id: string, size: string, qty?: number, productSnapshot?: ProductSnapshot) => void
  remove: (id: string, size: string) => void
  update: (id: string, size: string, qty: number) => void
  clear: () => void
  count: number
  total: number
  detailed: Array<CartItem & { product: ProductSnapshot }>
  replaceWithSingle: (id: string, size: string, qty: number, productSnapshot?: ProductSnapshot) => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'jerseyx_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const add: CartContextType['add'] = (id, size, qty = 1, productSnapshot) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === id && p.size === size)
      if (i > -1) {
        const copy = [...prev]
        const existing = copy[i]
        copy[i] = { ...existing, qty: existing.qty + qty, product: existing.product || productSnapshot }
        return copy
      }
      return [...prev, { id, size, qty, product: productSnapshot }]
    })
  }

  const replaceWithSingle: CartContextType['replaceWithSingle'] = (id, size, qty, productSnapshot) => {
    setItems([{ id, size, qty, product: productSnapshot }])
  }

  const remove: CartContextType['remove'] = (id, size) =>
    setItems((prev) => prev.filter((p) => !(p.id === id && p.size === size)))

  const update: CartContextType['update'] = (id, size, qty) =>
    setItems((prev) => prev.map((p) => (p.id === id && p.size === size ? { ...p, qty } : p)))

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items])

  const [hydrating, setHydrating] = useState(false)

  // Build detailed list using snapshot OR local catalog fallback.
  const detailed = useMemo(() => {
    return items
      .map((it) => {
        const prod = it.product || productsById[it.id]
        if (!prod) return null
        // Normalize to ProductSnapshot shape if from catalog
        const snapshot: ProductSnapshot = it.product || {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          images: (prod.images && prod.images.length ? prod.images : [getSportCover((prod as any).sport), getSportCover((prod as any).sport)]),
          team: prod.team,
          sport: (prod as any).sport || 'Sport',
          sizes: prod.sizes,
          description: prod.description
        }
        return { ...it, product: snapshot }
      })
      .filter(Boolean) as Array<CartItem & { product: ProductSnapshot }>
  }, [items])

  // Removed remote hydration (no backend). If ever needed, reintroduce via a client API.

  const total = useMemo(() => detailed.reduce((a, b) => a + b.product.price * b.qty, 0), [detailed])

  const value: CartContextType = {
    items,
    add,
    remove,
    update,
    clear,
    count,
    total,
    detailed,
    replaceWithSingle
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}