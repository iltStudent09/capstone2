import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type AuthUser = {
  id: number
  name: string
  email: string
  phone: string
  role: 'admin' | 'user'
}

type AuthContextValue = {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, phone: string, password: string) => Promise<void>
  register: (email: string, phone: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'customer-manager-auth-user'

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawUser = window.localStorage.getItem(STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    const parsedUser = JSON.parse(rawUser) as AuthUser

    if (
      typeof parsedUser?.id === 'number' &&
      typeof parsedUser?.email === 'string' &&
      typeof parsedUser?.phone === 'string' &&
      (parsedUser?.role === 'admin' || parsedUser?.role === 'user')
    ) {
      return parsedUser
    }
  } catch {
    return null
  }

  return null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(readStoredUser)

  const login = useCallback(async (email: string, phone: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      }),
    })

    if (!response.ok) {
      throw new Error('Invalid email, phone number, or password')
    }

    const user = (await response.json()) as AuthUser

    setCurrentUser(user)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }, [])

  const register = useCallback(async (email: string, phone: string, password: string) => {
    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      }),
    })

    if (!registerResponse.ok) {
      const registerMessage =
        registerResponse.status === 409
          ? 'An account with this email or phone already exists'
          : 'Unable to create account'
      throw new Error(registerMessage)
    }

    await login(email, phone, password)
  }, [login])

  const logout = useCallback(() => {
    setCurrentUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout,
    }),
    [currentUser, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
