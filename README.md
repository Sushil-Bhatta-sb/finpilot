# FinPilot

*A full‑stack personal finance dashboard for tracking income, expenses, budgets, savings goals, investments, and transactions.*

## Overview

FinPilot is designed for individual users who want a single, privacy‑respecting dashboard to monitor personal finances. It provides a consolidated view of income and expenses, budget progress and alerts, savings goals, an investments tracker, transaction history with export options, and role‑based admin tools.

## Live Demo

| Frontend | Backend API |
|---|---|
| [View Live App](https://finpilot-oiek-q4zxkmfqt-sushil-bhattas-projects.vercel.app/) | [API Base](https://finplot-rhir.onrender.com) |

## Features

- **Authentication** — JWT-based auth with bcrypt password hashing and role-based access control.
- **Financial Tracking** — Create and manage income, expenses, budgets (with exceed alerts), savings goals, and investments.
- **Insights** — Interactive dashboard with charts and category breakdowns.
- **Real‑Time** — Socket.io powered per-user notifications and toast alerts.
- **Admin Tools** — User management, suspend accounts, and platform reporting for admins.
- **Data Export** — Export transaction history to CSV and PDF.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, TypeScript, Vite, React Router, Axios, Recharts, Socket.io Client |
| Backend | Node.js, Express, JWT, bcryptjs, Socket.io, PDFKit |
| Database | MongoDB (Mongoose) |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

## Project Structure

```
finpilot/
├─ backend/
│  ├─ server.js
│  ├─ render.yaml
│  └─ src/
│     ├─ app.js
│     ├─ socket.js
│     ├─ config/
│     ├─ controller/
│     ├─ middleware/
│     ├─ models/
│     └─ routes/
├─ frontend/
│  ├─ package.json
│  └─ src/
│     ├─ api/
│     ├─ components/
│     ├─ context/
│     ├─ pages/
│     └─ types/
└─ docs/
   ├─ level-1/
   ├─ level2/
   └─ level-3/
```

## Getting Started

### Prerequisites

- Node.js 18+ and `npm`
- A MongoDB connection string (MongoDB Atlas recommended)

### Installation

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**backend/.env**

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign JWTs |
| FRONTEND_URL | Allowed CORS origin |
| PORT | Server port (default 5000) |

**frontend/.env**

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL, including `/api` |

## API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account, returns token and user | Public |
| POST | /api/auth/login | Login, returns token and user | Public |
| GET | /api/auth/me | Get current authenticated user | Required |
| GET | /api/auth/users | List users (admin only) | Admin |
| GET/POST | /api/income | List / create incomes (scoped to user) | Required |
| PUT/DELETE | /api/income/:id | Update / delete an income owned by the user | Required |
| GET/POST | /api/expenses | List / create expenses (scoped to user) | Required |
| PUT/DELETE | /api/expenses/:id | Update / delete an expense owned by the user | Required |
| GET/POST | /api/budgets | List / create budgets | Required |
| PUT/DELETE | /api/budgets/:id | Update / delete budget | Required |
| GET/POST | /api/savings | List / create savings goals | Required |
| PUT/DELETE | /api/savings/:id | Update / delete savings goal | Required |
| POST | /api/savings/:id/deposit | Deposit to a savings goal | Required |
| GET/POST | /api/investments | List / create investments | Required |
| PUT/DELETE | /api/investments/:id | Update / delete investment | Required |
| GET/POST | /api/categories | List / create categories | Required |
| PUT/DELETE | /api/categories/:id | Update / delete category | Required |
| GET | /api/transactions | List transactions (filters supported) | Required |
| GET | /api/transactions/export/csv | Export transactions as CSV | Required |
| GET | /api/transactions/export/pdf | Export transactions as PDF | Required |
| GET | /api/notifications | List notifications for user | Required |
| DELETE | /api/notifications/:id | Delete a notification | Required |
| PUT | /api/notifications/:id/read | Mark notification read | Required |
| GET | /api/dashboard/stats | Dashboard stats (returns guest-safe payload if unauthenticated) | Public |
| GET/PUT | /api/profile | Get / update profile | Required |
| PUT | /api/profile/change-password | Change user password | Required |
| GET/DELETE/PUT | /api/admin/* | Admin reports, list/delete users, suspend users | Admin |

## Authentication Flow

Registering or logging in returns a signed JWT. The frontend stores that token in local storage and the Axios client attaches it as an `Authorization: Bearer <token>` header for subsequent requests. Backend middleware validates the token on protected routes, populates `req.user`, and enforces role checks where applicable.

## Real‑Time Notifications

The application uses Socket.io for real‑time, per‑user notifications. Clients join a private room identified by their user ID after connecting; the backend emits events such as budget alerts, savings goal completion, and investment updates. The frontend listens for `notification` events to update the notification bell and show toast alerts.

## Task Breakdown

### Level 1 — Basic

**Task 1: Development Environment Setup**

The project documents the local development setup and verification (Node/npm versions and MongoDB connection). The repo includes screenshots demonstrating successful environment checks. See the full task details in the project docs: [Task 1 — Environment Setup](docs/level-1/task-1-environment-setup.md).

**Task 2: REST API**

Implemented a simple Express REST API with full CRUD for Income and Expense resources, input validation, centralized error handling, and example test collections (Thunder Client / Postman). Endpoints and example requests are documented in the task file: [Task 2 — REST API](docs/level-1/task-2-rest-api.md).

### Level 2 — Intermediate

**Task 1: Frontend Framework**

The frontend was rebuilt with React 19, TypeScript, and Vite. It provides a component library (`src/components/ui`), typed API clients in `src/api`, global state via `AuthContext`, and protected routes via `ProtectedRoute`. See details and screenshots: [Task 1 — Frontend Framework](docs/level2/task-1-frontend-framework.md).

**Task 2: Authentication**

Server-side authentication uses `bcryptjs` for hashing and `jsonwebtoken` for JWTs. The `User` model hashes passwords pre-save and the `protect` and `authorize` middleware enforce authentication and role‑based authorization. Frontend integrates via an Axios interceptor and `AuthContext`. See the implementation notes: [Task 2 — Authentication](docs/level2/task-2-auth.md).

**Task 3: Database Integration**

MongoDB integration is implemented using Mongoose models with validation and indexes (notably `{ user: 1, date: -1 }` on income and expense). Controllers scope CRUD operations to the authenticated user. See the model summaries and validation behavior: [Task 3 — Database Integration](docs/level2/task-3-database.md).

### Level 3 — Advanced

**Task 1: Full‑Stack Application**

The Level 3 work ties together authentication, dashboard, income/expense, budgets (with threshold alerts), savings goals, investments, transactions (with CSV/PDF export), categories, analytics, profile, and an admin panel. Role checks and ownership filters are enforced across controllers. For full module lists and UI notes, see: [Task 1 — Fullstack Application](docs/level-3/task-1-fullstack-application.md).

**Task 2: WebSockets**

Socket.io is used to deliver private real‑time notifications to users; the backend attaches Socket.io to the HTTP server and emits events to user‑specific rooms. The frontend connects after login and updates the UI on `notification` events. Read the full details here: [Task 2 — WebSockets](docs/level-3/task-2-websockets.md).

## Documentation

For screenshots, test evidence, and full implementation notes for each task above, see the project `docs/` folder.

## Demo Video

[Watch Demo](finpilot-demo-video.mp4)

## Author

Sushil Bhatta — [GitHub](https://github.com/Sushil-Bhatta-sb) · [LinkedIn](https://www.linkedin.com/in/sushil-bhatta-67855b318/) · [Portfolio](https://sushil-bhatta.com.np)

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
