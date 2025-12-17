# Arkansas River & Stream Flow Tracker (monorepo)

Minimal monorepo scaffold for API, worker, web, and mobile.

## Development

1. Copy `.env.example` to `.env` and adjust.
2. Install dependencies: `npm install` (uses workspaces).
3. Run dev servers: `npm run dev`.
4. Mobile: `npm run mobile`.

## Docker

`docker-compose up --build` will start Postgres, Redis, API, and worker containers.

## Tests

Run flow logic unit test: `npm --workspace services/api run test`.
