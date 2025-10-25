import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Session-only auth: restore user from sessionStorage
    try {
      const raw = sessionStorage.getItem('jerseyx_user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
    setLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    // Validate against session account only
    try {
      const raw = sessionStorage.getItem('jerseyx_account')
      if (!raw) return { error: 'No account found this session. Please sign up.' }
      const acc = JSON.parse(raw)
      if (acc.email !== email || acc.password !== password) return { error: 'Invalid email or password.' }
      const u = { id: `local-${acc.email}`, email: acc.email, name: acc.name || acc.email?.split('@')[0] || 'User' }
      setUser(u)
      sessionStorage.setItem('jerseyx_user', JSON.stringify(u))
      return {}
    } catch {
      return { error: 'Unable to sign in. Try again.' }
    }
  }
  async function signUp(email: string, password: string, name?: string) {
    // Create a session-only account and sign-in immediately
    try {
      const account = { email, password, name: name || email.split('@')[0] }
      sessionStorage.setItem('jerseyx_account', JSON.stringify(account))
      const u = { id: `local-${email}`, email, name: account.name }
      setUser(u)
      sessionStorage.setItem('jerseyx_user', JSON.stringify(u))
      return {}
    } catch {
      return { error: 'Unable to create account. Try again.' }
    }
  }
  async function signOut() {
    try { sessionStorage.removeItem('jerseyx_user') } catch {}
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
