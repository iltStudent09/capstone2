import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerList from '../components/CustomerList'
import CustomerListPage from '../pages/CustomerListPage'
import type { Customer } from '../types/customer'
import { useCustomers } from '../hooks/useCustomers'

vi.mock('../hooks/useCustomers', () => ({
  useCustomers: vi.fn(),
}))

const mockedUseCustomers = vi.mocked(useCustomers)

const customers: Customer[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-1111',
    address: '123 Main St',
    city: 'Denver',
    state: 'CO',
    zip: '80203',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '555-2222',
    address: '456 Elm St',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
]

describe('CustomerList', () => {
  it('renders customer names and edit links', () => {
    render(
      <MemoryRouter>
        <CustomerList customers={customers} onDeleteCustomer={vi.fn()} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()

    const editLinks = screen.getAllByRole('link', { name: 'Edit' })
    expect(editLinks[0]).toHaveAttribute('href', '/edit/1')
    expect(editLinks[1]).toHaveAttribute('href', '/edit/2')
  })

  it('calls delete callback when delete is clicked', async () => {
    const user = userEvent.setup()
    const onDeleteCustomer = vi.fn()

    render(
      <MemoryRouter>
        <CustomerList customers={customers} onDeleteCustomer={onDeleteCustomer} />
      </MemoryRouter>,
    )

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0])

    expect(onDeleteCustomer).toHaveBeenCalledTimes(1)
    expect(onDeleteCustomer).toHaveBeenCalledWith(customers[0])
  })
})

describe('CustomerListPage', () => {
  it('persists selected sort across remounts', async () => {
    const user = userEvent.setup()

    mockedUseCustomers.mockReturnValue({
      customers: [
        {
          id: 1,
          name: 'Cora Lane',
          email: 'cora@example.com',
          phone: '(555) 333-3333',
          address: '123 Main St',
          city: 'Denver',
          state: 'CO',
          zip: '80203',
        },
        {
          id: 2,
          name: 'Alice West',
          email: 'alice@example.com',
          phone: '(555) 111-1111',
          address: '456 Elm St',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
        },
        {
          id: 3,
          name: 'Ben York',
          email: 'ben@example.com',
          phone: '(555) 222-2222',
          address: '789 Pine St',
          city: 'Boston',
          state: 'MA',
          zip: '02108',
        },
      ],
      isLoading: false,
      errorMessage: '',
      fetchCustomers: vi.fn(),
      getCustomerById: vi.fn(),
      createCustomer: vi.fn(),
      updateCustomer: vi.fn(),
      deleteCustomer: vi.fn(),
      clearError: vi.fn(),
    })

    const firstRender = render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /^Email/ }))
    await user.click(screen.getByRole('button', { name: /^Email/ }))

    const savedSort = window.localStorage.getItem('customer-list-sort')
    expect(savedSort).toBe('{"field":"email","direction":"desc"}')

    const firstTableRows = screen.getAllByRole('row')
    expect(within(firstTableRows[1]).getByText('Cora Lane')).toBeInTheDocument()

    firstRender.unmount()

    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /^Email/ })).toHaveTextContent('↓')

    const secondTableRows = screen.getAllByRole('row')
    expect(within(secondTableRows[1]).getByText('Cora Lane')).toBeInTheDocument()
  })

  it('shows empty state when there are no customers', () => {
    mockedUseCustomers.mockReturnValue({
      customers: [],
      isLoading: false,
      errorMessage: '',
      fetchCustomers: vi.fn(),
      getCustomerById: vi.fn(),
      createCustomer: vi.fn(),
      updateCustomer: vi.fn(),
      deleteCustomer: vi.fn(),
      clearError: vi.fn(),
    })

    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('No customers found.')).toBeInTheDocument()
  })
})
