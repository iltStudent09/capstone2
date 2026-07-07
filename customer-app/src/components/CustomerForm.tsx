import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { CustomerFormData } from '../types/customer'

type CustomerFormErrors = Partial<Record<keyof CustomerFormData, string>>

type CustomerFormProps = {
  initialData?: CustomerFormData
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (data: CustomerFormData) => Promise<void>
  onCancel?: () => void
}

const emptyForm: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

const fieldOrder: Array<keyof CustomerFormData> = [
  'name',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'zip',
]

const stateAbbreviations = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL',
  'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT',
  'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
])

function normalizeFormData(data: CustomerFormData): CustomerFormData {
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim().toUpperCase(),
    zip: data.zip.trim(),
  }
}

function validateFormData(data: CustomerFormData): CustomerFormErrors {
  const errors: CustomerFormErrors = {}

  if (!data.name) {
    errors.name = 'Name is required.'
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  } else if (data.name.length > 80) {
    errors.name = 'Name must be 80 characters or fewer.'
  } else if (!/^[A-Za-z][A-Za-z\s'.-]*$/.test(data.name)) {
    errors.name = 'Name contains invalid characters.'
  }

  if (!data.email) {
    errors.email = 'Email is required.'
  } else if (data.email.length > 254) {
    errors.email = 'Email is too long.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!data.phone) {
    errors.phone = 'Phone is required.'
  } else {
    const digitsOnly = data.phone.replace(/\D/g, '')
    const isTenDigits = digitsOnly.length === 10
    const isUsElevenDigits = digitsOnly.length === 11 && digitsOnly.startsWith('1')

    if (!isTenDigits && !isUsElevenDigits) {
      errors.phone = 'Enter a valid phone number.'
    }
  }

  if (!data.address) {
    errors.address = 'Address is required.'
  } else if (data.address.length < 5) {
    errors.address = 'Address must be at least 5 characters.'
  } else if (data.address.length > 120) {
    errors.address = 'Address must be 120 characters or fewer.'
  }

  if (!data.city) {
    errors.city = 'City is required.'
  } else if (data.city.length < 2) {
    errors.city = 'City must be at least 2 characters.'
  } else if (data.city.length > 80) {
    errors.city = 'City must be 80 characters or fewer.'
  } else if (!/^[A-Za-z][A-Za-z\s'.-]*$/.test(data.city)) {
    errors.city = 'City contains invalid characters.'
  }

  if (!data.state) {
    errors.state = 'State is required.'
  } else if (!/^[A-Z]{2}$/.test(data.state) || !stateAbbreviations.has(data.state)) {
    errors.state = 'State must be a valid 2-letter abbreviation.'
  }

  if (!data.zip) {
    errors.zip = 'ZIP is required.'
  } else if (!/^\d{5}(-\d{4})?$/.test(data.zip)) {
    errors.zip = 'ZIP must be 5 digits or ZIP+4 format.'
  }

  return errors
}

function CustomerForm({
  initialData,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(initialData ?? emptyForm)
  const [fieldErrors, setFieldErrors] = useState<CustomerFormErrors>({})

  const hasErrors = useMemo(
    () => fieldOrder.some((field) => Boolean(fieldErrors[field])),
    [fieldErrors],
  )

  const handleFieldChange = (field: keyof CustomerFormData, value: string) => {
    const nextValue = field === 'state' ? value.toUpperCase() : value

    setFormData((previous) => ({
      ...previous,
      [field]: nextValue,
    }))

    setFieldErrors((previous) => {
      if (!previous[field]) {
        return previous
      }

      return {
        ...previous,
        [field]: undefined,
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedData = normalizeFormData(formData)
    const errors = validateFormData(normalizedData)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormData(normalizedData)
      return
    }

    setFieldErrors({})
    setFormData(normalizedData)
    await onSubmit(normalizedData)
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <label>
        Name
        <input
          type="text"
          value={formData.name}
          onChange={(event) => handleFieldChange('name', event.target.value)}
        />
        {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
      </label>

      <label>
        Email
        <input
          type="email"
          value={formData.email}
          onChange={(event) => handleFieldChange('email', event.target.value)}
        />
        {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
      </label>

      <label>
        Phone
        <input
          type="text"
          value={formData.phone}
          onChange={(event) => handleFieldChange('phone', event.target.value)}
        />
        {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
      </label>

      <label>
        Address
        <input
          type="text"
          value={formData.address}
          onChange={(event) => handleFieldChange('address', event.target.value)}
        />
        {fieldErrors.address && <p className="field-error">{fieldErrors.address}</p>}
      </label>

      <div className="form-grid">
        <label>
          City
          <input
            type="text"
            value={formData.city}
            onChange={(event) => handleFieldChange('city', event.target.value)}
          />
          {fieldErrors.city && <p className="field-error">{fieldErrors.city}</p>}
        </label>

        <label>
          State
          <input
            type="text"
            maxLength={2}
            value={formData.state}
            onChange={(event) => handleFieldChange('state', event.target.value)}
          />
          {fieldErrors.state && <p className="field-error">{fieldErrors.state}</p>}
        </label>

        <label>
          ZIP
          <input
            type="text"
            value={formData.zip}
            onChange={(event) => handleFieldChange('zip', event.target.value)}
          />
          {fieldErrors.zip && <p className="field-error">{fieldErrors.zip}</p>}
        </label>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="form-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>

      {hasErrors && <p className="form-note">Please fix the errors above.</p>}
    </form>
  )
}

export default CustomerForm