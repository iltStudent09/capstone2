# Customer Manager Architecture Decisions

This document captures the selected implementation approach for state, CRUD logic, hooks, and form structure.

## 1) Where customer state will live

**Decision:** Use a **Context Provider** for customer domain state.

- Add a `CustomerProvider` that wraps the customer routes/app shell.
- Expose customer state and actions through a `useCustomerContext()` hook.
- Keep customer data, loading flags, and domain errors centralized.

Why this choice:
- Avoids prop drilling between list/add/edit pages.
- Keeps customer data consistent across routes.
- Gives one domain-level source of truth.

## 2) How CRUD operations will be managed

**Decision:** Use **`useReducer`** for customer domain state and keep tiny UI-only bits in **`useState`**.

- `useReducer`: customer entities, loading state, request errors, and CRUD transitions.
- `useState`: local/transient UI details (input focus, simple toggles, temporary button state).

Why this choice:
- Reducer gives predictable state transitions for async CRUD flows.
- `useState` keeps local view concerns lightweight and simple.

## 3) Custom hooks strategy

**Decision:** Use **both together**:

1. `useApi` (generic transport layer)
   - Handles shared request concerns (`GET/POST/PUT/DELETE`, base path, common error shaping).
2. `useCustomers` (domain hook)
   - Orchestrates customer CRUD behavior and dispatches reducer actions.

Why this choice:
- Good separation of concerns: transport vs business/domain logic.
- Reusable network layer plus clear customer-focused behavior.

## 4) Form strategy for add and edit

**Decision:** Use **one shared `CustomerForm` component** with **thin page wrappers** for add/edit behavior.

- `AddCustomerPage`: passes empty initial values and create submit handler.
- `EditCustomerPage`: loads by id, passes prefilled values and update submit handler.
- `CustomerForm`: owns rendering/field inputs/validation display only.

Why this choice:
- Prevents duplicate form markup and validation drift.
- Maintains one consistent UX for create/edit.
- Keeps route-level behavior explicit while reusing form UI.

## Suggested project structure

```text
customer-app/src/
  context/
    CustomerContext.tsx
  hooks/
    useApi.ts
    useCustomers.ts
  components/
    CustomerForm.tsx
  pages/
    CustomerListPage.tsx
    AddCustomerPage.tsx
    EditCustomerPage.tsx
```

## Implementation notes

- Use reducer actions such as:
  - `FETCH_CUSTOMERS_START | SUCCESS | ERROR`
  - `CREATE_CUSTOMER_START | SUCCESS | ERROR`
  - `UPDATE_CUSTOMER_START | SUCCESS | ERROR`
- Keep validation rules shared and reusable for add/edit.
- Prefer route wrappers to keep form component presentational.
