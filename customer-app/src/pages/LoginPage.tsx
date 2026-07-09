import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'register') {
        await register(email, phone, password)
      } else {
        await login(email, phone, password)
      }
      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : mode === 'register'
            ? 'Unable to create account'
            : 'Unable to login with provided credentials'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <h1>{mode === 'register' ? 'Create Account' : 'Sign In'}</h1>
          <p className="login-subtitle">
            {mode === 'register'
              ? 'Create your account with email, phone number, and password.'
              : 'Use your credentials to access your customer records.'}
          </p>
        </header>

        <div className="login-mode-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'login' ? 'mode-button mode-button-active' : 'mode-button'}
            onClick={() => {
              setMode('login')
              setErrorMessage('')
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'mode-button mode-button-active' : 'mode-button'}
            onClick={() => {
              setMode('register')
              setErrorMessage('')
            }}
          >
            Create Account
          </button>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'register'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'register'
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <section className="login-demo" aria-label="Demo credentials">
          <h2>Demo Accounts</h2>
          <ul>
            <li>admin@company.com / (555) 900-0001 / admin123</li>
            <li>user1@company.com / (555) 900-0002 / user123</li>
            <li>user2@company.com / (555) 900-0003 / user123</li>
          </ul>
        </section>

        {errorMessage && <p className="login-error">{errorMessage}</p>}
      </section>
    </main>
  )
}

export default LoginPage
