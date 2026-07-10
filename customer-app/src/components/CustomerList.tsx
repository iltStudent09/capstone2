import { Link } from 'react-router-dom'
import type { Customer } from '../types/customer'

export type SortableField = 'name' | 'email' | 'phone' | 'city' | 'state'

type CustomerListProps = {
  customers: Customer[]
  deletingCustomerId?: number | null
  onDeleteCustomer: (customer: Customer) => void
  canDelete?: boolean
  showOwner?: boolean
  currentUserId?: number
  sortField?: SortableField
  sortDirection?: 'asc' | 'desc'
  onRequestSort?: (field: SortableField) => void
}

function CustomerList({
  customers,
  deletingCustomerId = null,
  onDeleteCustomer,
  canDelete = true,
  showOwner = false,
  currentUserId,
  sortField,
  sortDirection,
  onRequestSort,
}: CustomerListProps) {
  const getOwnerLabel = (customer: Customer) => {
    if (!customer.createdByUserId) {
      return 'Unknown'
    }

    if (customer.createdByUserId === currentUserId) {
      return 'My Account'
    }

    return `User #${customer.createdByUserId}`
  }

  const renderSortableHeader = (label: string, field: SortableField) => {
    if (!onRequestSort) {
      return label
    }

    const isCurrentSortField = sortField === field
    const indicator =
      isCurrentSortField && sortDirection === 'asc'
        ? ' ↑'
        : isCurrentSortField && sortDirection === 'desc'
          ? ' ↓'
          : ''

    return (
      <button
        type="button"
        className="table-sort"
        onClick={() => onRequestSort(field)}
      >
        {label}
        {indicator}
      </button>
    )
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>{renderSortableHeader('Name', 'name')}</th>
          <th>{renderSortableHeader('Email', 'email')}</th>
          <th>{renderSortableHeader('Phone', 'phone')}</th>
          <th>{renderSortableHeader('City', 'city')}</th>
          <th>{renderSortableHeader('State', 'state')}</th>
          {showOwner && <th>Owner</th>}
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
            {showOwner && <td>{getOwnerLabel(customer)}</td>}
            <td>
              <div className="table-actions">
                <Link to={`/edit/${customer.id}`}>Edit</Link>
                {canDelete && (
                  <button
                    type="button"
                    className="table-delete"
                    onClick={() => onDeleteCustomer(customer)}
                    disabled={deletingCustomerId === customer.id}
                  >
                    {deletingCustomerId === customer.id ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList