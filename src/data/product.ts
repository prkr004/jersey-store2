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

const img = {
  football1: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
  football2: 'https://images.unsplash.com/photo-1506704888324-5a5fbe3f02fb?q=80&w=1200&auto=format&fit=crop',
  basketball1: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
  basketball2: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
  cricket1: 'https://images.unsplash.com/photo-1521417531039-94a2f8f0f6b4?q=80&w=1200&auto=format&fit=crop',
  cricket2: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop',
  baseball1: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
  hockey1: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop'
}

export const products: Product[] = [
  {
    id: 'FB-NY-01',
    name: 'NY Guardians Home Jersey',
    team: 'New York Guardians',
    sport: 'Football',
    price: 119.0,
    rating: 4.7,
    images: [img.football1, img.football2],
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
    price: 139.0,
    rating: 4.8,
    images: [img.basketball1, img.basketball2],
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
    price: 109.0,
    rating: 4.6,
    images: [img.cricket1, img.cricket2],
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
    price: 129.0,
    rating: 4.9,
    images: [img.basketball2, img.basketball1],
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
    price: 115.0,
    rating: 4.5,
    images: [img.football2, img.football1],
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
    price: 99.0,
    rating: 4.4,
    images: [img.cricket2, img.cricket1],
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
    price: 125.0,
    rating: 4.3,
    images: [img.baseball1, img.football1],
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
    price: 149.0,
    rating: 4.6,
    images: [img.hockey1, img.football2],
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
    price: 89 + (i % 5) * 10,
    rating: 4.1 + ((i * 7) % 9) / 10,
    images: [img.football1, img.basketball1],
    colors: ['#06b6d4', '#22c55e'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-performance jersey crafted for fans and athletes. Breathable, durable, iconic.',
  }))
]

export const productsById = Object.fromEntries(products.map((p) => [p.id, p]))
export const teams = Array.from(new Set(products.map((p) => p.team))).sort()
export const sports = Array.from(new Set(products.map((p) => p.sport))).sort()
export const priceMin = Math.min(...products.map((p) => p.price))
export const priceMax = Math.max(...products.map((p) => p.price))