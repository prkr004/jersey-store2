import HeroBanner from '../components/HeroBanner'
import { products } from '../data/product'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import MotionButton from '../components/MotionButton'
import { motion } from 'framer-motion'

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6)
  const trending = products.filter((p) => p.trending).slice(0, 6)

  return (
    <>
      <HeroBanner />

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Featured Jerseys</h2>
          <Link to="/shop"><MotionButton variant="outline">View All</MotionButton></Link>
        </div>
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <Categories />

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Trending Deals</h2>
          <Link to="/shop"><MotionButton variant="outline">Shop Deals</MotionButton></Link>
        </div>
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <CTA />
    </>
  )
}

function Categories() {
  const cats = [
    { name: 'Football', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Basketball', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Cricket', img: 'https://images.unsplash.com/photo-1521417531039-94a2f8f0f6b4?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Hockey', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop' }
  ]
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="font-display text-3xl mb-6">Shop by Sport</h2>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
        {cats.map((c, i) => (
          <Link key={c.name} to={`/shop?sport=${encodeURIComponent(c.name)}`} className="group">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl relative"
            >
              <img src={c.img} alt={c.name} className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 font-semibold text-white">{c.name}</div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-brand-500 to-accent relative p-10">
        <div className="relative z-10">
          <h3 className="font-display text-3xl text-white">Join JerseyX Club</h3>
          <p className="text-white/90 mt-2 max-w-xl">Members get early access to drops, exclusive discounts, and more.</p>
          <div className="mt-4">
            <Link to="/account"><MotionButton variant="outline" className="bg-white/10 text-white">Create Account</MotionButton></Link>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
      </div>
    </section>
  )
}