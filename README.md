# Customer Manager Capstone

## Live Demo

- https://iltStudent09.github.io/capstone2/

## Features

- Full customer CRUD (list, add, edit, delete)
- Search, filter, sort, and pagination
- Authentication with email + phone + password
- First-time account creation from the login card
- User-scoped data access after sign-in
- Dark mode toggle

## Run the Application

### Prerequisites

- Node.js 18+
- npm

### 1) Install dependencies

From project root:

```bash
npm install
```

From frontend folder:

```bash
cd customer-app
npm install
```

### 2) Start the API

From project root:

```bash
npm run api
```

API endpoints:

- http://localhost:3001/customers
- http://localhost:3001/auth/login
- http://localhost:3001/auth/register

### 3) Start the frontend

In a second terminal:

```bash
cd customer-app
npm run dev
```

Frontend:

- http://localhost:5173

### 4) Optional checks

Build frontend:

```bash
cd customer-app
npm run build
```

Type-check only:

```bash
cd customer-app
npx tsc --noEmit
```

## Authentication

- Unauthenticated users are redirected to `/login`.
- Sign-in requires email, phone number, and password.
- First-time users can create an account from the same auth card.

### Demo Credentials

- admin@company.com / (555) 900-0001 / admin123
- user1@company.com / (555) 900-0002 / user123
- user2@company.com / (555) 900-0003 / user123

## Deployment

Deploy to GitHub Pages with `gh-pages`:

```bash
npm run deploy
```

This builds `customer-app` and publishes `customer-app/dist` to the `gh-pages` branch.

## CI

- Workflow: **CI Build and Test**
- Triggers:
  - push to `main`
  - pull requests
- Steps:
  - `npm run test:run`
  - `npm run build`

## Architecture Docs

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [architecture-prompts.md](architecture-prompts.md)