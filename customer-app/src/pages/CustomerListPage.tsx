import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

const API_BASE_URL = '/api'

function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
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
        setCustomers(data)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load customers'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCustomers()
  }, [])

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
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.city}</td>
                <td>{customer.state}</td>
                <td>
                  <Link to={`/edit/${customer.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default CustomerListPage