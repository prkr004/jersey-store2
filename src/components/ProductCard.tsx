import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Product } from '../data/product'
import { currency } from '../utils/format'
import { Star } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="card-ring group rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLElement
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
        el.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
      }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {product.trending && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-500 text-white text-xs font-medium px-3 py-1">
              Trending
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{product.name}</h3>
            <span className="font-semibold text-brand-600">{currency(product.price)}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{product.team} • {product.sport}</p>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
            ))}
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}