# LeaveLab Webhook Events Documentation 🔔

**Version**: 1.0  
**Last Updated**: October 2025

---

## Table of Contents

- [Overview](#overview)
- [Stripe Webhooks](#stripe-webhooks)
- [n8n Integration](#n8n-integration)
- [Webhook Security](#webhook-security)
- [Event Types](#event-types)
- [Testing Webhooks](#testing-webhooks)
- [Troubleshooting](#troubleshooting)

---

## Overview

LeaveLab uses webhooks to receive real-time notifications from Stripe about subscription events. These webhooks are then processed and forwarded to n8n for workflow automation (emails, notifications, analytics).

### Webhook Flow

```
Stripe Event
    │
    ▼
POST /api/v1/subscriptions/webhook
    │
    ├──▶ Verify signature (security)
    │
    ├──▶ Check for duplicates (idempotency)
    │
    ├──▶ Log to database (audit trail)
    │
    ├──▶ Process event (update subscription)
    │
    └──▶ Forward to n8n (automation)
```

---

## Stripe Webhooks

### Endpoint Configuration

**Production**: `https://leavelab.com/api/v1/subscriptions/webhook`  
**Development**: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for local testing

### Configuring Stripe Webhooks

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Add endpoint**: `https://leavelab.com/api/v1/subscriptions/webhook`
3. **Select events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`

4. **Copy webhook signing secret** → Add to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## n8n Integration

### n8n Webhook URL

```
https://nocoded-n8n-u41031.vm.elestio.app/webhook/4f8d2597-a525-4355-997b-52acbc5a8e33
```

### n8n Payload Format

All subscription events are forwarded to n8n with a standardized payload:

```typescript
interface N8nWebhookPayload {
  event: string;                    // Event type
  timestamp: string;                // ISO 8601 timestamp
  user: {
    id: string;                     // User ID
    email: string;                  // User email
    name: string | null;            // Display name
  };
  subscription: {
    id: string;                     // Subscription ID
    tier: string;                   // 'free' | 'basic' | 'premium'
    billingCycle: string;           // 'monthly' | 'annual'
    status: string;                 // Subscription status
    currentPeriodEnd: string;       // Next billing date
    cancelAtPeriodEnd: boolean;     // Is cancelling?
  };
  payment: {
    amountGbp: number;              // Amount in GBP
    currency: string;               // 'GBP'
    stripeCustomerId: string;       // Stripe Customer ID
    stripeSubscriptionId: string;   // Stripe Subscription ID
  };
  trial: {
    active: boolean;                // Is in trial?
    daysRemaining: number;          // Days left in trial
  };
}
```

### Example n8n Payload

```json
{
  "event": "subscription.created",
  "timestamp": "2025-10-17T12:00:00Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Smith"
  },
  "subscription": {
    "id": "sub_xxx",
    "tier": "premium",
    "billingCycle": "annual",
    "status": "active",
    "currentPeriodEnd": "2026-10-17T12:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "payment": {
    "amountGbp": 960,
    "currency": "GBP",
    "stripeCustomerId": "cus_xxx",
    "stripeSubscriptionId": "sub_xxx"
  },
  "trial": {
    "active": false,
    "daysRemaining": 0
  }
}
```

---

## Webhook Security

### Signature Verification

All Stripe webhooks are verified using HMAC signatures to ensure they come from Stripe.

#### How It Works

1. Stripe signs the payload with your webhook secret
2. Signature is sent in `Stripe-Signature` header
3. Our server verifies the signature before processing

#### Implementation

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Invalid signature:', error);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Process event
}
```

### Idempotency

We track all webhook events by `stripe_event_id` to prevent duplicate processing:

```sql
-- Check for duplicate
SELECT id FROM subscription_events 
WHERE stripe_event_id = 'evt_xxx';

-- If exists, return early
IF EXISTS THEN
  RETURN { received: true, duplicate: true };
END IF;

-- Otherwise, process event
```

### Rate Limiting

- **Maximum**: 1000 webhook requests per minute
- **Retries**: Stripe retries failed webhooks for 3 days
- **Backoff**: Exponential backoff (1h, 3h, 6h, 12h, 24h)

---

## Event Types

### checkout.session.completed

Fired when a checkout session is successfully completed.

#### When It Fires

- User completes payment in Stripe Checkout
- Payment is authorized
- Subscription is created

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_xxx",
      "object": "checkout.session",
      "customer": "cus_xxx",
      "subscription": "sub_xxx",
      "amount_total": 96000,
      "currency": "gbp",
      "payment_status": "paid",
      "metadata": {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "tierId": "tier-premium-id",
        "billingCycle": "annual"
      }
    }
  }
}
```

#### Our Processing

1. Extract `userId`, `tierId`, `billingCycle` from metadata
2. Update `user_subscriptions` table:
   - Set `stripe_customer_id`
   - Set `stripe_subscription_id`
   - Set `status` to `active` or `trialing`
   - Set billing period dates
3. Send to n8n with event: `subscription.created`

#### n8n Actions

- Send welcome email
- Add to email list (Basic/Premium)
- Send Discord invitation (Basic/Premium)
- Track conversion in analytics

---

### customer.subscription.created

Fired when a subscription is created.

#### When It Fires

- After successful checkout
- Usually follows `checkout.session.completed`

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "customer.subscription.created",
  "data": {
    "object": {
      "id": "sub_xxx",
      "object": "subscription",
      "customer": "cus_xxx",
      "status": "active",
      "current_period_start": 1697548800,
      "current_period_end": 1700227200,
      "items": {
        "data": [{
          "price": {
            "id": "price_xxx",
            "unit_amount": 10000,
            "currency": "gbp",
            "recurring": {
              "interval": "month"
            }
          }
        }]
      }
    }
  }
}
```

#### Our Processing

1. Find user by `stripe_subscription_id` or `stripe_customer_id`
2. Update subscription in database
3. Usually redundant with `checkout.session.completed`

---

### customer.subscription.updated

Fired when a subscription is updated.

#### When It Fires

- Billing cycle changed (monthly ↔ annual)
- Payment method updated
- Subscription upgraded/downgraded
- Subscription cancelled (but still active until period end)
- Trial converted to paid

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_xxx",
      "status": "active",
      "cancel_at_period_end": true,
      "current_period_end": 1700227200
    },
    "previous_attributes": {
      "cancel_at_period_end": false
    }
  }
}
```

#### Our Processing

1. Find user by `stripe_subscription_id`
2. Update subscription fields:
   - `status`
   - `current_period_start`
   - `current_period_end`
   - `cancel_at_period_end`
   - `cancelled_at` (if cancelling)
3. Send to n8n with event: `subscription.updated`

#### n8n Actions

- If `cancel_at_period_end` = true:
  - Send cancellation confirmation email
  - Send feedback survey
  - Offer win-back discount
- If upgraded:
  - Send upgrade confirmation
  - Grant access to new features
- If downgraded:
  - Send downgrade confirmation
  - Remove access at period end

---

### customer.subscription.deleted

Fired when a subscription is cancelled/deleted.

#### When It Fires

- Subscription period ends after cancellation
- Payment fails multiple times
- Subscription manually deleted in Stripe

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "customer.subscription.deleted",
  "data": {
    "object": {
      "id": "sub_xxx",
      "status": "canceled",
      "canceled_at": 1697548800,
      "ended_at": 1697548800
    }
  }
}
```

#### Our Processing

1. Find user by `stripe_subscription_id`
2. Move user to free tier:
   - Get free tier ID
   - Update `user_subscriptions`:
     - `tier_id` = free tier ID
     - `status` = 'cancelled'
     - `cancelled_at` = now
     - `stripe_subscription_id` = null
3. Send to n8n with event: `subscription.cancelled`

#### n8n Actions

- Send "sorry to see you go" email
- Remove from premium email lists
- Remove from Discord premium roles
- Track churn in analytics
- Schedule win-back campaign (30 days)

---

### invoice.payment_succeeded

Fired when a subscription payment succeeds.

#### When It Fires

- First payment (subscription creation)
- Recurring payment (renewal)
- Retry after failed payment

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "invoice.payment_succeeded",
  "data": {
    "object": {
      "id": "in_xxx",
      "subscription": "sub_xxx",
      "amount_paid": 10000,
      "currency": "gbp",
      "billing_reason": "subscription_cycle",
      "customer": "cus_xxx"
    }
  }
}
```

#### Our Processing

1. Find user by `stripe_subscription_id`
2. Log payment event in `subscription_events`
3. Send to n8n with event: `payment.succeeded`

#### n8n Actions

- Send payment receipt email
- Update billing records
- Track revenue in analytics
- If renewal:
  - Send "thank you for renewing" email

---

### invoice.payment_failed

Fired when a subscription payment fails.

#### When It Fires

- Card declined
- Insufficient funds
- Card expired
- Payment method removed

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "invoice.payment_failed",
  "data": {
    "object": {
      "id": "in_xxx",
      "subscription": "sub_xxx",
      "amount_due": 10000,
      "currency": "gbp",
      "customer": "cus_xxx",
      "next_payment_attempt": 1697635200
    }
  }
}
```

#### Our Processing

1. Find user by `stripe_subscription_id`
2. Update subscription status to `past_due`
3. Send to n8n with event: `payment.failed`

#### n8n Actions

- Send payment failed email
- Ask user to update payment method
- Provide link to customer portal
- If 3rd failure:
  - Send final warning
  - Notify that subscription will cancel in 5 days

#### Stripe's Automatic Retries

Stripe automatically retries failed payments:
- **Day 3**: First retry
- **Day 5**: Second retry
- **Day 7**: Third retry
- **Day 15**: Final retry
- **After Day 15**: Subscription cancelled

---

### customer.subscription.trial_will_end

Fired when a trial is ending soon.

#### When It Fires

- 3 days before trial ends (configurable in Stripe)

#### Payload Example

```json
{
  "id": "evt_xxx",
  "type": "customer.subscription.trial_will_end",
  "data": {
    "object": {
      "id": "sub_xxx",
      "status": "trialing",
      "trial_end": 1697721600,
      "customer": "cus_xxx"
    }
  }
}
```

#### Our Processing

1. Find user by `stripe_subscription_id`
2. Calculate days remaining
3. Send to n8n with event: `trial.ending`

#### n8n Actions

- Send "trial ending" reminder email
- Highlight what they'll lose if they cancel
- Show content they've accessed
- Offer to continue with paid subscription
- Provide cancellation link

---

## Testing Webhooks

### Local Testing with Stripe CLI

1. **Install Stripe CLI**:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook
   ```

4. **Copy webhook signing secret** and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

5. **Trigger test events**:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.created
   stripe trigger invoice.payment_failed
   ```

### Testing with Stripe Dashboard

1. Go to **Developers** → **Webhooks** → **Test webhooks**
2. Select event type
3. Customize payload
4. Click "Send test webhook"
5. View response in dashboard

### Verifying Events

Check the `subscription_events` table:

```sql
SELECT 
  stripe_event_id,
  event_type,
  processed,
  error,
  created_at
FROM subscription_events
ORDER BY created_at DESC
LIMIT 10;
```

---

## Troubleshooting

### Webhook Not Received

**Check**:
1. Webhook endpoint is accessible (not localhost in production)
2. HTTPS is enabled (Stripe requires HTTPS)
3. No firewall blocking Stripe IPs
4. Endpoint returns `200 OK` within 30 seconds

**Test**:
```bash
curl -X POST https://leavelab.com/api/v1/subscriptions/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Signature Verification Failed

**Common Causes**:
- Wrong webhook secret in `.env`
- Body modified before verification (e.g., parsed as JSON)
- Timestamp too old (>5 minutes)

**Solution**:
```typescript
// ❌ Wrong - body parsed
const body = await request.json();

// ✅ Correct - raw text
const body = await request.text();
```

### Duplicate Events

**Why It Happens**:
- Stripe retries if no `200 OK` received
- Network issues
- Slow response times

**Solution**: Use idempotency checks:

```typescript
// Check if already processed
const { data: existing } = await supabase
  .from('subscription_events')
  .select('id')
  .eq('stripe_event_id', event.id)
  .single();

if (existing) {
  return Response.json({ received: true, duplicate: true });
}

// Process event...
```

### Event Not Processed

**Check database**:
```sql
SELECT * FROM subscription_events 
WHERE stripe_event_id = 'evt_xxx';
```

**Check logs**:
```bash
# Production logs
vercel logs

# Local logs
npm run dev
```

**Common Issues**:
- Database connection failed
- RLS policy blocked update
- Invalid user ID in metadata
- Stripe API rate limit

### n8n Webhook Failed

**Check**:
1. n8n URL is correct
2. n8n workflow is active
3. n8n accepts payload format
4. Network connectivity to n8n

**Test manually**:
```bash
curl -X POST https://nocoded-n8n-u41031.vm.elestio.app/webhook/xxx \
  -H "Content-Type: application/json" \
  -d '{
    "event": "subscription.created",
    "timestamp": "2025-10-17T12:00:00Z",
    "user": {
      "id": "test-id",
      "email": "test@example.com",
      "name": "Test User"
    }
  }'
```

---

## Best Practices

### 1. Always Verify Signatures

Never trust webhook payloads without verification:

```typescript
// ✅ Good
const event = stripe.webhooks.constructEvent(body, signature, secret);

// ❌ Bad
const event = JSON.parse(body);
```

### 2. Handle Idempotency

Always check for duplicate events:

```typescript
if (await isProcessed(event.id)) {
  return Response.json({ received: true, duplicate: true });
}
```

### 3. Respond Quickly

Stripe expects a `200 OK` within 30 seconds:

```typescript
// ✅ Good - respond immediately, process async
await logEvent(event);
processEventAsync(event); // Don't await
return Response.json({ received: true });

// ❌ Bad - slow processing
await processEvent(event); // Takes 2 minutes
return Response.json({ received: true });
```

### 4. Handle All Events

Don't ignore events:

```typescript
switch (event.type) {
  case 'checkout.session.completed':
    // Handle
    break;
  default:
    console.log(`Unhandled event: ${event.type}`);
    // Still mark as processed
}
```

### 5. Log Everything

Create audit trail:

```sql
INSERT INTO subscription_events (
  stripe_event_id,
  event_type,
  metadata,
  processed,
  created_at
) VALUES (
  'evt_xxx',
  'checkout.session.completed',
  '{"userId": "xxx"}',
  true,
  NOW()
);
```

### 6. Monitor Failures

Set up alerts for:
- Signature verification failures
- Processing errors
- n8n webhook failures
- Database errors

### 7. Test Thoroughly

Test all scenarios:
- ✅ Successful payments
- ✅ Failed payments
- ✅ Subscription cancellations
- ✅ Upgrades/downgrades
- ✅ Trial conversions
- ✅ Refunds

---

## Webhook Event Reference

### Summary Table

| Event Type | When It Fires | Action | n8n Event |
|------------|---------------|--------|-----------|
| `checkout.session.completed` | Payment successful | Create subscription | `subscription.created` |
| `customer.subscription.created` | Subscription created | Update database | - |
| `customer.subscription.updated` | Subscription changed | Update subscription | `subscription.updated` |
| `customer.subscription.deleted` | Subscription ended | Move to free tier | `subscription.cancelled` |
| `invoice.payment_succeeded` | Payment successful | Log payment | `payment.succeeded` |
| `invoice.payment_failed` | Payment failed | Update status | `payment.failed` |
| `customer.subscription.trial_will_end` | Trial ending soon | Send reminder | `trial.ending` |

---

## Monitoring & Debugging

### View Recent Events

```sql
SELECT 
  event_type,
  processed,
  error,
  created_at
FROM subscription_events
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Failed Events

```sql
SELECT * FROM subscription_events
WHERE processed = false
  OR error IS NOT NULL
ORDER BY created_at DESC;
```

### Replay Failed Event

1. Get event ID from Stripe Dashboard
2. Click "Resend" in webhook logs
3. Or use Stripe CLI:
   ```bash
   stripe events resend evt_xxx
   ```

---

## Additional Resources

- **Stripe Webhooks Guide**: https://stripe.com/docs/webhooks
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **n8n Webhook Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- **LeaveLab API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)

---

**Webhook Documentation Complete** ✅

*Last Updated: October 2025*

