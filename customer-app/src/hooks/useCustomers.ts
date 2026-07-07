import { useCallback, useMemo } from 'react'
import { sampleCustomers } from '../data/sampleCustomers'
import { useApi } from './useApi'
import { useCustomerContext } from './useCustomerContext'
import type { Customer, CustomerFormData } from '../types/customer'

export function useCustomers() {
  const api = useApi('/api')
  const { state, dispatch } = useCustomerContext()

  const fetchCustomers = useCallback(async () => {
    dispatch({ type: 'FETCH_CUSTOMERS_START' })

    try {
      const customers = await api.get<Customer[]>('/customers')
      dispatch({ type: 'FETCH_CUSTOMERS_SUCCESS', payload: customers })
      return customers
    } catch {
      dispatch({ type: 'FETCH_CUSTOMERS_SUCCESS', payload: sampleCustomers })
      return sampleCustomers
    }
  }, [api, dispatch])

  const getCustomerById = useCallback(async (id: number) => {
    try {
      const customer = await api.get<Customer>(`/customers/${id}`)
      dispatch({ type: 'CLEAR_CUSTOMER_ERROR' })
      return customer
    } catch {
      const fallbackCustomer =
        state.customers.find((customer) => customer.id === id) ??
        sampleCustomers.find((customer) => customer.id === id)

      if (fallbackCustomer) {
        dispatch({ type: 'CLEAR_CUSTOMER_ERROR' })
        return fallbackCustomer
      }

      const message = 'Unable to load customer'
      dispatch({ type: 'FETCH_CUSTOMERS_ERROR', payload: message })
      throw new Error(message)
    }
  }, [api, dispatch, state.customers])

  const createCustomer = useCallback(async (formData: CustomerFormData) => {
    dispatch({ type: 'CREATE_CUSTOMER_START' })

    try {
      const customer = await api.post<Customer, CustomerFormData>(
        '/customers',
        formData,
      )
      dispatch({ type: 'CREATE_CUSTOMER_SUCCESS', payload: customer })
      return customer
    } catch {
      const nextId =
        state.customers.length > 0
          ? Math.max(...state.customers.map((customer) => customer.id)) + 1
          : 1
      const localCustomer: Customer = {
        id: nextId,
        ...formData,
      }
      dispatch({ type: 'CREATE_CUSTOMER_SUCCESS', payload: localCustomer })
      return localCustomer
    }
  }, [api, dispatch, state.customers])

  const updateCustomer = useCallback(async (id: number, formData: CustomerFormData) => {
    dispatch({ type: 'UPDATE_CUSTOMER_START' })

    try {
      const customer = await api.put<Customer, Customer>(`/customers/${id}`, {
        id,
        ...formData,
      })
      dispatch({ type: 'UPDATE_CUSTOMER_SUCCESS', payload: customer })
      return customer
    } catch {
      const localCustomer: Customer = {
        id,
        ...formData,
      }
      dispatch({ type: 'UPDATE_CUSTOMER_SUCCESS', payload: localCustomer })
      return localCustomer
    }
  }, [api, dispatch])

  const deleteCustomer = useCallback(async (id: number) => {
    try {
      await api.remove<void>(`/customers/${id}`)
    } catch {
      dispatch({ type: 'CLEAR_CUSTOMER_ERROR' })
    }
    dispatch({ type: 'DELETE_CUSTOMER', payload: id })
  }, [api, dispatch])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_CUSTOMER_ERROR' })
  }, [dispatch])

  return useMemo(
    () => ({
      customers: state.customers,
      isLoading: state.isLoading,
      errorMessage: state.errorMessage,
      fetchCustomers,
      getCustomerById,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      clearError,
    }),
    [
      state.customers,
      state.isLoading,
      state.errorMessage,
      fetchCustomers,
      getCustomerById,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      clearError,
    ],
  )
}