export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  createdByUserId?: number
  updatedByUserId?: number
}

export type CustomerFormData = Omit<Customer, 'id'>
