// Create a Customer interface in src/types/customer.ts with the following fields:
// id: number (unique identifier assigned automatically by JSON Server)
// name: string (customer’s full name)
// email: string (email address)
// phone: string (phone number)
// address: string (street address)
// city: string (city)
// state: string (state abbreviation)
// zip: string (ZIP code)
//
// Also create a CustomerFormData type that omits id, since new customers
// don’t have an ID yet because JSON Server assigns it automatically.

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export type CustomerFormData = Omit<Customer, 'id'>;
