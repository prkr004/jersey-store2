import { NavLink, Route, Routes } from 'react-router-dom'
import MotionButton from '../components/MotionButton'

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
  return (
    <div>
      <h2 className="font-semibold text-xl">Profile</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">This is a demo profile screen.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <input placeholder="Full Name" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input placeholder="Email" type="email" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input placeholder="Phone" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <MotionButton className="sm:col-span-2">Save Changes</MotionButton>
      </div>
    </div>
  )
}

function Login() {
  return (
    <div>
      <h2 className="font-semibold text-xl">Login</h2>
      <div className="grid gap-4 mt-4">
        <input placeholder="Email" type="email" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input placeholder="Password" type="password" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <MotionButton>Sign In</MotionButton>
      </div>
    </div>
  )
}

function Signup() {
  return (
    <div>
      <h2 className="font-semibold text-xl">Create Account</h2>
      <div className="grid gap-4 mt-4">
        <input placeholder="Full Name" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input placeholder="Email" type="email" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <input placeholder="Password" type="password" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
        <MotionButton>Create Account</MotionButton>
      </div>
    </div>
  )
}