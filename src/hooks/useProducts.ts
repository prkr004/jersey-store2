import { useEffect, useState } from 'react'
import { supabase, type DbProduct } from '../lib/supabaseClient'
import type { Product } from '../data/product'
import { getSportCover } from '../data/product'

// Map DB row to existing Product UI shape. Because DB schema is lean we fill missing fields with sensible defaults.
function deriveSport(p: DbProduct): Product['sport'] {
  const text = `${p.name} ${p.team} ${p.slug}`.toLowerCase()
  if (/basket|nba/.test(text)) return 'Basketball'
  if (/crick|ipl|odi|t20/.test(text)) return 'Cricket'
  if (/baseball|mlb/.test(text)) return 'Baseball'
  if (/hockey|nhl|ice/.test(text)) return 'Hockey'
  return 'Football'
}

function mapToProduct(p: DbProduct): Product {
  // Choose slug as the stable public id for routing; fallback to uuid if slug missing.
  const publicId = p.slug || p.id
  const sport = (p as any).sport || deriveSport(p)
  const images = (p.images && p.images.length ? p.images : [getSportCover(sport), getSportCover(sport)])
  return {
    id: publicId,
    name: p.name,
    team: p.team ?? 'Unknown Team',
    sport,
    price: p.price_cents / 100,
    rating: 4.5, // Default placeholder rating.
    images,
    colors: [],
    sizes: p.sizes ?? [],
    description: p.description ?? '',
    featured: false,
    trending: false,
  }
}

export function useProducts() {
  const [data, setData] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(100)
      if (cancelled) return
      if (error) setError(error.message)
      else setData((data ?? []).map(mapToProduct))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { products: data, loading, error }
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle()
      if (cancelled) return
      if (error) setError(error.message)
      else if (data) setProduct(mapToProduct(data))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [slug])

  return { product, loading, error }
}
