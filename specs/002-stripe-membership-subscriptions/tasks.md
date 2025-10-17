# Task Breakdown: Stripe Membership Subscriptions

**Feature ID**: 002  
**Status**: 📋 Ready for Implementation  
**Created**: 2025-10-08  
**Total Tasks**: 96  
**Estimated Time**: 3-4 weeks

---

## Task Organization

- **[P]** = Can be executed in parallel with adjacent [P] tasks
- **Tests First**: Following TDD, write tests before implementation
- **Dependencies**: Tasks must be completed in order within each phase (unless marked [P])

---

## Phase 1: Foundation & Database (Week 1)

### Setup & Dependencies

**Task 1.1**: Install Stripe dependencies
- [ ] Run `npm install stripe @stripe/stripe-js`
- [ ] Verify installation in `package.json`
- **Files**: `package.json`
- **Time**: 5 min

**Task 1.2**: Add Stripe environment variables
- [ ] Add to `.env.local`:
  - `STRIPE_SECRET_KEY=sk_test_...`
  - `STRIPE_PUBLISHABLE_KEY=pk_test_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Add to `.env.example` (with placeholder values)
- **Files**: `.env.local`, `.env.example`
- **Time**: 5 min

---

### Database Migrations

**Task 1.3**: Create subscription_tiers table migration
- [ ] Create `supabase/migrations/20251008100001_create_subscription_tiers_table.sql`
- [ ] Define table schema (id, name, display_name, description, stripe IDs, pricing, features JSONB, sort_order, is_active)
- [ ] Add indexes on `name` and `is_active`
- [ ] Enable RLS with read-only policy for active tiers
- [ ] Add `updated_at` trigger
- **Files**: `supabase/migrations/20251008100001_create_subscription_tiers_table.sql`
- **Time**: 20 min

**Task 1.4**: Create user_subscriptions table migration
- [ ] Create `supabase/migrations/20251008100002_create_user_subscriptions_table.sql`
- [ ] Define table schema (id, user_id, tier_id, stripe customer/subscription/price IDs, status, billing cycle, period dates, trial dates, cancel flags)
- [ ] Add UNIQUE constraints (user_id, stripe_subscription_id)
- [ ] Add indexes on user_id, stripe_customer_id, stripe_subscription_id, status
- [ ] Enable RLS:
  - Users can view own subscription
  - Service role can manage all
- [ ] Add `updated_at` trigger
- **Files**: `supabase/migrations/20251008100002_create_user_subscriptions_table.sql`
- **Time**: 25 min

**Task 1.5**: Create subscription_events table migration
- [ ] Create `supabase/migrations/20251008100003_create_subscription_events_table.sql`
- [ ] Define table schema (id, user_id, event_type, event_source, stripe event ID, metadata JSONB, processed flag, error)
- [ ] Add UNIQUE constraint on stripe_event_id
- [ ] Add indexes on user_id, stripe_event_id, event_type, created_at, processed
- [ ] Enable RLS:
  - Users can view own events
  - Service role can manage all
- **Files**: `supabase/migrations/20251008100003_create_subscription_events_table.sql`
- **Time**: 20 min

**Task 1.6**: Create database helper functions migration
- [ ] Create `supabase/migrations/20251008100004_create_subscription_functions.sql`
- [ ] Create `get_user_tier(user_uuid UUID)` function
- [ ] Create `can_access_content(user_uuid UUID, content_type TEXT, content_level TEXT)` function
- [ ] Both functions should be SECURITY DEFINER
- **Files**: `supabase/migrations/20251008100004_create_subscription_functions.sql`
- **Time**: 30 min

**Task 1.7**: Seed subscription tiers migration
- [ ] Create `supabase/migrations/20251008100005_seed_subscription_tiers.sql`
- [ ] Insert Free tier (£0, no Stripe IDs, basic features)
- [ ] Insert Basic tier (£70/month, £672/year, placeholder Stripe IDs, basic features)
- [ ] Insert Premium tier (£100/month, £960/year, placeholder Stripe IDs, all features + trial)
- [ ] Use proper JSONB for features object
- **Files**: `supabase/migrations/20251008100005_seed_subscription_tiers.sql`
- **Time**: 20 min

**Task 1.8**: Run database migrations
- [ ] Run `supabase db reset` (if local) or `supabase db push` (if remote)
- [ ] Verify all tables created successfully
- [ ] Test `get_user_tier()` function with test user
- [ ] Test `can_access_content()` function with different tiers
- **Time**: 15 min

---

### Stripe Dashboard Setup

**Task 1.9**: Create Stripe products and prices
- [ ] Log in to Stripe Dashboard (Test Mode)
- [ ] Create "LeaveLab Basic" product
  - Add monthly price: £70.00 (recurring monthly) → Copy price ID
  - Add annual price: £672.00 (recurring yearly) → Copy price ID
- [ ] Create "LeaveLab Premium" product
  - Add monthly price: £100.00 (recurring monthly) → Copy price ID
  - Add annual price: £960.00 (recurring yearly) → Copy price ID
- [ ] Document all 4 price IDs
- **Time**: 15 min

**Task 1.10**: Update database with Stripe price IDs
- [ ] Create migration `supabase/migrations/20251008100006_update_stripe_price_ids.sql`
- [ ] Update Basic tier with real Stripe product ID and price IDs
- [ ] Update Premium tier with real Stripe product ID and price IDs
- [ ] Run migration
- **Files**: `supabase/migrations/20251008100006_update_stripe_price_ids.sql`
- **Time**: 10 min

**Task 1.11**: Configure Stripe webhook endpoint (placeholder)
- [ ] In Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint URL: `https://localhost:3000/api/v1/subscriptions/webhook` (will update when deployed)
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.trial_will_end`
- [ ] Copy webhook signing secret to `.env.local`
- **Time**: 10 min
- **Note**: Will update URL after deployment

---

## Phase 2: Backend API (Week 2)

### Server-Side Stripe Utilities

**Task 2.1**: Create Stripe server utility
- [ ] Create `src/features/subscriptions/lib/stripe-server.ts`
- [ ] Export singleton Stripe instance initialized with secret key
- [ ] Add helper functions:
  - `getStripeCustomer(customerId: string)`
  - `createStripeCustomer(email: string, userId: string)`
  - `getStripeSubscription(subscriptionId: string)`
- **Files**: `src/features/subscriptions/lib/stripe-server.ts`
- **Time**: 20 min

**Task 2.2**: Create Stripe client utility
- [ ] Create `src/features/subscriptions/lib/stripe-client.ts`
- [ ] Export function to load Stripe.js with publishable key
- [ ] Add type definitions for Stripe elements
- **Files**: `src/features/subscriptions/lib/stripe-client.ts`
- **Time**: 15 min

**Task 2.3**: Create subscription type definitions
- [ ] Create `src/features/subscriptions/types/subscription.ts`
- [ ] Define types:
  - `SubscriptionTier`
  - `UserSubscription`
  - `SubscriptionEvent`
  - `BillingCycle` ('monthly' | 'annual')
  - `SubscriptionStatus` (Stripe statuses)
  - `TierFeatures`
- **Files**: `src/features/subscriptions/types/subscription.ts`
- **Time**: 20 min

**Task 2.4**: Create Stripe types
- [ ] Create `src/features/subscriptions/types/stripe.ts`
- [ ] Define types for Stripe webhook events
- [ ] Define types for Checkout session creation
- **Files**: `src/features/subscriptions/types/stripe.ts`
- **Time**: 15 min

**Task 2.5**: Create subscription helper utilities
- [ ] Create `src/features/subscriptions/lib/subscription-helpers.ts`
- [ ] Add functions:
  - `formatPrice(pence: number)` → "£70.00"
  - `calculateAnnualSavings(monthlyPence: number, annualPence: number)` → { savings, percent }
  - `isTrialing(subscription)` → boolean
  - `canUpgrade(currentTier, targetTier)` → boolean
  - `canDowngrade(currentTier, targetTier)` → boolean
- **Files**: `src/features/subscriptions/lib/subscription-helpers.ts`
- **Time**: 25 min

**Task 2.6**: Create tier access utility
- [ ] Create `src/features/subscriptions/lib/tier-access.ts`
- [ ] Add functions:
  - `checkCourseAccess(tierFeatures, courseId?)` → boolean
  - `checkCommunityAccess(tierFeatures)` → boolean
  - `checkVisaInfoAccess(tierFeatures, level)` → boolean
  - `checkAccommodationInfoAccess(tierFeatures, level)` → boolean
  - `checkSupportLevel(tierFeatures)` → 'none' | 'email' | 'one-on-one'
- **Files**: `src/features/subscriptions/lib/tier-access.ts`
- **Time**: 30 min

**Task 2.7**: Create n8n webhook utility
- [ ] Create `src/lib/utils/n8n-webhook.ts`
- [ ] Add function `sendToN8n(eventData)` with retry logic
- [ ] Format payload according to plan spec
- [ ] Add error handling and logging
- **Files**: `src/lib/utils/n8n-webhook.ts`
- **Time**: 20 min

---

### API Endpoints - Tiers

**Task 2.8**: Write tests for GET /tiers endpoint
- [ ] Create `tests/integration/api/subscriptions/tiers.test.ts`
- [ ] Test: Returns all active tiers
- [ ] Test: Includes pricing calculations (savings, annualMonthly)
- [ ] Test: Marks user's current tier as `isCurrent: true`
- [ ] Test: Excludes inactive tiers
- [ ] Test: Returns 200 with proper structure
- **Files**: `tests/integration/api/subscriptions/tiers.test.ts`
- **Time**: 30 min

**Task 2.9**: Implement GET /tiers endpoint
- [ ] Create `src/app/api/v1/subscriptions/tiers/route.ts`
- [ ] Fetch all active tiers from database
- [ ] Get user's current tier (if authenticated)
- [ ] Calculate pricing (savings, annual monthly equivalent)
- [ ] Format response with all tier details
- [ ] Return 200 with tiers array
- **Files**: `src/app/api/v1/subscriptions/tiers/route.ts`
- **Time**: 35 min

---

### API Endpoints - Status

**Task 2.10**: Write tests for GET /status endpoint
- [ ] Create `tests/integration/api/subscriptions/status.test.ts`
- [ ] Test: Returns current subscription for authenticated user
- [ ] Test: Returns free tier if no subscription
- [ ] Test: Includes trial information if active
- [ ] Test: Includes next billing date and amount
- [ ] Test: Returns 401 if not authenticated
- **Files**: `tests/integration/api/subscriptions/status.test.ts`
- **Time**: 25 min

**Task 2.11**: Implement GET /status endpoint
- [ ] Create `src/app/api/v1/subscriptions/status/route.ts`
- [ ] Require authentication
- [ ] Fetch user's subscription from database
- [ ] Join with tier details
- [ ] Format response with all subscription details
- [ ] Handle case of no subscription (free tier)
- [ ] Return 200 with subscription object
- **Files**: `src/app/api/v1/subscriptions/status/route.ts`
- **Time**: 30 min

---

### API Endpoints - Checkout

**Task 2.12**: Write tests for POST /checkout endpoint
- [ ] Create `tests/integration/api/subscriptions/checkout.test.ts`
- [ ] Test: Creates Stripe Checkout session successfully
- [ ] Test: Returns session ID and URL
- [ ] Test: Handles trial for Premium tier
- [ ] Test: Returns 400 for invalid tier
- [ ] Test: Returns 401 if not authenticated
- [ ] Test: Returns 409 if already subscribed to same tier
- **Files**: `tests/integration/api/subscriptions/checkout.test.ts`
- **Time**: 30 min

**Task 2.13**: Implement POST /checkout endpoint
- [ ] Create `src/app/api/v1/subscriptions/checkout/route.ts`
- [ ] Require authentication
- [ ] Validate request body (tierId, billingCycle)
- [ ] Check if user already has Stripe customer ID, create if not
- [ ] Get tier and Stripe price ID from database
- [ ] Create Stripe Checkout Session with:
  - Customer ID
  - Price ID
  - Success/cancel URLs
  - Metadata (userId, tierId, billingCycle)
  - Trial period if Premium
- [ ] Return session ID and URL
- [ ] Handle errors (400, 409, 500)
- **Files**: `src/app/api/v1/subscriptions/checkout/route.ts`
- **Time**: 45 min

---

### API Endpoints - Customer Portal

**Task 2.14**: Write tests for POST /portal endpoint
- [ ] Create `tests/integration/api/subscriptions/portal.test.ts`
- [ ] Test: Creates Customer Portal session successfully
- [ ] Test: Returns portal URL
- [ ] Test: Returns 401 if not authenticated
- [ ] Test: Returns 404 if no Stripe customer found
- **Files**: `tests/integration/api/subscriptions/portal.test.ts`
- **Time**: 20 min

**Task 2.15**: Implement POST /portal endpoint
- [ ] Create `src/app/api/v1/subscriptions/portal/route.ts`
- [ ] Require authentication
- [ ] Get user's Stripe customer ID from database
- [ ] Return 404 if no customer ID
- [ ] Create Stripe Customer Portal session
- [ ] Return portal URL
- [ ] Handle errors (401, 404, 500)
- **Files**: `src/app/api/v1/subscriptions/portal/route.ts`
- **Time**: 25 min

---

### API Endpoints - Webhook Handler

**Task 2.16**: Write tests for POST /webhook endpoint
- [ ] Create `tests/integration/api/subscriptions/webhook.test.ts`
- [ ] Test: Verifies Stripe signature
- [ ] Test: Handles `checkout.session.completed` event
- [ ] Test: Handles `customer.subscription.updated` event
- [ ] Test: Handles `customer.subscription.deleted` event
- [ ] Test: Handles `invoice.payment_failed` event
- [ ] Test: Logs event to subscription_events table
- [ ] Test: Sends event to n8n webhook
- [ ] Test: Returns 200 with `{ received: true }`
- [ ] Test: Returns 400 for invalid signature
- [ ] Test: Uses idempotency (duplicate event IDs ignored)
- **Files**: `tests/integration/api/subscriptions/webhook.test.ts`
- **Time**: 45 min

**Task 2.17**: Implement POST /webhook endpoint (Part 1: Setup)
- [ ] Create `src/app/api/v1/subscriptions/webhook/route.ts`
- [ ] Set up Stripe webhook signature verification
- [ ] Parse webhook event
- [ ] Return 400 if signature invalid
- [ ] Check for duplicate event (idempotency via stripe_event_id)
- [ ] Log event to subscription_events table
- **Files**: `src/app/api/v1/subscriptions/webhook/route.ts`
- **Time**: 30 min

**Task 2.18**: Implement POST /webhook endpoint (Part 2: Event Handlers)
- [ ] Add handler for `checkout.session.completed`:
  - Extract customer ID, subscription ID, metadata
  - Create or update user_subscriptions record
  - Set status to 'trialing' or 'active'
  - Send to n8n webhook
- [ ] Add handler for `customer.subscription.created`:
  - Update user_subscriptions with subscription details
- [ ] Add handler for `customer.subscription.updated`:
  - Update user_subscriptions (status, period, cancel flags)
  - Detect upgrades/downgrades
  - Send to n8n webhook
- **Files**: `src/app/api/v1/subscriptions/webhook/route.ts`
- **Time**: 45 min

**Task 2.19**: Implement POST /webhook endpoint (Part 3: More Event Handlers)
- [ ] Add handler for `customer.subscription.deleted`:
  - Update user_subscriptions to cancelled
  - Move user back to free tier
  - Send to n8n webhook
- [ ] Add handler for `invoice.payment_succeeded`:
  - Update period dates
  - Send to n8n webhook
- [ ] Add handler for `invoice.payment_failed`:
  - Update status to 'past_due'
  - Send to n8n webhook (for reminder emails)
- [ ] Add handler for `customer.subscription.trial_will_end`:
  - Send to n8n webhook (for reminder emails)
- [ ] Mark event as processed
- [ ] Return 200 `{ received: true }`
- **Files**: `src/app/api/v1/subscriptions/webhook/route.ts`
- **Time**: 45 min

---

### Unit Tests for Utilities

**Task 2.20**: [P] Write unit tests for subscription helpers
- [ ] Create `tests/unit/subscriptions/subscription-helpers.test.ts`
- [ ] Test `formatPrice()` for various amounts
- [ ] Test `calculateAnnualSavings()` calculations
- [ ] Test `isTrialing()` with different dates
- [ ] Test `canUpgrade()` and `canDowngrade()` logic
- **Files**: `tests/unit/subscriptions/subscription-helpers.test.ts`
- **Time**: 30 min

**Task 2.21**: [P] Write unit tests for tier access
- [ ] Create `tests/unit/subscriptions/tier-access.test.ts`
- [ ] Test course access for each tier
- [ ] Test community access for each tier
- [ ] Test visa info access with different levels
- [ ] Test accommodation info access with different levels
- [ ] Test support level detection
- **Files**: `tests/unit/subscriptions/tier-access.test.ts`
- **Time**: 30 min

---

## Phase 3: Frontend UI (Week 3)

### Subscription Constants

**Task 3.1**: Create subscription constants
- [ ] Create `src/features/subscriptions/constants/tiers.ts`
- [ ] Export tier names as constants (FREE, BASIC, PREMIUM)
- [ ] Export feature keys as constants
- **Files**: `src/features/subscriptions/constants/tiers.ts`
- **Time**: 10 min

**Task 3.2**: Create subscription messages
- [ ] Create `src/features/subscriptions/constants/messages.ts`
- [ ] Add British English messages for:
  - Checkout success/failure
  - Trial messaging
  - Subscription errors
  - Upgrade prompts
  - Cancellation confirmations
- **Files**: `src/features/subscriptions/constants/messages.ts`
- **Time**: 15 min

---

### React Hooks

**Task 3.3**: Create useSubscription hook (with tests)
- [ ] Create `tests/unit/subscriptions/hooks/useSubscription.test.ts`
- [ ] Test: Fetches user's subscription on mount
- [ ] Test: Returns loading state
- [ ] Test: Returns error state
- [ ] Test: Returns subscription data
- [ ] Create `src/features/subscriptions/hooks/useSubscription.ts`
- [ ] Implement hook using SWR or React Query (fetches `/api/v1/subscriptions/status`)
- [ ] Export subscription, loading, error, refetch
- **Files**: 
  - `tests/unit/subscriptions/hooks/useSubscription.test.ts`
  - `src/features/subscriptions/hooks/useSubscription.ts`
- **Time**: 35 min

**Task 3.4**: Create useCheckout hook (with tests)
- [ ] Create `tests/unit/subscriptions/hooks/useCheckout.test.ts`
- [ ] Test: Creates checkout session
- [ ] Test: Redirects to Stripe Checkout
- [ ] Test: Handles errors
- [ ] Create `src/features/subscriptions/hooks/useCheckout.ts`
- [ ] Implement hook to call `/api/v1/subscriptions/checkout`
- [ ] Add function to redirect to Stripe Checkout URL
- [ ] Export `createCheckoutSession`, `loading`, `error`
- **Files**: 
  - `tests/unit/subscriptions/hooks/useCheckout.test.ts`
  - `src/features/subscriptions/hooks/useCheckout.ts`
- **Time**: 35 min

**Task 3.5**: Create useSubscriptionGate hook (with tests)
- [ ] Create `tests/unit/subscriptions/hooks/useSubscriptionGate.test.ts`
- [ ] Test: Returns access status for different content types
- [ ] Test: Works with different tier features
- [ ] Create `src/features/subscriptions/hooks/useSubscriptionGate.ts`
- [ ] Implement hook that uses `useSubscription` + `tier-access` utility
- [ ] Export `canAccessContent(contentType, level?)` function
- **Files**: 
  - `tests/unit/subscriptions/hooks/useSubscriptionGate.test.ts`
  - `src/features/subscriptions/hooks/useSubscriptionGate.ts`
- **Time**: 30 min

---

### UI Components - Pricing Page

**Task 3.6**: Create PricingToggle component (with tests)
- [ ] Create `tests/unit/subscriptions/components/PricingToggle.test.tsx`
- [ ] Test: Renders monthly/annual toggle
- [ ] Test: Calls onChange when toggled
- [ ] Test: Shows correct active state
- [ ] Create `src/features/subscriptions/components/PricingToggle.tsx`
- [ ] Implement toggle switch (monthly ↔ annual)
- [ ] Use Shadcn Switch or custom toggle
- [ ] Show "Save 20%" badge on annual
- [ ] Mobile-optimized (44px tap targets)
- **Files**: 
  - `tests/unit/subscriptions/components/PricingToggle.test.tsx`
  - `src/features/subscriptions/components/PricingToggle.tsx`
- **Time**: 35 min

**Task 3.7**: Create PricingCard component (with tests)
- [ ] Create `tests/unit/subscriptions/components/PricingCard.test.tsx`
- [ ] Test: Renders tier details correctly
- [ ] Test: Shows correct price based on billing cycle
- [ ] Test: Highlights current tier
- [ ] Test: Shows "Popular" badge for Premium
- [ ] Test: Calls onSubscribe when button clicked
- [ ] Create `src/features/subscriptions/components/PricingCard.tsx`
- [ ] Accept props: tier, billingCycle, isCurrent, isPopular, onSubscribe
- [ ] Render card with:
  - Tier name and description
  - Price (per month or annual)
  - Features list with checkmarks
  - Subscribe button (disabled if current tier)
  - "7-day free trial" for Premium
- [ ] Use Shadcn Card component
- [ ] Mobile-first responsive design
- **Files**: 
  - `tests/unit/subscriptions/components/PricingCard.test.tsx`
  - `src/features/subscriptions/components/PricingCard.tsx`
- **Time**: 50 min

**Task 3.8**: Create TrialBanner component (with tests)
- [ ] Create `tests/unit/subscriptions/components/TrialBanner.test.tsx`
- [ ] Test: Renders trial message
- [ ] Test: Shows correct trial length
- [ ] Create `src/features/subscriptions/components/TrialBanner.tsx`
- [ ] Show banner: "Try Premium free for 7 days"
- [ ] Include small print about billing
- [ ] Use Shadcn Alert or custom banner
- **Files**: 
  - `tests/unit/subscriptions/components/TrialBanner.test.tsx`
  - `src/features/subscriptions/components/TrialBanner.tsx`
- **Time**: 25 min

**Task 3.9**: Create PricingComparison component (with tests)
- [ ] Create `tests/unit/subscriptions/components/PricingComparison.test.tsx`
- [ ] Test: Renders all pricing cards
- [ ] Test: Updates prices when toggle changes
- [ ] Test: Calls checkout hook on subscribe
- [ ] Create `src/features/subscriptions/components/PricingComparison.tsx`
- [ ] Fetch tiers from `/api/v1/subscriptions/tiers`
- [ ] Show `PricingToggle` at top
- [ ] Render 3 `PricingCard` components (Free, Basic, Premium)
- [ ] Show `TrialBanner` for Premium
- [ ] Handle subscribe button click → call useCheckout
- [ ] Show loading state while redirecting
- [ ] Mobile: Stack cards vertically, Desktop: Side by side
- **Files**: 
  - `tests/unit/subscriptions/components/PricingComparison.test.tsx`
  - `src/features/subscriptions/components/PricingComparison.tsx`
- **Time**: 50 min

**Task 3.10**: Create public pricing page
- [ ] Create `src/app/(marketing)/pricing/page.tsx`
- [ ] Add metadata (title, description)
- [ ] Render `PricingComparison` component
- [ ] Add hero section at top:
  - Heading: "Choose your plan"
  - Subheading: "Start your digital nomad journey today"
- [ ] Add FAQ section at bottom (accordion)
- [ ] Fully responsive
- **Files**: `src/app/(marketing)/pricing/page.tsx`
- **Time**: 40 min

**Task 3.11**: Create FAQ accordion for pricing page
- [ ] Add FAQs to pricing page:
  - "Can I change my plan later?" → Yes, upgrade/downgrade anytime
  - "What payment methods do you accept?" → All major cards via Stripe
  - "Can I cancel anytime?" → Yes, keep access until period ends
  - "What's included in the free trial?" → Full Premium access for 7 days
  - "Do you offer refunds?" → 14-day money-back guarantee
- [ ] Use Shadcn Accordion component
- [ ] British English
- **Files**: `src/app/(marketing)/pricing/page.tsx`
- **Time**: 25 min

---

### UI Components - Subscription Management

**Task 3.12**: Create SubscriptionStatus component (with tests)
- [ ] Create `tests/unit/subscriptions/components/SubscriptionStatus.test.tsx`
- [ ] Test: Shows current tier and status
- [ ] Test: Shows trial information if active
- [ ] Test: Shows next billing date
- [ ] Test: Shows cancel warning if `cancelAtPeriodEnd`
- [ ] Create `src/features/subscriptions/components/SubscriptionStatus.tsx`
- [ ] Accept props: subscription
- [ ] Display:
  - Current tier badge
  - Status (Active, Trialing, Past Due, etc.)
  - Trial countdown if active
  - Next billing date and amount
  - Cancellation notice if scheduled
- [ ] Use Shadcn Badge, Card components
- **Files**: 
  - `tests/unit/subscriptions/components/SubscriptionStatus.test.tsx`
  - `src/features/subscriptions/components/SubscriptionStatus.tsx`
- **Time**: 40 min

**Task 3.13**: Create subscription management page
- [ ] Create `src/app/(dashboard)/subscription/page.tsx`
- [ ] Require authentication (redirect to login if not)
- [ ] Fetch subscription via `useSubscription()`
- [ ] Show `SubscriptionStatus` component
- [ ] Show "Upgrade" button if on Free or Basic
- [ ] Show "Manage Subscription" button → opens Customer Portal
- [ ] Show link to pricing page
- [ ] Add metadata
- **Files**: `src/app/(dashboard)/subscription/page.tsx`
- **Time**: 35 min

**Task 3.14**: Add Customer Portal redirect functionality
- [ ] In subscription management page:
  - Add "Manage Billing" button
  - On click, call `/api/v1/subscriptions/portal`
  - Redirect to returned URL
  - Show loading spinner while creating session
- [ ] Handle errors (show toast/alert)
- **Files**: `src/app/(dashboard)/subscription/page.tsx`
- **Time**: 20 min

---

### UI Components - Upgrade Prompts

**Task 3.15**: Create UpgradePrompt component (with tests)
- [ ] Create `tests/unit/subscriptions/components/UpgradePrompt.test.tsx`
- [ ] Test: Shows message about locked content
- [ ] Test: Shows required tier
- [ ] Test: Has link to pricing page
- [ ] Create `src/features/subscriptions/components/UpgradePrompt.tsx`
- [ ] Accept props: requiredTier, contentType
- [ ] Show message: "This [content type] requires [tier] membership"
- [ ] Show "Upgrade to [tier]" button → links to pricing page
- [ ] Use Shadcn Alert component
- [ ] Mobile-optimized
- **Files**: 
  - `tests/unit/subscriptions/components/UpgradePrompt.test.tsx`
  - `src/features/subscriptions/components/UpgradePrompt.tsx`
- **Time**: 30 min

---

## Phase 4: Access Control (Week 3-4)

### RLS Policies for Content

**Task 4.1**: Create RLS policy for courses (placeholder)
- [ ] Create `supabase/migrations/20251008200001_add_course_access_rls.sql`
- [ ] Add comment: "Will implement when courses table exists"
- [ ] Add placeholder policy structure:
  ```sql
  -- POLICY: Users can access courses based on tier
  -- SELECT: WHERE can_access_content(auth.uid(), 'course', NULL)
  ```
- [ ] Document logic for future implementation
- **Files**: `supabase/migrations/20251008200001_add_course_access_rls.sql`
- **Time**: 15 min

**Task 4.2**: Create RLS policy for visa info (placeholder)
- [ ] Create `supabase/migrations/20251008200002_add_visa_info_access_rls.sql`
- [ ] Add comment: "Will implement when visa_info table exists"
- [ ] Add placeholder policy structure:
  ```sql
  -- POLICY: Users can access visa info based on tier and level
  -- SELECT: WHERE can_access_content(auth.uid(), 'visa_info', level)
  ```
- **Files**: `supabase/migrations/20251008200002_add_visa_info_access_rls.sql`
- **Time**: 15 min

**Task 4.3**: Create RLS policy for accommodation info (placeholder)
- [ ] Create `supabase/migrations/20251008200003_add_accommodation_access_rls.sql`
- [ ] Add comment: "Will implement when accommodation_info table exists"
- [ ] Add placeholder policy:
  ```sql
  -- POLICY: Users can access accommodation info based on tier and level
  -- SELECT: WHERE can_access_content(auth.uid(), 'accommodation_info', level)
  ```
- **Files**: `supabase/migrations/20251008200003_add_accommodation_access_rls.sql`
- **Time**: 15 min

---

### Client-Side Access Control

**Task 4.4**: Add subscription gate to dashboard
- [ ] Update `src/app/(dashboard)/dashboard/page.tsx`
- [ ] Use `useSubscription()` to get current tier
- [ ] Show tier badge in dashboard header
- [ ] Show upgrade prompt if on Free tier
- [ ] Add "Upgrade" link in navigation
- **Files**: `src/app/(dashboard)/dashboard/page.tsx`
- **Time**: 20 min

**Task 4.5**: Create example gated content page (for testing)
- [ ] Create `src/app/(dashboard)/premium-content/page.tsx`
- [ ] Use `useSubscriptionGate()` to check access
- [ ] If no access:
  - Show `UpgradePrompt` component
  - Hide actual content
- [ ] If has access:
  - Show premium content placeholder
- [ ] Test with different tiers
- **Files**: `src/app/(dashboard)/premium-content/page.tsx`
- **Time**: 25 min

---

### Server-Side Access Control

**Task 4.6**: Create subscription middleware utility
- [ ] Create `src/lib/utils/subscription-middleware.ts`
- [ ] Add function `requireSubscription(tierId: string)`
- [ ] Check user's subscription server-side
- [ ] Return 403 if insufficient access
- [ ] Export for use in API routes
- **Files**: `src/lib/utils/subscription-middleware.ts`
- **Time**: 30 min

**Task 4.7**: Create example protected API route (for testing)
- [ ] Create `src/app/api/v1/premium/data/route.ts`
- [ ] Use `requireSubscription('premium')` middleware
- [ ] Return premium data if authorized
- [ ] Return 403 if not authorized
- [ ] Test with different user tiers
- **Files**: `src/app/api/v1/premium/data/route.ts`
- **Time**: 20 min

---

## Phase 5: Testing & Polish (Week 4)

### Integration Tests

**Task 5.1**: Write E2E test for full checkout flow
- [ ] Create `tests/e2e/subscriptions/checkout-flow.spec.ts`
- [ ] Test: User views pricing page
- [ ] Test: User clicks "Subscribe to Premium"
- [ ] Test: User redirected to Stripe Checkout
- [ ] Test: User enters test card (4242 4242 4242 4242)
- [ ] Test: User completes payment
- [ ] Test: User redirected back to LeaveLab
- [ ] Test: User's subscription updated in database
- [ ] Test: User can access premium content
- **Files**: `tests/e2e/subscriptions/checkout-flow.spec.ts`
- **Time**: 60 min

**Task 5.2**: Write E2E test for trial flow
- [ ] Create `tests/e2e/subscriptions/trial-flow.spec.ts`
- [ ] Test: User subscribes to Premium with trial
- [ ] Test: Subscription status shows "Trialing"
- [ ] Test: User has access to premium content
- [ ] Test: Trial countdown displays correctly
- **Files**: `tests/e2e/subscriptions/trial-flow.spec.ts`
- **Time**: 40 min

**Task 5.3**: Write E2E test for subscription management
- [ ] Create `tests/e2e/subscriptions/manage-subscription.spec.ts`
- [ ] Test: User navigates to subscription page
- [ ] Test: User clicks "Manage Billing"
- [ ] Test: User redirected to Customer Portal
- [ ] Test: User can view invoice history (in Portal)
- [ ] Test: User can update payment method (in Portal)
- **Files**: `tests/e2e/subscriptions/manage-subscription.spec.ts`
- **Time**: 40 min

**Task 5.4**: Write integration test for webhook idempotency
- [ ] Create `tests/integration/webhooks/idempotency.test.ts`
- [ ] Test: Send same webhook event twice
- [ ] Test: Second event is ignored (no duplicate processing)
- [ ] Test: subscription_events table only has one entry
- **Files**: `tests/integration/webhooks/idempotency.test.ts`
- **Time**: 30 min

**Task 5.5**: Write integration test for n8n webhook
- [ ] Create `tests/integration/webhooks/n8n-integration.test.ts`
- [ ] Test: Webhook sends correct payload to n8n
- [ ] Test: Handles n8n timeout gracefully
- [ ] Test: Retries on 5xx errors
- [ ] Test: Logs failures
- **Files**: `tests/integration/webhooks/n8n-integration.test.ts`
- **Time**: 35 min

**Task 5.6**: Test access control with different tiers
- [ ] Create `tests/integration/access-control/tier-access.test.ts`
- [ ] Test Free tier:
  - Cannot access courses
  - Cannot access community
  - Cannot access visa/accommodation info
- [ ] Test Basic tier:
  - Can access 1 course
  - Can access community
  - Can access short-term visa/accommodation info
  - Cannot access long-term info
- [ ] Test Premium tier:
  - Can access all courses
  - Can access all content
  - Can access 1-on-1 support
- **Files**: `tests/integration/access-control/tier-access.test.ts`
- **Time**: 45 min

---

### Manual Testing & Polish

**Task 5.7**: Test with Stripe test cards
- [ ] Test successful payment (4242 4242 4242 4242)
- [ ] Test declined payment (4000 0000 0000 0002)
- [ ] Test authentication required (4000 0025 0000 3155)
- [ ] Test expired card (4000 0000 0000 0069)
- [ ] Verify error handling for each case
- **Time**: 30 min

**Task 5.8**: Test trial conversion flow
- [ ] Subscribe to Premium with trial (test account)
- [ ] Wait for trial to "end" (adjust dates in DB for testing)
- [ ] Verify auto-charge occurs
- [ ] Verify status changes from 'trialing' to 'active'
- [ ] Verify n8n receives event
- **Time**: 30 min

**Task 5.9**: Test subscription upgrade
- [ ] Subscribe to Basic (test account)
- [ ] Upgrade to Premium from subscription page
- [ ] Verify prorated charge
- [ ] Verify access immediately updated
- [ ] Verify webhook processed correctly
- [ ] Verify n8n receives event
- **Time**: 25 min

**Task 5.10**: Test subscription downgrade
- [ ] Subscribe to Premium (test account)
- [ ] Downgrade to Basic via Customer Portal
- [ ] Verify access continues until period end
- [ ] Verify `cancelAtPeriodEnd` flag set correctly
- [ ] Verify downgrade takes effect at period end
- **Time**: 25 min

**Task 5.11**: Test subscription cancellation
- [ ] Subscribe to Premium (test account)
- [ ] Cancel via Customer Portal
- [ ] Verify access continues until period end
- [ ] Verify status shows "Cancelled"
- [ ] Verify user moved to Free tier after period end
- [ ] Verify n8n receives event
- **Time**: 25 min

**Task 5.12**: Test failed payment handling
- [ ] Subscribe to Basic (test account)
- [ ] Simulate failed payment (use Stripe Dashboard test mode)
- [ ] Verify status changes to 'past_due'
- [ ] Verify n8n receives event (for reminder email)
- [ ] Verify user still has access (grace period)
- **Time**: 25 min

**Task 5.13**: Mobile responsiveness testing
- [ ] Test pricing page on 375px width (iPhone SE)
- [ ] Test subscription management page on mobile
- [ ] Test all buttons meet 44px tap target
- [ ] Test Stripe Checkout on mobile device
- [ ] Test toggle switch on mobile
- [ ] Verify no horizontal scroll
- **Time**: 30 min

**Task 5.14**: Performance testing
- [ ] Measure pricing page load time (target: < 2s)
- [ ] Measure Checkout redirect time (target: < 2s)
- [ ] Measure webhook processing time (target: < 5s)
- [ ] Optimize slow queries if needed
- [ ] Add skeleton loaders where needed
- **Time**: 40 min

**Task 5.15**: British English copy review
- [ ] Review all user-facing messages
- [ ] Verify "centre" not "center", "licence" not "license", etc.
- [ ] Review pricing page copy
- [ ] Review subscription management page copy
- [ ] Review error messages
- [ ] Review email templates (via n8n)
- **Time**: 20 min

---

### Documentation

**Task 5.16**: Create subscription testing guide
- [ ] Create `SUBSCRIPTION_TESTING_GUIDE.md`
- [ ] Document how to test locally:
  - Stripe test cards
  - Webhook testing (Stripe CLI)
  - Trial flows
  - n8n webhook testing
- [ ] Add troubleshooting section
- **Files**: `SUBSCRIPTION_TESTING_GUIDE.md`
- **Time**: 30 min

**Task 5.17**: Update README with subscription setup
- [ ] Add "Subscriptions" section to README
- [ ] Document Stripe setup steps
- [ ] Document required env variables
- [ ] Add link to pricing page
- **Files**: `README.md`
- **Time**: 20 min

**Task 5.18**: Create Stripe webhook deployment guide
- [ ] Create `STRIPE_WEBHOOK_DEPLOYMENT.md`
- [ ] Document how to update webhook URL after deployment
- [ ] Document how to verify webhook signature
- [ ] Add troubleshooting for webhook issues
- **Files**: `STRIPE_WEBHOOK_DEPLOYMENT.md`
- **Time**: 25 min

---

### Security Audit

**Task 5.19**: Security review of Stripe integration
- [ ] Verify Stripe secret key never exposed client-side
- [ ] Verify webhook signature verification working
- [ ] Verify all Stripe API calls are server-side
- [ ] Verify idempotency keys used correctly
- [ ] Verify no sensitive data logged
- [ ] Test rate limiting on webhook endpoint
- **Time**: 40 min

**Task 5.20**: Security review of RLS policies
- [ ] Verify users can only read own subscription
- [ ] Verify service role required for subscription writes
- [ ] Verify content access enforced at DB level
- [ ] Test attempting to access higher tier content with lower tier account
- [ ] Test SQL injection attempts on access functions
- **Time**: 35 min

**Task 5.21**: GDPR compliance check
- [ ] Verify subscription data included in data export (Feature 001)
- [ ] Verify subscription data deleted on account deletion
- [ ] Verify Stripe customer deleted on account deletion
- [ ] Document data retention policy
- [ ] Add "Delete my subscription data" to account deletion flow
- **Time**: 30 min

---

### Final Polish

**Task 5.22**: Add subscription info to profile page
- [ ] Update `src/app/(dashboard)/profile/page.tsx`
- [ ] Add "Current Plan" section
- [ ] Show tier badge
- [ ] Add link to subscription management page
- **Files**: `src/app/(dashboard)/profile/page.tsx`
- **Time**: 15 min

**Task 5.23**: Add "Upgrade" link to navigation
- [ ] Update main navigation (header/sidebar)
- [ ] Show "Upgrade" link if on Free or Basic tier
- [ ] Hide if on Premium tier
- [ ] Link to pricing page
- **Time**: 15 min

**Task 5.24**: Add loading skeletons
- [ ] Add skeleton loader to pricing page (while fetching tiers)
- [ ] Add skeleton loader to subscription management page
- [ ] Add skeleton loader to subscription status component
- [ ] Use Shadcn Skeleton component
- **Time**: 25 min

**Task 5.25**: Add success/error toasts
- [ ] Add toast notification on successful subscription
- [ ] Add toast notification on subscription update
- [ ] Add toast notification on errors
- [ ] Use Shadcn Toast or Sonner
- **Time**: 20 min

**Task 5.26**: Final testing checklist
- [ ] Run full test suite (`npm test`)
- [ ] Run E2E tests (`npm run test:e2e`)
- [ ] Test all flows manually on desktop
- [ ] Test all flows manually on mobile
- [ ] Test with different browsers (Chrome, Safari, Firefox)
- [ ] Test webhook delivery with Stripe CLI
- [ ] Test n8n webhook reception
- [ ] Verify no console errors
- [ ] Verify no linter errors
- [ ] Verify TypeScript compiles with no errors
- **Time**: 60 min

---

## Summary

### Total Tasks: 96
### Estimated Time: 3-4 weeks (60-80 hours)

**Breakdown by Phase**:
- Phase 1 (Foundation): 11 tasks, ~3 hours
- Phase 2 (Backend API): 21 tasks, ~12 hours
- Phase 3 (Frontend UI): 15 tasks, ~9 hours
- Phase 4 (Access Control): 7 tasks, ~3 hours
- Phase 5 (Testing & Polish): 42 tasks, ~17 hours

**Critical Path**:
1. Database setup (Phase 1)
2. Stripe configuration (Phase 1)
3. Backend APIs (Phase 2)
4. Frontend UI (Phase 3)
5. Access control (Phase 4)
6. Testing & polish (Phase 5)

**MVP Scope** (if needed to ship faster):
- Phases 1-3 (Foundation + Backend + Frontend)
- Skip advanced access control (Phase 4) → implement when content exists
- Skip some E2E tests (Phase 5) → do manual testing only
- **MVP Time**: ~2 weeks

---

## Prerequisites Before Starting

1. **Stripe Account**: Create and verify Stripe account
2. **Stripe Test Mode**: Enable test mode, get API keys
3. **n8n Access**: Ensure n8n webhook URL is accessible
4. **Supabase Running**: Local or remote Supabase instance
5. **Feature 001 Complete**: Authentication must be working

---

## Next Steps

Ready to begin implementation! Would you like to:

1. **Start Phase 1 automatically** (Foundation & Database)
2. **Review specific tasks** before starting
3. **Adjust scope** (e.g., MVP vs. full implementation)

Let me know how you'd like to proceed! 🚀
