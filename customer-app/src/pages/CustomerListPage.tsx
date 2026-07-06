import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomerList from '../components/CustomerList'
import type { Customer } from '../types/customer'
import { useCustomerContext } from '../hooks/useCustomerContext'

const API_BASE_URL = '/api'

function CustomerListPage() {
  const { state, dispatch } = useCustomerContext()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers`)

        if (!response.ok) {
          throw new Error('Unable to load customers')
        }

        const data: Customer[] = await response.json()
        dispatch({ type: 'SET_CUSTOMERS', payload: data })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load customers'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCustomers()
  }, [dispatch])

  return (
    <main className="page">
      <header className="page-header">
        <h1>Customers</h1>
        <Link className="button-link" to="/add">
          Add Customer
        </Link>
      </header>

      {isLoading && <p>Loading customers...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && state.customers.length === 0 && (
        <p>No customers found.</p>
      )}

      {!isLoading && !errorMessage && state.customers.length > 0 && (
        <CustomerList customers={state.customers} />
      )}
    </main>
  )
}

export default CustomerListPage