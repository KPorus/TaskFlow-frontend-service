# TaskFlow Frontend

React + Vite client for the EAP 4.0 Smart Project & Task Collaboration System.

## Features

- Login, register, **Demo Login** (PM credentials)
- Dashboard with KPI cards, charts, activity feed, workload, deadlines
- Project-scoped kanban board with drag-and-drop status updates
- Search, filter, sort, and pagination for tasks
- Flat task comments
- Real-time notifications via Socket.IO
- Role-aware UI (project create/settings for Admin & PM)

## Setup

```bash
npm install
cp .env.example .env   # or edit .env
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_BASE_URL` | Backend API base, e.g. `http://localhost:5000/api/v1` |
| `VITE_SOCKET_URL` | Socket.IO server, e.g. `http://localhost:5000` |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskflow.com | Admin@123 |
| Project Manager | pm@taskflow.com | Pm@123 |
| Team Member | member@taskflow.com | Member@123 |

Use **Demo Login** on the sign-in screen for instant PM access.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Deployment

1. Set `VITE_BASE_URL` and `VITE_SOCKET_URL` to your deployed backend.
2. Run `npm run build`.
3. Host `dist/` on Vercel, Netlify, or any static host (HashRouter needs no rewrite rules).

## Project Structure

```
components/
  auth/         Login screen
  board/        Kanban board
  dashboard/    Analytics home
  layout/       Sidebar, notifications
  model/        Modals
  search/       Filters & pagination
store/slices/   Redux state
services/       API & Socket.IO
```
