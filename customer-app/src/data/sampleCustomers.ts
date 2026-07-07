import type { Customer } from '../types/customer'

export const sampleCustomers: Customer[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-101-2201',
    address: '123 Maple St',
    city: 'Denver',
    state: 'CO',
    zip: '80203',
  },
  {
    id: 2,
    name: 'Brian Lee',
    email: 'brian.lee@example.com',
    phone: '555-102-3344',
    address: '456 Oak Ave',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
  {
    id: 3,
    name: 'Carla Mendes',
    email: 'carla.mendes@example.com',
    phone: '555-103-4455',
    address: '789 Pine Rd',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
  },
]