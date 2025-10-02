import { createClient } from '@supabase/supabase-js'

// Environment variables must be prefixed with VITE_ to be exposed to the client build.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
	// eslint-disable-next-line no-console
	console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Frontend data fetching will fail until set.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
	},
})

// Simple typed shapes for lean schema
export type DbProduct = {
	id: string
	name: string
	slug: string
	description: string | null
	price_cents: number
	images: string[] | null
	team: string | null
	sizes: string[] | null
	stock: number | null
	is_active: boolean | null
}
