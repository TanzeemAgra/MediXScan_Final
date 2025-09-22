# 🔐 Secure Environment Variables for Railway Deployment
# =====================================================

## GENERATED SECURE KEYS (Copy to Railway Dashboard)

### Django SECRET_KEY:
```
@yHkPmD(L#%&Bpvba0wh0(vW@hbSYvV%I3zp%XXs+nuE44K@ZN$Tej=oL-hh*4VL
```

### JWT_SECRET_KEY:
```
H!gHt*z3ktZOqp%LLxxeLxpY71pjLYMUH$*Pr^sQ2sFaubLc--zVio+Yskaf-_9HPKxf3r0Q
```

## COMPLETE RAILWAY ENVIRONMENT VARIABLES SETUP

### 🔴 CRITICAL - Add These to Railway Dashboard:

1. **SECRET_KEY**
   ```
   @yHkPmD(L#%&Bpvba0wh0(vW@hbSYvV%I3zp%XXs+nuE44K@ZN$Tej=oL-hh*4VL
   ```

2. **JWT_SECRET_KEY**
   ```
   H!gHt*z3ktZOqp%LLxxeLxpY71pjLYMUH$*Pr^sQ2sFaubLc--zVio+Yskaf-_9HPKxf3r0Q
   ```

3. **DEBUG**
   ```
   False
   ```

4. **DJANGO_SETTINGS_MODULE**
   ```
   config.settings
   ```

5. **FRONTEND_URL** (Update with your actual Vercel URL)
   ```
   https://your-frontend-app.vercel.app
   ```

6. **ALLOWED_HOSTS** (Update with your domains)
   ```
   *.railway.app,*.up.railway.app,your-frontend-app.vercel.app
   ```

### 🟡 OPTIONAL - Recommended for Production:

7. **API_RATE_LIMIT**
   ```
   1000/hour
   ```

8. **JWT_ACCESS_TOKEN_LIFETIME**
   ```
   30
   ```

9. **JWT_REFRESH_TOKEN_LIFETIME**
   ```
   7
   ```

10. **SESSION_TIMEOUT**
    ```
    1800
    ```

## 📋 STEP-BY-STEP SETUP INSTRUCTIONS

### Step 1: Access Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Navigate to your MediXScan project
3. Click on your backend service
4. Go to the "Variables" tab

### Step 2: Add Environment Variables
Copy and paste each variable name and value from above:

```
Variable Name: SECRET_KEY
Value: @yHkPmD(L#%&Bpvba0wh0(vW@hbSYvV%I3zp%XXs+nuE44K@ZN$Tej=oL-hh*4VL

Variable Name: JWT_SECRET_KEY  
Value: H!gHt*z3ktZOqp%LLxxeLxpY71pjLYMUH$*Pr^sQ2sFaubLc--zVio+Yskaf-_9HPKxf3r0Q

Variable Name: DEBUG
Value: False

Variable Name: DJANGO_SETTINGS_MODULE
Value: config.settings
```

### Step 3: Update URLs
Replace `your-frontend-app.vercel.app` with your actual Vercel deployment URL in:
- FRONTEND_URL
- ALLOWED_HOSTS (add it to the comma-separated list)

### Step 4: Deploy
1. Save all environment variables
2. Redeploy your Railway service
3. Check the deployment logs for any errors

## 🔍 VERIFICATION

After setting up, your Railway backend should:
- ✅ Start without module import errors
- ✅ Connect to the database successfully  
- ✅ Accept requests from your Vercel frontend
- ✅ Authenticate users with JWT tokens

## 🚨 SECURITY NOTES

- ✅ These keys are cryptographically secure (64+ characters)
- ✅ Never commit these to version control
- ✅ Only add them to Railway dashboard environment variables
- ✅ Regenerate keys if ever compromised

## 🆘 TROUBLESHOOTING

If deployment still fails after adding these:
1. Check Railway logs for specific error messages
2. Verify all variable names are spelled correctly
3. Ensure DEBUG=False (not "false" or "0")
4. Make sure FRONTEND_URL matches your Vercel domain exactly