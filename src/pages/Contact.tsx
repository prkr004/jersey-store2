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
          <p className="text-sm text-slate-600 dark:text-slate-400">123 Arena Blvd, Suite 7, Sports City</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Email: support@jerseyx.example</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Phone: (555) 123-4567</p>
          <div className="mt-4">
            <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">Map Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  )
}