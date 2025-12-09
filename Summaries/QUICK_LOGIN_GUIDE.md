# Complete Login Guide - Ready to Test

## Current Status: ✅ ALL SYSTEMS GO

Your authentication system is fully configured and ready to use!

### Verified:
- ✅ Django JWT authentication configured
- ✅ Token endpoint ready at `/api/token/`
- ✅ 3 users in database (2 superusers)
- ✅ Frontend API client configured for localhost
- ✅ Login form updated for local development
- ✅ CORS enabled for frontend communication

## Quick Start (5 minutes)

### Terminal 1: Start Backend

```bash
cd Tezrisat_Backend
bash run_dev.sh
```

**Expected output:**
```
Starting Tezrisat Backend Development Server...
System check identified no issues (0 silenced).
Starting development server at http://localhost:8000
```

### Terminal 2: Start Frontend

```bash
cd Tezrisat_Frontend/tezrisat_frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Terminal 3 (Optional): Test API

```bash
# Test login endpoint with existing superuser
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"equbit","password":"your_password"}'
```

## Access Your App

### 1. Login Page
**URL:** `http://localhost:5173/home#/login`

**Available test accounts (superusers):**
- `equbit` - superuser
- `equbi` - superuser

**Note:** You need to know the password you set for these accounts, or create a new one.

### 2. Create New Superuser (If needed)

```bash
cd Tezrisat_Backend
python manage.py createsuperuser
```

Example:
```
Username: testadmin
Email: test@example.com
Password: TestPass123!
```

### 3. Django Admin Panel
**URL:** `http://localhost:8000/admin/`

Login with any superuser account to manage users, permissions, and data.

## Login Flow

```
1. You type credentials at http://localhost:5173/home#/login
                          ↓
2. Frontend sends POST to http://localhost:8000/api/token/
   Request: { username: "equbit", password: "..." }
                          ↓
3. Backend validates against database
                          ↓
4. Backend returns JWT tokens
   Response: { access: "eyJ...", refresh: "eyJ..." }
                          ↓
5. Frontend stores tokens in browser localStorage
                          ↓
6. Frontend redirects you to http://localhost:5173/home
                          ↓
7. You are logged in! ✅
```

## Troubleshooting

### Problem: Login shows "Invalid credentials"

**Check:**
```bash
# 1. Are you using the correct username?
cd Tezrisat_Backend
python manage.py shell
from django.contrib.auth.models import User
for user in User.objects.all():
    print(f"Username: {user.username}, Superuser: {user.is_superuser}")

# 2. Test token endpoint manually
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"equbit","password":"test123"}'

# 3. Check if backend is running
curl http://localhost:8000/api/
```

### Problem: "Cannot connect to backend"

**Check:**
```bash
# Is backend running?
curl http://localhost:8000/

# Is frontend using correct API URL?
cat Tezrisat_Frontend/tezrisat_frontend/.env
# Should show: VITE_API_URL="http://localhost:8000"

# Check frontend console for errors (F12 → Console tab)
```

### Problem: Page stuck on loading after login

**Check:**
```bash
# 1. Check browser console (F12)
# 2. Check backend terminal for errors
# 3. Restart both frontend and backend
```

## What Happens After Login

Once logged in, you can:
1. ✅ Access protected pages
2. ✅ View your profile
3. ✅ Create/edit microcourses
4. ✅ Access your account settings
5. ✅ Logout and login again

## API Testing

### Get Current User Info
```bash
# After getting token, use it to make authenticated requests
ACCESS_TOKEN="eyJ..." # From login response

curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:8000/api/users/current/
```

### Refresh Token
```bash
REFRESH_TOKEN="eyJ..."

curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"'$REFRESH_TOKEN'"}'
```

## Important Files

### Backend Authentication
- `Tezrisat_Backend/settings.py` - JWT configuration
- `Tezrisat_Backend/urls.py` - Token endpoints
- `api/models.py` - User model

### Frontend Authentication
- `src/api.js` - API client (fixed to use localhost)
- `src/pages/LoginPage.tsx` - Login form (fixed validation)
- `src/constants.js` - Token storage keys

## Configuration Details

### Backend Settings (Verified)
```python
# JWT Configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

# Authentication
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",  # for dev
    ],
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True  # for dev
```

### Frontend Configuration (Fixed)
```javascript
// src/api.js - Now correctly uses localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-type": "application/json",
  },
});
```

## Next Steps

1. ✅ **Backend running?** `bash run_dev.sh` in `Tezrisat_Backend`
2. ✅ **Frontend running?** `npm run dev` in `Tezrisat_Frontend/tezrisat_frontend`
3. ✅ **Access login?** Go to `http://localhost:5173/home#/login`
4. ✅ **Login with:** `equbit` (or any superuser account)
5. ✅ **See dashboard?** You're in!

## Debugging Commands

```bash
# Check if services are running
curl http://localhost:8000/api/          # Backend
curl http://localhost:5173/              # Frontend

# Check database users
cd Tezrisat_Backend && python manage.py shell
from django.contrib.auth.models import User
User.objects.all().values('username', 'is_superuser')

# Check token endpoint directly
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"equbit","password":"PASSWORD"}'

# Check frontend env
cat Tezrisat_Frontend/tezrisat_frontend/.env

# Check browser storage (in DevTools Console)
localStorage.getItem('access_token')
localStorage.getItem('refresh_token')
```

## Security Reminders

⚠️ **For Local Development Only:**
- DEBUG = True
- CORS_ALLOW_ALL_ORIGINS = True
- PASSWORD_HASHERS not overridden
- No HTTPS

For production, these must be changed!

---

**You're all set!** Your login system is fully integrated and ready to test. 🚀
