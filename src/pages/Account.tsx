import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import MotionButton from '../components/MotionButton'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useOrders } from '../context/OrdersContext'
import { currency } from '../utils/format'

export default function Account() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Your Account</h1>

      <div className="mt-6 grid lg:grid-cols-3 gap-8">
        <aside className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4">
          <nav className="space-y-1">
            <NavLink to="" end className={linkClass}>Profile</NavLink>
            <NavLink to="orders" className={linkClass}>Orders</NavLink>
            <NavLink to="login" className={linkClass}>Login</NavLink>
            <NavLink to="signup" className={linkClass}>Sign Up</NavLink>
          </nav>
        </aside>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
            <Routes>
              <Route index element={<Profile />} />
              <Route path="orders" element={<Orders />} />
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

function Orders() {
  const { orders } = useOrders()
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 text-sm text-slate-600 dark:text-slate-400">No orders yet this session. After you checkout, they will appear here.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Order</div>
                  <div className="font-mono text-sm font-semibold">{o.id}</div>
                </div>
                <div className="sm:ml-6">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Placed</div>
                  <div className="text-sm">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="sm:ml-auto">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Total</div>
                  <div className="text-sm font-semibold">{currency(o.totals.total)}</div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium border border-slate-300 dark:border-slate-700">{o.status}</span>
                </div>
              </div>
              <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {o.items.map((it, i) => (
                  <div key={i} className="p-4 sm:p-5 flex items-center gap-3 text-sm">
                    <img src={it.images?.[0]} onError={(e:any)=>{e.currentTarget.src = it.images?.[1] || it.images?.[0]}} alt={it.name} className="w-14 h-14 rounded-lg object-cover border border-slate-200/60 dark:border-slate-800" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate flex items-center gap-2">
                        <span className="truncate">{it.name}</span>
                        {it.custom && (
                          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800">Customized</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Size {it.size} • Qty {it.qty}
                        {it.custom && (it.custom.name || it.custom.number) && (
                          <span className="block sm:inline sm:ml-2 text-slate-600 dark:text-slate-400">
                            Custom: {it.custom.name ? it.custom.name.toUpperCase() : ''}{it.custom.number ? ` #${it.custom.number}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-medium">{currency(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 sm:p-5 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-3">
                <div>Payment: {o.payment.method} • {o.payment.status}</div>
                <div>Ship to: {o.shipping.name}, {o.shipping.city} {o.shipping.postalCode}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Login() {
  const { signIn, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
    setSubmitted(true)
    const emailValid = /.+@.+\..+/.test(email)
    const passwordValid = password.length >= 6
    if (!emailValid || !passwordValid) return
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
        <div>
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            aria-invalid={submitted && !/.+@.+\..+/.test(email)}
            className={`rounded-xl w-full bg-slate-100 dark:bg-slate-900 px-4 py-2 ${submitted && !/.+@.+\..+/.test(email) ? 'border border-red-500' : ''}`}
          />
          {submitted && !/.+@.+\..+/.test(email) && (
            <p className="text-[11px] text-red-600 mt-1">Enter a valid email address.</p>
          )}
        </div>
        <div>
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password (min 6)"
            type="password"
            required
            aria-invalid={submitted && password.length < 6}
            className={`rounded-xl w-full bg-slate-100 dark:bg-slate-900 px-4 py-2 ${submitted && password.length < 6 ? 'border border-red-500' : ''}`}
          />
          {submitted && password.length < 6 && (
            <p className="text-[11px] text-red-600 mt-1">Password must be at least 6 characters.</p>
          )}
        </div>
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
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
    setSubmitted(true)
    const emailValid = /.+@.+\..+/.test(email)
    const passwordValid = password.length >= 6
    const nameValid = name.trim().length >= 2
    if (!emailValid || !passwordValid || !nameValid) return
    setLoading(true)
    const { error } = await signUp(email, password, name)
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
        <div>
          <input
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Full name"
            required
            aria-invalid={submitted && name.trim().length < 2}
            className={`rounded-xl w-full bg-slate-100 dark:bg-slate-900 px-4 py-2 ${submitted && name.trim().length < 2 ? 'border border-red-500' : ''}`}
          />
          {submitted && name.trim().length < 2 && (
            <p className="text-[11px] text-red-600 mt-1">Enter at least 2 characters.</p>
          )}
        </div>
        <div>
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            aria-invalid={submitted && !/.+@.+\..+/.test(email)}
            className={`rounded-xl w-full bg-slate-100 dark:bg-slate-900 px-4 py-2 ${submitted && !/.+@.+\..+/.test(email) ? 'border border-red-500' : ''}`}
          />
          {submitted && !/.+@.+\..+/.test(email) && (
            <p className="text-[11px] text-red-600 mt-1">Enter a valid email address.</p>
          )}
        </div>
        <div>
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password (min 6)"
            type="password"
            required
            aria-invalid={submitted && password.length < 6}
            className={`rounded-xl w-full bg-slate-100 dark:bg-slate-900 px-4 py-2 ${submitted && password.length < 6 ? 'border border-red-500' : ''}`}
          />
          {submitted && password.length < 6 && (
            <p className="text-[11px] text-red-600 mt-1">Password must be at least 6 characters.</p>
          )}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <MotionButton disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</MotionButton>
      </form>
    </div>
  )
}