import { sports as allSports } from '../data/product'
import { currency } from '../utils/format'
import MotionButton from './MotionButton'
import { useSearchParams } from 'react-router-dom'

export default function FilterBar() {
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const sport = params.get('sport') ?? ''
  // Removed team filter
  // Force INR price band between 1000 and 3000 irrespective of original static dataset pricing extremes.
  const RANGE_MIN = 1000
  const RANGE_MAX = 3000
  const price = Number(params.get('price') ?? RANGE_MAX)

  const update = (key: string, val: string) => {
    const p = new URLSearchParams(params)
    if (!val) p.delete(key)
    else p.set(key, val)
    setParams(p, { replace: true })
  }

  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: true })
  }

  // no teams list

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-wrap items-center gap-3">
      <input
        value={q}
        onChange={(e) => update('q', e.target.value)}
        placeholder="Search"
        className="flex-1 min-w-[200px] rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />

      {/* Sport selector: pill buttons with icons */}
      <div className="w-full sm:w-auto">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1" role="group" aria-label="Filter by sport">
          <SportPill
            label="All"
            active={!sport}
            onClick={() => update('sport', '')}
          >
            <AllIcon />
          </SportPill>
          {allSports.map((s) => (
            <SportPill key={s} label={s} active={sport === s} onClick={() => update('sport', s)}>
              <SportIcon sport={s} />
            </SportPill>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm text-slate-600 dark:text-slate-400">Max Price:</label>
        <input
          aria-label="Max price"
          type="range"
          min={RANGE_MIN}
          max={RANGE_MAX}
          step={100}
          value={price}
          onChange={(e) => update('price', e.target.value)}
        />
        <span className="text-sm font-medium">{currency(price)}</span>
      </div>

      <MotionButton variant="outline" onClick={clearAll}>Clear</MotionButton>
    </div>
  )
}

function SportPill({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      title={label}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors ${
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700'
      }`}
    >
      <span className="shrink-0">{children}</span>
      <span>{label}</span>
    </button>
  )
}

function SportIcon({ sport }: { sport: string }) {
  switch (sport) {
    case 'Football':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 7 5 5-5 5"/><path d="m21 7-5 5 5 5"/><path d="M14 7h-4"/><path d="M14 17h-4"/></svg>
      )
    case 'Basketball':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>
      )
    case 'Cricket':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6"/><path d="m10 7 7 7 3-3-7-7z"/><path d="M3 21h6"/></svg>
      )
    case 'Baseball':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19 5c-1.5 2-4 5-7 5s-5.5-3-7-5"/><path d="M5 19c1.5-2 4-5 7-5s5.5 3 7 5"/></svg>
      )
    case 'Hockey':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h6a6 6 0 0 0 6-6V3"/><path d="M22 21h-6a6 6 0 0 1-6-6"/></svg>
      )
    default:
      return <AllIcon />
  }
}

function AllIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>
  )
}