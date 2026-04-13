# Vercel Backend Setup Guide

This guide explains how to deploy the Vercel serverless functions for secure Brankas integration.

## Overview

The Vercel backend provides a **FREE** secure way to handle Brankas API calls without exposing your secret key in the frontend.

### API Endpoints Created

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/brankas/callback` | POST | Exchange OAuth code for tokens & accounts |
| `/api/brankas/create-session` | POST | Create Brankas session |
| `/api/brankas/get-session` | GET | Get session status |
| `/api/brankas/sync` | POST | Sync account (balance + transactions) |
| `/api/brankas/transactions` | POST | Fetch transactions |
| `/api/brankas/balance` | POST | Fetch balance |
| `/api/brankas/disconnect` | POST | Disconnect account |

## Setup Instructions

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Set Environment Variable in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project (`fintraph`)
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `BRANKAS_SECRET_KEY`
   - **Value**: `SANDBOX-ImDnGc0tftvcNv7yNAj4WKV1YBfPFMfh3DKox9c0f7KfHYcEB4i1Btr1lsy9WiK4`
   - **Environment**: Production (and Preview if testing)

### 3. Deploy

#### Option A: Git Push (Automatic)

Just push to GitHub and Vercel auto-deploys:

```bash
git add .
git commit -m "Add Vercel backend for Brankas"
git push origin main
```

#### Option B: Vercel CLI

```bash
vercel --prod
```

### 4. Verify Deployment

Test an API endpoint:

```bash
curl https://fintraph.vercel.app/api/brankas/create-session \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"institution":"gcash","redirect_url":"https://fintraph.vercel.app/callback"}'
```

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Your React    │──────▶│  Vercel Functions │──────▶│   Brankas   │
│    Frontend     │◀──────│   (FREE tier)    │◀──────│     API     │
│                 │        │                  │      │             │
│  No Secret Key  │        │  Has Secret Key  │      │             │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

## Security Benefits

✅ **Secret key never exposed** in frontend code  
✅ **CORS protection** - API only callable from your domain  
✅ **Environment variables** securely stored on Vercel  
✅ **FREE** - Vercel Hobby plan includes generous free tier

## Free Tier Limits (Vercel Hobby)

- **Function invocations**: 125,000 per month
- **Execution time**: 10 seconds per function
- **Memory**: 1024 MB per function
- **Concurrent executions**: 1000

For a personal finance app, these limits are very generous!

## Local Development

To test locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Set local env variable
vercel env add BRANKAS_SECRET_KEY

# Start dev server (includes API routes)
vercel dev
```

The frontend will automatically call `http://localhost:3000/api/brankas/*`

## Switching to Production

When ready for production Brankas:

1. Get your production Brankas secret key
2. Update Vercel environment variable:
   ```
   BRANKAS_SECRET_KEY=YOUR_PRODUCTION_KEY
   ```
3. Redeploy

## Troubleshooting

### Function not found (404)
- Check the file is in `/api/brankas/*.ts`
- Ensure file exports a default handler function
- Redeploy: `vercel --prod`

### CORS errors
- Functions already include CORS headers
- Check if calling from allowed origin

### "Secret key not configured" error
- Verify env variable is set in Vercel dashboard
- Redeploy after setting env vars
- Check Functions Logs in Vercel dashboard

## Files Changed

- ✅ `api/brankas/*.ts` - All API endpoints
- ✅ `src/services/brankas.ts` - Updated to call Vercel API
- ✅ `src/pages/CallbackPage.tsx` - Uses Vercel backend
- ✅ `src/types/finance.ts` - Added token fields
- ✅ `src/context/FinanceContext.tsx` - Passes tokens to API
- ✅ `vercel.json` - Vercel configuration

## Comparison: Before vs After

| Aspect | Before (Direct API) | After (Vercel Backend) |
|--------|-------------------|----------------------|
| Secret Key | In frontend (exposed) | In backend (secure) |
| Cost | Free | Free |
| Security | ⚠️ Low | ✅ High |
| Setup | Simple | Medium |

## Next Steps

1. ✅ Push code to GitHub (already done)
2. ⏭️ Set env variable in Vercel Dashboard
3. ⏭️ Test the flow
4. ⏭️ Monitor Function Logs for any issues

Your app now has a **production-ready, secure backend** for Brankas integration! 🚀
