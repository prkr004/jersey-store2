import { motion, HTMLMotionProps } from 'framer-motion'
import { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & {
  glow?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
  children?: React.ReactNode
}

export default function MotionButton({
  glow = true,
  variant = 'primary',
  className,
  children,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const colors = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white',
    outline: 'border border-brand-500 text-brand-600 hover:bg-brand-500/10',
    ghost: 'text-brand-500 hover:bg-brand-500/10'
  }[variant]

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples((r) => [...r, { x, y, id }])
      setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 600)
    }
    onClick?.(e)
  }



  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={twMerge(
        clsx(
          'relative overflow-hidden rounded-xl px-5 py-3 font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent',
          colors,
          glow && 'shadow-brand',
          className
        )
      )}
      onClick={handleClick}
      {...rest}
    >
  {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute aspect-square w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 animate-[ripple_600ms_ease-out]"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <style>{`@keyframes ripple { from { transform: translate(-50%, -50%) scale(0); opacity: .6 } to { transform: translate(-50%, -50%) scale(3); opacity: 0 } }`}</style>
    </motion.button>
  )
}