# Static Folder Setup - Complete ✅

## What Was Done

I've successfully configured ZAPI to serve the frontend build from a static `public/` folder. This allows you to run a single production server instead of two separate dev servers.

---

## Changes Made

### 1. **Created `public/` Folder** ✅
```
ZAPI/
├── public/              ← NEW folder
│   ├── .gitkeep        ← Keeps folder in git
│   ├── index.html      ← Built React app
│   ├── assets/         ← JS & CSS bundles
│   │   ├── index-*.js
│   │   └── index-*.css
│   └── images/         ← Static images
```

### 2. **Updated Vite Config** ✅
**File**: `frontend/vite.config.js`

**Changes**:
- Added ES module `__dirname` polyfill (needed for `import` syntax)
- Set build output directory to `../public`
- Added `/webhook` proxy for development
- Configured to empty output directory on each build

### 3. **Updated Backend Server** ✅
**File**: `src/server.js`

**Changes**:
- Added `express.static()` middleware to serve files from `public/`
- Added SPA fallback route (`app.get('*')`) to serve `index.html` for all non-API routes
- API/webhook routes are excluded from SPA fallback
- Helpful error message if frontend isn't built yet

### 4. **Added Build Scripts** ✅
**File**: `package.json`

**New scripts**:
```json
{
  "build:frontend": "cd frontend && npm run build",
  "build": "npm run build:frontend",
  "start": "NODE_ENV=production node src/server.js"
}
```

### 5. **Updated .gitignore** ✅
**File**: `.gitignore`

**Added**:
```
# Frontend build output
public/*
!public/.gitkeep
```

This ensures built files aren't committed to git, but the folder structure is preserved.

---

## How to Use

### **Development Mode** (Two Servers)

```bash
# Terminal 1 - Backend API
npm run dev

# Terminal 2 - Frontend with HMR
cd frontend
npm run dev
```

- Backend: `http://localhost:5000` (API only)
- Frontend: `http://localhost:5173` (React dev server with hot reload)

### **Production Mode** (Single Server)

```bash
# Step 1: Build frontend
npm run build

# Step 2: Start production server
npm start
```

- Everything served from: `http://localhost:5000`
- Frontend files served from `public/`
- API routes still work at `/api/*` and `/webhook/*`

---

## Architecture

### Development:
```
Browser → http://localhost:5173 (Vite dev server)
   ↓
   Proxy: /api → http://localhost:5000 (Express backend)
```

### Production:
```
Browser → http://localhost:5000 (Express)
   ↓
   ├── /api/* → API routes
   ├── /webhook/* → Webhook routes
   ├── /health → Health check
   └── /* → Serve from public/ folder
```

---

## Route Prioritization

The server checks routes in this order:

1. **Stripe Webhook** → `/webhook/stripe` (raw body needed)
2. **Other Webhooks** → `/webhook/twilio`, `/webhook/monei`
3. **API Routes** → `/api/*`
4. **Static Files** → Files in `public/` (JS, CSS, images)
5. **Health Check** → `/health`
6. **SPA Fallback** → Serve `index.html` for all other routes

---

## Verification

### Test the Build:

```bash
# Build frontend
npm run build

# Check files were created
ls -la public/
# Should see: index.html, assets/, images/

# Check assets
ls -la public/assets/
# Should see: index-*.js, index-*.css
```

### Test Production Server:

```bash
# Start server
npm start

# Test routes (in another terminal)
curl http://localhost:5000/              # → index.html
curl http://localhost:5000/login         # → index.html (SPA route)
curl http://localhost:5000/api/health    # → {"status":"ok",...}
curl http://localhost:5000/health        # → {"status":"ok",...}
```

---

## File Structure

```
ZAPI/
├── public/                  ← Frontend build output (git-ignored)
│   ├── .gitkeep            ← Keeps folder in git
│   ├── index.html          ← React app entry
│   ├── assets/             ← Bundled JS & CSS
│   └── images/             ← Static assets
├── frontend/
│   ├── src/                ← React source code
│   └── vite.config.js      ← Build config (outputs to ../public)
├── src/
│   └── server.js           ← Serves static files from public/
└── package.json            ← Build scripts
```

---

## Important Notes

⚠️ **Port 5000 Conflict**: If you get "Address already in use" error, port 5000 may be occupied by AirPlay/AirTunes on Mac.

**Solutions**:
1. Change port in `.env`: `PORT=3000`
2. Or disable AirPlay Receiver in System Preferences → General → AirDrop & Handoff

⚠️ **Build Required**: The production server won't work until you run `npm run build` at least once.

⚠️ **Environment Variables**: The dotenv warning about missing variables is safe to ignore in development (mock implementations are used).

---

## Summary

✅ **Static folder created** (`public/`)
✅ **Frontend builds to `public/`**
✅ **Backend serves from `public/`**
✅ **SPA routing works**
✅ **API routes prioritized**
✅ **Build scripts added**
✅ **Git ignore configured**

**Result**: You can now deploy ZAPI as a single server application!

---

## Next Steps

1. Test the production build locally
2. Deploy to a hosting service (Render, Railway, Vercel, etc.)
3. Set environment variables in production
4. Configure domain and SSL certificate

The static folder setup is complete and ready for production deployment! 🚀
