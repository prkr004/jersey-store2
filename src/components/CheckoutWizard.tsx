import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MotionButton from './MotionButton'
import { currency, genOrderId } from '../utils/format'
import UPIPayment from './UPIPayment'
import type { CartItem, ProductSnapshot } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'

interface WizardProps {
  total: number
  items: Array<CartItem & { product: ProductSnapshot }>
  onClose: () => void
  onComplete: () => void // callback invoked after success (e.g. clear cart)
}

type Step = 'intro' | 'info' | 'review' | 'payment'

export default function CheckoutWizard({ total, items, onClose, onComplete }: WizardProps) {
  const [step, setStep] = useState<Step>('intro')
  const [accepted, setAccepted] = useState(false)
  const [info, setInfo] = useState({ name: '', email: '', phone: '', address: '', city: '', postal: '' })
  const [payMode, setPayMode] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi')
  const [paid, setPaid] = useState(false)
  const navigate = useNavigate()
  const { placeOrder } = useOrders()

  function next() {
    if (step === 'intro') setStep('info')
    else if (step === 'info') setStep('review')
    else if (step === 'review') setStep('payment')
    else if (step === 'payment') {
      // handled directly in onPaid
    }
  }
  function back() {
    if (step === 'info') setStep('intro')
    else if (step === 'review') setStep('info')
    else if (step === 'payment') setStep('review')
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 sm:p-8 bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700 flex flex-col">
        <header className="p-5 border-b border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-display text-xl">Checkout</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm">Close</button>
        </header>
        <div className="px-5 pt-5 pb-6 overflow-y-auto max-h-[70vh]">
          <Progress step={step} />
          {step === 'intro' && (
            <Intro accepted={accepted} onAccept={setAccepted} onContinue={() => accepted && next()} total={total} />
          )}
          {step === 'info' && (
            <InfoForm info={info} setInfo={setInfo} onContinue={() => next()} onBack={back} />
          )}
          {step === 'review' && (
            <Review items={items} total={total} onContinue={next} onBack={back} info={info} />
          )}
          {step === 'payment' && (
            <Payment
              mode={payMode}
              setMode={setPayMode}
              total={total}
              onBack={back}
              onPaid={() => {
                setPaid(true)
                // Persist order in session (per-account if signed in)
                const ord = placeOrder({
                  items,
                  method: payMode === 'upi' ? 'UPI' : payMode === 'card' ? 'CARD' : payMode === 'netbanking' ? 'NETBANKING' : 'WALLET',
                  shipping: { name: info.name, email: info.email, address: info.address, city: info.city, postalCode: info.postal },
                  paymentRef: genOrderId()
                })
                onComplete()
                const order = {
                  id: ord.id,
                  items: ord.items.map(it => ({ name: it.name, qty: it.qty, price: it.price, size: it.size })),
                  total: ord.totals.total,
                  eta: buildETA(),
                }
                navigate('/order/confirmation', { state: { status: 'success', order } })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )}

function Progress({ step }: { step: Step }) {
  const steps: Step[] = ['intro', 'info', 'review', 'payment']
  const titles: Record<Step, string> = {
    intro: 'T&C',
    info: 'Details',
    review: 'Review',
    payment: 'Payment'
  }
  const currentIndex = steps.indexOf(step)
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border ${i <= currentIndex ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300/70 dark:border-slate-700'}`}>{i + 1}</div>
          <span className={`hidden sm:inline text-xs font-medium ${i <= currentIndex ? 'text-brand-600 dark:text-brand-300' : 'text-slate-500'}`}>{titles[s]}</span>
          {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 ${i < currentIndex ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`} />}
        </div>
      ))}
    </div>
  )
}

function Intro({ accepted, onAccept, onContinue, total }: { accepted: boolean; onAccept: (b: boolean) => void; onContinue: () => void; total: number }) {
  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-lg">Terms & Conditions</h3>
      <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 space-y-3">
        <p>By continuing you agree to our policies regarding shipping, returns, digital communications, and data processing compliant with applicable laws.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Orders ship within 2–4 business days.</li>
          <li>Custom jerseys are final sale.</li>
          <li>Refunds processed within 5–7 days of receipt.</li>
        </ul>
        <p>Total payable now: <span className="font-semibold text-brand-600">{currency(total)}</span></p>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={accepted} onChange={(e) => onAccept(e.target.checked)} />
        <span>I accept the Terms & Conditions.</span>
      </label>
      <MotionButton disabled={!accepted} onClick={onContinue} className="mt-2">Continue</MotionButton>
    </div>
  )
}

function InfoForm({ info, setInfo, onContinue, onBack }: { info: any; setInfo: (i: any) => void; onContinue: () => void; onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  function update(key: string, val: string) { setInfo({ ...info, [key]: val }) }
    const emailValid = /.+@.+\..+/.test(info.email)
   const phoneValid = true // phone is optional; no strict validation
  const postalValid = !info.postal || info.postal.length >= 4
  const errors: Record<string,string> = {}
  if (!info.name) errors.name = 'Name is required'
  if (info.email && !emailValid) errors.email = 'Enter a valid email'
  if (!info.email) errors.email = 'Email is required'
  if (!info.address) errors.address = 'Address is required'
   // No strict phone validation
  if (info.postal && !postalValid) errors.postal = 'Postal code too short'
  const disabled = Object.keys(errors).length > 0
  const showErrors = (field: string) => submitted || info[field]
  const baseInput = 'w-full rounded-lg border bg-white dark:bg-slate-800/70 px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:placeholder:text-slate-500'
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Customer Details</h3>
      {submitted && disabled && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-600 flex items-start gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>
          <span>Fix the highlighted fields before continuing.</span>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Full Name</label>
          <input aria-invalid={!!errors.name} placeholder="Full name" value={info.name} onChange={e=>update('name', e.target.value)} className={`${baseInput} ${errors.name && showErrors('name') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.name && showErrors('name') && <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Email</label>
          <input aria-invalid={!!errors.email} placeholder="Email" type="email" value={info.email} onChange={e=>update('email', e.target.value)} className={`${baseInput} ${errors.email && showErrors('email') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.email && showErrors('email') && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Phone (Optional)</label>
           <input placeholder="Phone" value={info.phone} onChange={e=>update('phone', e.target.value)} className={`${baseInput} border-slate-300/60 dark:border-slate-700`} />
          {errors.phone && showErrors('phone') && <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">City</label>
          <input placeholder="City" value={info.city} onChange={e=>update('city', e.target.value)} className={`${baseInput} border-slate-300/60 dark:border-slate-700`} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Postal Code</label>
          <input aria-invalid={!!errors.postal} placeholder="Postal Code" value={info.postal} onChange={e=>update('postal', e.target.value)} className={`${baseInput} ${errors.postal && showErrors('postal') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.postal && showErrors('postal') && <p className="mt-1 text-[11px] text-red-600">{errors.postal}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Address</label>
          <textarea aria-invalid={!!errors.address} placeholder="Address" value={info.address} onChange={e=>update('address', e.target.value)} className={`${baseInput} min-h-[90px] resize-y ${errors.address && showErrors('address') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.address && showErrors('address') && <p className="mt-1 text-[11px] text-red-600">{errors.address}</p>}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <MotionButton variant="outline" onClick={onBack}>Back</MotionButton>
        <MotionButton
          disabled={disabled}
          onClick={() => {
            setSubmitted(true)
            if (!disabled) onContinue()
          }}
        >Continue</MotionButton>
      </div>
    </div>
  )
}

function Review({ items, total, onContinue, onBack, info }: { items: Array<CartItem & { product: ProductSnapshot }>; total: number; onContinue: () => void; onBack: () => void; info: any }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Review Order</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map(it => (
          <div key={`${it.id}-${it.size}`} className="flex justify-between text-sm border-b border-slate-200/60 dark:border-slate-700 pb-2">
            <div>
              <div className="font-medium">{it.product.name}</div>
              <div className="text-xs text-slate-500">Size {it.size} × {it.qty}</div>
            </div>
            <div className="font-medium">{currency(it.product.price * it.qty)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-1 text-xs">
        <div><span className="font-semibold">Ship To:</span> {info.name || '—'}, {info.address || '—'}</div>
        <div><span className="font-semibold">Email:</span> {info.email || '—'}</div>
      </div>
      <div className="flex justify-between font-semibold text-sm pt-2 border-t border-slate-200/60 dark:border-slate-700">
        <span>Total</span>
        <span>{currency(total)}</span>
      </div>
      <div className="flex justify-between">
        <MotionButton variant="outline" onClick={onBack}>Back</MotionButton>
        <MotionButton onClick={onContinue}>Proceed to Payment</MotionButton>
      </div>
    </div>
  )
}

function Payment({ mode, setMode, total, onBack, onPaid }: { mode: string; setMode: (m: any) => void; total: number; onBack: () => void; onPaid: () => void }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Payment</h3>
      <div className="flex flex-wrap gap-2">
        {['upi','card','netbanking','wallet'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition ${mode===m ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >{m.toUpperCase()}</button>
        ))}
      </div>
      {mode === 'upi' && (
        <UPIPayment amount={total} config={{ payeeVPA: 'merchant@upi', payeeName: 'JerseyX Store', note: 'Order Payment' }} onSimulateSuccess={onPaid} />
      )}
      {mode === 'card' && <CardForm amount={total} onPaid={onPaid} />}
      {mode === 'netbanking' && <NetBankingList amount={total} onPaid={onPaid} />}
      {mode === 'wallet' && <Wallets amount={total} onPaid={onPaid} />}
      <div className="flex justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700">
        <MotionButton variant="outline" onClick={onBack}>Back</MotionButton>
      </div>
    </div>
  )
}

function CardForm({ amount, onPaid }: { amount: number; onPaid: () => void }) {
  const [holder, setHolder] = useState('')
  const [number, setNumber] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const baseInput = 'w-full rounded-lg border bg-white dark:bg-slate-800/70 px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40'
  // Format number groups (XXXX XXXX ...)
  function formatCard(raw: string) {
    return raw.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim()
  }
  const digits = number.replace(/\D/g, '')
  const numberValid = digits.length >= 13 && digits.length <= 19
  const expValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(exp)
  const cvcValid = /^\d{3,4}$/.test(cvc)
  const holderValid = holder.trim().length > 2
  const errors: Record<string,string> = {}
  if (!holderValid) errors.holder = 'Name required'
  if (!numberValid) errors.number = 'Card number 13–19 digits'
  if (!expValid) errors.exp = 'Format MM/YY'
  if (!cvcValid) errors.cvc = '3–4 digits'
  const disabled = Object.keys(errors).length > 0
  const showErrors = (field: string) => submitted || (field === 'holder' ? holder : field === 'number' ? number : field === 'exp' ? exp : cvc)
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Cardholder Name</label>
          <input value={holder} onChange={e=>setHolder(e.target.value)} aria-invalid={!holderValid} placeholder="Name on card" className={`${baseInput} ${errors.holder && showErrors('holder') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.holder && showErrors('holder') && <p className="mt-1 text-[11px] text-red-600">{errors.holder}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Card Number</label>
          <input value={formatCard(number)} inputMode="numeric" onChange={e=>setNumber(e.target.value.replace(/[^\d]/g,''))} aria-invalid={!numberValid} placeholder="XXXX XXXX XXXX XXXX" className={`${baseInput} tracking-widest ${errors.number && showErrors('number') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.number && showErrors('number') && <p className="mt-1 text-[11px] text-red-600">{errors.number}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Expiry (MM/YY)</label>
          <input value={exp} onChange={e=>setExp(e.target.value.toUpperCase())} aria-invalid={!expValid} placeholder="MM/YY" className={`${baseInput} ${errors.exp && showErrors('exp') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.exp && showErrors('exp') && <p className="mt-1 text-[11px] text-red-600">{errors.exp}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">CVC</label>
          <input value={cvc} onChange={e=>setCvc(e.target.value.replace(/[^\d]/g,''))} aria-invalid={!cvcValid} placeholder="CVC" className={`${baseInput} ${errors.cvc && showErrors('cvc') ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-300/60 dark:border-slate-700'}`} />
          {errors.cvc && showErrors('cvc') && <p className="mt-1 text-[11px] text-red-600">{errors.cvc}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <MotionButton
          disabled={disabled}
          onClick={() => {
            setSubmitted(true)
            if (!disabled) onPaid()
          }}
        >Pay {currency(amount)}</MotionButton>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Demo only – card details are validated locally and never sent to a server.</p>
    </div>
  )
}

function NetBankingList({ amount, onPaid }: { amount: number; onPaid: () => void }) {
  const banks = ['HDFC','ICICI','SBI','AXIS','KOTAK','YES','PNB','BOB']
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {banks.map(b => (
          <button key={b} onClick={onPaid} className="rounded-lg border border-slate-200 dark:border-slate-700 py-3 px-2 hover:bg-brand-500/10 font-medium">{b}</button>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Selecting a bank here simulates redirect + success.</p>
    </div>
  )
}

function Wallets({ amount, onPaid }: { amount: number; onPaid: () => void }) {
  const wallets = ['PhonePe','Paytm','Amazon Pay','Mobikwik']
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        {wallets.map(w => (
          <button key={w} onClick={onPaid} className="rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-brand-500/10 font-medium">{w}</button>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Wallet selection simulates an instant success.</p>
    </div>
  )
}

function buildETA() {
  const d = new Date()
  d.setDate(d.getDate() + 5)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
