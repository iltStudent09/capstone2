import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'customer-manager-theme'

function resolveInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function Layout() {
  const [theme, setTheme] = useState<ThemeMode>(resolveInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="layout-container header-inner">
          <h1 className="app-title">Customer Manager</h1>
          <div className="header-actions">
            <nav aria-label="Primary" className="main-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
                end
              >
                Customer List
              </NavLink>
              <NavLink
                to="/add"
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
              >
                Add Customer
              </NavLink>
            </nav>

            <button
              type="button"
              className="theme-toggle"
              onClick={() =>
                setTheme((previousTheme) =>
                  previousTheme === 'dark' ? 'light' : 'dark',
                )
              }
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="layout-main">
        <div className="layout-container content-padding">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout