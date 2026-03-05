# Twilio WhatsApp Configuration Guide for SEETA

## Overview
This guide explains how to configure Twilio's WhatsApp Business API for your SEETA installation.

## Required Information for Twilio

### 1. Twilio Account Credentials
You need three pieces of information from your Twilio account:

#### A. **TWILIO_ACCOUNT_SID**
- Found on your [Twilio Console Dashboard](https://console.twilio.com/)
- Format: Starts with `AC` followed by 32 characters
- Example: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### B. **TWILIO_AUTH_TOKEN**
- Found on your Twilio Console Dashboard (click "Show" to reveal)
- Format: 32 character string
- Example: `your_32_character_auth_token`
- ⚠️ **Keep this secret!** Never commit to version control

#### C. **TWILIO_WHATSAPP_NUMBER**
- Your Twilio WhatsApp-enabled phone number
- Format: International format with country code
- Example: `+14155238886` (Twilio Sandbox) or `+34612345678` (Your approved number)

---

## Step-by-Step Setup

### Step 1: Get Your Twilio Credentials

1. **Sign up for Twilio** (if you haven't already)
   - Go to https://www.twilio.com/try-twilio
   - Create a free account (you'll get trial credit)

2. **Navigate to Console**
   - Go to https://console.twilio.com/
   - You'll see your Account SID and Auth Token on the main dashboard

3. **Copy Your Credentials**
   - Copy the `Account SID`
   - Click "Show" and copy the `Auth Token`

### Step 2: Enable WhatsApp

#### Option A: Use Twilio Sandbox (For Testing)

1. Go to https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Send the join code from your WhatsApp to the Twilio number
3. Your sandbox number is: `+1 415 523 8886`
4. Use this for `TWILIO_WHATSAPP_NUMBER`: `+14155238886`

**Limitations:**
- Users must send a join code first
- Message says "Your Twilio code is..."
- Not suitable for production

#### Option B: Get an Approved WhatsApp Number (For Production)

1. Go to https://console.twilio.com/us1/develop/sms/whatsapp/senders
2. Click "Request Access" or "Create New WhatsApp Number"
3. Submit your business profile for Facebook approval
4. Wait for approval (can take 1-3 weeks)
5. Once approved, use your approved number

---

### Step 3: Configure Your Webhook URL

The webhook URL is where Twilio sends incoming WhatsApp messages.

#### Your Webhook URL Format:
```
https://your-domain.com/api/webhooks/twilio
```

#### Configuration Steps:

1. **Go to WhatsApp Senders**
   - Navigate to https://console.twilio.com/us1/develop/sms/whatsapp/senders
   - Click on your WhatsApp sender number

2. **Configure the Webhook**
   - Scroll to "Webhook Configuration" section
   - Set "When a message comes in": `https://your-domain.com/api/webhooks/twilio`
   - HTTP Method: `POST`
   - Click "Save"

#### Important Webhook Requirements:
- Must be HTTPS (not HTTP)
- Must be publicly accessible
- Must respond within 15 seconds
- Should return `200` status code with TwiML response

---

### Step 4: Update Your .env File

Add these three variables to your `.env` file in the SEETA root directory:

```bash
# Twilio WhatsApp Integration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_32_character_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Replace with your actual values!**

---

### Step 5: Deploy and Get Your Public URL

#### For Production (Recommended):

1. **Deploy to a cloud service:**
   - Heroku: https://heroku.com
   - Railway: https://railway.app
   - Render: https://render.com
   - DigitalOcean App Platform: https://www.digitalocean.com/products/app-platform

2. **Your webhook URL will be:**
   ```
   https://your-app-name.herokuapp.com/api/webhooks/twilio
   ```

#### For Development/Testing (Temporary):

Use **ngrok** to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Run your SEETA server
npm start

# In another terminal, expose port 5000
ngrok http 5000
```

You'll get a URL like: `https://abc123.ngrok.io`

Your webhook URL: `https://abc123.ngrok.io/api/webhooks/twilio`

⚠️ **ngrok URLs change every time you restart!** Update Twilio each time.

---

## How SEETA Processes WhatsApp Messages

### Message Flow:

```
WhatsApp User → Twilio → Your Webhook → SEETA Backend
                                        ↓
                                    OpenAI (Intent Extraction)
                                        ↓
                                    Business Logic
                                        ↓
                                    Response via Twilio → WhatsApp User
```

### Current Implementation:

**File: `/src/routes/webhook.routes.js`**
- Receives incoming messages from Twilio
- Validates signature for security
- Extracts intent using OpenAI
- Handles booking logic
- Sends response back via WhatsApp

**File: `/src/services/whatsapp.service.js`**
- Sends WhatsApp messages via Twilio
- Validates webhook signatures
- Handles errors gracefully

---

## Testing Your Setup

### Test 1: Check Credentials
```bash
# From your SEETA directory
npm start

# Look for this in the logs:
# ✅ "Twilio client initialized"
# ❌ "Twilio credentials missing. WhatsApp service will only log messages."
```

### Test 2: Send a Test Message

**Sandbox Mode:**
1. Join the sandbox by sending the code to `+1 415 523 8886`
2. Send: "Book a haircut for tomorrow at 3pm"
3. Check your server logs for the webhook call

**Production Mode:**
1. Message your approved WhatsApp number
2. Send: "Book a haircut for tomorrow at 3pm"
3. You should receive an AI-powered response

### Test 3: Check Webhook Logs

In Twilio Console:
1. Go to Monitor → Logs → Messaging
2. Check for successful webhook calls (200 status)
3. If you see errors, check the error messages

---

## Common Issues & Solutions

### Issue 1: "Twilio credentials missing"
**Solution:**
- Check your `.env` file has all three variables
- Restart your server after updating `.env`
- Ensure no extra spaces or quotes

### Issue 2: "Invalid Twilio signature"
**Solution:**
- Your webhook URL must exactly match what's in Twilio
- Must be HTTPS in production
- Check if you're behind a proxy (Heroku, nginx)

### Issue 3: "Message not receiving"
**Solution:**
- Verify webhook URL is correct in Twilio Console
- Check server logs for incoming requests
- Ensure server is running and accessible
- Check Twilio message logs for delivery status

### Issue 4: "Sandbox join code not working"
**Solution:**
- Make sure you're messaging the exact number: `+1 415 523 8886`
- The join code is case-sensitive
- Check WhatsApp → Settings → Linked Devices

### Issue 5: "Request timeout"
**Solution:**
- Your webhook must respond in < 15 seconds
- SEETA responds immediately with `<Response></Response>`
- Processing happens asynchronously

---

## Security Best Practices

1. **Always validate signatures:** SEETA does this automatically
2. **Use HTTPS:** Never HTTP in production
3. **Keep Auth Token secret:** Never commit to git
4. **Rate limiting:** Implement on your server
5. **Monitor logs:** Use Twilio's monitoring tools

---

## Costs & Billing

### Twilio WhatsApp Pricing (as of 2024):
- **Sandbox:** Free for testing
- **Business-initiated messages:** ~$0.005 per message
- **User-initiated messages (24hr window):** Free for first message, then ~$0.005
- **Monthly phone number:** ~$5-15 depending on country

Check current pricing: https://www.twilio.com/whatsapp/pricing

---

## Production Checklist

- [ ] Twilio Account SID configured
- [ ] Auth Token configured and secret
- [ ] WhatsApp number approved by Facebook
- [ ] Webhook URL is HTTPS
- [ ] Webhook URL configured in Twilio
- [ ] Server deployed and accessible
- [ ] Test messages working
- [ ] OpenAI API key configured (for AI responses)
- [ ] MongoDB connected (for booking storage)
- [ ] Payment provider configured (Stripe/Monei)

---

## Additional Resources

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [WhatsApp Business Profile Setup](https://www.twilio.com/docs/whatsapp/self-sign-up)
- [Webhook Signature Validation](https://www.twilio.com/docs/usage/webhooks/webhooks-security)
- [Twilio Console](https://console.twilio.com/)

---

## Support

If you have issues:
1. Check Twilio Console → Monitor → Logs
2. Check your SEETA server logs
3. Review this guide's troubleshooting section
4. Contact Twilio Support: https://support.twilio.com

---

**Last Updated:** 2026-03-05
**SEETA Version:** 1.0.0
