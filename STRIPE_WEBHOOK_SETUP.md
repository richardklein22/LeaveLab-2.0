# Stripe Webhook Setup for Local Development

**Status**: Ready to Configure  
**Date**: 2025-10-08

---

## Overview

For local development, Stripe webhooks need to be forwarded from Stripe's servers to your local machine. We'll use the **Stripe CLI** to do this.

---

## Step 1: Install Stripe CLI

### macOS (Homebrew)

```bash
brew install stripe/stripe-cli/stripe
```

### Alternative: Manual Download

Download from: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

---

## Step 2: Login to Stripe CLI

Run this command and follow the browser prompt to authenticate:

```bash
stripe login
```

You'll see output like:
```
Your pairing code is: word-word-word
Press Enter to open the browser (^C to quit)
```

This will open your browser to confirm the connection. Click **"Allow access"**.

---

## Step 3: Forward Webhooks to Local Server

Open a **new terminal window** (keep your Next.js dev server running in the original terminal) and run:

```bash
stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook
```

You'll see output like:

```
> Ready! You are using Stripe API Version [2024-XX-XX]. Your webhook signing secret is whsec_1234567890abcdefghijklmnopqrstuvwxyz (^C to quit)
```

**📋 IMPORTANT**: Copy the webhook signing secret (starts with `whsec_`)

---

## Step 4: Update Environment Variable

Add the webhook secret to your `.env.local` file:

```bash
# Replace the placeholder with your actual webhook secret from Step 3
STRIPE_WEBHOOK_SECRET=whsec_your_secret_from_cli_output
```

**⚠️ Important**: Restart your Next.js dev server after updating `.env.local`

---

## Step 5: Keep Stripe CLI Running

**Keep the terminal window with `stripe listen` running** while you're developing and testing subscriptions.

If you close it, webhooks won't be forwarded to your local server.

---

## Testing Webhook Events

### Trigger Test Events

While `stripe listen` is running, you can manually trigger test events:

```bash
# In a THIRD terminal window
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

You'll see the events in:
1. The `stripe listen` terminal (webhook received)
2. Your Next.js dev server logs (API route processing)
3. Your database (`subscription_events` table)

---

## Verify Webhook Integration

### 1. Check Stripe CLI Output

In the terminal running `stripe listen`, you should see:

```
2025-10-08 12:34:56   --> checkout.session.completed [evt_123...]
2025-10-08 12:34:56   <--  [200] POST http://localhost:3000/api/v1/subscriptions/webhook [evt_123...]
```

The `[200]` means your webhook endpoint responded successfully.

### 2. Check Next.js Logs

In your Next.js terminal, you should see:

```
POST /api/v1/subscriptions/webhook 200 in 123ms
```

### 3. Check Database

Query your database to see logged events:

```sql
SELECT 
  event_type,
  event_source,
  stripe_event_id,
  processed,
  created_at
FROM subscription_events
ORDER BY created_at DESC
LIMIT 10;
```

### 4. Check n8n Webhook

If everything is working, your n8n webhook should also receive the events.

Check your n8n workflow logs at:
https://nocoded-n8n-u41031.vm.elestio.app

---

## Common Issues

### Issue 1: "Webhook signature verification failed"

**Cause**: Wrong `STRIPE_WEBHOOK_SECRET` in `.env.local`

**Solution**:
1. Copy the secret from `stripe listen` output (starts with `whsec_`)
2. Update `.env.local`
3. Restart Next.js dev server

---

### Issue 2: "Connection refused" or "Cannot POST"

**Cause**: Next.js dev server not running on port 3000

**Solution**:
1. Ensure `npm run dev` is running
2. Check the port in terminal output
3. If using a different port, update the `stripe listen` command:
   ```bash
   stripe listen --forward-to localhost:YOUR_PORT/api/v1/subscriptions/webhook
   ```

---

### Issue 3: Events not appearing in database

**Cause**: API route not implemented yet (we're in Phase 1)

**Solution**: This is expected! Once we implement Phase 2 (Backend API), the webhook handler will process events and log them to the database.

---

## Development Workflow

### Daily Development

**Terminal 1** (Next.js):
```bash
npm run dev
```

**Terminal 2** (Supabase):
```bash
# Should already be running from Feature 001
# If not:
supabase start
```

**Terminal 3** (Stripe CLI):
```bash
stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook
```

### Quick Test Flow

1. Open `http://localhost:3000/pricing` (once we build it)
2. Click "Subscribe to Premium"
3. Enter test card: `4242 4242 4242 4242`
4. Complete checkout
5. Watch the webhook events flow through in Terminal 3

---

## Production Deployment

When you deploy to production, you'll set up a **real webhook endpoint** in Stripe Dashboard:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint URL: `https://yourdomain.com/api/v1/subscriptions/webhook`
3. Select the same events as in `STRIPE_SETUP_GUIDE.md`
4. Get the webhook signing secret
5. Add to production environment variables (Vercel, etc.)

**Don't use the Stripe CLI secret in production** - use the one from Stripe Dashboard.

---

## Your Configuration

Here's a quick reference for your setup:

### Stripe Products:
- **Basic**: `prod_TD2lm2R0TiSqaV`
  - Monthly: `price_1SGcgI2NPhvfjGt3rFJJI8vs` (£70)
  - Annual: `price_1SGci32NPhvfjGt3TUOLGjEI` (£672)

- **Premium**: `prod_TD2psqkFNU8ksh`
  - Monthly: `price_1SGcjP2NPhvfjGt3N7KR3gxX` (£100)
  - Annual: `price_1SGckl2NPhvfjGt32xVjJOtj` (£960)

### Environment Variables (`.env.local`):
```bash
STRIPE_SECRET_KEY=sk_test_51P6tSY2NPhvfjGt3eN13KGxBNykkT8VqnEdkKk9L3enjaoQfZlfPu6Ifq07mJohidACNOzGE4yjDe2LYERc3lIaF00tB8yB9vj
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51P6tSY2NPhvfjGt3rI7mn1mxfGEfN8jRjX7Zxg4tONAGfF2IRyBDCtjlqivyAmd34GNZy8Ip2mGtkiy2esAVk3NQ00T0Xl6Rnu
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_cli_output
N8N_WEBHOOK_URL=https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33
```

---

## Next Steps

Once the webhook is set up:

1. ✅ Test with `stripe trigger` commands
2. ✅ Proceed to **Phase 2: Backend API**
3. ✅ Implement webhook handler to process events

---

That's it! Your local development environment is ready for Stripe subscriptions. 🚀
