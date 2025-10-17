# Error Handling Testing Guide 🧪

## Overview

This guide provides step-by-step instructions for testing all error handling scenarios implemented in the application. Use this guide to verify that errors are handled gracefully and users receive appropriate feedback.

## Prerequisites

- Development environment running
- Stripe CLI installed (for webhook testing)
- Test user accounts created
- Test Stripe products/prices configured

## Testing Categories

## 1. Authentication Error Testing

### Test 1.1: Missing Authentication
**Endpoint**: Any protected route  
**Method**: GET/POST/PATCH  
**Setup**:
```bash
# Make request without authentication token
curl http://localhost:3000/api/v1/subscriptions/status
```

**Expected Result**:
- Status Code: 401
- Error Message: "You must be logged in to view subscription status"
- Error Code: "AUTH_ERROR"

### Test 1.2: Expired Token
**Setup**:
```bash
# Use expired JWT token
curl -H "Authorization: Bearer <expired_token>" \
  http://localhost:3000/api/v1/subscriptions/status
```

**Expected Result**:
- Status Code: 401
- User-friendly error message
- No sensitive token information exposed

### Test 1.3: Invalid Token
**Setup**:
```bash
# Use malformed JWT token
curl -H "Authorization: Bearer invalid_token_here" \
  http://localhost:3000/api/v1/subscriptions/status
```

**Expected Result**:
- Status Code: 401
- Error handled gracefully

## 2. Validation Error Testing

### Test 2.1: Missing Required Fields
**Endpoint**: POST /api/v1/subscriptions/checkout  
**Setup**:
```javascript
fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Missing tierId and billingCycle
  })
});
```

**Expected Result**:
```json
{
  "error": {
    "message": "tierId and billingCycle are required",
    "code": "VALIDATION_ERROR",
    "details": {
      "tierId": ["Tier ID is required"],
      "billingCycle": ["Billing cycle is required"]
    }
  }
}
```

### Test 2.2: Invalid Field Values
**Setup**:
```javascript
fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  body: JSON.stringify({
    tierId: 'tier_123',
    billingCycle: 'weekly' // Invalid value
  })
});
```

**Expected Result**:
- Status Code: 400
- Validation error with details
- Clear message about valid values

### Test 2.3: Invalid JSON
**Setup**:
```javascript
fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  body: '{ invalid json }'
});
```

**Expected Result**:
- Status Code: 400
- Message: "Invalid JSON in request body"

## 3. Stripe Error Testing

### Test 3.1: Card Declined
**Setup**:
```bash
# Use Stripe test card that always declines
# Card: 4000 0000 0000 0002
```

**Steps**:
1. Navigate to pricing page
2. Select a paid tier
3. Enter test card: 4000 0000 0000 0002
4. Attempt checkout

**Expected Result**:
- User-friendly error message
- No technical Stripe details exposed
- Option to try again
- Error logged on server

**Check Logs**:
```bash
# Should see:
# 💳 Stripe error: { type: 'StripeCardError', message: '...' }
```

### Test 3.2: Stripe API Failure
**Setup**:
```bash
# Temporarily use invalid Stripe API key
# Or use Stripe CLI to simulate API error
stripe trigger payment_intent.payment_failed
```

**Expected Result**:
- Status Code: 502 (Bad Gateway)
- Message: "Payment service error. Please try again later."
- Error logged as FATAL

### Test 3.3: Stripe Rate Limit
**Setup**:
```bash
# Make many rapid requests to checkout endpoint
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/v1/subscriptions/checkout &
done
```

**Expected Result**:
- Status Code: 429
- Message: "Too many requests. Please try again shortly."

### Test 3.4: Missing Stripe Configuration
**Setup**:
```bash
# Temporarily remove STRIPE_SECRET_KEY from .env
# Restart server
```

**Expected Result**:
- Server fails to start OR
- Returns 500 with message about configuration
- Fatal error logged

## 4. Edge Case Testing

### Test 4.1: Already Subscribed
**Setup**:
1. Subscribe user to "Premium" tier
2. While still subscribed, attempt to checkout for "Premium" tier again

**Steps**:
```javascript
// First subscription succeeds
const response1 = await fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  body: JSON.stringify({
    tierId: 'premium_tier_id',
    billingCycle: 'monthly'
  })
});

// Complete the checkout in Stripe

// Try subscribing again
const response2 = await fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  body: JSON.stringify({
    tierId: 'premium_tier_id',
    billingCycle: 'monthly'
  })
});
```

**Expected Result**:
- Status Code: 409 (Conflict)
- Message: "You are already subscribed to the Premium plan. Please manage your subscription from the customer portal."
- Link or instruction to customer portal

### Test 4.2: Free Tier Checkout
**Setup**:
```javascript
fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  body: JSON.stringify({
    tierId: 'free_tier_id',
    billingCycle: 'monthly'
  })
});
```

**Expected Result**:
- Status Code: 400
- Message: "Cannot create checkout session for free tier"

### Test 4.3: Non-existent Tier
**Setup**:
```javascript
fetch('/api/v1/subscriptions/checkout', {
  method: 'POST',
  body: JSON.stringify({
    tierId: 'non_existent_tier_id',
    billingCycle: 'monthly'
  })
});
```

**Expected Result**:
- Status Code: 404
- Message: "Subscription tier not found"

### Test 4.4: Customer Portal Without Subscription
**Setup**:
```javascript
// User with no subscription tries to access portal
fetch('/api/v1/subscriptions/portal', {
  method: 'POST'
});
```

**Expected Result**:
- Status Code: 404
- Message: "No subscription found. Please subscribe to a plan first."

### Test 4.5: Payment Failure During Renewal
**Setup**:
```bash
# Use Stripe CLI to trigger payment failure
stripe trigger invoice.payment_failed
```

**Expected Result**:
1. Webhook receives event
2. Subscription status updated to "past_due"
3. Event logged in subscription_events table
4. User notified (via n8n webhook)
5. Event marked as processed

**Verify Database**:
```sql
SELECT * FROM subscription_events 
WHERE event_type = 'invoice.payment_failed' 
ORDER BY created_at DESC 
LIMIT 1;

SELECT status FROM user_subscriptions 
WHERE stripe_subscription_id = '<subscription_id>';
```

### Test 4.6: Duplicate Webhook Events
**Setup**:
```bash
# Send same webhook event twice
stripe trigger checkout.session.completed
# Immediately send again (manually replay in Stripe dashboard)
```

**Expected Result**:
- First event: Processed successfully
- Second event: Recognized as duplicate, skipped
- Response includes `"duplicate": true`
- No duplicate database entries

## 5. Database Error Testing

### Test 5.1: Record Not Found
**Setup**:
```javascript
// Request subscription for non-existent user
fetch('/api/v1/subscriptions/status?userId=non_existent_user_id');
```

**Expected Result**:
- Status Code: 404
- Message: "No active subscription found"
- Error code: "NOT_FOUND"

### Test 5.2: Database Connection Issue
**Setup**:
```bash
# Temporarily stop Supabase or use invalid credentials
# Or test with network disconnected
```

**Expected Result**:
- Status Code: 500
- Generic error message (no connection details exposed)
- Error logged with full details server-side

### Test 5.3: Constraint Violation
**Setup**:
```javascript
// Attempt to create duplicate record (unique constraint)
// This would need to be tested at a lower level
```

**Expected Result**:
- Status Code: 400
- Message: "This record already exists"

## 6. React Error Boundary Testing

### Test 6.1: Component Error
**Setup**:
1. Create a component that throws an error:
```tsx
function BrokenComponent() {
  throw new Error('Test component error');
  return <div>This won't render</div>;
}
```

2. Wrap in ErrorBoundary:
```tsx
<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>
```

**Expected Result**:
- Component error caught
- Error UI displayed
- No white screen of death
- Error details shown in dev mode
- Error logged to console

### Test 6.2: Async Error in Component
**Setup**:
```tsx
function AsyncErrorComponent() {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('Async error');
    }, 1000);
  }, []);
  
  return <div>Component</div>;
}
```

**Expected Result**:
- Error boundary catches error
- UI shows error state
- User can reload or go home

### Test 6.3: Network Error in Component
**Setup**:
```tsx
function NetworkErrorComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/invalid-endpoint')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(setData);
  }, []);
  
  return <div>{data}</div>;
}
```

**Expected Result**:
- Error caught by error boundary
- User-friendly error message
- Recovery options available

## 7. Logging Verification

### Test 7.1: Check Log Output Format
**Setup**: Make any API request

**Verify**:
1. Development mode shows colored, formatted logs
2. Production mode shows JSON logs
3. Logs include:
   - Timestamp
   - Log level
   - Message
   - Context (userId, endpoint, etc.)
   - Error details (if error)

**Example Output (Dev)**:
```
🔍 [DEBUG] Fetching subscription tier
📋 Context: { userId: '...', tierId: '...', endpoint: '/api/v1/subscriptions/checkout' }

✅ [INFO] POST /api/v1/subscriptions/checkout - 200
📋 Context: { duration: '145ms', sessionId: '...' }
```

### Test 7.2: Error Log Detail
**Setup**: Trigger any error

**Verify Logs Include**:
- Error message
- Error code
- Status code
- Stack trace
- Request context
- User ID (if authenticated)
- Duration

### Test 7.3: Performance Logging
**Setup**: Make slow request (or add artificial delay)

**Verify**:
- Duration is logged
- Slow requests are flagged
- Performance metrics are accurate

## 8. Webhook Testing

### Test 8.1: Valid Webhook Signature
**Setup**:
```bash
stripe listen --forward-to localhost:3000/api/v1/subscriptions/webhook
stripe trigger checkout.session.completed
```

**Expected Result**:
- Webhook signature verified
- Event processed
- Status 200 returned
- Event logged to database

### Test 8.2: Invalid Webhook Signature
**Setup**:
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions/webhook \
  -H "Stripe-Signature: invalid_signature" \
  -d '{"test": "data"}'
```

**Expected Result**:
- Status Code: 400
- Message: "Invalid signature"
- Event not processed
- Security log entry

### Test 8.3: Missing Webhook Signature
**Setup**:
```bash
curl -X POST http://localhost:3000/api/v1/subscriptions/webhook \
  -d '{"test": "data"}'
```

**Expected Result**:
- Status Code: 400
- Message: "No signature"
- Request rejected immediately

### Test 8.4: Webhook Processing Failure
**Setup**:
```bash
# Trigger webhook while database is down
# Or modify handler to throw error
```

**Expected Result**:
- Status Code: 500 (triggers Stripe retry)
- Error logged
- Event marked as failed in database
- Stripe will retry later

## 9. End-to-End Error Scenarios

### Test 9.1: Complete Subscription Flow with Errors
**Steps**:
1. ❌ Try checkout without login → 401 error
2. ✅ Login
3. ❌ Try free tier checkout → 400 error
4. ❌ Try invalid tier → 404 error
5. ✅ Valid checkout request
6. ❌ Use declined card → Stripe error
7. ✅ Use valid card → Success
8. ❌ Try same tier again → 409 conflict
9. ✅ Access customer portal → Success

### Test 9.2: Payment Failure Recovery Flow
**Steps**:
1. ✅ Subscribe successfully
2. ❌ Payment fails (trigger invoice.payment_failed)
3. ✅ Status changes to "past_due"
4. ✅ User receives notification
5. ✅ User accesses customer portal
6. ✅ User updates payment method
7. ✅ Subscription reactivated

## Testing Checklist

### Before Release
- [ ] All authentication errors return 401 with clear messages
- [ ] Validation errors include field-level details
- [ ] All Stripe errors are caught and formatted
- [ ] Edge cases (already subscribed, etc.) are handled
- [ ] Database errors don't expose sensitive information
- [ ] Webhook signature validation works
- [ ] Webhook idempotency prevents duplicates
- [ ] React error boundary catches component errors
- [ ] All errors are logged with appropriate level
- [ ] Performance is tracked and logged
- [ ] User-friendly error messages everywhere
- [ ] No stack traces exposed to users
- [ ] Recovery options provided where possible

### Development Mode Testing
- [ ] Pretty console logs work
- [ ] Error details shown in UI (dev mode)
- [ ] Stack traces available in logs
- [ ] Performance metrics logged

### Production Mode Testing
- [ ] JSON structured logs
- [ ] No sensitive data in logs
- [ ] Error details hidden from users
- [ ] External monitoring ready (when configured)

## Common Issues and Solutions

### Issue: Errors Not Caught
**Solution**: Ensure try-catch wraps all async operations
```typescript
// ❌ Bad
const data = await fetchData();

// ✅ Good
try {
  const data = await fetchData();
} catch (error) {
  return handleErrorResponse(error);
}
```

### Issue: Generic Error Messages
**Solution**: Use specific error classes
```typescript
// ❌ Bad
throw new Error('Error occurred');

// ✅ Good
throw new NotFoundError('Subscription tier not found');
```

### Issue: Missing Context in Logs
**Solution**: Always use logger with context
```typescript
// ❌ Bad
console.log('Error:', error);

// ✅ Good
logger.error('Failed to create checkout', {
  userId,
  tierId,
  endpoint: '/checkout'
}, error);
```

### Issue: Webhook Retries Causing Issues
**Solution**: Implement idempotency
```typescript
// Check for duplicate event
const existing = await db.get(event.id);
if (existing) {
  return { received: true, duplicate: true };
}
```

## Automated Testing Examples

### Jest Test Example
```typescript
describe('Error Handling', () => {
  it('should return 401 for unauthenticated requests', async () => {
    const response = await request(app)
      .get('/api/v1/subscriptions/status');
    
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_ERROR');
  });
  
  it('should handle already subscribed error', async () => {
    // Subscribe user first
    await subscribeUser(userId, tierId);
    
    // Try subscribing again
    const response = await request(app)
      .post('/api/v1/subscriptions/checkout')
      .send({ tierId, billingCycle: 'monthly' });
    
    expect(response.status).toBe(409);
    expect(response.body.error.message).toContain('already subscribed');
  });
});
```

### Playwright E2E Test Example
```typescript
test('shows error message on payment failure', async ({ page }) => {
  await page.goto('/pricing');
  await page.click('[data-testid="premium-plan"]');
  
  // Enter test card that will fail
  await page.fill('[data-testid="card-number"]', '4000000000000002');
  await page.click('[data-testid="submit-payment"]');
  
  // Verify error message appears
  await expect(page.locator('[data-testid="error-message"]'))
    .toContainText('card was declined');
});
```

## Monitoring After Deployment

### Key Metrics to Track
1. **Error Rate**: Percentage of requests resulting in errors
2. **Error Types**: Distribution of error codes
3. **Response Times**: Including errors
4. **User Impact**: How many users affected
5. **Recovery Rate**: How many users recover from errors

### Alerts to Configure
1. Error rate > 5% for any endpoint
2. Fatal errors occur
3. Stripe errors increase suddenly
4. Webhook failures exceed threshold
5. Database connection failures

## Conclusion

This testing guide covers all implemented error handling scenarios. Use it to:
- Verify error handling works correctly
- Ensure user experience is maintained during errors
- Validate logging and monitoring
- Prepare for production deployment

Regular testing of these scenarios ensures robust error handling and a great user experience even when things go wrong.

---

**Last Updated**: October 17, 2025  
**Version**: 1.0  
**Status**: Complete ✅

