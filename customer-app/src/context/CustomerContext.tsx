import { createContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Customer } from '../types/customer'

export type CustomerState = {
  customers: Customer[]
}

export type CustomerAction =
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: number }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }

const initialState: CustomerState = {
  customers: [],
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