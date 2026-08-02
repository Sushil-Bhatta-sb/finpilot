# FinPilot Backend

Express + MongoDB (Mongoose) REST API with JWT auth, role-based access,
and Socket.io real-time notifications.

## Environment variables

Create a `.env` file in `backend/` (never commit it) with:

| Variable       | Description                                              | Example                                   |
| -------------- | -------------------------------------------------------- | ----------------------------------------- |
| `MONGO_URI`    | MongoDB Atlas connection string                          | `mongodb+srv://user:pass@cluster/finpilot`|
| `JWT_SECRET`   | Secret used to sign JWTs                                 | `a-long-random-string`                    |
| `FRONTEND_URL` | Allowed CORS origin (frontend URL) for HTTP + Socket.io  | `https://finpilot.vercel.app`             |
| `PORT`         | Port the server listens on (defaults to 5000)            | `5000`                                    |

In development, if `FRONTEND_URL` is not set, CORS reflects any origin and
Socket.io defaults to `http://localhost:5173`.

## Scripts

```bash
npm install      # install dependencies
npm run dev      # start with nodemon (development)
npm start        # start with node (production)
```

## Deployment

A [`render.yaml`](./render.yaml) blueprint is included for Render. Set
`MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` in the dashboard (they are
marked `sync: false`).
