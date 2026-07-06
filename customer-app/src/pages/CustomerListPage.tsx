import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomerList from '../components/CustomerList'
import { useCustomers } from '../hooks/useCustomers'
import type { Customer } from '../types/customer'

function CustomerListPage() {
  const {
    customers,
    isLoading,
    errorMessage,
    fetchCustomers,
    deleteCustomer,
  } = useCustomers()
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(
    null,
  )
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('')

  useEffect(() => {
    void fetchCustomers()
  }, [fetchCustomers])

  const handleDeleteCustomer = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete customer ${customer.name}? This cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    setDeletingCustomerId(customer.id)
    setDeleteErrorMessage('')

    try {
      await deleteCustomer(customer.id)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete customer'
      setDeleteErrorMessage(message)
    } finally {
      setDeletingCustomerId(null)
    }
  }

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
      {!isLoading && deleteErrorMessage && <p>{deleteErrorMessage}</p>}

      {!isLoading && !errorMessage && customers.length === 0 && (
        <p>No customers found.</p>
      )}

      {!isLoading && !errorMessage && customers.length > 0 && (
        <CustomerList
          customers={customers}
          deletingCustomerId={deletingCustomerId}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}
    </main>
  )
}

export default CustomerListPage