# Phase 1: Foundation & Database - COMPLETE ✅

**Feature**: 002 - Stripe Membership Subscriptions  
**Date**: 2025-10-08  
**Status**: Phase 1 Complete, Ready for Stripe Dashboard Setup

---

## What Was Completed

### ✅ Dependencies Installed
- `stripe` (v14.x) - Server-side Stripe API
- `@stripe/stripe-js` (v2.x) - Client-side Stripe.js

### ✅ Database Schema Created

Created 3 new tables:

1. **`subscription_tiers`** - Defines available tiers (Free, Basic, Premium)
   - Includes pricing in pence (£70 = 7000 pence)
   - Features stored as JSONB for flexibility
   - Placeholders for Stripe product/price IDs

2. **`user_subscriptions`** - Tracks user subscriptions
   - Links users to tiers
   - Stores Stripe customer/subscription IDs
   - Tracks billing cycles, trial periods, cancellation flags
   - **Auto-creates free tier** subscription for new users

3. **`subscription_events`** - Audit log for all events
   - Webhook events from Stripe
   - User actions (upgrades, cancellations)
   - n8n webhook delivery logs
   - Idempotency via `stripe_event_id`

### ✅ Database Functions Created

1. **`get_user_tier(user_id)`** - Returns user's current tier name
2. **`can_access_content(user_id, content_type, level)`** - Access control
3. **`get_user_subscription_details(user_id)`** - Full subscription info

### ✅ Seed Data Loaded

3 subscription tiers seeded:

| Tier | Monthly | Annual | Features |
|------|---------|--------|----------|
| **Free** | £0 | £0 | First lesson only, no community |
| **Basic** | £70 | £672 (£56/mo) | 1 course, community, email support, short-term info |
| **Premium** | £100 | £960 (£80/mo) | Unlimited, 1-on-1 support, all info, 7-day trial |

**Annual Savings**: 20% (£168 for Basic, £240 for Premium)

---

## Environment Variables Configured

Your `.env.local` should have:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51P6tSY2NPhvfjGt3eN13KGxBNykkT8VqnEdkKk9L3enjaoQfZlfPu6Ifq07mJohidACNOzGE4yjDe2LYERc3lIaF00tB8yB9vj
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51P6tSY2NPhvfjGt3rI7mn1mxfGEfN8jRjX7Zxg4tONAGfF2IRyBDCtjlqivyAmd34GNZy8Ip2mGtkiy2esAVk3NQ00T0Xl6Rnu
STRIPE_WEBHOOK_SECRET=whsec_placeholder_will_be_updated_later

# n8n Webhook
N8N_WEBHOOK_URL=https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33
```

**⚠️ Action Required**: Manually add these to your `.env.local` file.

---

## What's Next: Manual Stripe Setup Required

Before we can continue with Phase 2 (Backend API), you need to:

### 1. Create Products in Stripe Dashboard

Follow the guide in `STRIPE_SETUP_GUIDE.md`:

#### Product 1: LeaveLab Basic
- Monthly: £70.00 → Get `price_id`
- Annual: £672.00 → Get `price_id`
- Product ID → Get `prod_id`

#### Product 2: LeaveLab Premium
- Monthly: £100.00 → Get `price_id`
- Annual: £960.00 → Get `price_id`
- Product ID → Get `prod_id`

### 2. Update Database with Stripe IDs

Once you have the IDs, run this SQL (I'll help you create the migration):

```sql
UPDATE subscription_tiers
SET 
  stripe_product_id = 'YOUR_BASIC_PRODUCT_ID',
  stripe_price_id_monthly = 'YOUR_BASIC_MONTHLY_PRICE_ID',
  stripe_price_id_annual = 'YOUR_BASIC_ANNUAL_PRICE_ID'
WHERE name = 'basic';

UPDATE subscription_tiers
SET 
  stripe_product_id = 'YOUR_PREMIUM_PRODUCT_ID',
  stripe_price_id_monthly = 'YOUR_PREMIUM_MONTHLY_PRICE_ID',
  stripe_price_id_annual = 'YOUR_PREMIUM_ANNUAL_PRICE_ID'
WHERE name = 'premium';
```

### 3. Set Up Webhook Endpoint

For local development:
```bash
# Install Stripe CLI (if needed)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks (keep this running)
stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook
```

Copy the webhook secret from CLI output and update `.env.local`.

---

## Verification

To verify Phase 1 is complete:

```sql
-- Check tiers exist
SELECT name, display_name, price_monthly_pence, price_annual_pence
FROM subscription_tiers
ORDER BY sort_order;

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name LIKE '%subscription%' OR routine_name LIKE '%tier%';

-- Test function
SELECT get_user_tier('00000000-0000-0000-0000-000000000000');
```

Expected output:
- 3 tiers (free, basic, premium)
- 4 functions (get_user_tier, can_access_content, get_user_subscription_details, create_free_subscription_for_new_user)

---

## Database Structure

```
subscription_tiers (3 rows)
  ├── free (£0/month)
  ├── basic (£70/month or £672/year)
  └── premium (£100/month or £960/year)

user_subscriptions (empty, will be populated on signup)
  └── Automatically creates free tier for new users

subscription_events (empty, will log webhook events)
  └── Idempotent event processing
```

---

## Files Created/Modified

### New Files:
- `supabase/migrations/20251008100001_create_subscription_tiers_table.sql`
- `supabase/migrations/20251008100002_create_user_subscriptions_table.sql`
- `supabase/migrations/20251008100003_create_subscription_events_table.sql`
- `supabase/migrations/20251008100004_create_subscription_functions.sql`
- `supabase/migrations/20251008100005_seed_subscription_tiers.sql`
- `STRIPE_SETUP_GUIDE.md`
- `PHASE_1_SUBSCRIPTIONS_COMPLETE.md` (this file)

### Modified Files:
- `package.json` - Added Stripe dependencies

---

## Ready for Phase 2?

Once you complete the manual Stripe setup:

1. ✅ Products created in Stripe Dashboard
2. ✅ Database updated with real Stripe IDs
3. ✅ Webhook endpoint configured (Stripe CLI running locally)
4. ✅ Environment variables added to `.env.local`

**Then we can proceed to Phase 2: Backend API** 🚀

This includes:
- Stripe server/client utilities
- 5 API endpoints (tiers, status, checkout, portal, webhook)
- n8n webhook integration
- Comprehensive test suite

---

## Questions?

- **Stripe Setup**: See `STRIPE_SETUP_GUIDE.md` for detailed instructions
- **Database Schema**: See `specs/002-stripe-membership-subscriptions/data-model.md` (in plan)
- **Task List**: See `specs/002-stripe-membership-subscriptions/tasks.md`

---

**Phase 1 Complete!** ✅ Ready for your Stripe Dashboard setup.
