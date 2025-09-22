# MedixScan Backend - Railway Deployment

## 🚂 Quick Railway Setup

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy Backend
```bash
cd backend
railway init
railway up
```

### 3. Add PostgreSQL
In Railway dashboard:
- Click "New Service" → "PostgreSQL"
- Railway will automatically provide DATABASE_URL

### 4. Environment Variables
Add these in Railway dashboard → Variables:

```env
SECRET_KEY=your-generated-secret-key
DEBUG=False
ALLOWED_HOSTS=*.railway.app,your-domain.com
FRONTEND_URL=https://your-vercel-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
RAILWAY_ENVIRONMENT=production
```

### 5. Run Migrations
```bash
railway shell
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### 6. Your API will be available at:
`https://your-project-name.railway.app`

## 📋 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Generate using Django |
| `DEBUG` | Debug mode | `False` |
| `DATABASE_URL` | PostgreSQL connection | Auto-provided by Railway |
| `ALLOWED_HOSTS` | Allowed domains | `*.railway.app,yourdomain.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourapp.vercel.app` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_HOST_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | Email app password | App-specific password |

## 🔍 Testing Your Deployment

```bash
# Test health endpoint
curl https://your-app.railway.app/health/

# Test API
curl https://your-app.railway.app/api/v1/

# Test admin
# Visit: https://your-app.railway.app/admin/
```

## 📊 Monitoring

```bash
# View logs
railway logs

# Monitor service
railway status

# Access shell
railway shell
```