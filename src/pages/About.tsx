export default function About() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-display text-4xl">About JerseyX</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            JerseyX was founded with a simple mission: craft elite, performance-driven jerseys that empower fans and athletes alike.
          </p>
          <div className="mt-6 space-y-3">
            <AboutBlock title="Our Mission" text="Deliver premium sportswear that blends innovation, sustainability, and style." />
            <AboutBlock title="Our Vision" text="Be the global destination for modern, high-performance fan gear." />
            <AboutBlock title="Our Promise" text="Quality materials, ethical production, and designs that stand out." />
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden">
          <img
            // Stable placeholder (swap with /public/about-hero.jpg for a real asset later)
            src="about_us.jpg"
            alt="About JerseyX"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

function AboutBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{text}</p>
    </div>
  )
}