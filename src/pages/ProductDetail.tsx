import { useParams } from 'react-router-dom'
import { productsById } from '../data/products'
import { useMemo, useState } from 'react'
import { currency } from '../utils/format'
import MotionButton from '../components/MotionButton'
import { useCart } from '../context/CartContext'
import { motion } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = id ? productsById[id] : null
  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [imgIndex, setImgIndex] = useState(0)
  const { add } = useCart()

  const related = useMemo(
    () => (product ? Object.values(productsById).filter((p) => p.sport === product.sport && p.id !== product.id).slice(0, 4) : []),
    [product]
  )

  if (!product) return <div className="container mx-auto px-4 py-16">Product not found.</div>

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
            <motion.img key={imgIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {product.images.map((src, i) => (
              <button key={i} onClick={() => setImgIndex(i)} className={`w-20 h-20 rounded-xl overflow-hidden border ${i === imgIndex ? 'border-brand-500' : 'border-slate-200/60 dark:border-slate-800'}`}>
                <img src={src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="font-display text-4xl">{product.name}</h1>
          <div className="mt-2 text-slate-600 dark:text-slate-400">{product.team} • {product.sport}</div>
          <div className="mt-3 text-2xl font-semibold text-brand-600">{currency(product.price)}</div>

          <p className="mt-6 text-slate-700 dark:text-slate-300">{product.description}</p>

          <div className="mt-6">
            <label className="text-sm text-slate-600 dark:text-slate-400">Size</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-xl border ${size === s ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <MotionButton onClick={() => add(product.id, size || product.sizes[0], 1)} className="px-6 py-3">Add to Cart</MotionButton>
            <MotionButton variant="outline" className="px-6 py-3">Wishlist</MotionButton>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl mb-4">You Might Also Like</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <RelatedCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RelatedCard({ id, name, images }: { id: string; name: string; images: string[] }) {
  return (
    <a href={`/product/${id}`} className="group block rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={images[0]} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="p-4 font-medium">{name}</div>
    </a>
  )
}