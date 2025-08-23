import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../data/product'
import { productsById } from '../data/product'

export type CartItem = {
  id: string // product id
  size: string
  qty: number
}

type CartContextType = {
  items: CartItem[]
  add: (id: string, size: string, qty?: number) => void
  remove: (id: string, size: string) => void
  update: (id: string, size: string, qty: number) => void
  clear: () => void
  count: number
  total: number
  detailed: Array<CartItem & { product: Product }>
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

  const add: CartContextType['add'] = (id, size, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === id && p.size === size)
      if (i > -1) {
        const copy = [...prev]
        copy[i] = { ...copy[i], qty: copy[i].qty + qty }
        return copy
      }
      return [...prev, { id, size, qty }]
    })
  }

  const remove: CartContextType['remove'] = (id, size) =>
    setItems((prev) => prev.filter((p) => !(p.id === id && p.size === size)))

  const update: CartContextType['update'] = (id, size, qty) =>
    setItems((prev) => prev.map((p) => (p.id === id && p.size === size ? { ...p, qty } : p)))

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items])

  const detailed = useMemo(
    () =>
      items
        .map((it) => {
          const product = productsById[it.id]
          if (!product) return null
          return { ...it, product }
        })
        .filter(Boolean) as Array<CartItem & { product: Product }>,
    [items]
  )

  const total = useMemo(
    () => detailed.reduce((a, b) => a + b.product.price * b.qty, 0),
    [detailed]
  )

  const value: CartContextType = {
    items,
    add,
    remove,
    update,
    clear,
    count,
    total,
    detailed
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}