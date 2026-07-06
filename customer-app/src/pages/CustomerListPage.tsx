import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CustomerList from '../components/CustomerList'
import { useCustomers } from '../hooks/useCustomers'

function CustomerListPage() {
  const { customers, isLoading, errorMessage, fetchCustomers } = useCustomers()

  useEffect(() => {
    void fetchCustomers()
  }, [fetchCustomers])

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

      {!isLoading && !errorMessage && customers.length === 0 && (
        <p>No customers found.</p>
      )}

      {!isLoading && !errorMessage && customers.length > 0 && (
        <CustomerList customers={customers} />
      )}
    </main>
  )
}

export default CustomerListPage