import { Cookie, Settings, ShieldCheck, BarChart } from 'lucide-react'

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <section className="bg-gradient-to-r from-amber-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-14">
          <div className="flex items-center gap-3">
            <Cookie className="w-8 h-8" />
            <h1 className="font-display text-3xl sm:text-4xl">Cookies Policy</h1>
          </div>
          <p className="mt-2 text-sm/relaxed opacity-90">Last updated: October 2025 • Helpful cookies only, baked fresh.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-6">
        <Section title="What are cookies?" icon={<Cookie className='w-5 h-5' />}> 
          <p>Cookies are tiny text files saved on your device. They remember your preferences and keep things like cart and login working smoothly.</p>
        </Section>

        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Types we use" icon={<BarChart className='w-5 h-5' />}> 
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Essential:</strong> login, cart, checkout</li>
              <li><strong>Performance:</strong> anonymous usage insights</li>
              <li><strong>Functional:</strong> preferences like size or sport</li>
              <li><strong>Advertising:</strong> relevant offers and promos</li>
            </ul>
          </Section>
          <Section title="Manage your choice" icon={<Settings className='w-5 h-5' />}> 
            <p>Control cookies in your browser settings. Turning some off may affect wishlist, auth, or checkout features.</p>
          </Section>
        </div>

        <Section title="Third‑party cookies" icon={<ShieldCheck className='w-5 h-5' />}> 
          <p>Trusted services (e.g., analytics/ads) may set cookies to help us improve. We keep it minimal and respectful to your privacy.</p>
        </Section>

        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-800/50">
          <h3 className="font-semibold">Consent</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">By using JerseyX, you agree to our cookie usage consistent with this policy.</p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  )
}