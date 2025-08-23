import { useMemo } from 'react'
import FilterBar from '../components/FilterBar'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'

export default function Shop() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase()
  const sport = params.get('sport') ?? ''
  const team = params.get('team') ?? ''
  const price = Number(params.get('price')) || Infinity

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQ = q
        ? [p.name, p.team, p.sport].some((f) => f.toLowerCase().includes(q))
        : true
      const matchesSport = sport ? p.sport === sport : true
      const matchesTeam = team ? p.team === team : true
      const matchesPrice = isFinite(price) ? p.price <= price : true
      return matchesQ && matchesSport && matchesTeam && matchesPrice
    })
  }, [q, sport, team, price])

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

      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}