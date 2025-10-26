import MotionButton from '../components/MotionButton'
import { useCart } from '../context/CartContext'
import { currency } from '../utils/format'
import UPIPayment from '../components/UPIPayment'
import { useState } from 'react'
import { useOrders } from '../context/OrdersContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { total, detailed, clear } = useCart()
  const { placeOrder } = useOrders()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [ship, setShip] = useState({
    first: '',
    last: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: ''
  })
  const canPlace = ship.first && ship.last && ship.email && ship.address && ship.city && ship.postalCode && detailed.length > 0

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Checkout</h1>
      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
            <h2 className="font-semibold mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="First name" value={ship.first} onChange={e=>setShip(s=>({ ...s, first: e.target.value }))} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Last name" value={ship.last} onChange={e=>setShip(s=>({ ...s, last: e.target.value }))} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Email" type="email" value={ship.email} onChange={e=>setShip(s=>({ ...s, email: e.target.value }))} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 sm:col-span-2" />
              <input placeholder="Address" value={ship.address} onChange={e=>setShip(s=>({ ...s, address: e.target.value }))} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 sm:col-span-2" />
              <input placeholder="City" value={ship.city} onChange={e=>setShip(s=>({ ...s, city: e.target.value }))} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Postal Code" value={ship.postalCode} onChange={e=>setShip(s=>({ ...s, postalCode: e.target.value }))} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-6">
            <h2 className="font-semibold">Payment</h2>
            <UPIPayment
              amount={total}
              config={{
                payeeVPA: 'merchant@upi',
                payeeName: 'JerseyX Store',
                note: 'Order Payment',
              }}
              onSimulateSuccess={() => {
                // Allow order placement even if some fields are missing (session demo)
                const fallbackName = `${ship.first || ''} ${ship.last || ''}`.trim() || 'Guest'
                const ord = placeOrder({
                  items: detailed,
                  shipping: {
                    name: fallbackName,
                    email: ship.email || 'guest@example.com',
                    address: ship.address || '—',
                    city: ship.city || '—',
                    postalCode: ship.postalCode || '—'
                  }
                })
                setOrderPlaced(true)
                clear()
                // Estimate delivery in 3–5 days
                const etaDate = new Date();
                etaDate.setDate(etaDate.getDate() + (Math.random() < 0.5 ? 3 : 5))
                navigate('/order/confirmation', {
                  replace: true,
                  state: {
                    status: 'success',
                    order: {
                      id: ord.id,
                      items: ord.items.map(i => ({ name: i.name, qty: i.qty, price: i.price, size: i.size })),
                      total: ord.totals.total,
                      eta: etaDate.toLocaleDateString()
                    }
                  }
                })
              }}
            />
            {!canPlace && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-300">Tip: Fill shipping details for a more complete receipt. Your order will still be recorded for this session.</div>
            )}
            {orderPlaced && (
              <div className="rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-300/50 dark:border-green-700 p-4 text-sm text-green-700 dark:text-green-300">
                <p className="font-medium">Payment Recorded</p>
                <p className="mt-1">Thank you! Your order is being processed. A confirmation email would be sent in a real deployment.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 h-fit">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {detailed.map((it) => (
              <div key={`${it.id}-${it.size}`} className="flex justify-between text-sm">
                <span>{it.product.name} × {it.qty}</span>
                <span>{currency(it.product.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-slate-200/60 dark:border-slate-800 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{currency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}