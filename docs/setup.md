# Setup Guide

This guide walks you through local development setup and configuration.

## Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- OpenAI API key

## Clone the Repository

```bash
git clone <REPO_URL>
cd Tezrisat
```

## Environment Variables

Copy the example file and update values:

```bash
cp .env.example .env
```

Required variables:
- `OPENAI_API_KEY`

Common development variables:
- `DEBUG=true`
- `ALLOW_ANY=true` (allow unauthenticated API access in dev)
- `CORS_ALLOW_ALL_ORIGINS=true`

Production variables:
- `SECRET_KEY` (required)
- `ALLOW_ANY=false`
- `CORS_ALLOW_ALL_ORIGINS=false`
- `CORS_ALLOWED_ORIGINS` (comma-separated)
- `CSRF_TRUSTED_ORIGINS` (comma-separated)

## Backend Setup

```bash
cd Tezrisat_Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Backend runs at `http://localhost:8000`.

## Frontend Setup

```bash
cd Tezrisat_Frontend/tezrisat_frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Verification

1. Open `http://localhost:5173`.
2. Sign in or create a user.
3. Create a microcourse to verify end-to-end flow.

## Troubleshooting

### Backend
- Port 8000 already in use: `python manage.py runserver 8001`
- Database errors: re-run `python manage.py migrate`
- OpenAI API errors: verify `OPENAI_API_KEY` in `.env`

### Frontend
- Port 5173 already in use: `npm run dev -- --port 5174`
- API connection errors: verify backend is running and CORS config

## Next Steps

- See `docs/api.md` for API overview.
- See `CONTRIBUTING.md` for contribution guidelines.
