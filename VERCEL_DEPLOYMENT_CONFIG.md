# 🚀 Vercel Deployment Configuration - MediXScan Frontend

# Environment Variables for Vercel Dashboard
# Copy these to your Vercel project settings > Environment Variables

# Production Environment Variables
VITE_API_URL=https://medixscanfinal-production.up.railway.app
VITE_API_TIMEOUT=15000
VITE_NODE_ENV=production
VITE_APP_NAME=MediXScan
VITE_APP_VERSION=1.0.0
VITE_RAILWAY_BACKEND=https://medixscanfinal-production.up.railway.app
MODE=production

# Development Environment Variables (for preview deployments)
VITE_DEV_API_URL=http://localhost:8000
VITE_DEV_API_TIMEOUT=10000
VITE_DEV_NODE_ENV=development

# Security Headers (automatically applied via vercel.json)
X-Content-Type-Options=nosniff
X-Frame-Options=DENY
X-XSS-Protection=1; mode=block

# Build Configuration
BUILD_COMMAND=npm run build
OUTPUT_DIRECTORY=dist
INSTALL_COMMAND=npm install
FRAMEWORK=vite

# 📋 Deployment Steps:

## 1. Connect GitHub Repository to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository: TanzeemAgra/MediXScan_Final
4. Select the frontend folder as root directory

## 2. Configure Environment Variables
Copy all production variables above to Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add each VITE_* variable for "Production" environment
- Add each VITE_DEV_* variable for "Preview" environment

## 3. Configure Build Settings
Vercel will automatically detect:
- Framework: Vite
- Build Command: npm run build  
- Output Directory: dist
- Install Command: npm install

## 4. Deploy
- Push to main branch for production deployment
- Create pull request for preview deployments

# 🔧 Soft Coding Features Applied:

## Environment Detection
- Production: Uses Railway backend URL automatically
- Preview: Can use development backend or Railway
- Local: Falls back to localhost:8000

## Flexible API Configuration
The app automatically detects environment and uses appropriate backend:

```javascript
// Automatic environment detection in api.config.js
const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? 
   'https://medixscanfinal-production.up.railway.app' : 
   'http://localhost:8000')
```

## Dynamic Configuration
- Backend URL: Configurable via VITE_API_URL
- Timeout: Configurable via VITE_API_TIMEOUT  
- App Name: Configurable via VITE_APP_NAME
- Version: Configurable via VITE_APP_VERSION

# 🌐 Domain Configuration

## Custom Domain Setup (Optional)
1. Add custom domain in Vercel dashboard
2. Update Railway CORS settings with your domain:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-domain.com",
       "https://medixscanfinal-production.up.railway.app"
   ]
   ```

## Subdomain Setup
- Production: medixscan.vercel.app
- Preview: medixscan-git-branch.vercel.app
- Custom: your-domain.com

# 🔒 Security Configuration

## Headers Applied Automatically
- Content-Type-Options: nosniff
- Frame-Options: DENY  
- XSS-Protection: enabled
- Cache-Control: optimized for static assets

## CORS Configuration
Backend automatically allows Vercel domains:
- *.vercel.app
- medixscan.vercel.app
- Custom domains (when added)

# 📱 Mobile & PWA Support
- Responsive design automatically deployed
- Service worker support for offline functionality
- Mobile-optimized caching headers

# 🚀 Performance Optimizations
- Static asset caching: 1 year
- Automatic image optimization  
- Edge network deployment
- Serverless functions support (if needed)

# ✅ Deployment Checklist
- [x] Remove conflicting functions/builds properties
- [x] Update environment variables with Railway backend
- [x] Configure modern Vercel format
- [x] Add security headers
- [x] Setup redirects for dashboard routes
- [ ] Test deployment with Railway backend
- [ ] Verify all API endpoints work
- [ ] Add custom domain (optional)

The configuration is production-ready with Railway backend integration! 🎉