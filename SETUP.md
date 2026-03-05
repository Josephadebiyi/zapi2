# ZAPI Setup Guide

## Overview
ZAPI is a WhatsApp-first appointment booking platform for Spanish businesses, powered by AI intent extraction.

## Prerequisites

Before running ZAPI, you need to set up accounts and get API keys for the following services:

### Required Services

1. **MongoDB Atlas** (Database)
   - Sign up at: https://www.mongodb.com/cloud/atlas
   - Create a free M0 cluster
   - Get your connection string

2. **Twilio** (WhatsApp Integration)
   - Sign up at: https://www.twilio.com/
   - Enable WhatsApp Sandbox or apply for WhatsApp Business API
   - Get: Account SID, Auth Token, WhatsApp Number

3. **OpenAI** (AI Intent Extraction)
   - Sign up at: https://platform.openai.com/
   - Create an API key
   - Ensure you have access to GPT-4 models

4. **Upstash Redis** (Session State & Slot Locking)
   - Sign up at: https://upstash.com/
   - Create a Redis database (free tier available)
   - Get: REST URL and Token

5. **Resend** (Email Service)
   - Sign up at: https://resend.com/
   - Create an API key (free tier: 3,000 emails/month)

### Optional Services

6. **Stripe** (Primary Payment Processor)
   - Sign up at: https://stripe.com/
   - Get test mode keys
   - Set up webhook endpoint for `/webhook/stripe`

7. **Monei** (Alternative Payment Processor for Spain)
   - Sign up at: https://monei.com/
   - Get API key and webhook secret

## Installation

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your API keys:

```env
# Database
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/zapi

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Redis (Upstash)
REDIS_URL=https://your-redis.upstash.io
REDIS_TOKEN=your_redis_token

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Monei (optional)
MONEI_API_KEY=your_monei_key
MONEI_WEBHOOK_SECRET=your_monei_secret
```

### 3. Seed the Database

```bash
node seed.js
```

This creates a demo business (ZAPI Luxe Salon) in Madrid with sample services.

### 4. Run the Application

#### Development Mode

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Backend runs on: `http://localhost:5000`
Frontend runs on: `http://localhost:5173`

#### Production Mode

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start backend (serves frontend build)
npm start
```

## Architecture

### Backend (`/src`)
- **Express.js** server with MongoDB
- **Twilio** webhook for WhatsApp messages
- **OpenAI GPT-4o** for intent extraction
- **Redis session management** for conversation state
- **Stripe/Monei** payment webhooks
- **Bull queue** for retry logic on failed operations
- **Winston** logging to files

### Frontend (`/frontend`)
- **React + Vite** SPA
- Business registration & login
- Dashboard for managing bookings, services, and AI personality
- Responsive design with i18n support (EN/ES/PT/FR)

## Workflow

1. **Customer sends WhatsApp message** to Twilio number
2. **Twilio webhook** forwards to `/webhook/twilio`
3. **OpenAI extracts intent** (search, book, complaint, etc.)
4. **Intent controller** routes to appropriate handler
5. **Session service** tracks conversation state in Redis
6. **Booking flow** searches businesses, locks slots, creates booking
7. **Payment service** generates Stripe/Monei checkout link
8. **Queue service** retries failed operations
9. **Email service** sends confirmation

## Key Features Implemented

✅ Conversation session state management (Redis)
✅ AI-powered intent extraction with structured JSON output
✅ Multi-step booking flow with slot locking
✅ Payment processing (Stripe + Monei)
✅ Webhook signature verification
✅ Rate limiting on API endpoints
✅ Comprehensive logging (Winston)
✅ Job queue with retry logic (Bull)
✅ Frontend API integration
✅ Email notifications
✅ Spanish ID validation (NIF/NIE/CIF)
✅ Free booking auto-confirmation

## What's Missing / TODO

⚠️ **OpenAI API Key** - Required for intent extraction
⚠️ **Stripe API Keys** - Required for payment processing
⚠️ **Redis credentials** - Required for session state (currently using mock)
⚠️ **Test suite** - No automated tests yet
⚠️ **Production deployment config** - No Docker/Vercel setup
⚠️ **Admin panel** - Frontend dashboard needs real API integration
⚠️ **Analytics** - No metrics tracking

## Troubleshooting

### Missing API Keys
If you see warnings like "OpenAI API Key missing" or "Redis credentials missing", the app will use mock implementations. This works for testing but won't provide full functionality.

### Webhook Testing
Use ngrok to test webhooks locally:

```bash
ngrok http 5000
```

Then update your Twilio/Stripe/Monei webhook URLs to the ngrok URL.

### Database Connection Issues
Ensure your MongoDB Atlas cluster allows connections from your IP address in Network Access settings.

## Security Notes

⚠️ **Never commit `.env` to version control**
⚠️ **Change JWT_SECRET in production**
⚠️ **Enable HTTPS in production**
⚠️ **Set NODE_ENV=production** for production deployments

## Support

For issues, check the logs in the `logs/` directory:
- `error.log` - Error messages
- `combined.log` - All logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections
