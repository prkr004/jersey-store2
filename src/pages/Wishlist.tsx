import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import MotionButton from '../components/MotionButton'
import { currency } from '../utils/format'

export default function Wishlist() {
  const { items, remove, clear } = useWishlist()
  const has = items.length > 0
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Your Wishlist</h1>
        {has && <MotionButton variant="outline" onClick={clear}>Clear All</MotionButton>}
      </div>

      {!has ? (
        <div className="mt-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 text-center">
          <p>Your wishlist is empty.</p>
          <Link to="/shop"><MotionButton className="mt-4">Browse Jerseys</MotionButton></Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <Link to={`/product/${p.id}`} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src = p.images?.[1] ?? 'https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?auto=format&fit=crop&w=1200&q=60'
                    }}
                  />
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Link to={`/product/${p.id}`} className="font-medium hover:text-brand-600">{p.name}</Link>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{p.team}</div>
                  </div>
                  <div className="font-semibold text-brand-600">{currency(p.price)}</div>
                </div>
                <div className="mt-3 flex justify-end">
                  <MotionButton variant="outline" onClick={() => remove(p.id)}>Remove</MotionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
