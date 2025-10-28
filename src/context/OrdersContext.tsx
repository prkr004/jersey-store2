import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import type { CartItem, ProductSnapshot, CustomSpec } from './CartContext'

export type OrderItem = {
  id: string
  name: string
  size: string
  qty: number
  price: number
  images: string[]
  team?: string
  sport?: string
  custom?: CustomSpec
}

export type Order = {
  id: string
  createdAt: string // ISO
  status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'
  payment: { method: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'; status: 'Paid' | 'Pending'; reference?: string }
  totals: { subtotal: number; shipping: number; discount: number; total: number }
  items: OrderItem[]
  shipping: { name: string; email: string; address: string; city: string; postalCode: string }
}

type PlaceOrderInput = {
  items: Array<CartItem & { product: ProductSnapshot }>
  shipping: Order['shipping']
  paymentRef?: string
  method: Order['payment']['method']
  pricing?: { shipping?: number; discount?: number }
}

type OrdersContextType = {
  orders: Order[]
  placeOrder: (input: PlaceOrderInput) => Order
  getById: (id: string) => Order | undefined
  clearSessionOrders: () => void
}

const OrdersContext = createContext<OrdersContextType | null>(null)

function makeOrderId() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `JX-${y}${m}${d}-${rand}`
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const storageKey = useMemo(() => (user ? `jerseyx_orders_${user.email || user.id}` : 'jerseyx_orders_guest'), [user])
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = sessionStorage.getItem('jerseyx_orders_guest')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // Load user-specific orders when user changes
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey)
      setOrders(raw ? JSON.parse(raw) : [])
    } catch {
      setOrders([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // Persist on change
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(orders))
    } catch {}
  }, [orders, storageKey])

  const placeOrder: OrdersContextType['placeOrder'] = ({ items, shipping, paymentRef, pricing, method }) => {
    const subtotal = items.reduce((a, b) => a + b.product.price * b.qty, 0)
    const shippingFee = pricing?.shipping ?? 0
    const discount = pricing?.discount ?? 0
    const total = subtotal + shippingFee - discount
    const orderItems: OrderItem[] = items.map((it) => ({
      id: it.id,
      name: it.product.name,
      size: it.size,
      qty: it.qty,
      price: it.product.price,
      images: it.product.images,
      team: it.product.team,
      sport: it.product.sport,
      custom: it.custom,
    }))

    const ord: Order = {
      id: makeOrderId(),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      payment: { method, status: 'Paid', reference: paymentRef },
      totals: { subtotal, shipping: shippingFee, discount, total },
      items: orderItems,
      shipping,
    }
    setOrders((prev) => [ord, ...prev])
    return ord
  }

  const getById = (id: string) => orders.find((o) => o.id === id)
  const clearSessionOrders = () => setOrders([])

  const value: OrdersContextType = { orders, placeOrder, getById, clearSessionOrders }
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
