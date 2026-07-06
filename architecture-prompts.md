# Prompt Library (Aligned to ARCHITECTURE.md)

Use these prompts when working with AI so implementation follows [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1) Scaffold the architecture

```text
Read ARCHITECTURE.md and scaffold the project structure exactly as documented.
Requirements:
- Use CustomerProvider (Context) for customer domain state.
- Use useReducer for customer domain state.
- Keep tiny UI-only state in useState.
- Implement both hooks: useApi (generic) + useCustomers (domain).
- Build one shared CustomerForm component with thin AddCustomerPage/EditCustomerPage wrappers.
Do not add extra features. Keep changes minimal and consistent with existing code style.
```

## 2) Build Customer Context + Reducer

```text
Implement CustomerContext and reducer according to ARCHITECTURE.md.
Include:
- State: customers, loading, error.
- Actions:
  FETCH_CUSTOMERS_START|SUCCESS|ERROR
  CREATE_CUSTOMER_START|SUCCESS|ERROR
  UPDATE_CUSTOMER_START|SUCCESS|ERROR
Expose state + dispatch through a typed useCustomerContext hook.
Do not introduce unrelated global state.
```

## 3) Build useApi hook

```text
Create a reusable useApi hook aligned with ARCHITECTURE.md.
Requirements:
- Base URL should support current app API usage.
- Provide typed helpers for GET/POST/PUT/DELETE.
- Return normalized error shape.
- Keep transport generic (no customer-specific logic).
Add only what current customer feature needs.
```

## 4) Build useCustomers domain hook

```text
Create useCustomers hook using useApi + CustomerContext reducer flow from ARCHITECTURE.md.
Requirements:
- fetchCustomers, createCustomer, updateCustomer.
- Dispatch START/SUCCESS/ERROR actions for each async flow.
- Keep business logic in this hook, not in pages.
- Keep page components thin.
```

## 5) Create shared CustomerForm + wrappers

```text
Refactor forms to match ARCHITECTURE.md:
- Create one shared CustomerForm component for fields + validation UI.
- Add AddCustomerPage wrapper for create behavior.
- Add EditCustomerPage wrapper for load-by-id + update behavior.
- Keep submit behavior mode-specific in wrappers.
Do not duplicate field markup across pages.
```

## 6) Wire routes to wrapper pages

```text
Update routing to use CustomerListPage, AddCustomerPage, and EditCustomerPage under the existing Layout.
Keep route behavior:
- / -> list
- /add -> add wrapper
- /edit/:id -> edit wrapper
Follow ARCHITECTURE.md and avoid adding new routes.
```

## 7) Enforce validation consistency

```text
Implement shared customer validation used by both add and edit flows.
Rules must align with validation.html and ARCHITECTURE.md.
Requirements:
- Required fields: name, email, phone, address, city, state, zip.
- state: 2 uppercase letters.
- zip: supported format (document exact rule in code).
- Normalize input (trim, uppercase state).
Use one shared validation source to avoid validation drift.
```

## 8) Safety check prompt (before merging)

```text
Review current implementation against ARCHITECTURE.md.
Report:
1) What matches the architecture.
2) What diverges.
3) Minimal diffs to realign.
Do not refactor unrelated areas.
```

## 9) Small-step prompt (single file at a time)

```text
Follow ARCHITECTURE.md. Change only one file in this step: <FILE_PATH>.
Explain what changed and why it supports the architecture decisions.
Do not modify other files.
```

## 10) Commit message helper prompt

```text
Generate a concise commit message and bullet summary based on changes made to align with ARCHITECTURE.md.
Format:
- Title (imperative, <=72 chars)
- 3-5 bullets explaining key architecture-aligned changes
```

---

## Quick usage tip

Start prompts with:

```text
Use ARCHITECTURE.md as the source of truth for implementation decisions.
```
