# Login Setup Guide - Frontend & Backend Integration

## Overview

This guide walks you through setting up superuser login for the Tezrisat web application. The login system uses JWT (JSON Web Tokens) for authentication.

## Architecture

```
Frontend (React/TypeScript)  →  Backend (Django REST)  →  Database (SQLite)
   LoginPage.tsx                api/views.py              db.sqlite3
   - Collects credentials       - Validates user          - Stores users
   - Sends to /api/token/       - Issues JWT tokens       - Issues tokens
   - Stores token locally       - Uses TokenObtainPairView
```

## Step 1: Ensure Backend is Running

```bash
cd Tezrisat_Backend
bash run_dev.sh
```

Expected output:
```
Starting Tezrisat Backend Development Server...
...
System check identified no issues (0 silenced).
Django version 4.2.16
...
Starting development server at http://localhost:8000
```

## Step 2: Create a Superuser Account

In a new terminal (keeping the backend running):

```bash
cd Tezrisat_Backend
python manage.py createsuperuser
```

You'll be prompted for:
- **Username:** (can be anything, e.g., `admin`)
- **Email:** (e.g., `admin@example.com`)
- **Password:** (e.g., `TestPass123!`)

Example:
```
Username: admin
Email: admin@example.com
Password: TestPass123!
Password (again): TestPass123!
```

**Important:** Remember the username and password you entered!

## Step 3: Verify Database Entry

Verify the user was created by accessing Django admin:

```
http://localhost:8000/admin/
```

Login with your superuser credentials. You should see the admin panel.

## Step 4: Start the Frontend

In another terminal:

```bash
cd Tezrisat_Frontend/tezrisat_frontend
npm install  # (only needed first time)
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

## Step 5: Test Login

1. Navigate to: `http://localhost:5173/home#/login`

2. Enter your superuser credentials:
   - **Username:** `admin` (or whatever you created)
   - **Password:** `TestPass123!` (or your password)

3. Click "Sign In"

### What Should Happen:

- ✅ Page shows loading indicator
- ✅ Frontend sends credentials to `http://localhost:8000/api/token/`
- ✅ Backend validates credentials against database
- ✅ Backend returns JWT tokens (access and refresh)
- ✅ Frontend stores tokens in localStorage
- ✅ Frontend redirects to home page
- ✅ You are logged in!

## Troubleshooting

### Issue: "Invalid credentials" or Login fails silently

**Possible causes:**
1. Username/password incorrect - Check Django admin at `http://localhost:8000/admin/`
2. Backend not running - Check that `http://localhost:8000/api/` is accessible
3. Frontend using wrong API URL - Check that `.env` has `VITE_API_URL=http://localhost:8000`

**Solutions:**
```bash
# Verify backend is running
curl http://localhost:8000/api/

# Verify user exists in database
cd Tezrisat_Backend
python manage.py shell
from django.contrib.auth.models import User
User.objects.all()
# Should show your superuser
```

### Issue: CORS Errors

**If you see:** `Access to XMLHttpRequest blocked by CORS policy`

This should be fixed, but verify:
- Backend has `CORS_ALLOW_ALL_ORIGINS = True` in settings.py
- Restart backend if you made changes

### Issue: "No module named..." errors

**Solution:**
```bash
pip install -r requirements.txt  # For backend
npm install                        # For frontend
```

### Issue: Token endpoint returns 404

**Solution:** Check backend URLs are configured correctly:
```bash
cd Tezrisat_Backend
python manage.py shell
from django.urls import resolve, reverse
print(reverse('get_token'))  # Should print: /api/token/
```

## Advanced: Manual API Testing

Test the login endpoint directly using curl:

```bash
# Get tokens
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TestPass123!"}'

# Response should be:
# {"access":"eyJ...","refresh":"eyJ..."}
```

Then use the access token to make authenticated requests:

```bash
curl -H "Authorization: Bearer eyJ..." \
  http://localhost:8000/api/users/current/
```

## Files Involved in Login

### Backend
- `Tezrisat_Backend/settings.py` - JWT configuration
- `Tezrisat_Backend/urls.py` - Token endpoint: `/api/token/`
- `api/views.py` - Contains CreateUserView for registration
- `api/models.py` - User model

### Frontend
- `src/api.js` - API client with interceptors
- `src/pages/LoginPage.tsx` - Login form UI
- `src/components/Login.tsx` - Login wrapper
- `src/constants.js` - Token storage keys (ACCESS_TOKEN, REFRESH_TOKEN)

## Token Flow Diagram

```
1. User enters credentials
   ↓
2. Frontend posts to /api/token/
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT tokens
   ↓
5. Frontend stores tokens in localStorage
   ↓
6. Future requests include token in Authorization header
   ↓
7. Backend validates token for protected endpoints
```

## Security Notes for Development

⚠️ **This setup is for local development only!**

For production:
- Change `DEBUG = False`
- Use strong SECRET_KEY
- Configure allowed hosts properly
- Use HTTPS for all requests
- Implement proper CORS rules
- Use secure cookie settings
- Enable CSRF protection

## Next Steps

After successful login:

1. **Access the application** at `http://localhost:5173/home`
2. **Manage users** via Django admin: `http://localhost:8000/admin/`
3. **Create new users** via register page: `http://localhost:5173/home#/register`
4. **Test protected endpoints** with your token

## Support

If you encounter issues:

1. Check backend logs: Look at the terminal running `bash run_dev.sh`
2. Check frontend console: Press F12 in browser, check Console tab
3. Test endpoints manually using curl commands above
4. Verify both services are running on correct ports
