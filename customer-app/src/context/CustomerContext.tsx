import { createContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Customer } from '../types/customer'

export type CustomerState = {
  customers: Customer[]
  isLoading: boolean
  errorMessage: string
}

export type CustomerAction =
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: number }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'FETCH_CUSTOMERS_START' }
  | { type: 'FETCH_CUSTOMERS_SUCCESS'; payload: Customer[] }
  | { type: 'FETCH_CUSTOMERS_ERROR'; payload: string }
  | { type: 'CREATE_CUSTOMER_START' }
  | { type: 'CREATE_CUSTOMER_SUCCESS'; payload: Customer }
  | { type: 'CREATE_CUSTOMER_ERROR'; payload: string }
  | { type: 'UPDATE_CUSTOMER_START' }
  | { type: 'UPDATE_CUSTOMER_SUCCESS'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER_ERROR'; payload: string }
  | { type: 'CLEAR_CUSTOMER_ERROR' }

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  errorMessage: '',
}

export function customerReducer(
  state: CustomerState,
  action: CustomerAction,
): CustomerState {
  switch (action.type) {
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload],
      }
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
      }
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload,
        ),
      }
    case 'SET_CUSTOMERS':
      return {
        ...state,
        customers: action.payload,
      }
    case 'FETCH_CUSTOMERS_START':
    case 'CREATE_CUSTOMER_START':
    case 'UPDATE_CUSTOMER_START':
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      }
    case 'FETCH_CUSTOMERS_SUCCESS':
      return {
        ...state,
        customers: action.payload,
        isLoading: false,
        errorMessage: '',
      }
    case 'CREATE_CUSTOMER_SUCCESS':
      return {
        ...state,
        customers: [...state.customers, action.payload],
        isLoading: false,
        errorMessage: '',
      }
    case 'UPDATE_CUSTOMER_SUCCESS':
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
        isLoading: false,
        errorMessage: '',
      }
    case 'FETCH_CUSTOMERS_ERROR':
    case 'CREATE_CUSTOMER_ERROR':
    case 'UPDATE_CUSTOMER_ERROR':
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      }
    case 'CLEAR_CUSTOMER_ERROR':
      return {
        ...state,
        errorMessage: '',
      }
    default:
      return state
  }
}

type CustomerContextValue = {
  state: CustomerState
  dispatch: Dispatch<CustomerAction>
}

export const CustomerContext = createContext<CustomerContextValue | undefined>(
  undefined,
)

type CustomerProviderProps = {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [state, dispatch] = useReducer(customerReducer, initialState)

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  )
}