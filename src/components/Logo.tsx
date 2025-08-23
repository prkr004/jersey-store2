export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 24 24" className="text-brand-500">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4"/>
            <stop offset="100%" stopColor="#22C55E"/>
          </linearGradient>
        </defs>
        <path fill="url(#g1)" d="M12 2l3.5 3.5H20v4.5L22 14l-2 3.5V22h-4.5L12 20l-3.5 2H4v-4.5L2 14l2-4V5.5h4.5L12 2z"/>
      </svg>
      <span className="font-display text-2xl tracking-wide">JerseyX</span>
    </div>
  )
}