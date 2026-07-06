import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Customer, CustomerFormData } from '../types/customer'

const API_BASE_URL = '/api'

const emptyForm: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

function CustomerFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState<CustomerFormData>(emptyForm)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isEditMode || !id) {
      return
    }

    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`)

        if (!response.ok) {
          throw new Error('Unable to load customer')
        }

        const customer: Customer = await response.json()
        const { name, email, phone, address, city, state, zip } = customer
        setFormData({ name, email, phone, address, city, state, zip })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load customer'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCustomer()
  }, [id, isEditMode])

  const handleFieldChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    try {
      if (isEditMode && id) {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: Number(id), ...formData }),
        })

        if (!response.ok) {
          throw new Error('Unable to update customer')
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Unable to create customer')
        }
      }

      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditMode
            ? 'Unable to update customer'
            : 'Unable to create customer'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>{isEditMode ? 'Edit Customer' : 'Add Customer'}</h1>
        <Link className="button-link secondary" to="/">
          Back to List
        </Link>
      </header>

      {isLoading && <p>Loading customer...</p>}

      {!isLoading && (
        <form className="customer-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={formData.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              required
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              value={formData.phone}
              onChange={(event) => handleFieldChange('phone', event.target.value)}
              required
            />
          </label>

          <label>
            Address
            <input
              type="text"
              value={formData.address}
              onChange={(event) => handleFieldChange('address', event.target.value)}
              required
            />
          </label>

          <div className="form-grid">
            <label>
              City
              <input
                type="text"
                value={formData.city}
                onChange={(event) => handleFieldChange('city', event.target.value)}
                required
              />
            </label>

            <label>
              State
              <input
                type="text"
                maxLength={2}
                value={formData.state}
                onChange={(event) =>
                  handleFieldChange('state', event.target.value.toUpperCase())
                }
                required
              />
            </label>

            <label>
              ZIP
              <input
                type="text"
                value={formData.zip}
                onChange={(event) => handleFieldChange('zip', event.target.value)}
                required
              />
            </label>
          </div>

          {errorMessage && <p>{errorMessage}</p>}

          <button type="submit" disabled={isSaving}>
            {isSaving
              ? 'Saving...'
              : isEditMode
                ? 'Update Customer'
                : 'Create Customer'}
          </button>
        </form>
      )}
    </main>
  )
}

export default CustomerFormPage