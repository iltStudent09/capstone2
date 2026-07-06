import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomers } from '../hooks/useCustomers'
import type { CustomerFormData } from '../types/customer'

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
  const { createCustomer, isLoading, errorMessage, clearError } = useCustomers()
  const navigate = useNavigate()

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleCreateCustomer = async (formData: CustomerFormData) => {
    try {
      await createCustomer(formData)

      navigate('/')
    } catch {
      return
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
        isSubmitting={isLoading}
        onSubmit={handleCreateCustomer}
        onCancel={() => navigate('/')}
      />

      {errorMessage && <p>{errorMessage}</p>}
    </main>
  )
}

export default AddCustomerPage