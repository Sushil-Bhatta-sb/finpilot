# FinPilot – Personal Finance & Investment Dashboard

## Overview
FinPilot is a full-stack MERN personal finance application for managing income, expenses, budgets, savings goals, investments, and real-time notifications. It provides a dashboard-style interface with charts, analytics, transaction history with export, custom categories, an admin panel, and role-based access control. It was built as part of the **Codveda Full-Stack Development Internship**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, React Router, Axios, Recharts, Socket.io-client, lucide-react |
| Backend | Node.js, Express.js, JWT, bcrypt, Socket.io |
| Database | MongoDB Atlas, Mongoose |
| Tooling | oxlint, Thunder Client / Postman, Nodemon |

## Features
- **Authentication** — JWT-based auth, bcrypt password hashing, protected routes, role-based access (user/admin)
- **Dashboard** — aggregated stats and charts (income vs expense, category breakdown, budget usage)
- **Income & Expense tracking** — full CRUD, scoped per user
- **Budget management** — create/edit/delete, auto-calculated spent amount, exceed alerts (80%/90%/100%)
- **Savings goals** — create goals, deposit money, auto-complete on target reached
- **Investment portfolio** — track stocks/crypto/gold/etc. with profit/loss calculation
- **Transaction history** — unified activity log with search/filter/sort and CSV & PDF export
- **Custom categories** — per-user category CRUD
- **Analytics** — charts for income growth, savings growth, and category spending
- **Real-time notifications** — Socket.io live alerts with a notification bell and toast alerts
- **Admin panel** — user management, suspend users, platform-wide statistics
- **Profile management** — update info, change password, light/dark theme support

## Project Structure

```
finpilot/
├── backend/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       └── middleware/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── types/
├── docs/
│   ├── level-1/
│   ├── level-2/
│   └── level-3/
├── screenshots/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (or local MongoDB)

### Installation
```bash
git clone <repo-url>
cd finpilot

# Backend
cd backend
npm install
# create .env with MONGO_URI, JWT_SECRET, PORT
npm run dev

# Frontend (new terminal)
cd frontend
npm install
# create .env with VITE_API_URL
npm run dev
```

## Environment Variables

**backend/.env**

| Variable | Description |
|----------|-------------|
| `PORT` | Port the backend server runs on (e.g. `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

**frontend/.env**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

## API Overview

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create account, returns JWT | No |
| POST | /api/auth/login | Login, returns JWT | No |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/auth/users | List all users | Yes (admin) |

### Income
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/income | List current user income | Yes |
| POST | /api/income | Create income entry | Yes |
| PUT | /api/income/:id | Update income entry | Yes |
| DELETE | /api/income/:id | Delete income entry | Yes |

### Expenses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/expenses | List current user expenses | Yes |
| POST | /api/expenses | Create expense entry | Yes |
| PUT | /api/expenses/:id | Update expense entry | Yes |
| DELETE | /api/expenses/:id | Delete expense entry | Yes |

### Budgets
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/budgets | List budgets | Yes |
| POST | /api/budgets | Create budget | Yes |
| PUT | /api/budgets/:id | Update budget | Yes |
| DELETE | /api/budgets/:id | Delete budget | Yes |

### Savings Goals
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/savings | List savings goals | Yes |
| POST | /api/savings | Create savings goal | Yes |
| PUT | /api/savings/:id | Update savings goal | Yes |
| DELETE | /api/savings/:id | Delete savings goal | Yes |
| POST | /api/savings/:id/deposit | Deposit toward a goal | Yes |

### Investments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/investments | List investments | Yes |
| POST | /api/investments | Create investment | Yes |
| PUT | /api/investments/:id | Update investment | Yes |
| DELETE | /api/investments/:id | Delete investment | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/categories | List categories | Yes |
| POST | /api/categories | Create category | Yes |
| PUT | /api/categories/:id | Update category | Yes |
| DELETE | /api/categories/:id | Delete category | Yes |

### Transactions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/transactions | List transactions (search/filter/sort) | Yes |
| GET | /api/transactions/export/csv | Export transactions as CSV | Yes |
| GET | /api/transactions/export/pdf | Export transactions as PDF | Yes |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/notifications | List notifications | Yes |
| PUT | /api/notifications/:id/read | Mark notification as read | Yes |
| DELETE | /api/notifications/:id | Delete notification | Yes |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/dashboard/stats | Aggregated dashboard statistics | Yes |

### Profile
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/profile | Get profile | Yes |
| PUT | /api/profile | Update profile | Yes |
| PUT | /api/profile/change-password | Change password | Yes |

### Admin
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/admin/users | List all users | Yes (admin) |
| DELETE | /api/admin/users/:id | Delete a user | Yes (admin) |
| PUT | /api/admin/users/:id/suspend | Suspend a user | Yes (admin) |
| GET | /api/admin/reports | Get all reports | Yes (admin) |
| GET | /api/admin/stats | Platform-wide statistics | Yes (admin) |

## Internship Task Mapping

| Level | Task | Status | Docs |
|-------|------|--------|------|
| Level 1 | Task 1: Environment Setup | ✅ Done | [docs/level-1/task-1-environment-setup.md](docs/level-1/task-1-environment-setup.md) |
| Level 1 | Task 2: REST API | ✅ Done | [docs/level-1/task-2-rest-api.md](docs/level-1/task-2-rest-api.md) |
| Level 2 | Task 1: Frontend Framework | ✅ Done | [docs/level2/task-1-frontend-framework.md](docs/level2/task-1-frontend-framework.md) |
| Level 2 | Task 2: Authentication | ✅ Done | [docs/level2/task-2-auth.md](docs/level2/task-2-auth.md) |
| Level 2 | Task 3: Database Integration | ✅ Done | [docs/level2/task-3-database.md](docs/level2/task-3-database.md) |
| Level 3 | Task 1: Full-Stack Application | ✅ Done | [docs/level-3/task-1-fullstack-application.md](docs/level-3/task-1-fullstack-application.md) |
| Level 3 | Task 2: WebSockets | ✅ Done | [docs/level-3/task-2-websockets.md](docs/level-3/task-2-websockets.md) |

## Screenshots

![Dashboard](screenshots/level-3/dashboard.png)
![Budgets with progress bars](screenshots/level-3/budgets.png)
![Transactions with filters](screenshots/level-3/transactions.png)

_See [docs/](docs/) for full screenshots per task._

## Demo Video
🎥 [Demo Video](VIDEO_LINK_HERE) <!-- TODO: add LinkedIn/YouTube video link once recorded -->

## Author
**Sushil Bhatta**
- GitHub: <https://github.com/Sushil-Bhatta-sb>
- LinkedIn: <https://www.linkedin.com/in/sushil-bhatta>
- Portfolio: <https://sushil-bhatta.com.np>

## License
This project is released under the MIT License. <!-- TODO: add a LICENSE file at the project root -->