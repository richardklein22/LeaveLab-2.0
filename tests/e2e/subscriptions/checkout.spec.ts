/**
 * E2E Tests for Subscription Checkout Flow
 * 
 * Tests the complete checkout flow including:
 * - Viewing pricing page
 * - Selecting plans
 * - Creating checkout sessions
 * - Handling success and error cases
 */

import { test, expect } from '../fixtures/auth-fixture';
import {
  mockStripeCheckoutSuccess,
  mockAlreadySubscribed,
  clearStripeMocks,
} from '../fixtures/stripe-mock';

test.describe('Subscription Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing mocks
    await clearStripeMocks(page);
  });

  test('should display pricing page with all tiers', async ({ page }) => {
    await page.goto('/pricing');

    // Check page title
    await expect(page.locator('h1')).toContainText('Choose your plan');

    // Check that all three tiers are displayed
    await expect(page.getByText('Free')).toBeVisible();
    await expect(page.getByText('Basic')).toBeVisible();
    await expect(page.getByText('Premium')).toBeVisible();

    // Check billing toggle
    await expect(page.getByRole('button', { name: /monthly/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /annual/i })).toBeVisible();
  });

  test('should toggle between monthly and annual billing', async ({ page }) => {
    await page.goto('/pricing');

    // Default should be annual
    const annualButton = page.getByRole('button', { name: /annual/i });
    await expect(annualButton).toHaveAttribute('data-state', 'active');

    // Click monthly
    const monthlyButton = page.getByRole('button', { name: /monthly/i });
    await monthlyButton.click();
    await expect(monthlyButton).toHaveAttribute('data-state', 'active');

    // Prices should update (check for /mo vs /yr)
    await expect(page.locator('text=/mo')).toBeVisible();

    // Switch back to annual
    await annualButton.click();
    await expect(annualButton).toHaveAttribute('data-state', 'active');
    await expect(page.locator('text=/yr')).toBeVisible();
  });

  test('should redirect to login when unauthenticated user tries to subscribe', async ({
    page,
  }) => {
    await page.goto('/pricing');

    // Find and click the first "Get Started" or "Subscribe" button (Basic tier)
    const subscribeButton = page
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe|Choose Basic/i })
      .first();
    
    await subscribeButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should create checkout session for authenticated user - monthly billing', async ({
    authenticatedPage: page,
  }) => {
    // Mock successful checkout
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_monthly',
    });

    await page.goto('/pricing');

    // Switch to monthly billing
    await page.getByRole('button', { name: /monthly/i }).click();

    // Find and click Basic tier subscribe button
    const basicCard = page.locator('[data-tier="basic"]').or(
      page.locator('text=Basic').locator('..').locator('..')
    );
    const subscribeButton = basicCard
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should redirect to success page
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
    await expect(page).toHaveURL(/session_id=cs_test_monthly/);
  });

  test('should create checkout session for authenticated user - annual billing', async ({
    authenticatedPage: page,
  }) => {
    // Mock successful checkout
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_annual',
    });

    await page.goto('/pricing');

    // Annual should be selected by default, but click to ensure
    await page.getByRole('button', { name: /annual/i }).click();

    // Find and click Premium tier subscribe button
    const premiumCard = page.locator('[data-tier="premium"]').or(
      page.locator('text=Premium').locator('..').locator('..')
    );
    const subscribeButton = premiumCard
      .locator('button')
      .filter({ hasText: /Start Trial|Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should redirect to success page
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
    await expect(page).toHaveURL(/session_id=cs_test_annual/);
  });

  test('should handle trial subscription for Premium tier', async ({
    authenticatedPage: page,
  }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_trial',
    });

    await page.goto('/pricing');

    // Premium tier should show trial banner or trial messaging
    const trialIndicator = page.locator('text=/7-day trial|14-day trial|Start Trial/i');
    await expect(trialIndicator.first()).toBeVisible();

    // Click Premium tier subscribe button
    const premiumButton = page
      .locator('button')
      .filter({ hasText: /Start Trial|Try Premium/i })
      .first();

    await premiumButton.click();

    // Should redirect with trial indication
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
  });

  test('should show error when checkout session creation fails', async ({
    authenticatedPage: page,
  }) => {
    // Mock failed checkout
    await mockStripeCheckoutSuccess(page, {
      shouldSucceed: false,
    });

    await page.goto('/pricing');

    // Click subscribe button
    const subscribeButton = page
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should show error message
    await expect(
      page.locator('text=/Failed to create checkout|error|something went wrong/i')
    ).toBeVisible({ timeout: 3000 });
  });

  test('should prevent subscribing to already active tier', async ({
    basicUser: page,
  }) => {
    // Mock "already subscribed" error
    await mockAlreadySubscribed(page);

    await page.goto('/pricing');

    // Find Basic tier (user's current tier)
    const basicCard = page.locator('[data-tier="basic"]').or(
      page.locator('text=Basic').locator('..').locator('..')
    );

    // Should show "Current Plan" instead of subscribe button
    await expect(
      basicCard.locator('text=/Current Plan|Active/i')
    ).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/pricing');

    // Scroll to FAQ
    const faqHeading = page.locator('h2', { hasText: /Frequently Asked Questions/i });
    await faqHeading.scrollIntoViewIfNeeded();
    await expect(faqHeading).toBeVisible();

    // Check for FAQ items
    await expect(
      page.locator('text=/Can I change my plan|upgrade|downgrade/i')
    ).toBeVisible();

    // Click on an FAQ item to expand
    const faqQuestion = page.locator('button[data-state="closed"]').first();
    await faqQuestion.click();
    await expect(faqQuestion).toHaveAttribute('data-state', 'open');
  });

  test('should show loading state during checkout', async ({
    authenticatedPage: page,
  }) => {
    // Mock checkout with delay
    await mockStripeCheckoutSuccess(page, {
      delayMs: 1000,
    });

    await page.goto('/pricing');

    const subscribeButton = page
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should show loading indicator
    await expect(
      page.locator('button:disabled').filter({ hasText: /Loading|Processing/i })
    ).toBeVisible();
  });

  test('should handle free tier correctly', async ({ authenticatedPage: page }) => {
    await page.goto('/pricing');

    // Free tier should not have a subscribe button or should show "Current Plan" for free users
    const freeCard = page.locator('[data-tier="free"]').or(
      page.locator('text=Free').locator('..').locator('..')
    );

    // Should either have no button or show "Current Plan"
    const hasButton = await freeCard
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .count();

    if (hasButton > 0) {
      // If there's a button, clicking it should not trigger checkout
      const freeButton = freeCard
        .locator('button')
        .filter({ hasText: /Get Started/i })
        .first();
      await freeButton.click();

      // Should stay on pricing page or show message
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      expect(currentUrl).toContain('/pricing');
    }
  });
});

test.describe('Subscription Checkout - Error Handling', () => {
  test('should handle network errors gracefully', async ({
    authenticatedPage: page,
  }) => {
    // Simulate network failure
    await page.route('**/api/v1/subscriptions/checkout', (route) => {
      route.abort('failed');
    });

    await page.goto('/pricing');

    const subscribeButton = page
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should show error message
    await expect(
      page.locator('text=/network|error|failed/i')
    ).toBeVisible({ timeout: 3000 });
  });

  test('should handle timeout errors', async ({ authenticatedPage: page }) => {
    // Simulate very slow response
    await page.route('**/api/v1/subscriptions/checkout', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ url: '/subscription' }),
      });
    });

    await page.goto('/pricing');

    const subscribeButton = page
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should show loading state
    await expect(
      page.locator('button:disabled').filter({ hasText: /Loading/i })
    ).toBeVisible();
  });
});

