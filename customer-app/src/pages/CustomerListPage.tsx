import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomerList, { type SortableField } from '../components/CustomerList'
import { useCustomers } from '../hooks/useCustomers'
import type { Customer } from '../types/customer'

const PAGE_SIZE = 10
const SORT_STORAGE_KEY = 'customer-list-sort'

function readStoredSort(): { field: SortableField; direction: 'asc' | 'desc' } {
  const fallback = { field: 'name' as SortableField, direction: 'asc' as const }

  if (typeof window === 'undefined') {
    return fallback
  }

  const rawStoredSort = window.localStorage.getItem(SORT_STORAGE_KEY)

  if (!rawStoredSort) {
    return fallback
  }

  try {
    const parsedSort = JSON.parse(rawStoredSort) as {
      field?: SortableField
      direction?: 'asc' | 'desc'
    }

    if (
      parsedSort.field &&
      ['name', 'email', 'phone', 'city', 'state'].includes(parsedSort.field) &&
      parsedSort.direction &&
      ['asc', 'desc'].includes(parsedSort.direction)
    ) {
      return {
        field: parsedSort.field,
        direction: parsedSort.direction,
      }
    }
  } catch {
    return fallback
  }

  return fallback
}

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL')
  const [sortField, setSortField] = useState<SortableField>(
    () => readStoredSort().field,
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    () => readStoredSort().direction,
  )
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    void fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStateFilter])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      SORT_STORAGE_KEY,
      JSON.stringify({ field: sortField, direction: sortDirection }),
    )
  }, [sortField, sortDirection])

  const availableStates = useMemo(() => {
    return Array.from(new Set(customers.map((customer) => customer.state))).sort(
      (firstState, secondState) => firstState.localeCompare(secondState),
    )
  }, [customers])

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return customers.filter((customer) => {
      const matchesState =
        selectedStateFilter === 'ALL' || customer.state === selectedStateFilter

      const matchesSearch =
        normalizedSearch.length === 0 ||
        [customer.name, customer.email, customer.phone, customer.city]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesState && matchesSearch
    })
  }, [customers, searchQuery, selectedStateFilter])

  const sortedCustomers = useMemo(() => {
    const nextCustomers = [...filteredCustomers]

    nextCustomers.sort((firstCustomer, secondCustomer) => {
      const firstValue = firstCustomer[sortField]
      const secondValue = secondCustomer[sortField]
      const compareResult = String(firstValue).localeCompare(String(secondValue), undefined, {
        sensitivity: 'base',
      })

      return sortDirection === 'asc' ? compareResult : compareResult * -1
    })

    return nextCustomers
  }, [filteredCustomers, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / PAGE_SIZE))
  const boundedCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    if (currentPage !== boundedCurrentPage) {
      setCurrentPage(boundedCurrentPage)
    }
  }, [currentPage, boundedCurrentPage])

  const paginatedCustomers = useMemo(() => {
    const startIndex = (boundedCurrentPage - 1) * PAGE_SIZE
    return sortedCustomers.slice(startIndex, startIndex + PAGE_SIZE)
  }, [boundedCurrentPage, sortedCustomers])

  const handleRequestSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection((previousDirection) =>
        previousDirection === 'asc' ? 'desc' : 'asc',
      )
      return
    }

    setSortField(field)
    setSortDirection('asc')
  }

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

      {!isLoading && !errorMessage && (
        <section className="list-controls" aria-label="Customer list controls">
          <label>
            Search
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search name, email, phone, city"
            />
          </label>

          <label>
            Filter by State
            <select
              value={selectedStateFilter}
              onChange={(event) => setSelectedStateFilter(event.target.value)}
            >
              <option value="ALL">All States</option>
              {availableStates.map((stateOption) => (
                <option key={stateOption} value={stateOption}>
                  {stateOption}
                </option>
              ))}
            </select>
          </label>
        </section>
      )}

      {isLoading && <p>Loading customers...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}
      {!isLoading && deleteErrorMessage && <p>{deleteErrorMessage}</p>}

      {!isLoading && !errorMessage && customers.length === 0 && (
        <p>No customers found.</p>
      )}

      {!isLoading && !errorMessage && customers.length > 0 && sortedCustomers.length === 0 && (
        <p>No customers match the current search/filter.</p>
      )}

      {!isLoading && !errorMessage && sortedCustomers.length > 0 && (
        <>
          <CustomerList
            customers={paginatedCustomers}
            deletingCustomerId={deletingCustomerId}
            onDeleteCustomer={handleDeleteCustomer}
            sortField={sortField}
            sortDirection={sortDirection}
            onRequestSort={handleRequestSort}
          />

          <nav className="pagination" aria-label="Customer pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={boundedCurrentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {boundedCurrentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={boundedCurrentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </main>
  )
}

export default CustomerListPage