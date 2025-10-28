import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import MotionButton from './MotionButton'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Elite sports jerseys engineered for performance and style. Join the JerseyX club.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-brand-600">Shop</Link></li>
              <li><Link to="/about" className="hover:text-brand-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
              <li><Link to="/account" className="hover:text-brand-600">Account</Link></li>
              <li><Link to="/cart" className="hover:text-brand-600">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?sport=Football" className="hover:text-brand-600">Football</Link></li>
              <li><Link to="/shop?sport=Basketball" className="hover:text-brand-600">Basketball</Link></li>
              <li><Link to="/shop?sport=Cricket" className="hover:text-brand-600">Cricket</Link></li>
              <li><Link to="/shop?sport=Baseball" className="hover:text-brand-600">Baseball</Link></li>
              <li><Link to="/shop?sport=Hockey" className="hover:text-brand-600">Hockey</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Subscribe for drops and exclusive deals.</p>
            <form className="flex gap-2">
              <input placeholder="Email address" type="email" className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" />
              <MotionButton type="submit">Join</MotionButton>
            </form>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} JerseyX. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-600">Terms</Link>
            <Link to="/cookies" className="hover:text-brand-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}