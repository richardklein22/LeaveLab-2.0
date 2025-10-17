# Implementation Plan: Stripe Membership Subscriptions

**Feature ID**: 002  
**Status**: 🔄 In Planning  
**Created**: 2025-10-08  
**Estimated Complexity**: High (3-4 weeks)

---

## Technical Context

### Current Stack
- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript 5.x
- **Backend**: Next.js API Routes (Server-Side), Supabase (PostgreSQL 15+, RLS)
- **Authentication**: Supabase Auth (from Feature 001)
- **Styling**: Tailwind CSS v3, Shadcn/ui components
- **Payments**: Stripe (Test Mode) - **NEW**
- **Automation**: n8n webhooks - **NEW**
- **Validation**: Zod schemas, React Hook Form
- **Testing**: Jest (unit), Playwright (E2E)

### New Dependencies
```json
{
  "stripe": "^14.x",
  "@stripe/stripe-js": "^2.x",
  "micro": "^10.x"
}
```

---

## Constitution Check ✅

Ensuring Feature 002 aligns with LeaveLab's core principles:

### 1. Mobile-First Development ✅
- [ ] Pricing page responsive on 375px width
- [ ] Stripe Checkout mobile-optimized (handled by Stripe)
- [ ] All buttons meet 44px tap target minimum
- [ ] Annual/monthly toggle easy to use on mobile
- [ ] Subscription management accessible on mobile

### 2. API-First Architecture ✅
- [ ] All subscription endpoints documented (OpenAPI)
- [ ] Stripe webhook handler defined before UI
- [ ] n8n webhook payload specified
- [ ] RLS policies documented
- [ ] API responses standardized

### 3. Security & Privacy First ✅
- [ ] All Stripe API calls server-side only
- [ ] Webhook signature verification required
- [ ] No Stripe keys in client-side code
- [ ] RLS policies enforce subscription access
- [ ] PCI DSS compliance (via Stripe)
- [ ] GDPR: Subscription data exportable/deletable

### 4. Modular Content Architecture ✅
- [ ] Subscription feature self-contained in `/features/subscriptions`
- [ ] Reusable components for tier cards, pricing display
- [ ] Content access logic centralized
- [ ] Easy to add new tiers in future

### 5. Test-Driven Development ✅
- [ ] Write tests before implementation
- [ ] Unit tests for subscription logic
- [ ] Integration tests for Stripe webhooks
- [ ] E2E tests for checkout flow
- [ ] 80% coverage target for subscription module

### 6. Performance & UX Excellence ✅
- [ ] Stripe Checkout redirect < 2 seconds
- [ ] Webhook processing < 5 seconds
- [ ] Subscription status cached (5 minutes)
- [ ] Skeleton loaders for pricing page
- [ ] Optimistic UI for tier changes
- [ ] Clear error messages (British English)

---

## Architecture Overview

### High-Level Flow

```
User → Pricing Page → Click Subscribe → Stripe Checkout
                                              ↓
                                     Enter Payment Details
                                              ↓
                                     Stripe Processes Payment
                                              ↓
                                     Webhook to Our Server
                                              ↓
                     ┌────────────────────────┴────────────────────────┐
                     ↓                                                  ↓
          Update Subscription in DB                          Send to n8n Webhook
                     ↓                                                  ↓
          User Redirected Back                              n8n Processes Event
                     ↓
          Access Premium Content
```

### Component Architecture

```
src/
├── features/subscriptions/
│   ├── components/
│   │   ├── PricingCard.tsx           # Individual tier card
│   │   ├── PricingToggle.tsx         # Monthly/Annual toggle
│   │   ├── PricingComparison.tsx     # Full pricing page
│   │   ├── SubscriptionStatus.tsx    # Current subscription display
│   │   ├── UpgradePrompt.tsx         # Shown when content locked
│   │   └── TrialBanner.tsx           # 7-day trial promotion
│   │
│   ├── hooks/
│   │   ├── useSubscription.ts        # Get user's subscription
│   │   ├── useCheckout.ts            # Handle Stripe Checkout
│   │   └── useSubscriptionGate.ts    # Check content access
│   │
│   ├── lib/
│   │   ├── stripe-client.ts          # Stripe JS (client-side)
│   │   ├── stripe-server.ts          # Stripe API (server-side)
│   │   ├── subscription-helpers.ts   # Business logic
│   │   └── tier-access.ts            # Access control logic
│   │
│   ├── types/
│   │   ├── subscription.ts           # TypeScript types
│   │   └── stripe.ts                 # Stripe-related types
│   │
│   └── constants/
│       ├── tiers.ts                  # Tier definitions
│       ├── stripe-config.ts          # Stripe product/price IDs
│       └── messages.ts               # British English messages
│
├── app/
│   ├── (marketing)/
│   │   └── pricing/
│   │       └── page.tsx              # Public pricing page
│   │
│   ├── (dashboard)/
│   │   └── subscription/
│   │       └── page.tsx              # Manage subscription
│   │
│   └── api/v1/subscriptions/
│       ├── checkout/route.ts         # Create Stripe Checkout session
│       ├── portal/route.ts           # Create Customer Portal session
│       ├── status/route.ts           # Get subscription status
│       ├── webhook/route.ts          # Stripe webhook handler
│       └── tiers/route.ts            # Get available tiers
│
└── lib/
    └── utils/
        ├── subscription-middleware.ts # Check subscription on requests
        └── n8n-webhook.ts            # Send events to n8n
```

---

## Database Schema

### New Tables

#### `subscription_tiers`
Defines available subscription tiers and their features.

```sql
CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- 'free', 'basic', 'premium'
  display_name TEXT NOT NULL, -- 'Free', 'Basic', 'Premium'
  description TEXT,
  
  -- Stripe Integration
  stripe_product_id TEXT UNIQUE, -- NULL for free tier
  stripe_price_id_monthly TEXT,
  stripe_price_id_annual TEXT,
  
  -- Pricing (in pence for precision)
  price_monthly_pence INTEGER NOT NULL DEFAULT 0,
  price_annual_pence INTEGER NOT NULL DEFAULT 0,
  
  -- Features (JSONB for flexibility)
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  /*
  Example features structure:
  {
    "max_courses": 1 | null (unlimited),
    "community_access": true | false,
    "email_support": true | false,
    "one_on_one_support": true | false,
    "visa_info": "none" | "short_term" | "all",
    "accommodation_info": "none" | "short_term" | "all",
    "has_trial": true | false,
    "trial_days": 7 | null
  }
  */
  
  -- Display Order
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Active/Inactive
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_tiers_name ON subscription_tiers(name);
CREATE INDEX idx_subscription_tiers_active ON subscription_tiers(is_active);

-- RLS Policies (Read-only for all, write for service role only)
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tiers"
  ON subscription_tiers
  FOR SELECT
  USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### `user_subscriptions`
Tracks user subscriptions and Stripe data.

```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  
  -- Stripe Integration
  stripe_customer_id TEXT, -- Stripe Customer ID
  stripe_subscription_id TEXT, -- Stripe Subscription ID (NULL for free tier)
  stripe_price_id TEXT, -- Current Stripe Price ID
  
  -- Subscription Status
  status TEXT NOT NULL DEFAULT 'active',
  -- Possible values: 'active', 'trialing', 'past_due', 'cancelled', 'incomplete', 'incomplete_expired', 'unpaid'
  
  -- Billing
  billing_cycle TEXT, -- 'monthly' | 'annual' | NULL (for free)
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  
  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id), -- One subscription per user
  UNIQUE(stripe_subscription_id) -- One subscription ID per record
);

-- Indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- RLS Policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### `subscription_events`
Audit log for all subscription events (webhook processing, changes, etc.).

```sql
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event Details
  event_type TEXT NOT NULL,
  -- Types: 'checkout.session.completed', 'subscription.created', 'subscription.updated', 
  --        'subscription.deleted', 'invoice.payment_succeeded', 'invoice.payment_failed',
  --        'trial.started', 'trial.ending', 'trial.ended', 'subscription.upgraded', 
  --        'subscription.downgraded', 'subscription.cancelled', 'subscription.reactivated'
  
  event_source TEXT NOT NULL DEFAULT 'stripe',
  -- Sources: 'stripe', 'system', 'user', 'n8n'
  
  -- Stripe Data
  stripe_event_id TEXT UNIQUE, -- Stripe Event ID for idempotency
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Event Metadata
  metadata JSONB,
  /*
  Example metadata:
  {
    "from_tier": "basic",
    "to_tier": "premium",
    "amount_gbp": 100.00,
    "billing_cycle": "annual",
    "trial_days": 7,
    "error_message": "...",
    "webhook_response": {...}
  }
  */
  
  -- Processing Status
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_stripe_event_id ON subscription_events(stripe_event_id);
CREATE INDEX idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_created_at ON subscription_events(created_at DESC);
CREATE INDEX idx_subscription_events_processed ON subscription_events(processed);

-- RLS Policies
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON subscription_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all events"
  ON subscription_events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### Seed Data

Initial subscription tiers (to be inserted via migration):

```sql
INSERT INTO subscription_tiers (name, display_name, description, price_monthly_pence, price_annual_pence, features, sort_order) VALUES
(
  'free',
  'Free',
  'Get started with digital nomad basics',
  0,
  0,
  '{
    "max_courses": 0,
    "first_lesson_only": true,
    "community_access": false,
    "email_support": false,
    "one_on_one_support": false,
    "visa_info": "none",
    "accommodation_info": "none",
    "has_trial": false,
    "trial_days": null
  }'::jsonb,
  1
),
(
  'basic',
  'Basic',
  'Start your digital nomad journey',
  7000, -- £70.00
  67200, -- £672.00 (£56/month)
  '{
    "max_courses": 1,
    "first_lesson_only": false,
    "community_access": true,
    "email_support": true,
    "one_on_one_support": false,
    "visa_info": "short_term",
    "accommodation_info": "short_term",
    "has_trial": false,
    "trial_days": null
  }'::jsonb,
  2
),
(
  'premium',
  'Premium',
  'Full access to everything you need',
  10000, -- £100.00
  96000, -- £960.00 (£80/month)
  '{
    "max_courses": null,
    "first_lesson_only": false,
    "community_access": true,
    "email_support": true,
    "one_on_one_support": true,
    "visa_info": "all",
    "accommodation_info": "all",
    "has_trial": true,
    "trial_days": 7
  }'::jsonb,
  3
);
```

### Database Functions

#### `get_user_tier()`
Helper function to get user's current tier (for RLS policies).

```sql
CREATE OR REPLACE FUNCTION get_user_tier(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  tier_name TEXT;
BEGIN
  SELECT st.name INTO tier_name
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
  LIMIT 1;
  
  -- Default to free if no subscription found
  RETURN COALESCE(tier_name, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `can_access_content()`
Check if user can access specific content type.

```sql
CREATE OR REPLACE FUNCTION can_access_content(
  user_uuid UUID,
  content_type TEXT, -- 'course', 'community', 'visa_info', etc.
  content_level TEXT DEFAULT NULL -- 'short_term', 'all', etc.
)
RETURNS BOOLEAN AS $$
DECLARE
  tier_features JSONB;
  tier_name TEXT;
BEGIN
  -- Get user's tier features
  SELECT st.features, st.name INTO tier_features, tier_name
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
  LIMIT 1;
  
  -- If no subscription, use free tier
  IF tier_features IS NULL THEN
    SELECT features, name INTO tier_features, tier_name
    FROM subscription_tiers
    WHERE name = 'free'
    LIMIT 1;
  END IF;
  
  -- Check access based on content type
  CASE content_type
    WHEN 'course' THEN
      RETURN COALESCE((tier_features->>'max_courses')::INTEGER, 999) > 0 
             OR tier_name = 'premium';
    
    WHEN 'community' THEN
      RETURN (tier_features->>'community_access')::BOOLEAN;
    
    WHEN 'email_support' THEN
      RETURN (tier_features->>'email_support')::BOOLEAN;
    
    WHEN 'one_on_one_support' THEN
      RETURN (tier_features->>'one_on_one_support')::BOOLEAN;
    
    WHEN 'visa_info' THEN
      IF content_level = 'short_term' THEN
        RETURN (tier_features->>'visa_info') IN ('short_term', 'all');
      ELSE
        RETURN (tier_features->>'visa_info') = 'all';
      END IF;
    
    WHEN 'accommodation_info' THEN
      IF content_level = 'short_term' THEN
        RETURN (tier_features->>'accommodation_info') IN ('short_term', 'all');
      ELSE
        RETURN (tier_features->>'accommodation_info') = 'all';
      END IF;
    
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## API Contracts

### Subscription Endpoints

#### `GET /api/v1/subscriptions/tiers`
Get all available subscription tiers with pricing.

**Response** (200):
```json
{
  "tiers": [
    {
      "id": "uuid",
      "name": "free",
      "displayName": "Free",
      "description": "Get started with digital nomad basics",
      "pricing": {
        "monthly": 0,
        "annual": 0,
        "currency": "GBP"
      },
      "features": {
        "maxCourses": 0,
        "firstLessonOnly": true,
        "communityAccess": false,
        "emailSupport": false,
        "oneOnOneSupport": false,
        "visaInfo": "none",
        "accommodationInfo": "none"
      },
      "isCurrent": true
    },
    {
      "id": "uuid",
      "name": "basic",
      "displayName": "Basic",
      "description": "Start your digital nomad journey",
      "pricing": {
        "monthly": 70.00,
        "annual": 672.00,
        "annualMonthly": 56.00,
        "savings": 168.00,
        "savingsPercent": 20,
        "currency": "GBP"
      },
      "features": {
        "maxCourses": 1,
        "firstLessonOnly": false,
        "communityAccess": true,
        "emailSupport": true,
        "oneOnOneSupport": false,
        "visaInfo": "short_term",
        "accommodationInfo": "short_term"
      },
      "isCurrent": false,
      "stripeMonthlyPriceId": "price_xxx",
      "stripeAnnualPriceId": "price_yyy"
    },
    {
      "id": "uuid",
      "name": "premium",
      "displayName": "Premium",
      "description": "Full access to everything you need",
      "pricing": {
        "monthly": 100.00,
        "annual": 960.00,
        "annualMonthly": 80.00,
        "savings": 240.00,
        "savingsPercent": 20,
        "currency": "GBP"
      },
      "features": {
        "maxCourses": null,
        "firstLessonOnly": false,
        "communityAccess": true,
        "emailSupport": true,
        "oneOnOneSupport": true,
        "visaInfo": "all",
        "accommodationInfo": "all"
      },
      "trial": {
        "days": 7,
        "available": true
      },
      "isCurrent": false,
      "stripeMonthlyPriceId": "price_zzz",
      "stripeAnnualPriceId": "price_aaa"
    }
  ]
}
```

---

#### `GET /api/v1/subscriptions/status`
Get current user's subscription status.

**Response** (200):
```json
{
  "subscription": {
    "id": "uuid",
    "tier": {
      "id": "uuid",
      "name": "premium",
      "displayName": "Premium"
    },
    "status": "active",
    "billingCycle": "annual",
    "currentPeriodStart": "2025-10-01T00:00:00Z",
    "currentPeriodEnd": "2026-10-01T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "trial": {
      "active": false,
      "start": "2025-10-01T00:00:00Z",
      "end": "2025-10-08T00:00:00Z"
    },
    "canUpgrade": false,
    "canDowngrade": true,
    "nextBillingDate": "2026-10-01T00:00:00Z",
    "nextBillingAmount": 960.00
  }
}
```

**Response** (200 - Free Tier):
```json
{
  "subscription": {
    "tier": {
      "id": "uuid",
      "name": "free",
      "displayName": "Free"
    },
    "status": "active",
    "billingCycle": null,
    "canUpgrade": true,
    "canDowngrade": false
  }
}
```

---

#### `POST /api/v1/subscriptions/checkout`
Create a Stripe Checkout session.

**Request Body**:
```json
{
  "tierId": "uuid",
  "billingCycle": "annual",
  "trial": false,
  "successUrl": "https://leavelab.com/subscription/success",
  "cancelUrl": "https://leavelab.com/pricing"
}
```

**Response** (200):
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

**Errors**:
- 400: Invalid tier or billing cycle
- 401: Not authenticated
- 409: Already subscribed to this tier
- 500: Stripe API error

---

#### `POST /api/v1/subscriptions/portal`
Create a Stripe Customer Portal session for subscription management.

**Request Body**:
```json
{
  "returnUrl": "https://leavelab.com/subscription"
}
```

**Response** (200):
```json
{
  "url": "https://billing.stripe.com/p/session/xxx"
}
```

**Errors**:
- 401: Not authenticated
- 404: No Stripe customer found
- 500: Stripe API error

---

#### `POST /api/v1/subscriptions/webhook`
Stripe webhook handler (receives events from Stripe).

**Headers**:
- `stripe-signature`: Webhook signature for verification

**Request Body** (varies by event type):
```json
{
  "id": "evt_xxx",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": { ... }
  }
}
```

**Response** (200):
```json
{
  "received": true
}
```

**Supported Events**:
- `checkout.session.completed`: New subscription created
- `customer.subscription.created`: Subscription activated
- `customer.subscription.updated`: Subscription changed (upgrade/downgrade)
- `customer.subscription.deleted`: Subscription cancelled
- `invoice.payment_succeeded`: Payment successful
- `invoice.payment_failed`: Payment failed
- `customer.subscription.trial_will_end`: Trial ending soon (2 days)

---

## Stripe Configuration

### Products & Prices Setup

In Stripe Dashboard (Test Mode):

#### Product 1: LeaveLab Basic Membership
- **Name**: LeaveLab Basic
- **Description**: 1 full course, community access, email support, short-term visa info
- **Prices**:
  - Monthly: £70.00 (recurring) → `price_basic_monthly`
  - Annual: £672.00 (recurring, yearly) → `price_basic_annual`

#### Product 2: LeaveLab Premium Membership
- **Name**: LeaveLab Premium
- **Description**: Unlimited courses, community, 1-on-1 support, all visa info
- **Prices**:
  - Monthly: £100.00 (recurring) → `price_premium_monthly`
  - Annual: £960.00 (recurring, yearly) → `price_premium_annual`
- **Trial**: 7 days (configured in Checkout Session)

### Webhook Endpoint

**URL**: `https://leavelab.com/api/v1/subscriptions/webhook`

**Events to Listen**:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.trial_will_end

### Customer Portal Configuration

**Settings**:
- ✅ Allow customers to update payment methods
- ✅ Allow customers to update billing cycle
- ✅ Allow customers to cancel subscriptions
- ✅ Show invoice history
- ❌ Disable "downgrade immediately" (keep access until period end)

---

## n8n Integration

### Webhook Payload

Send to: `https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33`

**Method**: POST  
**Content-Type**: application/json

**Payload Structure**:
```json
{
  "event": "subscription.created" | "subscription.updated" | "subscription.cancelled" | "payment.succeeded" | "payment.failed" | "trial.ending",
  "timestamp": "2025-10-08T12:34:56.789Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "subscription": {
    "id": "uuid",
    "tier": "basic" | "premium",
    "billingCycle": "monthly" | "annual",
    "status": "active" | "trialing" | "past_due" | "cancelled",
    "currentPeriodEnd": "2026-10-08T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "payment": {
    "amountGbp": 70.00,
    "currency": "GBP",
    "stripeCustomerId": "cus_xxx",
    "stripeSubscriptionId": "sub_xxx",
    "stripeInvoiceId": "in_xxx"
  },
  "trial": {
    "active": false,
    "daysRemaining": 0
  }
}
```

**Expected Response**: 200 OK (we'll retry on 5xx errors)

**Use Cases for n8n**:
1. Send welcome email on new subscription
2. Add user to CRM (e.g., Notion, Airtable)
3. Add user to Discord with appropriate role
4. Send reminder emails (trial ending, payment failed)
5. Update mailing list segments
6. Notify team on Slack about new subscriptions

---

## Implementation Approach

### Phase 1: Foundation (Week 1)
1. ✅ Database migrations (tiers, subscriptions, events)
2. ✅ Seed subscription tiers
3. ✅ Install Stripe dependencies
4. ✅ Configure Stripe API keys (env variables)
5. ✅ Create Stripe products and prices in Dashboard
6. ✅ Set up Stripe webhook endpoint

### Phase 2: Backend API (Week 2)
1. ✅ Create subscription tier API (`GET /tiers`)
2. ✅ Create subscription status API (`GET /status`)
3. ✅ Create Checkout session API (`POST /checkout`)
4. ✅ Create Customer Portal API (`POST /portal`)
5. ✅ Implement webhook handler (`POST /webhook`)
6. ✅ Implement n8n webhook sender
7. ✅ Write unit tests for all APIs

### Phase 3: Frontend UI (Week 3)
1. ✅ Create pricing page (`/pricing`)
2. ✅ Create pricing cards component
3. ✅ Create monthly/annual toggle
4. ✅ Create trial banner for Premium
5. ✅ Create subscription management page (`/subscription`)
6. ✅ Create subscription status component
7. ✅ Create upgrade prompts for locked content
8. ✅ Write component tests

### Phase 4: Access Control (Week 3-4)
1. ✅ Implement RLS policies for content gating
2. ✅ Create `useSubscriptionGate` hook
3. ✅ Add subscription checks to course pages
4. ✅ Add subscription checks to visa info pages
5. ✅ Add subscription checks to community access
6. ✅ Test access control thoroughly

### Phase 5: Testing & Polish (Week 4)
1. ✅ Integration tests for full checkout flow
2. ✅ E2E tests with Playwright
3. ✅ Test webhook handling (simulate Stripe events)
4. ✅ Test n8n integration
5. ✅ Test trial flow (start, reminder, conversion)
6. ✅ Mobile testing (all flows)
7. ✅ Performance testing
8. ✅ Security audit

---

## Testing Strategy

### Unit Tests (Jest)
- `stripe-server.ts`: Stripe API calls
- `subscription-helpers.ts`: Business logic
- `tier-access.ts`: Access control logic
- API routes: All endpoints
- React components: Pricing cards, toggle, etc.

### Integration Tests
- Full checkout flow (create session → webhook → update DB)
- Subscription upgrades/downgrades
- Trial conversions
- Cancellations
- n8n webhook sending

### E2E Tests (Playwright)
- Complete user journey:
  1. View pricing page
  2. Click "Subscribe to Premium"
  3. Redirected to Stripe Checkout
  4. Fill payment details (test card)
  5. Redirected back to LeaveLab
  6. Access premium content
  7. Manage subscription via portal
  8. Cancel subscription

### Manual Testing Checklist
- [ ] Test with real Stripe test cards
- [ ] Test trial flow (Premium only)
- [ ] Test annual discount displays correctly
- [ ] Test upgrade from Basic to Premium
- [ ] Test downgrade from Premium to Basic
- [ ] Test cancellation (keep access until period end)
- [ ] Test failed payment handling
- [ ] Test mobile responsiveness
- [ ] Test Stripe Customer Portal
- [ ] Test n8n webhook receives data

---

## Security Considerations

### Stripe API Keys
- **Secret Key**: Server-side only, stored in env variable
- **Publishable Key**: Client-side, safe to expose
- **Webhook Secret**: Verify all webhook requests

### Webhook Security
1. ✅ Verify Stripe signature on every request
2. ✅ Use idempotency keys (Stripe event IDs)
3. ✅ Rate limiting on webhook endpoint
4. ✅ Log all webhook events for audit

### RLS Policies
1. ✅ Users can only read their own subscription
2. ✅ Content access enforced at database level
3. ✅ Service role can manage all subscriptions (webhooks)

### PCI Compliance
- ✅ No card data ever touches our servers
- ✅ All payment processing via Stripe Checkout
- ✅ Stripe handles all PCI compliance

---

## Complexity Tracking

### Overall Complexity: **High** ⚠️

**Breakdown**:
- Database Schema: **Medium** (3 new tables, functions, RLS)
- Stripe Integration: **High** (Checkout, webhooks, Customer Portal)
- Frontend UI: **Medium** (Pricing page, subscription management)
- Access Control: **High** (RLS policies, content gating)
- Testing: **High** (E2E, webhook simulation, n8n)
- n8n Integration: **Low** (simple POST request)

**Risk Areas**:
1. 🔴 **Webhook Reliability**: Stripe webhooks can be missed or delayed
   - Mitigation: Idempotency, retry logic, manual recovery process
   
2. 🟡 **Trial Conversions**: Auto-charging after trial requires careful testing
   - Mitigation: Thorough testing with test cards, clear user notifications
   
3. 🟡 **Content Access**: Complex RLS policies can have gaps
   - Mitigation: Comprehensive access control tests, security audit
   
4. 🟢 **Pricing Changes**: Future price updates need careful handling
   - Mitigation: Document process, don't change existing price IDs

---

## Dependencies & Prerequisites

### Before Starting Implementation

1. **Stripe Account**: ✅ Required
   - [ ] Create Stripe account
   - [ ] Complete verification (UK business)
   - [ ] Enable Test Mode
   - [ ] Get API keys (Test)

2. **Stripe Products**: ⏳ To Create
   - [ ] Create "LeaveLab Basic" product
   - [ ] Create "LeaveLab Premium" product
   - [ ] Create price IDs for all tiers/cycles
   - [ ] Document price IDs in `.env.local`

3. **n8n Webhook**: ✅ Already Have
   - URL: `https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33`

4. **Content to Gate**: ⏳ Depends on Other Features
   - Will need Course Management (Feature 003?)
   - Will need Visa Info pages
   - Can stub with placeholder content for now

---

## Next Steps

1. ✅ Review this plan
2. ✅ Answer any questions
3. → Generate task breakdown (`/speckit.tasks`)
4. → Begin implementation (MVP: Phases 1-3)

---

**Plan Status**: ✅ Ready for Task Breakdown  
**Estimated Timeline**: 3-4 weeks (MVP can be done in 2 weeks)  
**Estimated Tasks**: ~80-100 tasks

---

Let me know if you have any questions about the plan, or if you'd like me to proceed with generating the task breakdown! 🚀
