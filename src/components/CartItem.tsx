import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { currency } from '../utils/format'

export default function CartItem({
  id,
  size,
  qty,
  img,
  name,
  price,
  custom
}: {
  id: string
  size: string
  qty: number
  img: string
  name: string
  price: number
  custom?: { name: string; number: string; font?: string; color?: string }
}) {
  const { update, remove } = useCart()
  return (
    <div className="flex gap-4">
      <Link to={`/product/${id}`} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = 'https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?auto=format&fit=crop&w=600&q=60'
          }}
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/product/${id}`} className="font-medium hover:text-brand-600">{name}</Link>
            <div className="text-sm text-slate-500 dark:text-slate-400">Size: {size}</div>
            {custom && (
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Custom: <span className="font-medium uppercase tracking-wide">{custom.name}</span> #{custom.number}
              </div>
            )}
            <div className="mt-1 font-semibold">{currency(price)}</div>
          </div>
          <button onClick={() => remove(id, size)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>
        <div className="mt-2">
          <QuantityStepper value={qty} onChange={(n) => update(id, size, n)} />
        </div>
      </div>
    </div>
  )
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const min = 1
  const max = 10
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden">
      <button onClick={dec} className="px-3 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Decrease quantity">−</button>
      <input
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^\d]/g, ''))
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
        }}
        className="w-10 text-center bg-transparent text-sm py-1 focus:outline-none"
        inputMode="numeric"
        aria-label="Quantity"
      />
      <button onClick={inc} className="px-3 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Increase quantity">+</button>
    </div>
  )
}