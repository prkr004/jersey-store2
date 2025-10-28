import { Scale, Truck, Shield, CreditCard } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <section className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
        <div className="container mx-auto px-4 py-14">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8" />
            <h1 className="font-display text-3xl sm:text-4xl">Terms & Conditions</h1>
          </div>
          <p className="mt-2 text-sm/relaxed opacity-90">Effective: October 2025 • Clear and fair terms for every fan.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-6">
        <Section title="Use of the website" icon={<Shield className='w-5 h-5' />}> 
          <ul className="list-disc pl-5 space-y-1">
            <li>Minimum age 13+ to create an account or purchase</li>
            <li>No misuse: hacking, scraping, fake orders, or abuse</li>
            <li>All content/designs belong to JerseyX unless stated</li>
          </ul>
        </Section>

        <Section title="Products & pricing" icon={<CreditCard className='w-5 h-5' />}> 
          <ul className="list-disc pl-5 space-y-1">
            <li>Prices in INR, taxes inclusive where applicable</li>
            <li>Prices/items may change or be discontinued</li>
            <li>Images are representative; minor variations may occur</li>
          </ul>
        </Section>

        <Section title="Orders & payments" icon={<CreditCard className='w-5 h-5' />}> 
          <ul className="list-disc pl-5 space-y-1">
            <li>Secure payments via trusted gateways</li>
            <li>Orders confirm on successful authorization</li>
            <li>Failed payments will not be processed</li>
          </ul>
        </Section>

        <Section title="Shipping & delivery" icon={<Truck className='w-5 h-5' />}> 
          <ul className="list-disc pl-5 space-y-1">
            <li>Dispatch in 2–5 business days</li>
            <li>Estimated delivery shown during checkout</li>
            <li>Delays by couriers/force majeure are outside our control</li>
          </ul>
        </Section>

        <Section title="Returns & exchanges" icon={<Shield className='w-5 h-5' />}> 
          <ul className="list-disc pl-5 space-y-1">
            <li>Returns within 7 days for damaged/incorrect items</li>
            <li>Customized jerseys are non-returnable</li>
            <li>Request: <a className="underline" href="mailto:support@jerseyx.in">support@jerseyx.in</a> with order ID and proof</li>
          </ul>
        </Section>

        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Limitation of liability" icon={<Shield className='w-5 h-5' />}> 
            <p>We’re not liable for indirect damages or delays beyond our control. Liability is capped at the order’s value.</p>
          </Section>
          <Section title="Governing law" icon={<Scale className='w-5 h-5' />}> 
            <p>These terms follow Indian law. Disputes fall under Mumbai jurisdiction.</p>
          </Section>
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