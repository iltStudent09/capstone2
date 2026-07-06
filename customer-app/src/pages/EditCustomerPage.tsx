import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
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

function EditCustomerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CustomerFormData>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!id) {
      setErrorMessage('Customer id is required')
      setIsLoading(false)
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
  }, [id])

  const handleUpdateCustomer = async (nextFormData: CustomerFormData) => {
    if (!id) {
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: Number(id), ...nextFormData }),
      })

      if (!response.ok) {
        throw new Error('Unable to update customer')
      }

      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to update customer'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Edit Customer</h1>
        <Link className="button-link secondary" to="/">
          Back to List
        </Link>
      </header>

      {isLoading && <p>Loading customer...</p>}

      {!isLoading && (
        <CustomerForm
          initialData={formData}
          submitLabel="Update Customer"
          isSubmitting={isSaving}
          onSubmit={handleUpdateCustomer}
          onCancel={() => navigate('/')}
        />
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </main>
  )
}

export default EditCustomerPage