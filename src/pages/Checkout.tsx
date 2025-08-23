import MotionButton from '../components/MotionButton'
import { useCart } from '../context/CartContext'
import { currency } from '../utils/format'

export default function Checkout() {
  const { total, detailed, clear } = useCart()

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Checkout</h1>
      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
            <h2 className="font-semibold mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="First name" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Last name" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Email" type="email" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 sm:col-span-2" />
              <input placeholder="Address" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 sm:col-span-2" />
              <input placeholder="City" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Postal Code" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
            <h2 className="font-semibold mb-4">Payment Details</h2>
            <div className="grid gap-4">
              <input placeholder="Cardholder name" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <input placeholder="Card number" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Expiry (MM/YY)" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
                <input placeholder="CVC" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
              </div>
            </div>
            <MotionButton className="mt-4" onClick={() => { alert('Demo checkout complete!'); clear(); }}>Pay {currency(total)}</MotionButton>
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