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
  price
}: {
  id: string
  size: string
  qty: number
  img: string
  name: string
  price: number
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
            <div className="mt-1 font-semibold">{currency(price)}</div>
          </div>
          <button onClick={() => remove(id, size)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>
        <div className="mt-2">
          <select
            value={qty}
            onChange={(e) => update(id, size, Number(e.target.value))}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}