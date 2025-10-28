import { useNavigate, useParams } from 'react-router-dom'
import { productsById, getSportCover } from '../data/product'
import { useEffect, useMemo, useState } from 'react'
import { currency } from '../utils/format'
import MotionButton from '../components/MotionButton'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { motion } from 'framer-motion'
import { useProductBySlug } from '../hooks/useProducts'
import { getRandomPrice } from '../utils/pricing'
import { useWishlist } from '../context/WishlistContext'
import CustomizeModal, { CustomizeSpec } from '../components/CustomizeModal'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>() // currently using id path param
  // Try local first (legacy) then attempt supabase by treating id as slug.
  const localProduct = id ? productsById[id] : null
  const { product: remoteProduct, loading } = useProductBySlug(id)
  const baseProduct = remoteProduct || localProduct
  
  // Apply consistent randomized pricing
  const product = useMemo(() => {
    if (!baseProduct) return null
    return { ...baseProduct, price: getRandomPrice(baseProduct.id) }
  }, [baseProduct])
  const [size, setSize] = useState(product?.sizes[0] ?? '')
  const [imgIndex, setImgIndex] = useState(0)
  const { add, replaceWithSingle } = useCart()
  const { user } = useAuth()
  const { requireAuth } = useAuthModal()
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()
  const { toggle: toggleWishlist, contains } = useWishlist()
  const [custom, setCustom] = useState<CustomizeSpec | null>(null)
  const [customOpen, setCustomOpen] = useState(false)

  useEffect(() => {
    if (product) setSize(product.sizes[0] ?? '')
  }, [product])

  // Ensure we always have at least one image using sport cover fallback
  const displayImages = useMemo(() => {
    if (!product) return []
    const cover = getSportCover((product as any).sport || 'Football')
    const imgs = product.images && product.images.length ? product.images : [cover, cover]
    return imgs
  }, [product])

  const related = useMemo(
    () => (product ? Object.values(productsById).filter((p) => p.sport === product.sport && p.id !== product.id).slice(0, 4) : []),
    [product]
  )

  if (loading && !product) return <div className="container mx-auto px-4 py-16">Loading...</div>
  if (!product) return <div className="container mx-auto px-4 py-16">Product not found.</div>

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
            <motion.img
              key={imgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={displayImages[imgIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                // Try next image index or fallback stable URL
                const next = (imgIndex + 1) % Math.max(displayImages.length, 1)
                currentTarget.src = displayImages[next] ?? 'https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?auto=format&fit=crop&w=1200&q=60'
              }}
            />
          </div>
          <div className="mt-3 flex gap-3">
            {displayImages.map((src, i) => (
              <button key={i} onClick={() => setImgIndex(i)} className={`w-20 h-20 rounded-xl overflow-hidden border ${i === imgIndex ? 'border-brand-500' : 'border-slate-200/60 dark:border-slate-800'}`}>
                <img
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = displayImages[(i + 1) % Math.max(displayImages.length, 1)] ?? 'https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?auto=format&fit=crop&w=1200&q=60'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="font-display text-4xl">{product.name}</h1>
          <div className="mt-2 text-slate-600 dark:text-slate-400">{product.team} • {(product as any).sport || 'Sport'}</div>
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
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <MotionButton variant="outline" onClick={() => setCustomOpen(true)}>Customize</MotionButton>
              {custom && (
                <span className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700 uppercase tracking-wide">
                  {custom.name} #{custom.number} • {custom.font}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <MotionButton
              onClick={() => {
                add(product.id, size || product.sizes[0], 1, {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: displayImages,
                  team: product.team,
                  sport: (product as any).sport || 'Sport',
                  sizes: product.sizes,
                  description: product.description
                }, custom || undefined)
                setAdded(true)
                setTimeout(() => setAdded(false), 3000)
              }}
              className="px-6 py-3"
            >{added ? 'Added ✓' : 'Add to Cart'}</MotionButton>
            <MotionButton
              variant="primary"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500"
              onClick={async () => {
                if (!user) {
                  const ok = await requireAuth('buy-now')
                  if (!ok) return
                }

                replaceWithSingle(product.id, size || product.sizes[0], 1, {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: displayImages,
                  team: product.team,
                  sport: (product as any).sport || 'Sport',
                  sizes: product.sizes,
                  description: product.description
                }, custom || undefined)
                // Navigate to cart and trigger checkout wizard via state flag
                navigate('/cart', { state: { checkout: true } })
              }}
            >Buy Now</MotionButton>
            <MotionButton
              variant="outline"
              className="px-6 py-3"
              onClick={() => {
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: displayImages,
                  team: product.team,
                  sport: (product as any).sport || 'Football',
                  sizes: product.sizes,
                  description: product.description,
                })
              }}
            >{contains(product.id) ? 'Wishlisted ✓' : 'Wishlist'}</MotionButton>
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
      {customOpen && (
        <CustomizeModal
          onClose={() => setCustomOpen(false)}
          onSave={(spec) => { setCustom(spec); setCustomOpen(false) }}
          colors={product.colors}
          initial={custom || undefined}
        />
      )}
    </div>
  )
}

function RelatedCard({ id, name, images, sport }: { id: string; name: string; images: string[]; sport: any }) {
  return (
    <a href={`/product/${id}`} className="group block rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={images?.[0] || getSportCover(sport)}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = images?.[1] ?? getSportCover(sport)
          }}
        />
      </div>
      <div className="p-4 font-medium">{name}</div>
    </a>
  )
}