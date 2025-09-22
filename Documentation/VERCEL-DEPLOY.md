# MedixScan Frontend - Vercel Deployment

## ▲ Quick Vercel Setup

### 1. Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

### 2. Deploy Frontend
```bash
cd frontend
vercel

# Follow prompts:
# Project name: medixscan-frontend
# Directory: ./
# Override settings: Yes
# Build command: npm run build  
# Output directory: build
```

### 3. Environment Variables
Add in Vercel dashboard → Settings → Environment Variables:

```env
REACT_APP_API_URL=https://your-railway-backend.railway.app/api/v1
REACT_APP_NAME=MedixScan
REACT_APP_VERSION=1.0.0
```

### 4. Your app will be available at:
`https://medixscan-frontend.vercel.app`

## 🎯 Vercel Dashboard Deployment

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Select `frontend` folder
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

## 🔧 Custom Domain Setup

1. Vercel Dashboard → Settings → Domains
2. Add your domain: `medixscan.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 📊 Monitoring

- View deployments in Vercel dashboard
- Check build logs for errors
- Monitor performance metrics
- Set up error tracking

## ⚡ Performance Tips

- Vite automatically optimizes builds
- Static assets are cached by Vercel CDN
- Images are automatically optimized
- Gzip compression enabled by default