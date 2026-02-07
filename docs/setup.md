# Setup Guide

This guide is optimized for a fast local setup so contributors can get productive quickly.

> **Local/self‑hosted only:** Public hosting or offering Tezrisat as a service to third parties is not allowed without a commercial license.

## Quick Start (Local)

1. Clone and enter the repo:

```bash
git clone <REPO_URL>
cd Tezrisat
```

2. Create a local `.env` from the example:

```bash
cp .env.example .env
```

3. Start the backend:

```bash
cd Tezrisat_Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

4. Start the frontend:

```bash
cd ../Tezrisat_Frontend/tezrisat_frontend
npm install
npm run dev
```

5. Open `http://localhost:5173` and create a microcourse.

## One-click Local Setup

If you want a single command that clones the repo, sets up dependencies, and runs both servers:

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/EQuBitC18/Tezrisat/main/scripts/bootstrap.ps1 | iex
```

macOS/Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/EQuBitC18/Tezrisat/main/scripts/bootstrap.sh | bash
```

If you already cloned the repo:

```powershell
.\scripts\dev.ps1
```

```bash
chmod +x ./scripts/dev.sh
./scripts/dev.sh
```

To enable pre-commit and pre-push checks, run:

```bash
./scripts/install-githooks.sh
```

```powershell
.\scripts\install-githooks.ps1
```

## macOS/Linux Notes

Use this activation command instead of `venv\Scripts\activate`:

```bash
source venv/bin/activate
```

## API Keys (Fast Path)

You can either set keys in `.env` or use the in-app modal:

- `.env`: set `OPENAI_API_KEY` (and optionally `SERPAPI_API_KEY`, `WOLFRAM_ALPHA_APPID`)
- UI modal: the app will prompt for missing keys and store them locally in the browser

## Environment Variables

Required for local generation:
- `OPENAI_API_KEY`
- `SERPAPI_API_KEY`

Recommended for richer output:
- `WOLFRAM_ALPHA_APPID` (optional)

Common dev flags:
- `DEBUG=true`
- `CORS_ALLOW_ALL_ORIGINS=true`

## Troubleshooting

Backend:
- Port 8000 in use: `python manage.py runserver 8001`
- Database errors: re-run `python manage.py migrate`
- API key errors: check `.env` or use the in-app modal

Frontend:
- Port 5173 in use: `npm run dev -- --port 5174`
- API connection errors: ensure backend is running and CORS is enabled

## Next Steps

- See [docs/api.md](api.md) for API overview.
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.
