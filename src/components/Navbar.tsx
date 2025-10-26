import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import Logo from './Logo'
import MotionButton from './MotionButton'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const search = q.trim() || params.get('q') || ''
    navigate(`/shop?${new URLSearchParams({ q: search }).toString()}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-slate-950/50 border-b border-slate-200/60 dark:border-slate-800">
      <nav className="container mx-auto px-4 py-3 flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        <form onSubmit={onSearch} className="hidden md:flex ml-6 flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jerseys, teams, sports..."
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </form>

        <div className="ml-auto hidden lg:flex items-center gap-2">
          <NavLinks />
          <div className="flex items-center gap-2">
            <MotionButton variant="ghost" aria-label="Toggle theme" onClick={toggle} className="p-2">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </MotionButton>
            <Link to="/cart" className="relative">
              <MotionButton variant="primary" className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>Cart</span>
                {count > 0 && <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>}
              </MotionButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="lg:hidden border-t border-slate-200/60 dark:border-slate-800">
          <div className="container mx-auto px-4 py-3 space-y-4">
            <form onSubmit={onSearch}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search jerseys, teams, sports..."
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </form>
            <NavLinks vertical onNavigate={() => setOpen(false)} />
            <div className="flex items-center gap-3">
              <MotionButton variant="outline" onClick={toggle} className="flex-1">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </MotionButton>
              <Link to="/cart" onClick={() => setOpen(false)} className="flex-1">
                <MotionButton variant="primary" className="w-full">
                  Cart {count > 0 ? `(${count})` : ''}
                </MotionButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLinks({ vertical = false, onNavigate }: { vertical?: boolean; onNavigate?: () => void }) {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ]
  return (
    <div className={vertical ? 'grid grid-cols-2 gap-2' : 'flex items-center gap-1'}>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'text-brand-700 dark:text-brand-300 bg-brand-500/10'
                : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/10'
            }`
          }
          end={l.to === '/'}
        >
          {l.label}
        </NavLink>
      ))}
      <NavLink
        to="/account"
        onClick={onNavigate}
        className={({ isActive }) =>
          `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'text-brand-700 dark:text-brand-300 bg-brand-500/10'
              : 'text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/10'
          }`
        }
      >
        Account
      </NavLink>
    </div>
  )
}