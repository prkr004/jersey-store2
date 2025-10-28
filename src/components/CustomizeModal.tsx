import { useEffect, useMemo, useState } from 'react'
import MotionButton from './MotionButton'

export type CustomizeSpec = {
  name: string
  number: string
  font: 'classic' | 'block'
  color: string
}

export default function CustomizeModal({
  onClose,
  onSave,
  colors,
  initial
}: {
  onClose: () => void
  onSave: (spec: CustomizeSpec) => void
  colors: string[]
  initial?: Partial<CustomizeSpec>
}) {
  const [name, setName] = useState(initial?.name || '')
  const [number, setNumber] = useState(initial?.number || '')
  const [font, setFont] = useState<CustomizeSpec['font']>(initial?.font || 'block')
  const [color, setColor] = useState(initial?.color || '#ffffff')
  const [submitted, setSubmitted] = useState(false)

  // Normalize
  const safeName = name.toUpperCase().slice(0, 12)
  const safeNumber = number.replace(/[^0-9]/g, '').slice(0, 2)

  const validName = safeName.length >= 1
  const validNumber = safeNumber.length >= 1

  const primary = colors?.[0] || '#0ea5e9'
  const secondary = colors?.[1] || '#111827'

  const preview = useMemo(() => {
    return jerseySVG(primary, secondary, { name: safeName, number: safeNumber, color, font })
  }, [primary, secondary, safeName, safeNumber, color, font])

  function save() {
    setSubmitted(true)
    if (!validName || !validNumber) return
    onSave({ name: safeName, number: safeNumber, color, font })
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-2xl">
        <header className="p-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Customize Jersey</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm">Close</button>
        </header>
        <div className="p-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              <img src={preview} alt="Jersey preview" className="w-full h-full object-contain"/>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <Swatch value="#ffffff" current={color} onPick={setColor} label="White"/>
              <Swatch value="#000000" current={color} onPick={setColor} label="Black"/>
              <Swatch value={secondary} current={color} onPick={setColor} label="Accent"/>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Name on Jersey</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., RAHUL" className={`w-full rounded-lg border bg-white dark:bg-slate-800/70 px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${submitted && !validName ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700 focus:ring-brand-500/40'}`} />
              {submitted && !validName && <p className="mt-1 text-[11px] text-red-600">Enter 1–12 letters.</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Number</label>
              <input value={safeNumber} onChange={e=>setNumber(e.target.value)} inputMode="numeric" placeholder="e.g., 10" className={`w-full rounded-lg border bg-white dark:bg-slate-800/70 px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${submitted && !validNumber ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700 focus:ring-brand-500/40'}`} />
              {submitted && !validNumber && <p className="mt-1 text-[11px] text-red-600">Enter 1–2 digits.</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Font Style</label>
              <div className="flex gap-2">
                {(['block','classic'] as const).map(f => (
                  <button key={f} onClick={()=>setFont(f)} className={`px-3 py-1 rounded-full text-xs border ${font===f ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{f.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <MotionButton variant="outline" onClick={onClose}>Cancel</MotionButton>
              <MotionButton onClick={save}>Save Customization</MotionButton>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">Your customization will be saved with this item and shown during checkout and in orders.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Swatch({ value, current, onPick, label }: { value: string; current: string; onPick: (v:string)=>void; label: string }) {
  const selected = value.toLowerCase() === current.toLowerCase()
  return (
    <button onClick={()=>onPick(value)} className={`flex items-center gap-2 px-2 py-1 rounded-lg border text-xs ${selected ? 'border-brand-500' : 'border-slate-300 dark:border-slate-700'}`}>
      <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" style={{ background: value }}></span>
      {label}
    </button>
  )
}

function jerseySVG(primary: string, secondary: string, opts: { name: string; number: string; color: string; font: 'classic'|'block' }) {
  const fontFamily = opts.font === 'block' ? "'Impact', system-ui, sans-serif" : "'Segoe UI', system-ui, sans-serif"
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 360'>
    <defs>
      <linearGradient id='g1' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stop-color='${primary}'/>
        <stop offset='100%' stop-color='${primary}CC'/>
      </linearGradient>
      <clipPath id='shirt'>
        <path d='M60 70 L110 40 L150 80 L190 40 L240 70 L220 120 L220 290 Q220 320 190 320 L110 320 Q80 320 80 290 L80 120 Z' />
      </clipPath>
    </defs>

    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <g clip-path='url(#shirt)'>
      <rect x='40' y='30' width='220' height='300' fill='url(#g1)'/>
      <rect x='40' y='130' width='220' height='8' fill='${secondary}' opacity='0.9'/>
      <rect x='40' y='220' width='220' height='8' fill='${secondary}' opacity='0.9'/>
      <text x='150' y='120' text-anchor='middle' font-family=${JSON.stringify(fontFamily)} font-size='20' font-weight='700' fill='${opts.color}' letter-spacing='2'>${opts.name}</text>
      <text x='150' y='205' text-anchor='middle' font-family=${JSON.stringify(fontFamily)} font-size='88' font-weight='800' fill='${opts.color}' opacity='0.9'>${opts.number}</text>
    </g>
    <path d='M60 70 L110 40 L150 80 L190 40 L240 70 L220 120 L220 290 Q220 320 190 320 L110 320 Q80 320 80 290 L80 120 Z' fill='none' stroke='#111827' stroke-width='4' opacity='0.7'/>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
