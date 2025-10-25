import { useState } from 'react'
import MotionButton from './MotionButton'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'

export default function AuthModal() {
  const { open, hide } = useAuthModal()
  if (!open) return null
  return <ModalContent onClose={hide} />
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/60 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
        <Header onClose={onClose} />
        <div className="px-6 pb-6">
          <Tabs tab={tab} onChange={setTab} />
          {tab === 'login' ? <LoginForm onSuccess={onClose} /> : <SignupForm onSuccess={() => setTab('login')} />}
        </div>
      </div>
    </div>
  )
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-brand-500/15 via-transparent to-transparent">
      <h3 className="font-display text-2xl">Welcome back</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">Sign in to sync your cart and checkout faster.</p>
      <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  )
}

function Tabs({ tab, onChange }: { tab: 'login' | 'signup'; onChange: (t: 'login' | 'signup') => void }) {
  return (
    <div className="mt-4 mb-6 grid grid-cols-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
      {(['login','signup'] as const).map(t => (
        <button key={t} onClick={() => onChange(t)} className={`py-2 rounded-lg text-sm font-medium transition ${tab===t ? 'bg-white dark:bg-slate-900 shadow border border-slate-200/60 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400'}`}>
          {t === 'login' ? 'Login' : 'Sign Up'}
        </button>
      ))}
    </div>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const emailValid = /.+@.+\..+/.test(email)
  const passwordValid = password.length >= 6
  const disabled = !emailValid || !passwordValid

  return (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault()
      if (disabled) return
      const { error } = await signIn(email, password)
      if (error) setError(error)
      else onSuccess()
    }}>
      <div>
        <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Email</label>
        <input className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Password</label>
        <input className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        <p className="text-[11px] text-slate-500 mt-1">At least 6 characters</p>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <MotionButton disabled={disabled} className="w-full">{loading ? 'Signing in…' : 'Sign In'}</MotionButton>
    </form>
  )
}

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { signUp, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const emailValid = /.+@.+\..+/.test(email)
  const passwordValid = password.length >= 6
  const nameValid = name.trim().length >= 2
  const disabled = !emailValid || !passwordValid || !nameValid

  return (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault()
      if (disabled) return
      const { error } = await signUp(email, password, name)
      if (error) setError(error)
      else onSuccess()
    }}>
      <div>
        <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Full Name</label>
        <input className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Email</label>
        <input className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 uppercase tracking-wide text-slate-500">Password</label>
        <input className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        <p className="text-[11px] text-slate-500 mt-1">At least 6 characters</p>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <MotionButton disabled={disabled} className="w-full">{loading ? 'Creating…' : 'Create Account'}</MotionButton>
      <p className="text-[11px] text-slate-500">By creating an account you agree to our Terms.</p>
    </form>
  )
}
