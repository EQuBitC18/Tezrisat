# API Overview

This document provides a lightweight overview of the Tezrisat API. For detailed endpoints, use the Django REST Framework browsable API when the backend is running.

## Base URL

Local development default:

```
http://localhost:8000
```

## Authentication

Authentication is disabled by default. This project is designed for local/self-hosted use where each user runs their own instance and supplies their own API keys.

If you plan to deploy this publicly, add authentication and rate limiting before exposing the API.

## API Keys

Keys can be provided via backend environment variables or via request headers:

- `X-OpenAI-Key` (required when not set on the backend)
- `X-SerpAPI-Key` (required when not set on the backend)
- `X-Wolfram-Key` (optional)

When using the UI, keys are stored locally in the browser and attached to requests.

## Health Check

If configured, you can add a simple health check endpoint in the backend for deployment monitoring.

## Notes

- This file is intentionally minimal. Expand with concrete endpoints as they stabilize.
