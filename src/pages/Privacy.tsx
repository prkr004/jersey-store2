import { ShieldCheck, Lock, Mail, Server } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <section className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-14">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="font-display text-3xl sm:text-4xl">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-sm/relaxed opacity-90">Last updated: October 2025 • Your data. Your control. Our commitment.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <ArticleCard title="What we collect" icon={<Server className='w-5 h-5' />}> 
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal:</strong> name, email, phone, address</li>
              <li><strong>Payments:</strong> handled securely by gateways (UPI/cards/wallets)</li>
              <li><strong>Account:</strong> auth details and jersey preferences</li>
              <li><strong>Usage:</strong> device, IP, and pages to improve experience</li>
            </ul>
          </ArticleCard>

          <ArticleCard title="How we use it" icon={<Mail className='w-5 h-5' />}> 
            <ul className="list-disc pl-5 space-y-1">
              <li>Fulfil orders and provide support</li>
              <li>Personalize recommendations and wishlists</li>
              <li>Send order updates and essential notifications</li>
              <li>Improve design, security, and performance</li>
            </ul>
          </ArticleCard>

          <ArticleCard title="Sharing & partners" icon={<Lock className='w-5 h-5' />}> 
            <p className="mb-2">We never sell your data. Limited sharing only with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payment gateways for secure transactions</li>
              <li>Logistics partners for delivery</li>
              <li>Trusted providers (e.g., Supabase) for auth/hosting</li>
            </ul>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">All partners follow strict data-protection standards.</p>
          </ArticleCard>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <ArticleCard title="Security we apply" icon={<ShieldCheck className='w-5 h-5' />}> 
            <p>We use SSL, firewalls, and role-based access to protect your data from unauthorized use.</p>
          </ArticleCard>
          <ArticleCard title="Your rights" icon={<Mail className='w-5 h-5' />}> 
            <ul className="list-disc pl-5 space-y-1">
              <li>Access and update your account anytime</li>
              <li>Request deletion at <a className="underline" href="mailto:support@jerseyx.in">support@jerseyx.in</a></li>
              <li>Opt-out of promotional emails</li>
            </ul>
          </ArticleCard>
        </div>

        <div className="mt-8 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <h3 className="font-semibold">Policy updates</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">We may update this policy periodically and will notify you of significant changes via email or in-app notice.</p>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </article>
  )
}