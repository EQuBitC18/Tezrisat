# API Overview

This document provides a lightweight overview of the Tezrisat API. For detailed endpoints, use the Django REST Framework browsable API when the backend is running.

## Base URL

Local development default:

```
http://localhost:8000
```

## Authentication

The API uses JWT authentication. Obtain a token and include it in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Health Check

If configured, you can add a simple health check endpoint in the backend for deployment monitoring.

## Notes

- This file is intentionally minimal. Expand with concrete endpoints as they stabilize.
