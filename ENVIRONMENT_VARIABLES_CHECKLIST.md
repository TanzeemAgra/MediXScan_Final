# MediXScan Environment Variables Checklist
# =====================================================

## CRITICAL FRONTEND ENVIRONMENT VARIABLES (Vercel)
## =====================================================

✅ **Currently Set in vercel.json:**
- VITE_API_URL=https://medixscanfinal-production.up.railway.app
- VITE_API_TIMEOUT=15000
- VITE_NODE_ENV=production
- VITE_APP_NAME=MediXScan
- VITE_APP_VERSION=1.0.0
- VITE_RAILWAY_BACKEND=https://medixscanfinal-production.up.railway.app
- NODE_ENV=production
- SASS_SILENCE_DEPRECATIONS=*
- SASS_QUIET_DEPS=1
- MODE=production

## CRITICAL BACKEND ENVIRONMENT VARIABLES (Railway)
## =====================================================

⚠️  **MUST BE SET IN RAILWAY DASHBOARD:**

### Database & Core Settings
- DATABASE_URL (Railway provides this automatically)
- SECRET_KEY (Generate a secure key)
- DEBUG=False (for production)
- DJANGO_SETTINGS_MODULE=config.settings

### Frontend Integration
- FRONTEND_URL=https://your-vercel-app.vercel.app
- ALLOWED_HOSTS=*.railway.app,*.up.railway.app,medixscanfinal-production.up.railway.app

### JWT Authentication
- JWT_SECRET_KEY (Generate a secure key)
- JWT_ACCESS_TOKEN_LIFETIME=30 (minutes)
- JWT_REFRESH_TOKEN_LIFETIME=7 (days)

### Email (Optional but recommended)
- EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USE_TLS=True
- EMAIL_HOST_USER=your-email@gmail.com
- EMAIL_HOST_PASSWORD=your-app-password

### API Rate Limiting
- API_RATE_LIMIT=1000/hour

### File Upload
- MAX_UPLOAD_SIZE=10485760 (10MB)
- ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,docx

### Healthcare Compliance
- HIPAA_AUDIT_LOG=True
- SESSION_TIMEOUT=1800 (30 minutes)

## ENVIRONMENT-SPECIFIC ISSUES TO CHECK
## =====================================================

### 1. CORS Configuration
The backend is configured to allow your Vercel frontend, but you need to update:
- Add your actual Vercel domain to CORS_ALLOWED_ORIGINS
- Ensure FRONTEND_URL points to your Vercel app

### 2. Railway Environment Setup
Check that Railway dashboard has these variables set:
- SECRET_KEY (Django secret key)
- DATABASE_URL (should be auto-provided)
- DEBUG=False
- FRONTEND_URL=https://your-frontend-domain.vercel.app

### 3. Vercel Environment Setup
The vercel.json is configured, but check if you need:
- VITE_API_URL pointing to your Railway backend
- Proper domain in VITE_RAILWAY_BACKEND

## NEXT STEPS
## =====================================================
1. Set missing environment variables in Railway dashboard
2. Update FRONTEND_URL to match your Vercel deployment domain  
3. Test the connection between frontend and backend
4. Verify CORS is properly configured for cross-origin requests