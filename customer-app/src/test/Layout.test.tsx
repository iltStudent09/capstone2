import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../hooks/useAuth'

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout theme behavior', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.unstubAllGlobals()
    mockedUseAuth.mockReturnValue({
      currentUser: {
        id: 1,
        name: 'System Admin',
        email: 'admin@company.com',
        phone: '(555) 900-0001',
        role: 'admin',
      },
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('loads saved dark theme and toggles/persists to light', async () => {
    const user = userEvent.setup()

    window.localStorage.setItem('customer-manager-theme', 'dark')
    mockMatchMedia(false)

    renderLayout()

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Light Mode' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Light Mode' }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(window.localStorage.getItem('customer-manager-theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Dark Mode' })).toBeInTheDocument()
  })

  it('defaults to dark when system preference is dark and no saved theme exists', () => {
    mockMatchMedia(true)

    renderLayout()

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(window.localStorage.getItem('customer-manager-theme')).toBe('dark')
  })
})
