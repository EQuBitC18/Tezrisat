# API Overview

This is a lightweight, contributor-friendly overview of the Tezrisat API. For the full list of endpoints, use the Django REST Framework browsable API while the backend is running.

> **Local‑only by design:** Tezrisat is intended for local/self‑hosted use. If you plan to expose it publicly, you must add authentication, rate limiting, and server‑side key management.

## Base URL

Local development default:

```
http://localhost:8000
```

## Authentication

Authentication is disabled by default. The project is designed for local/self-hosted use where each user runs their own instance and supplies their own API keys.

## API Keys

Keys can be provided via backend environment variables or via request headers:

- `X-OpenAI-Key` (required when not set on the backend)
- `X-SerpAPI-Key` (required when not set on the backend)
- `X-Wolfram-Key` (optional)

When using the UI, keys are stored locally in the browser and attached to requests.

## Health Check

If you need a health check endpoint for deployment, add a simple route in the backend and document it here.

## Notes

- This file is intentionally minimal to keep it easy to maintain.
- As endpoints stabilize, add concrete request/response examples.

