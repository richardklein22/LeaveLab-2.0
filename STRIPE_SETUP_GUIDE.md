# Stripe Setup Guide

This guide will walk you through setting up Stripe products, prices, and webhooks for LeaveLab's subscription system.

---

## Prerequisites

- ✅ Stripe account created
- ✅ Test mode enabled
- ✅ API keys obtained (you have these!)

---

## Step 1: Add Environment Variables

Add these variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51P6tSY2NPhvfjGt3eN13KGxBNykkT8VqnEdkKk9L3enjaoQfZlfPu6Ifq07mJohidACNOzGE4yjDe2LYERc3lIaF00tB8yB9vj
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51P6tSY2NPhvfjGt3rI7mn1mxfGEfN8jRjX7Zxg4tONAGfF2IRyBDCtjlqivyAmd34GNZy8Ip2mGtkiy2esAVk3NQ00T0Xl6Rnu
STRIPE_WEBHOOK_SECRET=whsec_placeholder_will_be_updated_later

# n8n Webhook Configuration
N8N_WEBHOOK_URL=https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33
```

**Note**: The webhook secret will be generated when you create the webhook endpoint in Step 3.

---

## Step 2: Create Products and Prices in Stripe Dashboard

### 2.1 Navigate to Stripe Dashboard

1. Go to [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
2. Ensure you're in **Test Mode** (toggle in top right)

### 2.2 Create "LeaveLab Basic" Product

1. Click **"+ Add product"**
2. Fill in details:
   - **Name**: `LeaveLab Basic`
   - **Description**: `1 full course, community access, email support, short-term visa info`
   - **Image**: (optional) Upload a product image
3. **Pricing**:
   - Click **"Add another price"** (we need two prices: monthly and annual)

#### Monthly Price:
- **Price**: `70.00`
- **Currency**: `GBP`
- **Billing period**: `Monthly`
- **Price name**: `Basic Monthly`
- Click **"Save"**
- **📋 Copy the Price ID** (starts with `price_`) → Save as `BASIC_MONTHLY_PRICE_ID`

#### Annual Price:
- Click **"Add another price"** again
- **Price**: `672.00`
- **Currency**: `GBP`
- **Billing period**: `Yearly`
- **Price name**: `Basic Annual`
- Click **"Save"**
- **📋 Copy the Price ID** (starts with `price_`) → Save as `BASIC_ANNUAL_PRICE_ID`

4. **📋 Copy the Product ID** (starts with `prod_`) → Save as `BASIC_PRODUCT_ID`

---

### 2.3 Create "LeaveLab Premium" Product

1. Click **"+ Add product"** again
2. Fill in details:
   - **Name**: `LeaveLab Premium`
   - **Description**: `Unlimited courses, community, 1-on-1 support, all visa info`
   - **Image**: (optional) Upload a product image
3. **Pricing**:

#### Monthly Price:
- **Price**: `100.00`
- **Currency**: `GBP`
- **Billing period**: `Monthly`
- **Price name**: `Premium Monthly`
- Click **"Save"**
- **📋 Copy the Price ID** (starts with `price_`) → Save as `PREMIUM_MONTHLY_PRICE_ID`

#### Annual Price:
- Click **"Add another price"**
- **Price**: `960.00`
- **Currency**: `GBP`
- **Billing period**: `Yearly`
- **Price name**: `Premium Annual`
- Click **"Save"**
- **📋 Copy the Price ID** (starts with `price_`) → Save as `PREMIUM_ANNUAL_PRICE_ID`

4. **📋 Copy the Product ID** (starts with `prod_`) → Save as `PREMIUM_PRODUCT_ID`

---

## Step 3: Configure Webhook Endpoint

### 3.1 Create Webhook

1. Go to [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"+ Add endpoint"**
3. **Endpoint URL**: `http://localhost:3000/api/v1/subscriptions/webhook`
   - **Note**: For local development, you'll need to use Stripe CLI (see Step 3.2)
   - For production, use your deployed URL: `https://yourdomain.com/api/v1/subscriptions/webhook`

### 3.2 Select Events to Listen

Select the following events:

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `customer.subscription.trial_will_end`

4. Click **"Add endpoint"**

### 3.3 Get Webhook Signing Secret

1. Click on the newly created webhook endpoint
2. In the **"Signing secret"** section, click **"Reveal"**
3. **📋 Copy the webhook signing secret** (starts with `whsec_`)
4. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

---

## Step 4: Update Database with Stripe IDs

Now that you have all the Stripe IDs, we need to update the database.

### 4.1 Create Update Migration

Run this SQL in your database (or create a migration file):

```sql
-- Update Basic tier with real Stripe IDs
UPDATE subscription_tiers
SET 
  stripe_product_id = 'YOUR_BASIC_PRODUCT_ID',
  stripe_price_id_monthly = 'YOUR_BASIC_MONTHLY_PRICE_ID',
  stripe_price_id_annual = 'YOUR_BASIC_ANNUAL_PRICE_ID',
  updated_at = NOW()
WHERE name = 'basic';

-- Update Premium tier with real Stripe IDs
UPDATE subscription_tiers
SET 
  stripe_product_id = 'YOUR_PREMIUM_PRODUCT_ID',
  stripe_price_id_monthly = 'YOUR_PREMIUM_MONTHLY_PRICE_ID',
  stripe_price_id_annual = 'YOUR_PREMIUM_ANNUAL_PRICE_ID',
  updated_at = NOW()
WHERE name = 'premium';

-- Verify the update
SELECT name, stripe_product_id, stripe_price_id_monthly, stripe_price_id_annual
FROM subscription_tiers
WHERE name IN ('basic', 'premium');
```

**Replace the placeholders** with your actual Stripe IDs from Step 2.

---

## Step 5: Test Webhook Locally with Stripe CLI

For local development, you need to forward webhooks from Stripe to your local server.

### 5.1 Install Stripe CLI

If you haven't already:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### 5.2 Login to Stripe CLI

```bash
stripe login
```

This will open a browser window to authenticate.

### 5.3 Forward Webhooks

In a **separate terminal window**, run:

```bash
stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_1234... (^C to quit)
```

**📋 Copy this webhook secret** and add it to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_from_cli_output
```

**Keep this terminal window running** while you're testing locally.

---

## Step 6: Configure Customer Portal (Optional)

The Customer Portal allows users to manage their subscriptions.

1. Go to [https://dashboard.stripe.com/test/settings/billing/portal](https://dashboard.stripe.com/test/settings/billing/portal)
2. Click **"Activate Customer Portal"**
3. Configure settings:
   - ✅ **Business information**: Add your business name and support email
   - ✅ **Functionality**:
     - ✅ Allow customers to update payment methods
     - ✅ Allow customers to update subscriptions (change plan)
     - ✅ Allow customers to cancel subscriptions
     - ✅ Show invoices
   - ✅ **Cancellation behavior**:
     - Select: **"Cancel at the end of the billing period"** (recommended)
     - Reason: Keeps access until period ends
4. Click **"Save changes"**

---

## Quick Reference: Your Stripe IDs

Fill this in as you create products:

### Basic Tier:
- Product ID: `prod_______________________`
- Monthly Price ID: `price_______________________`
- Annual Price ID: `price_______________________`

### Premium Tier:
- Product ID: `prod_______________________`
- Monthly Price ID: `price_______________________`
- Annual Price ID: `price_______________________`

### Webhook:
- Webhook Secret: `whsec_______________________`

---

## Next Steps

After completing this setup:

1. ✅ Test a subscription flow:
   - Go to `http://localhost:3000/pricing` (once we build it)
   - Subscribe to a plan
   - Use test card: `4242 4242 4242 4242`
   - Check webhook logs in Stripe CLI

2. ✅ Verify database updates:
   ```sql
   SELECT * FROM user_subscriptions;
   SELECT * FROM subscription_events;
   ```

3. ✅ Check n8n webhook received the event

---

## Test Cards

Use these test cards during development:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 0069` | Expired card |

**Expiry**: Any future date  
**CVC**: Any 3 digits  
**ZIP**: Any 5 digits

---

## Troubleshooting

### Webhook not receiving events locally
- ✅ Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook`
- ✅ Check `.env.local` has the correct `STRIPE_WEBHOOK_SECRET` from CLI output
- ✅ Restart Next.js dev server after changing env variables

### "No such price" error
- ✅ Verify price IDs in database match Stripe Dashboard
- ✅ Run the SQL update from Step 4.1

### "Invalid webhook signature" error
- ✅ Verify `STRIPE_WEBHOOK_SECRET` in `.env.local` matches Stripe CLI output
- ✅ For production, use the secret from Stripe Dashboard webhook settings

---

## Production Deployment

When deploying to production:

1. Create **production** products and prices in Stripe (live mode)
2. Get **live** API keys from Stripe
3. Update webhook URL to your production domain
4. Update environment variables in your hosting platform (Vercel)
5. Test the entire flow with real (small amount) payments

---

That's it! You're ready to implement the subscription system. 🚀
