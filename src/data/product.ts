import { imageOverrides } from './imageOverrides'

export type Product = {
  id: string
  name: string
  team: string
  sport: 'Football' | 'Basketball' | 'Cricket' | 'Baseball' | 'Hockey'
  price: number
  rating: number
  images: string[]
  colors: string[]
  sizes: string[]
  description: string
  featured?: boolean
  trending?: boolean
}

// Stable, direct CDN jersey images per sport (Unsplash/Pexels) to avoid random/blocked endpoints.
// Use only images.unsplash.com and images.pexels.com links with explicit sizing params.
const SPORT_IMAGE_POOL: Record<Product['sport'], string[]> = {
  Football: [
    // Soccer/football jerseys
    'https://images.unsplash.com/photo-1577212017184-80cc0da11082?auto=format&fit=crop&w=1200&q=60',
    'https://images.unsplash.com/photo-1616124619460-ff4ed8f4683c?auto=format&fit=crop&w=1200&q=60',
    'https://images.pexels.com/photos/6077784/pexels-photo-6077784.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  Basketball: [
    // Basketball jerseys and jersey-themed scenes
    'https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?auto=format&fit=crop&w=1200&q=60',
    'https://images.pexels.com/photos/7005243/pexels-photo-7005243.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/7005768/pexels-photo-7005768.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  Cricket: [
    // Cricket jerseys in action
    'https://images.pexels.com/photos/32801557/pexels-photo-32801557.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/34211752/pexels-photo-34211752.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/30497263/pexels-photo-30497263.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  Baseball: [
    // Baseball jerseys and gear
    'https://images.pexels.com/photos/5184688/pexels-photo-5184688.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/5184696/pexels-photo-5184696.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/32371388/pexels-photo-32371388.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  Hockey: [
    // Ice hockey jerseys and gameplay
    'https://images.unsplash.com/photo-1547650276-c112256c9cc6?auto=format&fit=crop&w=1200&q=60',
    'https://images.pexels.com/photos/8974847/pexels-photo-8974847.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/8975008/pexels-photo-8975008.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
}

const hashIndex = (id: string, mod: number) => {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const idx = Math.abs(h) % mod
  return idx
}

export const getSportCover = (sport: Product['sport']): string => {
  const arr = SPORT_IMAGE_POOL[sport]
  return arr[0]
}

// Base product list (without final images). Images will be generated from the product name below.
const baseProducts: Product[] = [
  {
    id: 'FB-NY-01',
    name: 'NY Guardians Home Jersey',
    team: 'New York Guardians',
    sport: 'Football',
  // Converted to INR pricing in thousands range
  price: 1999,
    rating: 4.7,
    images: [],
    colors: ['#0ea5e9', '#111827'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description:
      'Premium performance football jersey with breathable mesh panels and moisture-wicking fabric. Official team branding and athletic cut.',
    featured: true,
    trending: true
  },
  {
    id: 'BB-LA-23',
    name: 'LA Hoops City Edition',
    team: 'Los Angeles Hoops',
    sport: 'Basketball',
  price: 2499,
    rating: 4.8,
    images: [],
    colors: ['#6d28d9', '#f59e0b'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'City Edition basketball jersey with lightweight knit and heat-applied graphics. Designed for comfort on and off the court.',
    featured: true,
    trending: true
  },
  {
    id: 'CR-IND-07',
    name: 'India ODI Pro Jersey',
    team: 'India',
    sport: 'Cricket',
  price: 1799,
    rating: 4.6,
    images: [],
    colors: ['#1d4ed8', '#f97316'],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Official ODI cricket jersey with ventilated side panels and signature tricolor details. Perfect for die-hard supporters.',
    featured: true
  },
  {
    id: 'BB-CHI-91',
    name: 'Chicago Legacy Classic',
    team: 'Chicago Legacy',
    sport: 'Basketball',
  price: 2299,
    rating: 4.9,
    images: [],
    colors: ['#ef4444', '#111827'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description:
      'Throwback basketball classic with stitched lettering and premium fabric. An icon reborn for today’s fans.',
    trending: true
  },
  {
    id: 'FB-DAL-04',
    name: 'Dallas Star Away',
    team: 'Dallas Star',
    sport: 'Football',
  price: 1899,
    rating: 4.5,
    images: [],
    colors: ['#60a5fa', '#1f2937'],
    sizes: ['M', 'L', 'XL'],
    description:
      'Athletic fit football jersey built for speed. Smooth seams reduce friction while mesh zones keep you cool.'
  },
  {
    id: 'CR-AUS-11',
    name: 'Australia T20 Kit',
    team: 'Australia',
    sport: 'Cricket',
  price: 1499,
    rating: 4.4,
    images: [],
    colors: ['#22c55e', '#facc15'],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Lightweight T20 jersey with bold graphics and durable print. Support the Aussies in style.'
  },
  {
    id: 'BS-NYY-27',
    name: 'NY Stripes Home',
    team: 'New York Stripes',
    sport: 'Baseball',
  price: 2099,
    rating: 4.3,
    images: [],
    colors: ['#1e293b', '#f8fafc'],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Classic baseball pinstripes with button front closure and authentic on-field details.'
  },
  {
    id: 'HK-BOS-33',
    name: 'Boston Ice Pro',
    team: 'Boston Ice',
    sport: 'Hockey',
  price: 2799,
    rating: 4.6,
    images: [],
    colors: ['#0ea5e9', '#111827'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description:
      'Performance hockey sweater engineered for warmth and breathability with reinforced elbows.'
  },
  // More entries for a fuller grid
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `GEN-${i + 1}`,
    name: `Elite Performance Jersey ${i + 1}`,
    team: ['New York Guardians', 'Los Angeles Hoops', 'India', 'Chicago Legacy'][i % 4],
    sport: (['Football', 'Basketball', 'Cricket', 'Basketball'] as Product['sport'][])[i % 4],
  // Base 1099 to 3099 spread
  price: 1099 + (i % 5) * 500,
    rating: 4.1 + ((i * 7) % 9) / 10,
    images: [],
    colors: ['#06b6d4', '#22c55e'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-performance jersey crafted for fans and athletes. Breathable, durable, iconic.',
  }))
]

// Final exported products with generated images per name

export const products: Product[] = baseProducts.map((p) => ({
  ...p,
  images: (() => {
    const override = imageOverrides[p.id]
    if (override && override.length) return override
    const pool = SPORT_IMAGE_POOL[p.sport]
    const start = hashIndex(p.id, pool.length)
    return [pool[start], pool[(start + 1) % pool.length]]
  })()
}))

export const productsById = Object.fromEntries(products.map((p) => [p.id, p]))
export const teams = Array.from(new Set(products.map((p) => p.team))).sort()
export const sports = Array.from(new Set(products.map((p) => p.sport))).sort()
export const priceMin = Math.min(...products.map((p) => p.price))
export const priceMax = Math.max(...products.map((p) => p.price))