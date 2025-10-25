import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import MotionButton from '../components/MotionButton'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Account() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Your Account</h1>

      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <aside className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4">
          <nav className="space-y-1">
            <NavLink to="" end className={linkClass}>Profile</NavLink>
            <NavLink to="login" className={linkClass}>Login</NavLink>
            <NavLink to="signup" className={linkClass}>Sign Up</NavLink>
          </nav>
        </aside>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
            <Routes>
              <Route index element={<Profile />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

function linkClass({ isActive }: { isActive: boolean }) {
  return `block rounded-lg px-3 py-2 ${isActive ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`
}

function Profile() {
  const { user, signOut } = useAuth()
  if (!user) return <div className="text-sm text-slate-600 dark:text-slate-400">You are not signed in.</div>
  return (
    <div>
      <h2 className="font-semibold text-xl">Profile</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Signed in as {user.email}</p>
      <div className="mt-4">
        <MotionButton variant="outline" onClick={() => signOut()}>Sign Out</MotionButton>
      </div>
    </div>
  )
}

function Login() {
  const { signIn, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const returnTo = (location.state as any)?.returnTo || '/account'
  const message = (location.state as any)?.message
  
  if (user) {
    // If user is logged in and there's a return path, redirect
    if (returnTo !== '/account') {
      navigate(returnTo, { replace: true })
      return null
    }
    return <div className="text-sm text-slate-600 dark:text-slate-400">Already signed in.</div>
  }
  
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (!error) {
      // Success - redirect to return path
      navigate(returnTo, { replace: true })
    } else {
      setError(error)
    }
    setLoading(false)
  }
  return (
    <div>
      <h2 className="font-semibold text-xl">Login</h2>
      {message && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
          {message}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid gap-4 mt-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <MotionButton disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</MotionButton>
      </form>
    </div>
  )
}

function Signup() {
  const { signUp, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const returnTo = (location.state as any)?.returnTo || '/account'
  const message = (location.state as any)?.message
  
  if (user) {
    // If user is logged in and there's a return path, redirect
    if (returnTo !== '/account') {
      navigate(returnTo, { replace: true })
      return null
    }
    return <div className="text-sm text-slate-600 dark:text-slate-400">Already signed in.</div>
  }
  
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signUp(email, password)
    if (!error) {
      // Success - redirect to return path
      navigate(returnTo, { replace: true })
    } else {
      setError(error)
    }
    setLoading(false)
  }
  return (
    <div>
      <h2 className="font-semibold text-xl">Create Account</h2>
      {message && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
          {message}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid gap-4 mt-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <MotionButton disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</MotionButton>
      </form>
    </div>
  )
}