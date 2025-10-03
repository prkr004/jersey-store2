import { useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import MotionButton from './MotionButton'
import { currency } from '../utils/format'

/**
 * Lightweight UPI payment component (client-side demo).
 * Generates a UPI deep link and corresponding QR.
 * NOTE: For production you'd typically verify payment server-side via PSP webhook / polling.
 */
export interface UPIConfig {
  payeeVPA: string // e.g. merchant@upi
  payeeName: string // e.g. JerseyX Store
  merchantCode?: string // optional mc param
  note?: string
  currency?: 'INR'
}

interface Props {
  amount: number // in major units (e.g. 2499.50 => 2499.5)
  config: UPIConfig
  onPaymentInitiated?: (upiUrl: string) => void
  onSimulateSuccess?: () => void
}

export default function UPIPayment({ amount, config, onPaymentInitiated, onSimulateSuccess }: Props) {
  const [status, setStatus] = useState<'idle'|'initiated'|'confirmed'|'failed'>('idle')
  const [showRaw, setShowRaw] = useState(false)
  const [checking, setChecking] = useState(false)

  const amtStr = useMemo(() => amount.toFixed(2), [amount])

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams()
    params.set('pa', config.payeeVPA)
    params.set('pn', config.payeeName)
    params.set('am', amtStr)
    params.set('cu', config.currency || 'INR')
    if (config.note) params.set('tn', config.note)
    if (config.merchantCode) params.set('mc', config.merchantCode)
    // You can add transaction reference (tr) + order id if you have one
    return `upi://pay?${params.toString()}`
  }, [config, amtStr])

  function handleClick() {
    onPaymentInitiated?.(upiUrl)
    setStatus('initiated')
    // Attempt deep link open (mobile browsers)
    window.location.href = upiUrl
  }

  // Simulated polling (placeholder). In a real integration you'd have backend verifying.
  useEffect(() => {
    let timer: any
    if (status === 'initiated' && checking) {
      timer = setTimeout(() => {
        // Still no real verification: just reset checking
        setChecking(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [status, checking])

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700 p-5 space-y-4 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Unified Payments (UPI)</h3>
        <button onClick={() => setShowRaw(s => !s)} className="text-xs text-indigo-600 dark:text-indigo-400 underline">{showRaw ? 'Hide URI' : 'Show URI'}</button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Scan the QR with any UPI app (PhonePe, GPay, Paytm, BHIM) or tap the button on mobile to open your payment app. After paying, click <em>Mark as Paid</em> to simulate confirmation.</p>

      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200/60 dark:border-slate-700">
          <QRCode value={upiUrl} size={160} fgColor="#0f172a" />
        </div>
        <div className="text-center text-sm font-medium">
          <div>{config.payeeName}</div>
          <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">{config.payeeVPA}</div>
          <div className="mt-1 text-slate-700 dark:text-slate-300">Amount: {currency(amount)}</div>
        </div>
      </div>

      {showRaw && (
        <div className="rounded-lg bg-slate-100 dark:bg-slate-800 text-xs p-2 font-mono break-all select-all">{upiUrl}</div>
      )}

      <div className="flex flex-wrap gap-3">
        <MotionButton onClick={handleClick} variant="primary" className="flex-1 min-w-[140px]">Open UPI App</MotionButton>
        <MotionButton variant="outline" className="flex-1 min-w-[140px]" onClick={() => { setStatus('confirmed'); onSimulateSuccess?.() }}>Mark as Paid</MotionButton>
      </div>

      <StatusBar status={status} checking={checking} onCheck={() => setChecking(true)} />
      <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-snug">Demo only: This does not automatically verify payment. For production integrate a backend with order + PSP callback.</p>
    </div>
  )
}

function StatusBar({ status, checking, onCheck }: { status: string; checking: boolean; onCheck: () => void }) {
  if (status === 'idle') return null
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 p-3 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">Status:</span>
        <span className={{
          'initiated': 'text-amber-600',
          'confirmed': 'text-green-600',
          'failed': 'text-red-600'
        }[status] || 'text-slate-600'}>{status}</span>
      </div>
      {status === 'initiated' && (
        <div className="flex gap-2">
          <MotionButton variant="ghost" className="text-xs" onClick={onCheck} disabled={checking}>{checking ? 'Checking...' : 'Recheck'}</MotionButton>
        </div>
      )}
      {status === 'confirmed' && <div className="text-green-600">Payment marked as completed ✔</div>}
    </div>
  )
}
