# MedixScan Deployment Guide - Vercel + Railway

## 🚀 Deployment Architecture

- **Frontend**: React app deployed on **Vercel**
- **Backend**: Django API deployed on **Railway**  
- **Database**: PostgreSQL hosted on **Railway**
- **File Storage**: Railway volumes or AWS S3

---

## 🎯 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with your frontend code

### Step 1: Prepare Frontend for Production

1. **Update Environment Variables**
   ```bash
   # Update frontend/.env
   REACT_APP_API_URL=https://your-backend-name.railway.app/api/v1
   REACT_APP_NAME=MedixScan
   REACT_APP_VERSION=1.0.0
   ```

2. **Test Build Locally**
   ```bash
   cd frontend
   npm install
   npm run build
   npm run preview
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Login and deploy
vercel login
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: medixscan-frontend
# - Directory: ./
# - Want to override settings? Yes
# - Build command: npm run build
# - Output directory: build
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `frontend` folder as root directory
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL = https://your-backend-name.railway.app/api/v1
   REACT_APP_NAME = MedixScan
   ```
7. Deploy

### Step 3: Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## 🛠 Backend Deployment (Railway)

### Prerequisites
- Railway account
- GitHub repository with your backend code

### Step 1: Prepare Backend for Production

1. **Create Production Environment File**
   ```bash
   # Copy .env.example to .env in backend folder
   cp backend/.env.example backend/.env
   ```

2. **Update requirements.txt** (if needed)
   ```
   # Add any missing dependencies
   django-redis==5.3.0
   ```

### Step 2: Deploy to Railway

#### Option A: Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend folder
cd backend

# Initialize Railway project
railway init

# Deploy
railway up
```

#### Option B: Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select backend folder (if monorepo)

### Step 3: Configure Railway Services

#### 3.1 PostgreSQL Database
1. In Railway dashboard, click "New Service"
2. Select "PostgreSQL"
3. Note the connection details provided

#### 3.2 Backend Service Configuration
1. Go to your backend service → Settings → Variables
2. Add environment variables:

```env
# Required Environment Variables
SECRET_KEY=your-super-secret-key-generate-a-strong-one
DEBUG=False
ALLOWED_HOSTS=*.railway.app,your-domain.com
FRONTEND_URL=https://your-vercel-app.vercel.app

# Database (Railway will provide these automatically)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Redis (if using Railway Redis addon)
REDIS_URL=redis://localhost:6379/0

# Security
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Railway specific
RAILWAY_ENVIRONMENT=production
PORT=8000
```

### Step 4: Database Migration
```bash
# Using Railway CLI (after deployment)
railway shell

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### Step 5: Connect Frontend to Backend
1. Update Vercel environment variables with your Railway backend URL:
   ```
   REACT_APP_API_URL = https://your-backend-name.railway.app/api/v1
   ```
2. Redeploy frontend on Vercel

---

## 🔧 Post-Deployment Configuration

### 1. Test API Connection
```bash
# Test backend health
curl https://your-backend-name.railway.app/health/

# Test API endpoints
curl https://your-backend-name.railway.app/api/v1/auth/
```

### 2. Frontend API Integration
Update your frontend API base URL:
```javascript
// In your frontend API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
```

### 3. Configure CORS
Ensure your Railway backend allows requests from Vercel:
```python
# In Django settings
CORS_ALLOWED_ORIGINS = [
    "https://your-vercel-app.vercel.app",
    "https://your-custom-domain.com",
]
```

---

## 📊 Monitoring & Maintenance

### Railway Monitoring
- Monitor logs: `railway logs`
- Check metrics in Railway dashboard
- Set up health checks

### Vercel Monitoring  
- View deployment logs in Vercel dashboard
- Monitor performance metrics
- Set up error tracking

### Database Backups
```bash
# Railway PostgreSQL backup
railway db backup create

# Restore from backup
railway db backup restore <backup-id>
```

---

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ALLOWED_ORIGINS in Django settings
   - Ensure frontend URL is correct

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check Railway database service status

3. **Static Files Not Loading**
   - Run `python manage.py collectstatic`
   - Check STATIC_ROOT and STATIC_URL settings

4. **Environment Variables**
   - Verify all required env vars are set in Railway
   - Check Vercel environment variables

### Helpful Commands
```bash
# Railway debugging
railway logs --tail
railway shell
railway status

# Vercel debugging  
vercel logs
vercel env ls
vercel inspect
```

---

## 💰 Cost Optimization

### Railway (Backend)
- **Hobby Plan**: $5/month (suitable for development)
- **Pro Plan**: $20/month (production ready)
- PostgreSQL included in plans

### Vercel (Frontend)
- **Free Tier**: Perfect for personal projects
- **Pro Plan**: $20/month for commercial use

### Total Estimated Cost
- **Development**: Free (Vercel) + $5 (Railway) = $5/month
- **Production**: $20 (Vercel) + $20 (Railway) = $40/month

---

## ✅ Deployment Checklist

### Pre-deployment
- [ ] Test build locally
- [ ] Environment variables configured
- [ ] Database models migrated
- [ ] Static files collected
- [ ] CORS configured properly

### Post-deployment
- [ ] Health checks passing
- [ ] API endpoints working
- [ ] Frontend-backend communication working
- [ ] Database accessible
- [ ] Admin panel accessible
- [ ] File uploads working (if applicable)

### Production Ready
- [ ] Custom domain configured
- [ ] SSL certificates installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Performance monitoring active

**Congratulations! Your MedixScan application is now live! 🎉**