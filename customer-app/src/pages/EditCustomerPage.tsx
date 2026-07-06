import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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

function EditCustomerPage() {
  const { id } = useParams<{ id: string }>()
  const {
    customers,
    isLoading,
    errorMessage,
    getCustomerById,
    updateCustomer,
    clearError,
  } = useCustomers()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CustomerFormData>(emptyForm)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setIsPageLoading(false)
      return
    }

    clearError()

    const existingCustomer = customers.find(
      (customer) => customer.id === Number(id),
    )

    if (existingCustomer) {
      const { name, email, phone, address, city, state: customerState, zip } =
        existingCustomer
      setFormData({
        name,
        email,
        phone,
        address,
        city,
        state: customerState,
        zip,
      })
      setIsPageLoading(false)
      return
    }

    const fetchCustomer = async () => {
      try {
        const customer = await getCustomerById(Number(id))
        const { name, email, phone, address, city, state, zip } = customer
        setFormData({ name, email, phone, address, city, state, zip })
      } catch {
        setIsPageLoading(false)
        return
      }

      setIsPageLoading(false)
    }

    void fetchCustomer()
  }, [id, customers, getCustomerById, clearError])

  const handleUpdateCustomer = async (nextFormData: CustomerFormData) => {
    if (!id) {
      return
    }

    try {
      await updateCustomer(Number(id), nextFormData)

      navigate('/')
    } catch {
      return
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

      {isPageLoading && <p>Loading customer...</p>}

      {!isPageLoading && (
        <CustomerForm
          initialData={formData}
          submitLabel="Update Customer"
          isSubmitting={isLoading}
          onSubmit={handleUpdateCustomer}
          onCancel={() => navigate('/')}
        />
      )}

      {errorMessage && <p>{errorMessage}</p>}
    </main>
  )
}

export default EditCustomerPage