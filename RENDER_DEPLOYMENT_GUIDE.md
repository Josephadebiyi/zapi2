# SEETA Deployment Guide for Render

## Complete Step-by-Step Guide to Deploy SEETA on Render.com

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Push Code to GitHub](#push-code-to-github)
3. [Set Up MongoDB Atlas (Free)](#set-up-mongodb-atlas)
4. [Set Up Upstash Redis (Free)](#set-up-upstash-redis)
5. [Create Render Account](#create-render-account)
6. [Deploy to Render](#deploy-to-render)
7. [Configure Environment Variables](#configure-environment-variables)
8. [Configure Twilio Webhook](#configure-twilio-webhook)
9. [Test Your Deployment](#test-your-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ GitHub account
- ✅ Twilio account with WhatsApp enabled
- ✅ OpenAI API key
- ✅ Stripe account (for payments)
- ✅ Your SEETA code ready to push

---

## 1. Push Code to GitHub

### Option A: Using GitHub Desktop or Web Interface

1. Go to https://github.com/new
2. Create a new repository named `seeta`
3. Make it **Private** (recommended for production apps)
4. **DO NOT** initialize with README (you already have one)
5. Click "Create repository"

### Option B: Using Command Line

```bash
# Navigate to your SEETA directory
cd /Users/j/Desktop/CLAUDE/SEETA

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SEETA application ready for Render deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/seeta.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 2. Set Up MongoDB Atlas (Free)

Your SEETA application needs a MongoDB database. MongoDB Atlas offers a free tier perfect for getting started.

### Steps:

1. **Sign Up**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Select **M0 (Free tier)**
   - Choose a cloud provider (AWS recommended)
   - Select a region (choose one close to Oregon for best performance with Render)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `seeta-admin`
   - Password: Click "Autogenerate Secure Password" and **COPY IT** (you'll need this)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere" (select 0.0.0.0/0)
   - Click "Confirm"
   - ⚠️ Note: For production, you should whitelist only Render's IP addresses

5. **Get Your Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://seeta-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Replace `<password>`** with the password you copied earlier
   - **Add database name** before the `?`:
     ```
     mongodb+srv://seeta-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/seeta?retryWrites=true&w=majority
     ```

**Save this connection string** - you'll need it for Render environment variables.

---

## 3. Set Up Upstash Redis (Free)

SEETA uses Redis for session management and slot locking.

### Steps:

1. **Sign Up**
   - Go to https://console.upstash.com/
   - Create a free account (GitHub sign-in available)

2. **Create Redis Database**
   - Click "Create Database"
   - Name: `seeta-redis`
   - Type: **Regional**
   - Region: Choose **US-West-1** (closest to Render's Oregon region)
   - Click "Create"

3. **Get Credentials**
   - Click on your database name
   - Scroll to "REST API" section
   - Copy these two values:
     - **UPSTASH_REDIS_REST_URL** (looks like `https://xxx.upstash.io`)
     - **UPSTASH_REDIS_REST_TOKEN** (long string)

**Save these values** - you'll need them for Render environment variables.

---

## 4. Create Render Account

1. Go to https://render.com/
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended - makes deployment easier)
4. Authorize Render to access your GitHub account

---

## 5. Deploy to Render

### Method A: Using render.yaml (Recommended - Fastest)

Your SEETA project already includes a `render.yaml` file that automates the deployment.

1. **Create New Web Service**
   - From Render Dashboard, click "New +"
   - Select "Blueprint"
   - Click "Connect" next to your GitHub account
   - Select your `seeta` repository
   - Click "Connect"

2. **Render will auto-detect the `render.yaml` file**
   - Service name: `seeta` (or choose your own)
   - Click "Apply"

3. **Skip to Step 6** to configure environment variables

### Method B: Manual Setup

1. **Create New Web Service**
   - From Render Dashboard, click "New +"
   - Select "Web Service"
   - Click "Connect" next to your GitHub account
   - Select your `seeta` repository
   - Click "Connect"

2. **Configure Build Settings**
   - **Name:** `seeta` (or choose your preferred name)
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     npm install && npm run build:frontend
     ```
   - **Start Command:**
     ```bash
     npm start
     ```

3. **Configure Instance**
   - **Instance Type:** Free
   - **Environment Variables:** (Skip for now - we'll add these next)

4. **Advanced Settings**
   - **Health Check Path:** `/health`
   - **Auto-Deploy:** Yes (recommended)

5. **Click "Create Web Service"**
   - ⚠️ The first deployment will FAIL - this is expected! We need to add environment variables first.

---

## 6. Configure Environment Variables

After creating your web service, you need to add environment variables.

### Steps:

1. **Go to Your Service Dashboard**
   - Click on your service name (`seeta`)
   - Click "Environment" in the left sidebar

2. **Add Environment Variables**
   - Click "Add Environment Variable"
   - Add each variable below ONE BY ONE:

### Required Environment Variables:

#### Server Configuration
```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 3000
```

#### Database
```
Key: MONGODB_URI
Value: [Paste your MongoDB Atlas connection string from Step 2]
```

Example:
```
mongodb+srv://seeta-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/seeta?retryWrites=true&w=majority
```

#### Authentication
```
Key: JWT_SECRET
Value: [Generate a random 64-character string]
```

To generate a secure JWT secret, run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Twilio WhatsApp Integration
```
Key: TWILIO_ACCOUNT_SID
Value: [Your Twilio Account SID - starts with AC]
```

```
Key: TWILIO_AUTH_TOKEN
Value: [Your Twilio Auth Token - 32 characters]
```

```
Key: TWILIO_WHATSAPP_NUMBER
Value: [Your Twilio WhatsApp number in international format]
```

Example: `+14155238886` (Sandbox) or `+34612345678` (Your approved number)

#### OpenAI (AI-Powered Responses)
```
Key: OPENAI_API_KEY
Value: [Your OpenAI API key - starts with sk-]
```

Get your API key from: https://platform.openai.com/api-keys

#### Stripe Payment Processing
```
Key: STRIPE_SECRET_KEY
Value: [Your Stripe secret key - starts with sk_test_ or sk_live_]
```

```
Key: STRIPE_WEBHOOK_SECRET
Value: [Your Stripe webhook secret - starts with whsec_]
```

Get these from: https://dashboard.stripe.com/apikeys

⚠️ **Note:** You'll need to create a webhook endpoint in Stripe later (see below)

#### Upstash Redis
```
Key: REDIS_URL
Value: [Your Upstash Redis REST URL from Step 3]
```

```
Key: REDIS_TOKEN
Value: [Your Upstash Redis REST Token from Step 3]
```

#### Resend Email Service
```
Key: RESEND_API_KEY
Value: [Your Resend API key - starts with re_]
```

Get your API key from: https://resend.com/api-keys (Free tier: 3,000 emails/month)

#### Monei Payment Processing (Optional)
```
Key: MONEI_API_KEY
Value: [Your Monei API key - leave blank if not using]
```

```
Key: MONEI_WEBHOOK_SECRET
Value: [Your Monei webhook secret - leave blank if not using]
```

### Save Environment Variables

1. Click "Save Changes" after adding all variables
2. Render will automatically trigger a new deployment
3. Monitor the deployment logs (click "Logs" tab)

---

## 7. Configure Twilio Webhook

Once your Render deployment is successful, you'll have a public URL.

### Your Render App URL:
```
https://seeta.onrender.com
```
(Or `https://YOUR-SERVICE-NAME.onrender.com` if you chose a different name)

### Configure Twilio:

#### For Sandbox (Testing):

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Scroll to **"Sandbox Configuration"**
3. Under **"When a message comes in"**, enter:
   ```
   https://seeta.onrender.com/webhook/twilio
   ```
4. HTTP Method: **POST**
5. Click **"Save"**

#### For Production WhatsApp:

1. Go to: https://console.twilio.com/us1/develop/sms/whatsapp/senders
2. Click on your approved WhatsApp sender number
3. Under **"Webhook Configuration"**:
   - **Inbound Messages**: `https://seeta.onrender.com/webhook/twilio`
   - HTTP Method: **POST**
4. Click **"Save"**

### Configure Stripe Webhook:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://seeta.onrender.com/webhook/stripe`
4. Events to send: Select `checkout.session.completed`
5. Click "Add endpoint"
6. Click on the newly created endpoint
7. Copy the **"Signing secret"** (starts with `whsec_`)
8. Go back to Render → Environment Variables
9. Update `STRIPE_WEBHOOK_SECRET` with this value

---

## 8. Test Your Deployment

### Test 1: Health Check

Open your browser and visit:
```
https://seeta.onrender.com/health
```

You should see:
```json
{"status":"ok","time":"2026-03-05T..."}
```

### Test 2: Frontend

Visit:
```
https://seeta.onrender.com
```

You should see your SEETA landing page with the signup form.

### Test 3: Sign Up

1. Fill out the signup form
2. Create a test business account
3. You should be redirected to the dashboard

### Test 4: WhatsApp Integration

#### Sandbox:
1. Send the join code to Twilio's sandbox number
2. Send a message: "Hi"
3. You should receive an AI-powered response
4. Check Render logs: Click "Logs" tab and look for webhook calls

#### Production:
1. Message your approved WhatsApp number
2. Send: "Book a haircut for tomorrow at 3pm"
3. You should receive a booking confirmation

### Test 5: Dashboard Features

1. Log into your dashboard
2. Go to **Services** page
3. Add a new service
4. Verify it saves correctly
5. Go to **Bookings** page
6. Verify the page loads

---

## 9. Post-Deployment Configuration

### Set Your Business SEETA ID

After signup, your business is automatically assigned a 4-digit SEETA ID. You can view it in:
1. Dashboard → Settings page
2. Look for "SEETA ID: XXXX"

### Configure Your AI Personality

In Dashboard → Settings:
1. Choose your AI assistant personality:
   - Professional
   - Friendly
   - Casual
2. Click "Save Changes"

### Add Your Services

In Dashboard → Services:
1. Click "Add Service"
2. Fill in:
   - Service name
   - Duration (minutes)
   - Price
   - Payment requirement (Free or Paid)
3. Click "Save"

---

## 10. Troubleshooting

### Issue 1: Build Fails with "Module not found"

**Solution:**
- Check that all dependencies are in `package.json`
- Verify build command in Render matches: `npm install && npm run build:frontend`
- Check Render logs for specific missing module

### Issue 2: "Application Error" on Homepage

**Solution:**
- Check environment variables are set correctly
- Look at Render logs for errors
- Verify MongoDB connection string is correct
- Ensure `NODE_ENV=production` is set

### Issue 3: WhatsApp Messages Not Receiving

**Solution:**
- Verify Twilio webhook URL is exactly: `https://seeta.onrender.com/webhook/twilio`
- Check Twilio → Monitor → Logs for webhook errors
- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
- Check Render logs for incoming webhook requests

### Issue 4: "Invalid Twilio Signature"

**Solution:**
- Ensure webhook URL in Twilio matches your Render URL exactly
- Check if you have a trailing slash (should NOT have one)
- Verify `TWILIO_AUTH_TOKEN` is correct

### Issue 5: Render Service Spinning Down

**Note:** Free tier services spin down after 15 minutes of inactivity.

**Solutions:**
- First request after spin-down takes ~30 seconds (normal)
- For production, upgrade to paid plan ($7/month) for 24/7 uptime
- Use a cron job service to ping your health endpoint every 10 minutes (workaround)

### Issue 6: Database Connection Error

**Solution:**
- Verify MongoDB Atlas allows access from anywhere (0.0.0.0/0)
- Check connection string format is correct
- Ensure password in connection string has no special characters (or URL-encode them)
- Test connection string locally first

### Issue 7: Payment Webhook Not Working

**Solution:**
- Verify Stripe webhook URL: `https://seeta.onrender.com/webhook/stripe`
- Check Stripe webhook signing secret is correct
- Look at Stripe → Developers → Webhooks → Events for delivery status
- Check Render logs for incoming webhook requests

---

## Monitoring and Logs

### View Real-Time Logs:

1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. You'll see all server logs in real-time

### Useful Log Filters:

- Search for `ERROR` to find errors
- Search for `webhook` to see incoming WhatsApp messages
- Search for `Booking created` to track bookings

---

## Performance Optimization (Optional)

### Enable Auto-Scaling (Paid Plans Only):

1. Go to Service → Settings
2. Upgrade to Starter plan or higher
3. Configure auto-scaling rules

### Enable Health Checks:

Already configured in your `render.yaml`:
- Health Check Path: `/health`
- Render will restart your service if health checks fail

---

## Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use strong JWT secret** - Generate with crypto.randomBytes(64)
3. ✅ **Validate Twilio signatures** - Already implemented in webhook handler
4. ✅ **Use HTTPS only** - Render provides free SSL certificates
5. ✅ **Whitelist IP addresses** - In MongoDB Atlas for production
6. ✅ **Rotate secrets regularly** - Update environment variables every 3-6 months
7. ✅ **Enable rate limiting** - Already implemented in middleware

---

## Cost Breakdown

### Free Tier Services:
- **Render:** Free tier available (750 hours/month, one service)
- **MongoDB Atlas:** M0 Free tier (512MB storage)
- **Upstash Redis:** Free tier (10,000 commands/day)
- **Resend:** Free tier (3,000 emails/month)
- **Twilio Sandbox:** Free for testing

### Paid Services (When Ready for Production):
- **Render Starter:** $7/month (24/7 uptime, no spin-down)
- **Twilio WhatsApp:** ~$0.005 per message
- **OpenAI API:** Pay-as-you-go (~$0.002 per request)
- **Stripe:** 2.9% + $0.30 per transaction
- **MongoDB Atlas:** Free tier sufficient for small-medium apps

**Total Monthly Cost (Small Business):** ~$10-20/month

---

## Upgrading from Free to Paid

When you're ready for production:

1. **Render:**
   - Go to Service → Settings
   - Click "Upgrade Plan"
   - Select "Starter" ($7/month)

2. **MongoDB Atlas:**
   - Free tier (M0) handles ~500 concurrent users
   - Upgrade only when you need more

3. **Upstash Redis:**
   - Free tier handles most small apps
   - Upgrade when you exceed 10,000 commands/day

---

## Your Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] Upstash Redis created and credentials copied
- [ ] Render account created
- [ ] Web service deployed on Render
- [ ] All 15 environment variables configured
- [ ] Twilio webhook configured with Render URL
- [ ] Stripe webhook configured with Render URL
- [ ] Health check endpoint working (`/health`)
- [ ] Frontend loads correctly
- [ ] Signup flow works
- [ ] Dashboard accessible
- [ ] WhatsApp messages received and responded to
- [ ] Services can be created
- [ ] Bookings can be created

---

## Quick Reference: Important URLs

### Your Application:
```
Frontend: https://seeta.onrender.com
Health Check: https://seeta.onrender.com/health
Dashboard: https://seeta.onrender.com/dashboard
```

### Webhooks:
```
Twilio: https://seeta.onrender.com/webhook/twilio
Stripe: https://seeta.onrender.com/webhook/stripe
Monei: https://seeta.onrender.com/webhook/monei
```

### External Services:
- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Upstash Console: https://console.upstash.com
- Twilio Console: https://console.twilio.com
- Stripe Dashboard: https://dashboard.stripe.com
- OpenAI Platform: https://platform.openai.com

---

## Next Steps After Deployment

1. **Test thoroughly** - Test all features before announcing to users
2. **Set up monitoring** - Use Render's built-in monitoring
3. **Configure custom domain** (optional) - Add your own domain in Render
4. **Enable auto-deploy** - Push to GitHub → Auto-deploy to Render
5. **Set up backups** - MongoDB Atlas provides automatic backups
6. **Plan for scaling** - Monitor usage and upgrade when needed

---

## Support and Resources

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas Docs:** https://www.mongodb.com/docs/atlas/
- **Twilio WhatsApp Docs:** https://www.twilio.com/docs/whatsapp
- **Stripe Docs:** https://stripe.com/docs

---

**Congratulations!** 🎉

Your SEETA application is now deployed to Render and accessible to the world!

Your webhook URL for Twilio is:
```
https://seeta.onrender.com/webhook/twilio
```

Happy booking! 📅💬

---

**Last Updated:** March 5, 2026
**Version:** 1.0.0
