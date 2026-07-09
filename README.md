# capstone2

## Features

- Customer CRUD (list, add, edit, delete)
- Search, filter, sort, and pagination
- Sign in with email, phone, and password
- First-time user account creation (email, phone, password)
- User-scoped customer access after login
- Dark mode toggle

## Live Demo

- https://iltStudent09.github.io/capstone2/

## GitHub Pages Deployment (gh-pages)

Deploy from local using the root script:

```bash
cd /home/labadmin/Desktop/capstone2
npm run deploy
```

This builds `customer-app` and publishes `customer-app/dist` to the `gh-pages` branch.

## Automatic CI

- Workflow: **CI Build and Test**
- Triggers on:
	- pushes to `main`
	- all pull requests
- Runs:
	- `npm run test:run`
	- `npm run build`

Deploy uses the root `gh-pages` script.

## Run the Application

### Prerequisites

- Node.js 18+
- npm

### 1) Install dependencies

Install root dependencies (JSON Server):

```bash
cd /home/labadmin/Desktop/capstone2
npm install
```

Install frontend dependencies:

```bash
cd /home/labadmin/Desktop/capstone2/customer-app
npm install
```

### 2) Start the API (JSON Server)

From the project root:

```bash
cd /home/labadmin/Desktop/capstone2
npm run api
```

API will run at:

- http://localhost:3001/customers
- http://localhost:3001/auth/login
- http://localhost:3001/auth/register

### 3) Start the React app

In a second terminal:

```bash
cd /home/labadmin/Desktop/capstone2/customer-app
npm run dev
```

Frontend will run at:

- http://localhost:5173

## Authentication

- If you are not already signed in, the app redirects you to the login page.
- Sign in requires:
	- email
	- phone number
	- password
- New users can use **Create Account** on the same auth card.

### Demo credentials

- admin@company.com / (555) 900-0001 / admin123
- user1@company.com / (555) 900-0002 / user123
- user2@company.com / (555) 900-0003 / user123

### 4) Optional checks

Build the frontend:

```bash
cd /home/labadmin/Desktop/capstone2/customer-app
npm run build
```

Type check only:

```bash
cd /home/labadmin/Desktop/capstone2/customer-app
npx tsc --noEmit
```

## Architecture Guidance

- See [ARCHITECTURE.md](ARCHITECTURE.md) for the selected implementation decisions.
- See [architecture-prompts.md](architecture-prompts.md) for reusable prompts that enforce those decisions.