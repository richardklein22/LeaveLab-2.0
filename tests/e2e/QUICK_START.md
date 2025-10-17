# Quick Start Guide - E2E Subscription Tests

Get up and running with subscription E2E tests in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Set Environment Variables

Create `.env.test.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 3. Run Tests

```bash
# Run all subscription tests
npm run test:e2e tests/e2e/subscriptions/

# Run with UI (recommended for first time)
npx playwright test --ui tests/e2e/subscriptions/
```

## 📋 Test Checklist

Before running tests, ensure:

- ✅ Database migrations are applied
- ✅ Subscription tiers are seeded (free, basic, premium)
- ✅ Environment variables are set
- ✅ Dev server can run (`npm run dev`)

## 🎯 Quick Test Commands

```bash
# Test checkout flow
npm run test:e2e tests/e2e/subscriptions/checkout.spec.ts

# Test subscription management
npm run test:e2e tests/e2e/subscriptions/management.spec.ts

# Test trial flows
npm run test:e2e tests/e2e/subscriptions/trials.spec.ts

# Run single test
npm run test:e2e -- -g "should display pricing page"

# Debug mode
npx playwright test --debug tests/e2e/subscriptions/checkout.spec.ts
```

## 🔍 What Tests Cover

### ✅ Checkout Flow (`checkout.spec.ts`)
- Viewing pricing page
- Monthly vs Annual billing toggle
- Authentication requirements
- Creating checkout sessions
- Trial signup
- Error handling

### ✅ Management (`management.spec.ts`)
- Upgrading subscriptions (Free → Basic → Premium)
- Downgrading subscriptions
- Canceling subscriptions
- Customer Portal access
- Billing cycle changes
- Status display

### ✅ Trials (`trials.spec.ts`)
- Starting trial subscriptions
- Trial period tracking
- Trial expiration
- Trial-to-paid conversion
- Trial eligibility rules

## 🎭 How Mocking Works

All Stripe API calls are mocked in tests:

```typescript
// Automatically mocks Stripe checkout
await mockStripeCheckoutSuccess(page);

// Simulate successful subscription
await page.click('[data-testid="subscribe-button"]');

// No real payment made! ✨
```

## 📊 Expected Results

After running all tests, you should see:

```
✅ Subscription Checkout Flow: 14/14 passed
✅ Subscription Management: 25/25 passed
✅ Trial Subscriptions: 22/22 passed

Total: 61 tests passed
```

## 🐛 Quick Troubleshooting

### Tests Won't Run?
```bash
# Reinstall browsers
npx playwright install --force
```

### Auth Errors?
```bash
# Check service key has proper permissions
# Verify SUPABASE_SERVICE_ROLE_KEY is set
echo $SUPABASE_SERVICE_ROLE_KEY
```

### Database Errors?
```bash
# Apply migrations
npx supabase db push

# Or reset database
npx supabase db reset
```

### Mock Not Working?
```typescript
// Always clear mocks in beforeEach
test.beforeEach(async ({ page }) => {
  await clearStripeMocks(page);
});
```

## 📚 Next Steps

1. Read full [E2E Testing Guide](./README.md)
2. Add data-testid attributes to your components
3. Write tests for new features
4. Integrate with CI/CD

## 🆘 Getting Help

- Review test output in `playwright-report/index.html`
- Use `--debug` flag for step-through debugging
- Check browser console logs in headed mode
- See full [README](./README.md) for detailed documentation

## 🎉 Success!

You're ready to test subscription flows! Run tests frequently to catch regressions early.

```bash
# Happy testing! 🧪
npm run test:e2e
```

