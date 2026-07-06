import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

type CustomerListProps = {
  customers: Customer[]
}

function CustomerList({ customers }: CustomerListProps) {
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
              <Link to={`/edit/${customer.id}`}>Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList