import { useMemo } from 'react'
import FilterBar from '../components/FilterBar'
import { products as staticProducts } from '../data/product'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { getRandomPrice, PRICE_RANGE } from '../utils/pricing'

export default function Shop() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase()
  const sport = params.get('sport') ?? ''
  // Team filter removed
  const priceParam = Number(params.get('price'))
  const price = priceParam ? Math.min(Math.max(priceParam, PRICE_RANGE.MIN), PRICE_RANGE.MAX) : Infinity

  const { products, loading, error } = useProducts()
  const source = products ?? staticProducts // fallback to static if remote not loaded

  // Apply consistent randomized pricing using the centralized utility
  const pricedSource = useMemo(() => {
    return source.map((p) => ({ ...p, price: getRandomPrice(p.id) }))
  }, [source])

  const filtered = useMemo(() => {
    return pricedSource.filter((p) => {
      const productSport = (p as any).sport || 'Football'
      const matchesQ = q
        ? [p.name, p.team, productSport].some((f) => f.toLowerCase().includes(q))
        : true
      const matchesSport = sport ? productSport === sport : true
      const matchesPrice = isFinite(price) ? p.price <= price : true
      return matchesQ && matchesSport && matchesPrice
    })
  }, [q, sport, price, pricedSource])

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Shop Jerseys</h1>
          <p className="text-slate-600 dark:text-slate-400">Find your team’s colors with pro-grade quality.</p>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">{filtered.length} results</div>
      </div>

      <div className="mt-6">
        <FilterBar />
      </div>

      {error && <div className="mt-4 text-sm text-red-600">Failed to load live products: {error}</div>}
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading && !products && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}