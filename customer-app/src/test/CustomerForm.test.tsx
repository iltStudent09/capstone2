import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerForm from '../components/CustomerForm'
import type { CustomerFormData } from '../types/customer'

const validData: CustomerFormData = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '(555) 111-1111',
  address: '123 Main St',
  city: 'Denver',
  state: 'CO',
  zip: '80203',
}

describe('CustomerForm', () => {
  it('shows validation errors on invalid submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <CustomerForm
        submitLabel="Create Customer"
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Create Customer' }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/name/i), 'Alice')
    await user.type(screen.getByLabelText(/email/i), 'bad-email')
    await user.type(screen.getByLabelText(/phone/i), '5551111111')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Denver')
    await user.type(screen.getByLabelText(/state/i), 'CO')
    await user.type(screen.getByLabelText(/zip/i), '80203')

    await user.click(screen.getByRole('button', { name: 'Create Customer' }))

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears field error when user edits that field', async () => {
    const user = userEvent.setup()

    render(
      <CustomerForm
        submitLabel="Create Customer"
        isSubmitting={false}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Create Customer' }))
    expect(screen.getByText('Name is required.')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/name/i), 'Alice')

    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
  })

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <CustomerForm
        submitLabel="Create Customer"
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByLabelText(/name/i), ' Alice Johnson ')
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.type(screen.getByLabelText(/phone/i), '5551111111')
    await user.type(screen.getByLabelText(/address/i), '123 main st')
    await user.type(screen.getByLabelText(/city/i), 'Denver')
    await user.type(screen.getByLabelText(/state/i), 'co')
    await user.type(screen.getByLabelText(/zip/i), '80203')

    await user.click(screen.getByRole('button', { name: 'Create Customer' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      ...validData,
      name: 'Alice Johnson',
      address: '123 Main St',
      state: 'CO',
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <CustomerForm
        submitLabel="Update Customer"
        isSubmitting={false}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('pre-fills fields in edit mode when initialData is provided', () => {
    render(
      <CustomerForm
        initialData={validData}
        submitLabel="Update Customer"
        isSubmitting={false}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.getByLabelText(/name/i)).toHaveValue('Alice Johnson')
    expect(screen.getByLabelText(/email/i)).toHaveValue('alice@example.com')
    expect(screen.getByLabelText(/phone/i)).toHaveValue('(555) 111-1111')
    expect(screen.getByLabelText(/address/i)).toHaveValue('123 Main St')
    expect(screen.getByLabelText(/city/i)).toHaveValue('Denver')
    expect(screen.getByLabelText(/state/i)).toHaveValue('CO')
    expect(screen.getByLabelText(/zip/i)).toHaveValue('80203')
  })

  it('formats phone while typing and saves formatted value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <CustomerForm
        submitLabel="Create Customer"
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByLabelText(/name/i), 'Alice Johnson')
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.type(screen.getByLabelText(/phone/i), '5551111111')
    await user.type(screen.getByLabelText(/address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Denver')
    await user.type(screen.getByLabelText(/state/i), 'CO')
    await user.type(screen.getByLabelText(/zip/i), '80203')

    expect(screen.getByLabelText(/phone/i)).toHaveValue('(555) 111-1111')

    await user.click(screen.getByRole('button', { name: 'Create Customer' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '(555) 111-1111' }),
    )
  })

  it('does not accept spaces in the email field', async () => {
    const user = userEvent.setup()

    render(
      <CustomerForm
        submitLabel="Create Customer"
        isSubmitting={false}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    await user.type(screen.getByLabelText(/email/i), 'alice smith@example.com')

    expect(screen.getByLabelText(/email/i)).toHaveValue('alicesmith@example.com')
  })
})
