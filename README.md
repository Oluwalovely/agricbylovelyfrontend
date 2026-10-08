# AgricByLovely

A farm-records portfolio project for farmers in Nigeria. Record fields and plantings, follow crop stages, save harvest results, and check weather, reminders, calendar dates, and reports from one account.

- Live website: https://agricbylovely.onrender.com
- Backend repository: https://github.com/Oluwalovely/agricbylovely-backend

Built with React, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, and Socket.IO. The public homepage introduces the app; farm records require login.

## Run locally

Use Node.js 24. Start the backend on port 8001 following its README, copy `.env.example` to `.env`, then run:

```sh
npm ci
npm run dev
```

Open `http://localhost:5173`. `VITE_API_URL` includes `/api`; `VITE_SOCKET_URL` is the backend origin without `/api`. Frontend variables are public build settings. Keep database and provider secrets in the backend environment.

## Checks and build

```sh
npm test
npm run lint
npm run build
```

Tests cover session restoration, account switching, planting and harvest validation, calendar dates, notifications, and photo selection. Browser checks also cover page states, mobile layouts, public links, and keyboard access to the logout confirmation.

## Features

- Registration, login, profile editing, password recovery, and account photos.
- Fields, crop growing guides, plantings, growth stages, and harvest records.
- Calendar dates, crop summaries, and recorded yield history.
- Local weather forecasts, saved advisories, and notification history.
- Persistent field and planting photographs.

Harvest dates are estimates until a harvest is recorded. Weather advisories are general guidance. The free-host backend may need time to wake up, and scheduled reminders are best effort while it is running.

See [LANDING.md](LANDING.md) for the public page and labelled example screenshot, [DESIGN.md](DESIGN.md) for visual guidance, and the feature documents in this repository for implementation notes.
