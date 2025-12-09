# Tezrisat Backend - Local Development Setup

## Overview

The backend is configured for **100% local development** with:
- **Local SQLite database** (`db.sqlite3`) - no external database required
- **Django admin panel** accessible at `/admin/`
- **REST API** accessible at `/api/`
- All Render references removed
- CORS enabled for all origins (development only)

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` (optional for local development):

```bash
cp .env.example .env
```

**Note:** For local development, `.env` is optional. All settings have sensible defaults.

### 2. Run Django Migrations (First Time Only)

```bash
cd Tezrisat_Backend
python manage.py migrate
```

### 3. Create Admin User (First Time Only)

```bash
python manage.py createsuperuser
```

### 4. Run the Development Server

#### Using Bash (Recommended)

```bash
cd Tezrisat_Backend
bash run_dev.sh
```

#### Using Python directly

```bash
cd Tezrisat_Backend
python manage.py runserver
```

#### Using Windows Batch

```cmd
cd Tezrisat_Backend
run_dev.bat
```

The server will start at: `http://localhost:8000`

## Accessing the Admin Panel

1. Start the development server (see above)
2. Go to: `http://localhost:8000/admin/`
3. Log in with the superuser account you created

### What You Can Do in Admin:

- Manage users and permissions
- View API data
- Create/edit/delete records
- Monitor the application

## API Endpoints

Once the server is running:

- **Admin Panel:** `http://localhost:8000/admin/`
- **API Root:** `http://localhost:8000/api/`

### Local SQLite Database

By default, the development environment uses SQLite (`db.sqlite3`). This is a file-based database that requires no setup.

### Running Migrations

```bash
cd Tezrisat_Backend
python manage.py migrate
```

### Creating a Superuser (Admin Account)

```bash
cd Tezrisat_Backend
python manage.py createsuperuser
```

Then access the admin panel at: `http://localhost:8000/admin`

## Production vs. Development

### Development (Current Local Setup)
- Database: SQLite (`db.sqlite3`)
- Debug: Enabled
- Environment: `DJANGO_ENV=development` (default)

### Production (Render Deployment)
- Database: PostgreSQL on Render
- Debug: Disabled
- Environment: `DJANGO_ENV=production`
- Database Connection: Via `DATABASE_URL` environment variable

To switch to production settings locally (not recommended), set:
```bash
DJANGO_ENV=production
```

## Key Configuration Files

- **`Tezrisat_Backend/settings.py`** - Django settings
  - Database selection logic based on `DJANGO_ENV`
  - Local dev uses SQLite by default
  - Production uses `DATABASE_URL` from environment

- **`.env`** - Environment variables (local only, not in git)
- **`.env.example`** - Template for environment variables

## Common Issues & Solutions

### Issue: `OperationalError: connection to server at "dpg-..." failed`

**Solution**: Already fixed! The settings now properly handle local vs. production databases.

### Issue: Database is empty

**Solution**: Run migrations:
```bash
python manage.py migrate
```

### Issue: Can't access Django admin

**Solution**: 
1. Create a superuser: `python manage.py createsuperuser`
2. Access at: `http://localhost:8000/admin`

## API Endpoints

Once the server is running, access:
- API Root: `http://localhost:8000/api/`
- Admin Panel: `http://localhost:8000/admin/`
- Django Debug Toolbar: Enabled in development

## LangChain Imports

All deprecated LangChain imports have been updated to use the new community packages:
- `langchain_community` for LLMs, embeddings, document loaders, vectorstores
- `langchain_text_splitters` for text splitters
- `langchain` for core classes

This ensures compatibility with LangChain v0.3+

## Next Steps

1. Start the backend: `bash run_dev.sh`
2. Start the frontend: See `Tezrisat_Frontend/README.md`
3. Run migrations: `python manage.py migrate`
4. Create admin user: `python manage.py createsuperuser`
5. Access the application at `http://localhost:3000` (frontend) or `http://localhost:8000` (API)
