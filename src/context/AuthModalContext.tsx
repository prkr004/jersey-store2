import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './AuthContext'

interface AuthModalContextType {
  open: boolean
  show: (reason?: string) => void
  hide: () => void
  requireAuth: (reason?: string) => Promise<boolean>
}

const AuthModalContext = createContext<AuthModalContextType | null>(null)

const DISMISS_KEY = 'jerseyx_authmodal_dismissed'
const AUTO_DELAY_MS = 30000 // 30 seconds

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const waiter = useRef<{ resolve: (v: boolean)=>void } | null>(null)

  const hide = useCallback(() => {
    setOpen(false)
    if (!user) {
      // Mark dismissed to avoid nagging immediately; still required on checkout
      try { localStorage.setItem(DISMISS_KEY, Date.now().toString()) } catch {}
    }
    if (waiter.current) {
      waiter.current.resolve(false)
      waiter.current = null
    }
  }, [user])

  const show = useCallback((reason?: string) => {
    setOpen(true)
  }, [])

  const requireAuth = useCallback(async (reason?: string) => {
    if (user) return true
    setOpen(true)
    return new Promise<boolean>(resolve => {
      waiter.current = { resolve }
    })
  }, [user])

  // Auto open after 30s if no user and not dismissed this session
  useEffect(() => {
    if (user) return
    let timer: any
    const dismissed = (() => { try { return !!localStorage.getItem(DISMISS_KEY) } catch { return false } })()
    if (!dismissed) {
      timer = setTimeout(() => setOpen(true), AUTO_DELAY_MS)
    }
    return () => timer && clearTimeout(timer)
  }, [user])

  // Resolve waiter when user becomes authenticated
  useEffect(() => {
    if (user && waiter.current) {
      waiter.current.resolve(true)
      waiter.current = null
      setOpen(false)
    }
  }, [user])

  const value = useMemo(() => ({ open, show, hide, requireAuth }), [open, show, hide, requireAuth])

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider')
  return ctx
}
