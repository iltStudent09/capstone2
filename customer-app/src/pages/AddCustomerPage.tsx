import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import type { CustomerFormData } from '../types/customer'

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

function AddCustomerPage() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleCreateCustomer = async (formData: CustomerFormData) => {
    setIsSaving(true)
    setErrorMessage('')

    try {
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

      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create customer'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Add Customer</h1>
        <Link className="button-link secondary" to="/">
          Back to List
        </Link>
      </header>

      <CustomerForm
        initialData={emptyForm}
        submitLabel="Create Customer"
        isSubmitting={isSaving}
        onSubmit={handleCreateCustomer}
        onCancel={() => navigate('/')}
      />

      {errorMessage && <p>{errorMessage}</p>}
    </main>
  )
}

export default AddCustomerPage