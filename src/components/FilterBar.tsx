import { useMemo } from 'react'
import { sports as allSports, teams as allTeams, priceMin, priceMax } from '../data/product'
import MotionButton from './MotionButton'
import { useSearchParams } from 'react-router-dom'

export default function FilterBar() {
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const sport = params.get('sport') ?? ''
  const team = params.get('team') ?? ''
  const price = Number(params.get('price') ?? priceMax)

  const update = (key: string, val: string) => {
    const p = new URLSearchParams(params)
    if (!val) p.delete(key)
    else p.set(key, val)
    setParams(p, { replace: true })
  }

  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: true })
  }

  const teams = useMemo(() => allTeams, [])

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center gap-3">
      <input
        value={q}
        onChange={(e) => update('q', e.target.value)}
        placeholder="Search"
        className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />

      <select
        value={sport}
        onChange={(e) => update('sport', e.target.value)}
        className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        <option value="">All Sports</option>
        {allSports.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={team}
        onChange={(e) => update('team', e.target.value)}
        className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        <option value="">All Teams</option>
        {teams.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-600 dark:text-slate-400">Max Price:</label>
        <input
          type="range"
          min={priceMin}
          max={priceMax}
          value={price}
          onChange={(e) => update('price', e.target.value)}
        />
        <span className="text-sm">${price}</span>
      </div>

      <MotionButton variant="outline" onClick={clearAll}>Clear</MotionButton>
    </div>
  )
}