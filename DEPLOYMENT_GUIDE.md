# 🚀 MediXScan Complete Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [GitHub Actions Setup](#github-actions-setup)
5. [Post-Deployment Tasks](#post-deployment-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account with repository access
- [ ] Railway account (https://railway.app)
- [ ] Vercel account (https://vercel.com)

### Required Tools
```bash
# Install Node.js 18+
node --version

# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel
```

---

## Backend Deployment (Railway)

> **Note:** All Railway deployment files are located in the `backend/` directory:
> - `backend/Dockerfile.railway` - Docker configuration
> - `backend/railway.json` - Railway configuration
> - `backend/entrypoint.sh` - Startup script

### Step 1: Create Railway Project

1. **Login to Railway CLI**
```bash
railway login
```

2. **Create new Railway project**
```bash
cd /home/afhm/alifsense/prod/MediXScan_Final
railway init
# Choose "Empty Project"
# Name it: MediXScan-Backend
```

3. **Add PostgreSQL Database**
```bash
railway add
# Select "PostgreSQL"
```

### Step 2: Configure Railway Environment Variables

Go to [Railway Dashboard](https://railway.app/dashboard) → Your Project → Variables

Add these environment variables:

```env
# Django Configuration
SECRET_KEY=@yHkPmD(L#%&Bpvba0wh0(vW@hbSYvV%I3zp%XXs+nuE44K@ZN$Tej=oL-hh*4VL
JWT_SECRET_KEY=H!gHt*z3ktZOqp%LLxxeLxpY71pjLYMUH$*Pr^sQ2sFaubLc--zVio+Yskaf-_9HPKxf3r0Q
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings

# Allowed Hosts (Update with your Vercel domain)
ALLOWED_HOSTS=*.railway.app,*.up.railway.app,medixscan.vercel.app
FRONTEND_URL=https://medixscan.vercel.app

# Database (Auto-provided by Railway)
DATABASE_URL=[Auto-provided]

# Admin Credentials (Optional - for auto-creation)
DJANGO_ADMIN_USERNAME=admin
DJANGO_ADMIN_EMAIL=admin@medixscan.com
DJANGO_ADMIN_PASSWORD=YourSecurePassword2025!

# CORS Settings
CORS_ALLOWED_ORIGINS=https://medixscan.vercel.app,https://localhost:5173

# Optional: Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Step 3: Deploy Backend to Railway

1. **Connect GitHub Repository**
```bash
railway link
# Or manually in Railway Dashboard:
# Settings → GitHub → Connect Repository
# Select: MediXScan_Final
```

2. **Configure Deployment Settings**
- Go to Settings → Deploy
- Root Directory: `/backend` (set to backend folder)
- Build Command: (leave empty - using Dockerfile)
- Start Command: (leave empty - using Dockerfile)

3. **Deploy**
```bash
railway up
```

4. **Get Backend URL**
```bash
railway open
# Note your backend URL: https://medixscanfinal-production.up.railway.app
```

### Step 4: Verify Backend Deployment

```bash
# Test API health endpoint
curl https://medixscanfinal-production.up.railway.app/api/v1/dashboard/health/

# Check admin panel
open https://medixscanfinal-production.up.railway.app/admin/
```

---

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

1. **Update .env.production with Railway Backend URL**
```bash
cd frontend
# Edit .env.production and update:
VITE_API_URL=https://medixscanfinal-production.up.railway.app
```

### Step 2: Login to Vercel

```bash
vercel login
# Enter your email and follow authentication
```

### Step 3: Deploy to Vercel

1. **Initialize Vercel Project**
```bash
cd frontend
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? **[Select your account]**
- Link to existing project? **N**
- Project name? **medixscan-frontend**
- Directory with code? **./frontend**
- Override settings? **N**

2. **Configure Environment Variables in Vercel Dashboard**

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables for **Production** environment:

```env
VITE_API_URL=https://medixscanfinal-production.up.railway.app
VITE_API_TIMEOUT=15000
VITE_NODE_ENV=production
VITE_APP_NAME=MediXScan
VITE_APP_VERSION=1.0.0
NODE_ENV=production
SASS_SILENCE_DEPRECATIONS=*
SASS_QUIET_DEPS=1
```

3. **Deploy to Production**
```bash
vercel --prod
```

4. **Get Frontend URL**
```
Your production URL: https://medixscan-frontend.vercel.app
```

### Step 4: Update Railway CORS Settings

Go back to Railway Dashboard and update:
```env
ALLOWED_HOSTS=*.railway.app,*.up.railway.app,medixscan-frontend.vercel.app
FRONTEND_URL=https://medixscan-frontend.vercel.app
CORS_ALLOWED_ORIGINS=https://medixscan-frontend.vercel.app
```

Redeploy Railway:
```bash
railway up
```

---

## GitHub Actions Setup

### Step 1: Get Required Tokens

#### Vercel Tokens:
1. Go to [Vercel Settings](https://vercel.com/account/tokens)
2. Create new token: `medixscan-deploy`
3. Copy the token

4. Get Project and Org IDs:
```bash
cd frontend
vercel project ls
# Note the Project ID

vercel team ls
# Note the Org/Team ID
```

#### Railway Token:
1. Go to [Railway Dashboard](https://railway.app/account/tokens)
2. Create new token: `medixscan-deploy`
3. Copy the token

### Step 2: Add GitHub Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:

```yaml
# Vercel Deployment
VERCEL_TOKEN: your-vercel-token
VERCEL_ORG_ID: your-vercel-org-id
VERCEL_PROJECT_ID: your-vercel-project-id

# Railway Deployment
RAILWAY_TOKEN: your-railway-token

# API URLs
VITE_API_URL: https://medixscanfinal-production.up.railway.app
BACKEND_URL: https://medixscanfinal-production.up.railway.app
FRONTEND_URL: https://medixscan-frontend.vercel.app
```

### Step 3: Test GitHub Actions

1. Make a small change to README.md
2. Commit and push to main branch:
```bash
git add .
git commit -m "Test deployment pipeline"
git push origin main
```
3. Check Actions tab in GitHub for deployment status

---

## Post-Deployment Tasks

### 1. Create Production Superuser

```bash
# Using Railway CLI
railway run python manage.py createsuperuser --service backend

# Or SSH into Railway
railway shell
python manage.py createsuperuser
```

### 2. Load Initial Data (if any)

```bash
railway run python manage.py loaddata initial_data.json --service backend
```

### 3. Configure Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain: `app.yourdomain.com`
3. Follow DNS configuration instructions

#### For Backend (Railway):
1. Go to Railway Dashboard → Settings → Domains
2. Add custom domain: `api.yourdomain.com`
3. Configure DNS records

### 4. Setup Monitoring

#### Frontend Monitoring:
- Vercel automatically provides analytics
- Optional: Add Google Analytics or Sentry

#### Backend Monitoring:
- Check Railway logs: `railway logs`
- Optional: Add Sentry for error tracking

### 5. Configure Backups

For PostgreSQL on Railway:
1. Go to Database service → Settings
2. Enable automatic backups
3. Set backup schedule

---

## Troubleshooting

### Common Issues and Solutions

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**:
```python
# Update Railway environment variable
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

#### 2. Database Connection Failed
**Problem**: Backend can't connect to PostgreSQL
**Solution**:
- Check DATABASE_URL is set correctly in Railway
- Ensure PostgreSQL service is running

#### 3. Static Files Not Loading
**Problem**: Admin panel CSS not loading
**Solution**:
```bash
railway run python manage.py collectstatic --service backend
```

#### 4. Build Failures on Vercel
**Problem**: Frontend build fails
**Solution**:
- Check Node version compatibility
- Clear cache: `vercel --force`
- Check SASS deprecation warnings

#### 5. Railway Deployment Stuck
**Problem**: Deployment hangs
**Solution**:
```bash
# Check logs
railway logs

# Restart deployment
railway restart

# Force redeploy
railway up --detach
```

### Debug Commands

```bash
# Check Railway logs
railway logs --service backend

# Check Vercel logs
vercel logs medixscan-frontend

# Test backend locally with production DB
railway run python manage.py runserver

# SSH into Railway container
railway shell
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All code committed to GitHub
- [ ] Environment variables prepared
- [ ] Accounts created (Railway, Vercel)
- [ ] CLI tools installed

### Backend (Railway)
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Backend deployed successfully
- [ ] Admin panel accessible
- [ ] API endpoints responding

### Frontend (Vercel)
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Frontend deployed successfully
- [ ] Can connect to backend API
- [ ] All pages loading correctly

### Post-Deployment
- [ ] CORS configured correctly
- [ ] Superuser created
- [ ] GitHub Actions working
- [ ] Health checks passing
- [ ] Monitoring setup

---

## 📞 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Check Vercel logs: Dashboard → Functions → Logs
3. Review GitHub Actions: Repository → Actions tab
4. Check browser console for frontend errors

---

## 🎉 Congratulations!

Your MediXScan application is now deployed with:
- ✅ Backend on Railway with PostgreSQL
- ✅ Frontend on Vercel
- ✅ CI/CD with GitHub Actions
- ✅ Automatic deployments on push to main

**Production URLs:**
- Frontend: https://medixscan-frontend.vercel.app
- Backend API: https://medixscanfinal-production.up.railway.app
- Admin Panel: https://medixscanfinal-production.up.railway.app/admin/