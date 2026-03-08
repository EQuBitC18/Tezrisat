# Docker Compose Development

This workflow starts the Django backend and Vite frontend together for local development with hot reload.

> **Local/self-hosted only:** Public hosting or offering Tezrisat as a service to third parties is not allowed without a commercial license.

## Quick Start

1. Create a local `.env` file from the example:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Start both services:

```bash
docker compose up --build
```

3. Open `http://localhost:5173`.

## Common Commands

Start the stack:

```bash
docker compose up --build
```

Stop the stack:

```bash
docker compose down
```

Stop the stack and remove persisted Docker volumes:

```bash
docker compose down -v
```

Rebuild without using cached image layers:

```bash
docker compose build --no-cache
```

Stream service logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Persistence

- SQLite data is stored in the `backend_sqlite` named volume.
- Uploaded media is stored in the `backend_media` named volume.
- Frontend container dependencies are stored in the `frontend_node_modules` named volume.

## Networking

Set `VITE_API_URL` to a browser-reachable address. The default is `http://localhost:8000`.

Do not point `VITE_API_URL` to `http://backend:8000`, because that hostname only works inside the Docker network and not in the browser.
