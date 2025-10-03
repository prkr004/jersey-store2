import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import MotionButton from '../components/MotionButton'
import { currency } from '../utils/format'
import { useState, useEffect } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'

export default function Cart() {
  const { detailed, total, clear } = useCart()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  // Auto open checkout when arriving from Buy Now
  useEffect(() => {
    if ((location.state as any)?.checkout && detailed.length) {
      setOpen(true)
      // Clear the state so back nav doesn't reopen
      window.history.replaceState({}, document.title)
    }
  }, [location.state, detailed.length])
  const hasItems = detailed.length > 0

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Your Cart</h1>

      {!hasItems ? (
        <div className="mt-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 text-center">
          <p>Your cart is empty.</p>
          <Link to="/shop"><MotionButton className="mt-4">Start Shopping</MotionButton></Link>
        </div>
      ) : (
        <div className="mt-6 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {detailed.map((it) => (
              <div key={`${it.id}-${it.size}`} className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4">
                <CartItem
                  id={it.id}
                  size={it.size}
                  qty={it.qty}
                  img={it.product.images[0]}
                  name={it.product.name}
                  price={it.product.price}
                />
              </div>
            ))}
            <div className="flex justify-end">
              <MotionButton variant="outline" onClick={clear}>Clear Cart</MotionButton>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 h-fit">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{currency(total)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-3 border-t border-slate-200/60 dark:border-slate-800 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
            <MotionButton className="w-full mt-4" onClick={() => setOpen(true)}>Checkout</MotionButton>
          </div>
        </div>
      )}
      {open && (
        <CheckoutWizard
          total={total}
          items={detailed}
          onClose={() => setOpen(false)}
          onComplete={() => { setOpen(false); clear(); }}
        />
      )}
    </div>
  )
}