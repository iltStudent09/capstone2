# capstone2

## Live Demo

- https://iltStudent09.github.io/capstone2/

## GitHub Actions Deployment

You can manually trigger Pages deployment from the GitHub website:

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Select **Deploy to GitHub Pages**.
4. Click **Run workflow**.

> Note: In repository settings, set **Pages** source to **GitHub Actions**.

Deployment is intentionally GitHub Actions-only (no local `gh-pages` deploy script).

## Automatic CI

- Workflow: **CI Build and Test**
- Triggers on:
	- pushes to `main`
	- all pull requests
- Runs:
	- `npm run test:run`
	- `npm run build`

Deploy uses the **Deploy to GitHub Pages** workflow.

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

### 3) Start the React app

In a second terminal:

```bash
cd /home/labadmin/Desktop/capstone2/customer-app
npm run dev
```

Frontend will run at:

- http://localhost:5173

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