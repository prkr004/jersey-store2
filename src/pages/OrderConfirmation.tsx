import { useLocation, Link } from 'react-router-dom'
import { currency } from '../utils/format'

interface LocationState {
  status: 'success' | 'failed'
  order?: {
    id: string
    items: { name: string; qty: number; price: number; size: string }[]
    total: number
    eta: string
  }
  reason?: string
}

export default function OrderConfirmation() {
  const location = useLocation()
  const state = (location.state || {}) as LocationState
  const status = state.status || 'success'
  const order = state.order

  return (
    <div className="container mx-auto px-4 py-14">
      {status === 'success' ? (
        <div className="max-w-3xl mx-auto space-y-8">
          <header className="text-center space-y-3">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 className="font-display text-3xl">Payment Successful</h1>
            <p className="text-slate-600 dark:text-slate-400">Your order has been placed and is now being processed.</p>
          </header>
          {order && (
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Order ID</div>
                  <div className="font-mono text-sm font-semibold">{order.id}</div>
                </div>
                <div className="sm:ml-auto">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Total</div>
                  <div className="font-semibold">{currency(order.total)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Est. Delivery</div>
                  <div className="font-semibold">{order.eta}</div>
                </div>
              </div>
              <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {order.items.map((it,i) => (
                  <div key={i} className="p-4 flex items-center text-sm">
                    <div className="font-medium flex-1">{it.name}</div>
                    <div className="text-xs text-slate-500 w-14">Size {it.size}</div>
                    <div className="w-10 text-center">×{it.qty}</div>
                    <div className="font-medium w-24 text-right">{currency(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-2xl bg-gradient-to-r from-brand-500/10 to-brand-600/10 p-6 border border-brand-500/20 text-sm">
            <p>Shipment: We will dispatch your jerseys within 2–4 working days. A tracking link will be emailed once the package is picked up. If you created an account you can also track it in the Accounts section.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop" className="px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500">Continue Shopping</Link>
            <Link to="/account" className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Account</Link>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          </div>
          <h1 className="font-display text-3xl">Payment Failed</h1>
          <p className="text-slate-600 dark:text-slate-400">We couldn't process your payment. {state.reason || 'Please try a different method.'}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/cart" className="px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-500">Return to Cart</Link>
            <Link to="/contact" className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Contact Support</Link>
          </div>
        </div>
      )}
    </div>
  )
}