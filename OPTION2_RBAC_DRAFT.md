# Option 2 Draft: JSON Server + Middleware Guards (Single Admin, Many Users)

This draft is designed for your current stack (React + TypeScript + Vite + JSON Server), with **server-enforced authorization** while staying lightweight.

---

## Goals

- Exactly **one admin** account.
- Many regular users.
- **Admin** can:
  - see all customer entries,
  - delete any customer entry.
- **User** can:
  - see only their own entries,
  - create entries owned by themselves,
  - edit only their own entries,
  - cannot delete.

---

## 1) Data Model Changes

Update `db.json` to include users and ownership metadata.

### Users collection

```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@company.com",
      "password": "admin123",
      "role": "admin",
      "name": "System Admin"
    },
    {
      "id": 2,
      "email": "user1@company.com",
      "password": "user123",
      "role": "user",
      "name": "User One"
    }
  ]
}
```

### Customers ownership fields

Add these fields to each customer:
- `createdByUserId: number`
- `updatedByUserId: number` (optional, but useful)

Example:

```json
{
  "id": 101,
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "(555) 101-2201",
  "address": "123 Maple St",
  "city": "Denver",
  "state": "CO",
  "zip": "80203",
  "createdByUserId": 2,
  "updatedByUserId": 2
}
```

---

## 2) Auth Strategy for JSON Server

Because JSON Server has no real auth, use a lightweight header-based approach for development:

- Client sends `x-user-id` and `x-user-role` on every request.
- Middleware validates these values against `users` in `db.json`.
- Middleware enforces access rules server-side.

> Note: This is acceptable for capstone/demo. Not production secure.

---

## 3) Middleware Rules (Authorization Matrix)

### `GET /customers`
- Admin: return all customers.
- User: return only customers where `createdByUserId === currentUser.id`.

### `GET /customers/:id`
- Admin: allowed.
- User: allowed only if record owner matches current user.

### `POST /customers`
- Admin: allowed.
- User: allowed.
- Server should force `createdByUserId = currentUser.id` regardless of payload.

### `PUT/PATCH /customers/:id`
- Admin: allowed.
- User: allowed only on own records.
- Server should set `updatedByUserId = currentUser.id`.

### `DELETE /customers/:id`
- Admin: allowed.
- User: blocked with `403`.

### `POST /users`
- Enforce single admin:
  - If payload role = `admin` and an admin already exists, reject with `409`.

---

## 4) Backend Setup Draft

Create a custom JSON Server entry file (example: `server.js`) instead of plain `json-server --watch db.json`.

High-level flow:

1. `jsonServer.create()`
2. `jsonServer.defaults()`
3. `jsonServer.router('db.json')`
4. custom auth/guard middleware
5. route rewriting/filter logic
6. `server.use(router)`

Pseudo-example (trimmed):

```js
server.use((req, res, next) => {
  const userId = Number(req.header('x-user-id'))
  const role = req.header('x-user-role')

  const db = router.db
  const user = db.get('users').find({ id: userId }).value()

  if (!user || user.role !== role) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.currentUser = user
  next()
})
```

Then add per-method/customer checks.

---

## 5) Frontend Changes Draft

### Auth context
Add an `AuthContext` with:
- `currentUser`
- `login(email, password)`
- `logout()`

Persist user in localStorage for page refresh.

### API hook updates
In `useApi.ts`, attach headers from current user:
- `x-user-id`
- `x-user-role`

### Customers hook updates
- Keep existing API calls.
- Remove client-side assumptions about universal access.
- Let server drive access with 401/403/404 behavior.

### UI behavior
- Hide delete button for non-admin users.
- Optional: show role badge (`Admin` / `User`).
- Optional: route guard for unauthenticated users.

---

## 6) Files You’d Add/Change

### Add
- `server.js` (JSON Server middleware)
- `customer-app/src/context/AuthContext.tsx`
- `customer-app/src/hooks/useAuth.ts`
- `customer-app/src/pages/LoginPage.tsx` (optional but recommended)

### Update
- `package.json` root `api` script to run `node server.js`
- `db.json` (users + ownership fields)
- `customer-app/src/hooks/useApi.ts` (auth headers)
- `customer-app/src/hooks/useCustomers.ts` (error handling for 401/403)
- `customer-app/src/components/CustomerList.tsx` (admin-only delete button)
- routing (`App.tsx`) if adding login route/guard

---

## 7) Suggested Incremental Rollout

### Phase A (minimum)
1. Add `users` to `db.json`.
2. Add ownership fields to customers.
3. Add server middleware for read scoping and admin-only delete.
4. Add mock current user in frontend (hardcoded toggle for demo).

### Phase B (better UX)
1. Add real login page against `users` collection.
2. Persist session in localStorage.
3. Add route guard and logout.

### Phase C (hardening)
1. Improve error messages for 401/403.
2. Add tests for role behavior.
3. Enforce single-admin creation rule.

---

## 8) Test Cases to Add

- Admin gets all customers.
- User gets only owned customers.
- User cannot delete (403).
- User cannot update another user’s customer (403).
- Admin can delete any customer (200/204).
- Creating second admin user is rejected (409).

---

## 9) Keep / Drop Menu (for your review)

### Keep now (recommended)
- Header-based auth in dev (`x-user-id`, `x-user-role`)
- Ownership filtering in middleware
- Admin-only delete
- Single-admin rule in `/users`

### Optional now
- Login page
- Route guard
- `updatedByUserId`

### Skip for now
- JWT/password hashing/full production auth
- External auth provider

---

If you want, I can implement **Phase A only** first so you can validate behavior with minimal churn.
