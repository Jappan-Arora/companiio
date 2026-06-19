import { useState, useEffect, useCallback, useMemo, createContext, useContext, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { LOGIN_PATH } from '@/const'
import { trpc } from '@/providers/trpc'

export type User = {
  id: number
  name: string | null
  email: string | null
  avatar: string | null
  role: string
  provider: 'email' | 'google' | 'apple' | 'oauth'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const LOCAL_AUTH_STORAGE_KEY = 'companiio-local-token'

function getLocalToken(): string | null {
  return localStorage.getItem(LOCAL_AUTH_STORAGE_KEY)
}

function setLocalToken(token: string | null) {
  if (token) {
    localStorage.setItem(LOCAL_AUTH_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(LOCAL_AUTH_STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for local auth (email/password)
  const { data: localAuthUser, isLoading: localLoading } = trpc.localAuth.me.useQuery(
    undefined,
    {
      enabled: !!getLocalToken(),
      retry: false,
    }
  )

  // Check for OAuth (Kimi) user
  const { data: oauthUser, isLoading: oauthLoading } = trpc.auth.me.useQuery(
    undefined,
    {
      retry: false,
      enabled: !getLocalToken(), // Only check OAuth if no local token
    }
  )

  // Process local auth user when it arrives
  useEffect(() => {
    if (localAuthUser) {
      setLocalUser({
        id: localAuthUser.id,
        name: localAuthUser.name,
        email: localAuthUser.email,
        avatar: localAuthUser.avatar,
        role: localAuthUser.role,
        provider: 'email',
      })
    }
  }, [localAuthUser])

  // Process OAuth user when it arrives
  useEffect(() => {
    if (oauthUser && !getLocalToken()) {
      setLocalUser({
        id: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
        avatar: oauthUser.avatar,
        role: oauthUser.role,
        provider: 'oauth',
      })
    }
  }, [oauthUser])

  // Set loading state
  useEffect(() => {
    if (!localLoading && !oauthLoading) {
      // Give a small delay to let everything settle
      const timer = setTimeout(() => setIsLoading(false), 200)
      return () => clearTimeout(timer)
    }
  }, [localLoading, oauthLoading])

  // Clear user state when no auth found
  useEffect(() => {
    if (!localLoading && !oauthLoading && !localAuthUser && !oauthUser) {
      setLocalUser(null)
    }
  }, [localLoading, oauthLoading, localAuthUser, oauthUser])

  const login = useCallback((user: User) => {
    setLocalUser(user)
  }, [])

  const logout = useCallback(() => {
    setLocalToken(null)
    setLocalUser(null)
    // Reload page to clear all auth state
    window.location.reload()
  }, [])

  const value = useMemo(() => ({
    user: localUser,
    isAuthenticated: !!localUser,
    isLoading,
    login,
    logout,
  }), [localUser, isLoading, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')

  const navigate = useNavigate()
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } = options ?? {}

  useEffect(() => {
    if (redirectOnUnauthenticated && !ctx.isLoading && !ctx.isAuthenticated) {
      const currentPath = window.location.hash
      if (!currentPath.includes(redirectPath)) {
        navigate(redirectPath)
      }
    }
  }, [redirectOnUnauthenticated, ctx.isLoading, ctx.isAuthenticated, navigate, redirectPath])

  return ctx
}

export { setLocalToken, getLocalToken }

// Generate a unique ID for guest/email users
export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}
