# MedixScan Deployment Guide

## 🚀 Production Deployment

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the `build/` folder** to your static hosting provider

### Option 2: Traditional Web Server (Apache, Nginx)

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Copy build files** to your web server's document root

3. **Configure server** for Single Page Application:
   
   **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/build;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript application/json;
   }
   ```

   **Apache (.htaccess):**
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run:**
   ```bash
   docker build -t medixscan-frontend .
   docker run -p 80:80 medixscan-frontend
   ```

## 🔧 Environment Configuration

Update `.env` file with your production settings:

```env
PUBLIC_URL="/"
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_API_KEY=your-api-key-here
REACT_APP_NAME="MedixScan"
REACT_APP_VERSION="1.0.0"
```

## ✅ Pre-deployment Checklist

- [ ] Update API endpoints in `.env`
- [ ] Test build process: `npm run build`
- [ ] Verify all routes work in production
- [ ] Test responsive design on different devices
- [ ] Check console for any errors
- [ ] Optimize images and assets
- [ ] Configure proper caching headers
- [ ] Set up SSL certificate
- [ ] Configure monitoring and analytics

## 📊 Performance Optimization

1. **Enable Gzip compression** on your server
2. **Set proper cache headers** for static assets
3. **Use CDN** for faster asset delivery
4. **Enable HTTP/2** on your server
5. **Monitor bundle size** with `npm run build -- --analyze`

## 🔒 Security Considerations

- Always use HTTPS in production
- Configure Content Security Policy (CSP)
- Set secure HTTP headers
- Regularly update dependencies
- Sanitize user inputs
- Implement proper authentication

## 📱 Mobile Optimization

The app is already mobile-optimized, but verify:
- Touch targets are properly sized
- Scrolling works smoothly
- Forms are mobile-friendly
- Images load efficiently on slow connections

## 🚨 Troubleshooting

**Build fails:**
- Check Node.js version (requires v16+)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**Blank page after deployment:**
- Check console for JavaScript errors
- Verify PUBLIC_URL is correctly set
- Ensure server is configured for SPA routing

**Assets not loading:**
- Check network tab in browser dev tools
- Verify asset paths in build output
- Check server configuration for static files