# Customer Manager Frontend

React + TypeScript + Vite frontend for managing customer records with list, search/filter/sort, pagination, add/edit/delete flows, and theme persistence.

## Features

- Customer list with sortable columns
- Search and state filter controls
- Pagination (10 customers per page)
- Add and edit forms with field validation and normalization
- Delete with confirmation and error handling
- Dark mode toggle persisted in localStorage
- Sort preference persisted in localStorage
- Error boundary fallback UI

## Architecture

- Routing: React Router (`/`, `/add`, `/edit/:id`)
- State: Context + reducer (`CustomerContext`)
- Data access: `useApi` for transport, `useCustomers` for domain behavior
- Components: shared `CustomerForm`, reusable `CustomerList`, app shell `Layout`

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

## API Integration

The app calls `/api/*` and expects a proxy target from Vite.

- Local API server is expected at `http://localhost:3001`
- Proxy is configured in `vite.config.ts`

## Testing

Run all tests:

```bash
npm run test:run
```

Test stack:

- Vitest
- React Testing Library
- @testing-library/user-event

## Build and Preview

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```
