import MotionButton from '../components/MotionButton'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Contact Us</h1>
      <div className="mt-6 grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
          <h2 className="font-semibold mb-4">Send a Message</h2>
          <form className="grid gap-4">
            <input placeholder="Your Name" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
            <input placeholder="Email" type="email" className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
            <textarea placeholder="Message" rows={5} className="rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2" />
            <MotionButton type="submit">Submit</MotionButton>
          </form>
        </div>
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6">
          <h2 className="font-semibold mb-4">Our Studio</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">MPSTME, Opp. Copper Hospital, Vile Parle West, Mumbai - 400056</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Email: support@jerseyx.com</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Phone: (555) 123-4567</p>
          <div className="mt-4">
            <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
              <iframe
                title="MPSTME Location Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps?q=MPSTME%2C%20Opp.%20Copper%20Hospital%2C%20Vile%20Parle%20West%2C%20Mumbai%20-%20400056&output=embed"
                allowFullScreen
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=MPSTME%2C%20Opp.%20Copper%20Hospital%2C%20Vile%20Parle%20West%2C%20Mumbai%20-%20400056"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400 underline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}