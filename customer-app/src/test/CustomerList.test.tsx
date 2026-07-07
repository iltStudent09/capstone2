import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
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
