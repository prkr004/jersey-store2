import { motion } from 'framer-motion'
import MotionButton from './MotionButton'
import { Link } from 'react-router-dom'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute inset-0 bg-grid size-[24px] dark:bg-grid-dark [background-size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-5xl md:text-6xl leading-tight"
          >
            Elevate Your Game Day Fit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 text-lg text-slate-600 dark:text-slate-300"
          >
            Shop elite, premium jerseys engineered for performance with a sharp, modern aesthetic.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/shop">
              <MotionButton className="px-6 py-3">Shop Now</MotionButton>
            </Link>
            <Link to="/about">
              <MotionButton variant="outline" className="px-6 py-3">Learn More</MotionButton>
            </Link>
          </motion.div>
        </div>
        <div className="relative">
          <motion.div
            initial={{ rotate: -8, opacity: 0, scale: 0.95 }}
            animate={{ rotate: -2, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
            className="rounded-3xl p-2 bg-gradient-to-br from-brand-500/20 to-accent/20"
          >
            <img
              // Jersey collection photo (direct CDN) to replace placeholder
              src="https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?auto=format&fit=crop&w=1600&q=70"
              alt="Hero jersey"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-6 -left-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl px-4 py-3 shadow-lg"
          >
            <span className="text-sm">New Season Drops</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}