import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

type CustomerListProps = {
  customers: Customer[]
  deletingCustomerId?: number | null
  onDeleteCustomer: (customer: Customer) => void
}

function CustomerList({
  customers,
  deletingCustomerId = null,
  onDeleteCustomer,
}: CustomerListProps) {
  return (
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
              <div className="table-actions">
                <Link to={`/edit/${customer.id}`}>Edit</Link>
                <button
                  type="button"
                  className="table-delete"
                  onClick={() => onDeleteCustomer(customer)}
                  disabled={deletingCustomerId === customer.id}
                >
                  {deletingCustomerId === customer.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList