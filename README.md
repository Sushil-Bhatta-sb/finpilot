# FinPilot

FinPilot is a full‑stack personal finance dashboard that helps users track income, expenses, budgets, savings goals, investments and transactions. It includes a responsive React + TypeScript frontend, an Express + Node.js API backend with JWT authentication, and MongoDB (Mongoose) for persistence. Socket.io is used for real‑time notifications.

Live Demo
- Frontend: https://finpilot-oiek-q4zxkmfqt-sushil-bhattas-projects.vercel.app/
- Backend API: https://finplot-rhir.onrender.com

Summary (what this repository actually contains)
- Frontend: React + TypeScript app (Vite) in `frontend/`.
- Backend: Express API in `backend/` with Mongoose models and Socket.io in `backend/src/`.
- Authentication: JWT issued on `/api/auth/login` and `/api/auth/register` and enforced by `backend/src/middleware/auth.js`.

Key Implemented Features
- JWT authentication: register, login, `GET /api/auth/me` (server issues JWTs and `protect` middleware enforces them).
- Dashboard: aggregated stats endpoint `GET /api/dashboard/stats` (now serves a guest-safe empty payload for unauthenticated requests).
- CRUD for user-scoped resources: income, expenses, budgets, savings goals, investments, categories (all under `/api/*` and protected by middleware).
- Transactions log: unified transaction entries, export to CSV and PDF via `/api/transactions/export/csv` and `/api/transactions/export/pdf`.
- Budget recalculation & alerts: budgets recalc `spent` from expenses and emit budget alerts when thresholds are crossed.
- Savings deposit endpoint: `POST /api/savings/:id/deposit` increments saved amount and notifies user on completion.
- Real‑time notifications: Socket.io integration that emits persisted notifications to connected users; backend stores notifications in `Notification` model and emits them.
- Admin endpoints: admin-only routes exist (user list, suspend user, aggregated reports) guarded by `authorize('admin')` middleware.

Technology Stack
- Frontend: React, TypeScript, Vite, React Router, Axios, Recharts, Socket.io Client
- Backend: Node.js, Express, Mongoose, JWT (`jsonwebtoken`), bcryptjs, Socket.io, pdfkit
- Database: MongoDB Atlas (via Mongoose)

Frontend ↔ Backend communication
- Frontend uses `frontend/src/api/client.ts` which uses `import.meta.env.VITE_API_URL` as the Axios `baseURL`.
- Production front-end env (`frontend/.env.production`) is configured to point to the deployed backend: `https://finplot-rhir.onrender.com/api`.
- Backend API routes are mounted under `/api/*` in `backend/src/app.js` (for example `/api/auth`, `/api/income`, `/api/expenses`, etc.).

Authentication & Authorization Flow
- Register: `POST /api/auth/register` returns `{ token, user }`.
- Login: `POST /api/auth/login` returns `{ token, user }`.
- Token usage: the frontend stores the JWT in localStorage under `finpilot_token` and the Axios client attaches it to `Authorization: Bearer <token>`.
- Protected endpoints: most resource routes use the `protect` middleware (backend `backend/src/middleware/auth.js`), which validates JWTs and populates `req.user`.
- Role checks: `authorize(...roles)` middleware enforces admin-only operations (used by `backend/src/routes/adminRoutes.js`).

Public vs Protected (what guests can do)
- Public / guest-accessible:
  - The landing/dashboard UI is accessible to guests. The dashboard stats endpoint will return an empty/default payload to unauthenticated requests.
  - The login and register pages/endpoints are public (`/api/auth/register`, `/api/auth/login`).
- Protected (requires authentication):
  - Creating, editing, deleting Income (`/api/income`)
  - Creating, editing, deleting Expenses (`/api/expenses`)
  - Creating, editing, deleting Investments (`/api/investments`)
  - Creating, editing, deleting Budgets (`/api/budgets`)
  - Creating, editing, deleting Savings / Deposits (`/api/savings` and `/api/savings/:id/deposit`)
  - Managing Transactions exports (`/api/transactions/*`) and viewing a user's transactions (`/api/transactions`)
  - Categories CRUD (`/api/categories`)
  - Notifications (`/api/notifications`)
  - Profile read/update/change password (`/api/profile`)
  - Admin operations (`/api/admin/*`) require the logged-in user to have the `admin` role

Note: both frontend and backend enforce auth. The frontend uses a `ProtectedRoute` wrapper; the backend returns `401`/`403` where applicable.

Repository / Folder Structure (top-level)
```
finpilot/
├─ backend/
│  ├─ server.js
│  ├─ render.yaml            # Render blueprint for deployment
  │  └─ src/
│     ├─ app.js
│     ├─ socket.js
│     ├─ config/db.js
│     ├─ middleware/auth.js
     ├─ models/              # Mongoose models (User, Income, Expense, Budget, etc.)
     ├─ controller/          # Route handlers
     └─ routes/               # Express routes mounted under /api
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.ts
│  ├─ .env.production        # points to deployed backend (/api)
│  └─ src/
│     ├─ api/                # Axios clients for auth, income, expense, etc.
│     ├─ context/            # AuthContext, SocketContext, Theme, Toast
│     ├─ components/
│     └─ pages/              # Dashboard, Income, Expenses, Login, Register, etc.
└─ docs/
```

MongoDB / Database
- Connection: `backend/src/config/db.js` reads `process.env.MONGO_URI` and connects with Mongoose.
- Collections: Mongoose models are defined under `backend/src/models/` (e.g. `User`, `Income`, `Expense`, `Budget`, `SavingsGoal`, `Investment`, `Transaction`, `Notification`, `Category`).
- Auto-creation: MongoDB collections and documents are created on first write by Mongoose — there is no manual migration system in this codebase.

Environment Variables (do NOT commit secrets)
- Backend (`backend/.env`):
  - `MONGO_URI` — MongoDB connection string (example: `mongodb+srv://user:pass@cluster.example.mongodb.net/finpilot`)
  - `JWT_SECRET` — secret used to sign JWTs
  - `FRONTEND_URL` — allowed CORS origin (e.g. Vercel frontend URL)
  - `PORT` — server port (default 5000)
- Frontend (`frontend/.env` or `frontend/.env.production`):
  - `VITE_API_URL` — base API URL, must include the `/api` prefix in production (example: `https://finplot-rhir.onrender.com/api`)

How to run locally
1. Backend
```bash
cd backend
npm install
# create backend/.env with MONGO_URI, JWT_SECRET, FRONTEND_URL(optional), PORT(optional)
npm run dev
```
2. Frontend
```bash
cd frontend
npm install
# set frontend/.env with VITE_API_URL (e.g. http://localhost:5000/api for local backend)
npm run dev
```

Build / Production
- Frontend build: `cd frontend && npm run build` (this runs `tsc -b` and `vite build`).
- Backend start (production): `cd backend && npm start` (runs `node server.js`).

API Endpoints (high level)
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me` (register/login are public; `/me` is protected)
- Income: `/api/income` (GET/POST), `/api/income/:id` (PUT/DELETE) — protected
- Expenses: `/api/expenses` — protected
- Budgets: `/api/budgets` — protected
- Savings: `/api/savings` and `POST /api/savings/:id/deposit` — protected
- Investments: `/api/investments` — protected
- Categories: `/api/categories` — protected
- Transactions: `/api/transactions`, `/api/transactions/export/csv`, `/api/transactions/export/pdf` — protected
- Notifications: `/api/notifications` — protected
- Dashboard: `/api/dashboard/stats` — public (returns empty/default data for guests)
- Profile: `/api/profile` — protected
- Admin: `/api/admin/*` — protected + admin role required

Deployment notes
- Frontend: hosted on Vercel (see `frontend/.env.production` and `frontend/vercel.json`).
- Backend: has a Render blueprint at `backend/render.yaml` and is reachable at `https://finplot-rhir.onrender.com` (API under `/api`).
- Database: intended for MongoDB Atlas (set `MONGO_URI` in Render/environment).

Architecture diagram (simple ASCII)

Frontend (Vercel) ---> HTTPS ---> Backend API (Render) ---> MongoDB Atlas
                     \                         
                      \-- WebSocket (Socket.io) --> Backend (push notifications) --> clients

Security & Authentication Notes
- JWTs: signed using `process.env.JWT_SECRET`. Keep this secret safe in production settings (Render environment variables / Vercel environment variables).
- CORS: backend uses `FRONTEND_URL` environment variable to restrict origins in production; in development it falls back to permissive behavior.
- No secrets are stored in this repo; ensure `.env` files are never committed.

Configuration & Verification Checklist
- ✅ Backend routes are mounted under `/api/*` (`backend/src/app.js`).
- ✅ Auth endpoints `/api/auth/register` and `/api/auth/login` exist (`backend/src/routes/authRoutes.js` and `backend/src/controller/authController.js`).
- ✅ Frontend Axios client uses `VITE_API_URL` and frontend production env points to the deployed backend with the `/api` prefix (`frontend/.env.production`).
- ✅ Protected database operations exist and are enforced by backend `protect` middleware (see `backend/src/middleware/auth.js` and all resource routers that `router.use(protect)`).
- ✅ Transactions export (CSV/PDF) is implemented in `backend/src/controller/transactionController.js`.
- ⚠️ Render / Vercel environment values: `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` are referenced in `backend/render.yaml` and `backend/server.js`, but their actual values in the Render dashboard cannot be verified from the codebase here — please confirm these in your Render project settings.
- ⚠️ SSL / CORS in production: server restricts Socket.io `origin` to `FRONTEND_URL` if provided; confirm `FRONTEND_URL` matches your deployed Vercel domain.
- ⚠️ Database backups, monitoring and production scaling are not covered by this repo — recommend setting up MongoDB Atlas backups and monitoring for production workloads.

Future improvements (suggested)
- (Future) Add automated tests / CI for backend endpoints.
- (Future) Add database migration/versioning (e.g., migrate scripts or use MongoDB Realm/Atlas functions where appropriate).
- (Future) Provide an admin UI for Render/Infra checks and health endpoints.

Author & License
- Author: Sushil Bhatta
- License: MIT

If you want, I can also:
- Run a local verification (start both servers) and exercise the guest vs authenticated flows.
- Add a short Troubleshooting section with common errors (CORS, JWT expired, env var mistakes).
