# Feature Specification: Stripe Membership Subscriptions

**Feature ID**: 002  
**Status**: 🔄 In Specification  
**Priority**: High (Revenue Critical)  
**Estimated Complexity**: High (3-4 weeks)

---

## Overview

Enable users to subscribe to paid membership tiers using Stripe, manage their subscriptions, and access membership-gated premium content. This feature is critical for generating revenue and validating the LeaveLab business model.

---

## User Stories

### Priority 1 (P1) - MVP Required

#### US-001: View Subscription Plans
**As a** LeaveLab user  
**I want to** view available subscription plans with pricing and features  
**So that** I can decide which tier best fits my needs

**Acceptance Criteria**:
- [ ] Can view all available subscription tiers (Free, Basic, Premium)
- [ ] Each tier clearly shows pricing (monthly/annual)
- [ ] Features for each tier are listed
- [ ] Free tier is automatically assigned to new users
- [ ] Call-to-action buttons are prominent on mobile
- [ ] Pricing displayed in GBP (£)
- [ ] Visual comparison between tiers

#### US-002: Subscribe to Paid Plan
**As a** free tier user  
**I want to** subscribe to a paid plan using my credit/debit card  
**So that** I can access premium content and features

**Acceptance Criteria**:
- [ ] Can click "Subscribe" button for Basic or Premium tier
- [ ] Redirected to Stripe Checkout (hosted page)
- [ ] Can enter payment details securely
- [ ] Can choose monthly or annual billing
- [ ] Receive email confirmation after successful payment
- [ ] Automatically redirected back to LeaveLab after payment
- [ ] Subscription status updates immediately
- [ ] Can access premium content after subscription

#### US-003: Access Membership-Gated Content
**As a** paid subscriber  
**I want to** access content exclusive to my membership tier  
**So that** I get value from my subscription

**Acceptance Criteria**:
- [ ] Free tier users cannot access Basic/Premium content
- [ ] Basic tier users can access Basic content but not Premium
- [ ] Premium tier users can access all content
- [ ] Clear messaging when content is locked
- [ ] Upgrade prompts for locked content
- [ ] Content access verified on every request (RLS)

#### US-004: View Subscription Status
**As a** subscribed user  
**I want to** view my current subscription details  
**So that** I know what I'm paying and when

**Acceptance Criteria**:
- [ ] Can view current subscription tier
- [ ] Can see next billing date
- [ ] Can see billing amount
- [ ] Can see payment method (last 4 digits)
- [ ] Can see subscription history
- [ ] Can download invoices

#### US-005: Manage Subscription
**As a** subscribed user  
**I want to** manage my subscription (update payment, cancel, change plan)  
**So that** I have control over my membership

**Acceptance Criteria**:
- [ ] Can access Stripe Customer Portal
- [ ] Can update payment method
- [ ] Can change billing cycle (monthly ↔ annual)
- [ ] Can upgrade/downgrade between tiers
- [ ] Can cancel subscription
- [ ] Cancellation takes effect at end of billing period
- [ ] Can reactivate cancelled subscription before period ends

### Priority 2 (P2) - Nice to Have

#### US-006: Annual Discount
**As a** potential subscriber  
**I want to** see and choose annual billing with a discount  
**So that** I can save money on my subscription

**Acceptance Criteria**:
- [ ] Annual plans show discount (e.g., "Save 20%")
- [ ] Toggle between monthly and annual pricing
- [ ] Clear savings calculation displayed
- [ ] Can select annual billing during checkout

#### US-007: Trial Period
**As a** new user considering a paid plan  
**I want to** try a Premium plan free for 7 days  
**So that** I can evaluate if it's worth paying for

**Acceptance Criteria**:
- [ ] Can start 7-day free trial for Premium
- [ ] No payment required to start trial
- [ ] Payment method collected but not charged
- [ ] Notified 2 days before trial ends
- [ ] Automatically converts to paid after 7 days
- [ ] Can cancel during trial without charge

### Priority 3 (P3) - Future Enhancements

#### US-008: Referral Credits
**As a** subscribed user  
**I want to** receive subscription credits for referring friends  
**So that** I can reduce my subscription cost

**Acceptance Criteria**:
- [ ] Generate unique referral link
- [ ] Track referrals through link
- [ ] Receive £10 credit per successful referral
- [ ] Credits apply to next billing cycle
- [ ] View referral history and credits earned

---

## Functional Requirements

### Stripe Integration

**FR-001**: System must integrate with Stripe API in test mode initially  
**FR-002**: System must create Stripe Customer on first subscription attempt  
**FR-003**: System must use Stripe Checkout for payment collection  
**FR-004**: System must store Stripe Customer ID in user profile  
**FR-005**: System must handle Stripe webhooks for payment events

### Subscription Tiers

**FR-006**: System must support three membership tiers: Free, Basic, Premium  
**FR-007**: Free tier must be automatically assigned to new users  
**FR-008**: Each tier must have clearly defined features and access levels  
**FR-009**: Subscription tiers must be stored in database with pricing  
**FR-010**: Pricing must be in GBP (£)

### Payment Processing

**FR-011**: System must redirect to Stripe Checkout for payment  
**FR-012**: System must handle successful payment callback  
**FR-013**: System must handle failed payment callback  
**FR-014**: System must handle cancelled checkout  
**FR-015**: System must send payment confirmation email (Stripe)  
**FR-016**: System must support both monthly and annual billing cycles

### Subscription Management

**FR-017**: System must track active subscriptions in database  
**FR-018**: System must update subscription status via webhooks  
**FR-019**: System must handle subscription cancellation  
**FR-020**: System must handle subscription renewal  
**FR-021**: System must handle subscription upgrade/downgrade  
**FR-022**: System must handle payment method updates  
**FR-023**: System must provide access to Stripe Customer Portal

### Access Control

**FR-024**: System must enforce membership tier access via RLS policies  
**FR-025**: System must verify subscription status on each content request  
**FR-026**: System must cache subscription status for performance (5 minutes)  
**FR-027**: System must show upgrade prompt for inaccessible content  
**FR-028**: System must allow immediate access after successful payment

### Webhook Handling

**FR-029**: System must verify Stripe webhook signatures  
**FR-030**: System must handle `checkout.session.completed` event  
**FR-031**: System must handle `customer.subscription.created` event  
**FR-032**: System must handle `customer.subscription.updated` event  
**FR-033**: System must handle `customer.subscription.deleted` event  
**FR-034**: System must handle `invoice.payment_succeeded` event  
**FR-035**: System must handle `invoice.payment_failed` event  
**FR-036**: System must retry failed webhook processing

### n8n Integration

**FR-037**: System must send webhook to n8n on successful payment  
**FR-038**: n8n webhook must include customer email and subscription tier  
**FR-039**: System must send webhook to n8n on subscription cancellation  
**FR-040**: System must send webhook to n8n on failed payment

---

## Key Entities

### Subscription Tier
- `id` (UUID)
- `name` (Free, Basic, Premium)
- `stripe_price_id_monthly` (string, nullable)
- `stripe_price_id_annual` (string, nullable)
- `price_monthly_gbp` (decimal)
- `price_annual_gbp` (decimal)
- `features` (JSONB)
- `max_courses` (integer, nullable)
- `has_community_access` (boolean)
- `has_1on1_support` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### User Subscription
- `id` (UUID)
- `user_id` (UUID, FK to profiles)
- `tier_id` (UUID, FK to subscription_tiers)
- `stripe_customer_id` (string, nullable)
- `stripe_subscription_id` (string, nullable)
- `status` (enum: active, past_due, cancelled, incomplete, trialing)
- `billing_cycle` (enum: monthly, annual)
- `current_period_start` (timestamptz)
- `current_period_end` (timestamptz)
- `cancel_at_period_end` (boolean)
- `trial_end` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Payment Event (Audit)
- `id` (UUID)
- `user_id` (UUID, FK to profiles)
- `stripe_event_id` (string)
- `event_type` (string)
- `amount_gbp` (decimal, nullable)
- `status` (enum: success, failed, pending)
- `metadata` (JSONB)
- `created_at` (timestamptz)

---

## Success Criteria

### Functional Success
1. ✅ Users can view and compare subscription plans
2. ✅ Users can successfully subscribe to paid plans via Stripe
3. ✅ Payment confirmation received within 5 seconds
4. ✅ Subscription status updates immediately after payment
5. ✅ Users can access content appropriate to their tier
6. ✅ Premium content is blocked for Free/Basic tiers
7. ✅ Users can manage subscriptions via Stripe portal
8. ✅ Webhooks process successfully 100% of the time
9. ✅ n8n receives payment notifications

### Technical Success
1. ✅ All Stripe API calls use test mode
2. ✅ Webhook signature verification passes
3. ✅ RLS policies enforce access control
4. ✅ No subscription data exposed to unauthorized users
5. ✅ 0 TypeScript errors
6. ✅ Mobile-responsive on all payment flows
7. ✅ Stripe Checkout loads < 2 seconds

### Business Success
1. ✅ First paid subscription completed successfully
2. ✅ Conversion tracking working (free → paid)
3. ✅ Revenue tracking accurate in Stripe dashboard
4. ✅ Churn tracking enabled

---

## Edge Cases & Error Handling

### Payment Failures
- **Case**: Payment declined by bank
  - **Handling**: Show user-friendly error, retry option, contact support
  
- **Case**: Network error during checkout
  - **Handling**: Stripe handles retry automatically, user can refresh

### Subscription Conflicts
- **Case**: User already has active subscription
  - **Handling**: Redirect to manage subscription, not new checkout

- **Case**: User cancels but changes mind
  - **Handling**: Allow reactivation if within current billing period

### Webhook Failures
- **Case**: Webhook endpoint unreachable
  - **Handling**: Stripe retries for 3 days, manual recovery process

- **Case**: Duplicate webhook events
  - **Handling**: Idempotency keys prevent duplicate processing

### Access Control
- **Case**: Subscription expires mid-session
  - **Handling**: Grace period until next request, then prompt to renew

- **Case**: User downgrades mid-cycle
  - **Handling**: Maintain access until end of current period

---

## Assumptions

1. Users will primarily use Stripe Checkout (not Payment Intents)
2. GBP (£) is the primary currency
3. Free tier has no Stripe subscription (manual assignment)
4. Users have already completed email verification (Feature 001)
5. n8n webhook endpoint is pre-configured and secure
6. Initial launch will use Stripe test mode only
7. Customer portal is sufficient for subscription management (no custom UI needed initially)

---

## Out of Scope

### Not in This Feature
1. ❌ Custom payment UI (using Stripe Checkout instead)
2. ❌ Multiple currency support (GBP only initially)
3. ❌ PayPal or other payment methods
4. ❌ Gift subscriptions
5. ❌ Team/organization subscriptions
6. ❌ Proration calculations (Stripe handles this)
7. ❌ Custom invoicing system
8. ❌ Dunning management (Stripe Smart Retries)
9. ❌ Tax/VAT calculations (will add later)
10. ❌ Discounts/coupons (P2 feature)

---

## Dependencies

### External Services
- ✅ Stripe Account (created and verified)
- ✅ Stripe Test Mode API keys
- ⏳ n8n webhook endpoint configured
- ⏳ Email service for payment notifications (Supabase or Stripe)

### Internal Dependencies
- ✅ Feature 001: User Authentication (completed)
- ✅ Supabase database and RLS setup
- ⏳ Content management system (for gated content)

---

## Technical Constraints

### Performance
- Stripe Checkout redirect < 2 seconds
- Webhook processing < 5 seconds
- Subscription status check < 100ms (cached)

### Security
- All Stripe API calls server-side only
- Webhook signature verification required
- No Stripe keys in client-side code
- RLS policies enforce all access control

### Compliance
- PCI DSS: Handled by Stripe (we don't store card data)
- GDPR: Subscription data exportable and deletable
- SCA: Stripe handles Strong Customer Authentication

---

## Clarifications - RESOLVED ✅

### 1. Subscription Tiers & Features

**Free Tier** (£0/month):
- ✅ First lesson of every course
- ❌ No community access
- ❌ No email support
- ❌ No visa/accommodation info

**Basic Tier** (£70/month or £672/year):
- ✅ 1 full course
- ✅ Community access
- ✅ Email support
- ✅ Short-term visa & accommodation info

**Premium Tier** (£100/month or £960/year):
- ✅ Unlimited courses
- ✅ Community access
- ✅ 1-on-1 support
- ✅ All visa & accommodation info (short-term + long-term)
- ✅ 7-day free trial (requires billing details, auto-renews)

### 2. Pricing Structure

| Tier | Monthly | Annual | Annual Savings |
|------|---------|--------|----------------|
| Free | £0 | £0 | - |
| Basic | £70 | £672 (£56/month) | 20% off (£168) |
| Premium | £100 | £960 (£80/month) | 20% off (£240) |

**Strategy**: Push annual billing with messaging around setting long-term goals for big life changes

### 3. n8n Webhook Integration

**Webhook URL**: `https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33`

**Payload** (to be sent on payment events):
```json
{
  "event": "subscription.created" | "subscription.cancelled" | "payment.succeeded" | "payment.failed",
  "user_id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "tier": "basic" | "premium",
  "billing_cycle": "monthly" | "annual",
  "amount_gbp": 70.00,
  "stripe_customer_id": "cus_xxx",
  "stripe_subscription_id": "sub_xxx",
  "timestamp": "2025-10-08T12:00:00Z"
}
```

### 4. Content Access Rules

| Content Type | Free | Basic | Premium |
|--------------|------|-------|---------|
| Course: First Lesson | ✅ All | ✅ All | ✅ All |
| Course: Full Course | ❌ | ✅ 1 course | ✅ Unlimited |
| Community Access | ❌ | ✅ | ✅ |
| Email Support | ❌ | ✅ | ✅ |
| 1-on-1 Support | ❌ | ❌ | ✅ |
| Short-term Visa Info | ❌ | ✅ | ✅ |
| Long-term Visa Info | ❌ | ❌ | ✅ |
| Accommodation Info | ❌ | ✅ Short-term | ✅ All |

### 5. Trial Period

**Premium Tier Only**:
- 7-day free trial
- Billing details required upfront (card saved in Stripe)
- Auto-renews to paid Premium after 7 days
- Can cancel anytime during trial (no charge)
- Email notifications: Day 0 (welcome), Day 5 (reminder), Day 7 (converted to paid)

### 6. Billing Cycle Strategy

**Primary Focus**: Push annual billing

**Messaging**:
- "Save 20% with annual billing"
- "Set long-term goals for big life changes"
- "Commit to your digital nomad journey"
- Annual as default selection
- Clear savings calculator: "You save £168/year with Basic Annual"

---

**Status**: ✅ Specification Complete  
**Next Step**: Create implementation plan

---
