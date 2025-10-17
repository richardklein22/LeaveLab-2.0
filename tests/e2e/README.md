# E2E Testing Guide for LeaveLab Subscriptions

This guide covers the comprehensive E2E test suite for the LeaveLab subscription system, including checkout flows, subscription management, and trial functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Fixtures](#fixtures)
- [Mocking Stripe](#mocking-stripe)
- [Writing New Tests](#writing-new-tests)
- [Debugging](#debugging)
- [CI/CD Integration](#cicd-integration)

## 🎯 Overview

Our E2E test suite covers:

- **Subscription Checkout**: Testing the complete checkout flow for different tiers and billing cycles
- **Subscription Management**: Upgrades, downgrades, and cancellations
- **Trial Subscriptions**: Trial start, tracking, and conversion
- **Customer Portal**: Accessing and managing billing through Stripe Customer Portal
- **Error Handling**: Network errors, timeouts, and validation errors

## ✅ Prerequisites

Before running the E2E tests, ensure you have:

1. **Node.js** (v18 or higher)
2. **Supabase Project** with:
   - Service role key
   - Project URL
   - Database migrations applied
3. **Environment Variables** configured (see setup below)
4. **Playwright** installed

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

This installs Playwright and all required dependencies.

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This downloads the necessary browser binaries (Chromium, Firefox, WebKit).

### 3. Configure Environment Variables

Create a `.env.test.local` file in the project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Test Configuration (Optional)
TEST_USER_PASSWORD=TestPassword123!
```

### 4. Database Setup

Ensure all migrations are applied to your test database:

```bash
npx supabase db push
```

Or if using a separate test project:

```bash
npx supabase link --project-ref your-test-project-ref
npx supabase db push
```

### 5. Verify Setup

Run a quick test to ensure everything is configured:

```bash
npm run test:e2e -- tests/e2e/subscriptions/checkout.spec.ts --headed
```

## 🧪 Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npm run test:e2e tests/e2e/subscriptions/checkout.spec.ts
```

### Run Tests in Headed Mode (see browser)

```bash
npm run test:e2e -- --headed
```

### Run Tests in UI Mode (interactive)

```bash
npx playwright test --ui
```

### Run Tests for Specific Browser

```bash
# Chromium only
npm run test:e2e -- --project=chromium

# Mobile Safari
npm run test:e2e -- --project="Mobile Safari"
```

### Run Tests with Debugging

```bash
npx playwright test --debug
```

### Run Specific Test by Name

```bash
npm run test:e2e -- -g "should display pricing page"
```

## 📁 Test Structure

```
tests/e2e/
├── fixtures/
│   ├── auth-fixture.ts          # Authentication fixtures for test users
│   └── stripe-mock.ts            # Stripe API mocking utilities
├── subscriptions/
│   ├── checkout.spec.ts          # Checkout flow tests
│   ├── management.spec.ts        # Subscription management tests
│   └── trials.spec.ts            # Trial subscription tests
└── README.md                     # This file
```

### Test Files

#### `checkout.spec.ts`

Tests the subscription checkout flow:
- Viewing pricing page
- Selecting plans and billing cycles
- Creating checkout sessions
- Handling authentication
- Error handling

**Test Suites:**
- `Subscription Checkout Flow` (12 tests)
- `Subscription Checkout - Error Handling` (2 tests)

#### `management.spec.ts`

Tests subscription management features:
- Upgrading subscriptions
- Downgrading subscriptions
- Cancelling subscriptions
- Accessing Customer Portal
- Billing cycle changes

**Test Suites:**
- `Subscription Upgrades` (5 tests)
- `Subscription Downgrades` (3 tests)
- `Subscription Cancellation` (6 tests)
- `Customer Portal Access` (3 tests)
- `Subscription Status Display` (5 tests)
- `Billing Cycle Changes` (3 tests)

#### `trials.spec.ts`

Tests trial subscription functionality:
- Starting trials
- Trial period tracking
- Trial expiration
- Trial-to-paid conversion

**Test Suites:**
- `Trial Subscription Flow` (9 tests)
- `Trial Checkout Flow` (3 tests)
- `Trial User Experience` (4 tests)
- `Trial Notifications` (3 tests)
- `Trial Access Control` (3 tests)

## 🔧 Fixtures

### Authentication Fixtures

Located in `fixtures/auth-fixture.ts`, these fixtures provide authenticated page contexts:

#### `authenticatedPage`

A generic authenticated page with a fresh test user.

```typescript
test('my test', async ({ authenticatedPage: page }) => {
  await page.goto('/dashboard');
  // User is already authenticated
});
```

#### `testUser`

Access to the test user object for user details.

```typescript
test('my test', async ({ testUser }) => {
  console.log(testUser.email); // test-xxx@example.com
  console.log(testUser.id);    // UUID
});
```

#### `freeUser`

Authenticated page with a user on the Free tier.

```typescript
test('my test', async ({ freeUser: page }) => {
  await page.goto('/pricing');
  // User has free tier subscription
});
```

#### `basicUser`

Authenticated page with a user on the Basic tier.

```typescript
test('my test', async ({ basicUser: page }) => {
  await page.goto('/subscription');
  // User has active Basic subscription
});
```

#### `premiumUser`

Authenticated page with a user on the Premium tier.

```typescript
test('my test', async ({ premiumUser: page }) => {
  await page.goto('/dashboard');
  // User has active Premium subscription
});
```

### Cleanup

All test users are automatically cleaned up after each test, including:
- User subscriptions
- User profiles
- Auth users

## 🎭 Mocking Stripe

Located in `fixtures/stripe-mock.ts`, these utilities mock Stripe API calls:

### `mockStripeCheckoutSuccess`

Mocks successful Stripe Checkout session creation.

```typescript
await mockStripeCheckoutSuccess(page, {
  shouldSucceed: true,
  delayMs: 100,
  sessionId: 'cs_test_mock_session',
});
```

### `mockStripePortalSuccess`

Mocks successful Customer Portal session creation.

```typescript
await mockStripePortalSuccess(page, {
  shouldSucceed: true,
  delayMs: 100,
});
```

### `mockAlreadySubscribed`

Mocks "already subscribed" error response.

```typescript
await mockAlreadySubscribed(page);
```

### `mockSubscriptionCancellation`

Mocks subscription cancellation flow.

```typescript
await mockSubscriptionCancellation(page, true); // success
await mockSubscriptionCancellation(page, false); // failure
```

### `clearStripeMocks`

Clears all Stripe-related mocks.

```typescript
test.beforeEach(async ({ page }) => {
  await clearStripeMocks(page);
});
```

## ✍️ Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/auth-fixture';
import { mockStripeCheckoutSuccess } from '../fixtures/stripe-mock';

test.describe('My Feature', () => {
  test('should do something', async ({ authenticatedPage: page }) => {
    // Arrange
    await mockStripeCheckoutSuccess(page);
    
    // Act
    await page.goto('/my-page');
    await page.click('button[data-testid="my-button"]');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
   ```typescript
   test('should display error when checkout fails')
   ```

2. **Use Data Attributes**: For reliable selectors, use `data-testid` attributes
   ```typescript
   <button data-testid="subscribe-button">Subscribe</button>
   ```

3. **Clean Up Mocks**: Always clear mocks in `beforeEach`
   ```typescript
   test.beforeEach(async ({ page }) => {
     await clearStripeMocks(page);
   });
   ```

4. **Test User Journey**: Test complete user flows, not just individual actions
   ```typescript
   test('should complete checkout from pricing to success', async ({ authenticatedPage: page }) => {
     // 1. View pricing
     await page.goto('/pricing');
     
     // 2. Select plan
     await page.click('[data-tier="basic"] button');
     
     // 3. Verify redirect
     await expect(page).toHaveURL(/\/subscription/);
   });
   ```

5. **Use Appropriate Fixtures**: Choose the right fixture for your test
   ```typescript
   // Testing upgrade from Basic
   test('upgrade test', async ({ basicUser: page }) => {
     // ...
   });
   ```

## 🐛 Debugging

### Debug Mode

Run tests with `--debug` flag to step through tests:

```bash
npx playwright test --debug tests/e2e/subscriptions/checkout.spec.ts
```

### UI Mode

Use UI mode for interactive debugging:

```bash
npx playwright test --ui
```

### Trace Viewer

Generate and view traces for failed tests:

```bash
# Tests automatically generate traces on first retry
npm run test:e2e

# View trace
npx playwright show-trace trace.zip
```

### Screenshots and Videos

Playwright automatically captures screenshots on failure. Configure in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

### Console Logs

View browser console logs:

```typescript
page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
```

## 🔄 CI/CD Integration

### GitHub Actions

Example workflow file (`.github/workflows/e2e-tests.yml`):

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Environment Variables in CI

Store sensitive environment variables as secrets in your CI/CD platform:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_TEST_SECRET_KEY`
- `STRIPE_TEST_WEBHOOK_SECRET`

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report showing:
- Test results
- Test duration
- Screenshots/videos of failures
- Detailed error messages

## 🎯 Coverage Goals

Our E2E test suite aims for:
- ✅ All critical user journeys covered
- ✅ Authentication flows tested
- ✅ Payment flows tested (with mocks)
- ✅ Error states tested
- ✅ Mobile responsiveness tested

## 🆘 Troubleshooting

### Tests Fail Locally But Pass in CI

1. Check browser versions: `npx playwright --version`
2. Update browsers: `npx playwright install`
3. Clear cache: `rm -rf node_modules/.cache`

### Authentication Issues

1. Verify environment variables are set correctly
2. Check Supabase service role key has proper permissions
3. Ensure test database is accessible

### Stripe Mock Issues

1. Verify mocks are cleared in `beforeEach`
2. Check mock configuration matches expected responses
3. Review Stripe API version compatibility

### Timeout Errors

Increase timeout for slow operations:

```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  
  await page.goto('/slow-page');
});
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## 🤝 Contributing

When adding new tests:

1. Follow the existing test structure
2. Use appropriate fixtures
3. Mock Stripe API calls
4. Clean up test data
5. Add documentation for new fixtures/utilities
6. Update this README if adding new test suites

## 📝 License

Same as parent project.

---

**Happy Testing! 🎉**

