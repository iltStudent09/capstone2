# capstone2

## Live Demo

- https://iltStudent09.github.io/capstone2/

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