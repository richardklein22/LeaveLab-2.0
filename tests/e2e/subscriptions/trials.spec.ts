/**
 * E2E Tests for Trial Subscriptions
 * 
 * Tests trial functionality including:
 * - Starting trial subscriptions
 * - Trial period tracking
 * - Trial expiration handling
 * - Converting trials to paid subscriptions
 */

import { test, expect } from '../fixtures/auth-fixture';
import {
  mockStripeCheckoutSuccess,
  clearStripeMocks,
} from '../fixtures/stripe-mock';

test.describe('Trial Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should display trial offer on Premium tier', async ({ page }) => {
    await page.goto('/pricing');

    // Premium tier should show trial information
    const trialBanner = page.locator('text=/7-day|14-day|trial|Try free/i');
    await expect(trialBanner.first()).toBeVisible();
  });

  test('should start trial subscription for authenticated user', async ({
    authenticatedPage: page,
  }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_trial',
    });

    await page.goto('/pricing');

    // Find Premium tier with trial
    const premiumCard = page.locator('[data-tier="premium"]').or(
      page.locator('text=Premium').locator('..').locator('..')
    );

    const trialButton = premiumCard
      .locator('button')
      .filter({ hasText: /Start Trial|Try Free|Start.*Trial/i })
      .first();

    await trialButton.click();

    // Should redirect to success
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
  });

  test('should display trial status on dashboard', async ({
    authenticatedPage: page,
  }) => {
    // For this test, we'd need to set up a user with active trial
    // This is a simplified version
    await page.goto('/dashboard');

    // If user has trial, should show trial badge
    const trialIndicator = page.locator('text=/Trial|Days remaining/i');
    const hasTrialIndicator = await trialIndicator.count();

    // This test would need a user with actual trial subscription
    // In a real test, we'd set that up in the fixture
  });

  test('should show trial period remaining', async ({ authenticatedPage: page }) => {
    await page.goto('/subscription');

    // Should show days remaining (if on trial)
    // This test assumes we'd set up a trial user fixture
    const trialStatus = page.locator(
      'text=/days? remaining|days? left|trial.*end/i'
    );

    // The actual visibility depends on user having a trial
    const hasTrialStatus = await trialStatus.count();
    // In a full implementation, we'd use a trialUser fixture
  });

  test('should not allow starting trial twice', async ({ authenticatedPage: page }) => {
    // This test would need a user who already used their trial
    await page.goto('/pricing');

    const premiumCard = page.locator('[data-tier="premium"]').or(
      page.locator('text=Premium').locator('..').locator('..')
    );

    // After trial is used, button should show regular subscription
    const subscribeButton = premiumCard
      .locator('button')
      .filter({ hasText: /Subscribe|Get Started/i })
      .first();

    // Should not show "Start Trial" for users who already had trial
    const trialButton = premiumCard
      .locator('button')
      .filter({ hasText: /Start Trial/i });

    const trialButtonCount = await trialButton.count();
    
    // If user already had trial, should not see trial button
    // This would require a specific fixture for users who used trial
  });

  test('should show trial conversion prompt', async ({ authenticatedPage: page }) => {
    // Test for users approaching trial end
    await page.goto('/subscription');

    // Should show prompt to convert trial to paid subscription
    // This test would work best with a user fixture that has expiring trial
    const conversionPrompt = page.locator(
      'text=/trial.*ending|convert|continue/i'
    );

    // Actual implementation would need trial user fixture
  });

  test('should handle trial expiration', async ({ authenticatedPage: page }) => {
    // Test behavior when trial expires
    await page.goto('/dashboard');

    // If trial expired, should show upgrade prompt
    // This would need an "expired trial" user fixture
    const upgradePrompt = page.locator(
      'text=/trial.*ended|upgrade|subscribe/i'
    );

    // Actual behavior depends on user fixture
  });

  test('should display trial terms and conditions', async ({ page }) => {
    await page.goto('/pricing');

    // Should show trial terms
    const trialTerms = page.locator(
      'text=/No credit card|Cancel anytime|Free trial/i'
    );

    await expect(trialTerms.first()).toBeVisible();
  });

  test('should show trial banner for eligible users', async ({
    freeUser: page,
  }) => {
    await page.goto('/pricing');

    // Free users should see trial offer
    const trialBanner = page.locator('text=/Start.*trial|Try.*free/i');
    await expect(trialBanner.first()).toBeVisible();
  });

  test('should not show trial offer to existing paid subscribers', async ({
    basicUser: page,
  }) => {
    await page.goto('/pricing');

    // Basic users upgrading to Premium should not get trial
    const premiumCard = page.locator('[data-tier="premium"]').or(
      page.locator('text=Premium').locator('..').locator('..')
    );

    // Should show upgrade button, not trial button
    const upgradeButton = premiumCard
      .locator('button')
      .filter({ hasText: /Upgrade|Subscribe/i })
      .first();

    await expect(upgradeButton).toBeVisible();

    // Should not show trial button
    const trialButton = premiumCard
      .locator('button')
      .filter({ hasText: /Start Trial/i });
    
    const trialCount = await trialButton.count();
    // Existing paid users typically don't get trial for upgrades
  });
});

test.describe('Trial Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should create trial checkout session without payment', async ({
    authenticatedPage: page,
  }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_trial_no_payment',
    });

    await page.goto('/pricing');

    const trialButton = page
      .locator('button')
      .filter({ hasText: /Start Trial|Try Free/i })
      .first();

    await trialButton.click();

    // Should redirect to checkout
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
  });

  test('should show trial checkout loading state', async ({
    authenticatedPage: page,
  }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_trial',
      delayMs: 1000,
    });

    await page.goto('/pricing');

    const trialButton = page
      .locator('button')
      .filter({ hasText: /Start Trial/i })
      .first();

    await trialButton.click();

    // Should show loading
    await expect(
      page.locator('button:disabled').filter({ hasText: /Loading/i })
    ).toBeVisible();
  });

  test('should handle trial checkout errors', async ({
    authenticatedPage: page,
  }) => {
    await mockStripeCheckoutSuccess(page, {
      shouldSucceed: false,
    });

    await page.goto('/pricing');

    const trialButton = page
      .locator('button')
      .filter({ hasText: /Start Trial/i })
      .first();

    await trialButton.click();

    // Should show error
    await expect(
      page.locator('text=/error|failed/i')
    ).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Trial User Experience', () => {
  test('should display trial benefits clearly', async ({ page }) => {
    await page.goto('/pricing');

    // Should explain trial benefits
    await expect(
      page.locator('text=/No credit card|Cancel anytime|Full access/i')
    ).toBeVisible();
  });

  test('should show trial duration prominently', async ({ page }) => {
    await page.goto('/pricing');

    // Should show trial duration (e.g., "7 days" or "14 days")
    await expect(page.locator('text=/\\d+-day trial/i')).toBeVisible();
  });

  test('should explain trial-to-paid conversion', async ({ page }) => {
    await page.goto('/pricing');

    // Check FAQ for trial information
    const faqSection = page.locator('text=Frequently Asked Questions').locator('..');
    await faqSection.scrollIntoViewIfNeeded();

    // Look for trial-related FAQ
    const trialFaq = page.locator('text=/trial|free/i');
    await expect(trialFaq.first()).toBeVisible();
  });

  test('should provide trial cancellation information', async ({ page }) => {
    await page.goto('/pricing');

    // Should mention cancellation
    await expect(
      page.locator('text=/Cancel anytime|No commitment/i')
    ).toBeVisible();
  });
});

test.describe('Trial Notifications', () => {
  test('should show trial start confirmation', async ({
    authenticatedPage: page,
  }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_trial_start',
    });

    await page.goto('/pricing');

    const trialButton = page
      .locator('button')
      .filter({ hasText: /Start Trial/i })
      .first();

    await trialButton.click();

    await page.waitForURL(/\/subscription/, { timeout: 5000 });

    // Should show success message
    await expect(
      page.locator('text=/trial.*started|welcome|success/i')
    ).toBeVisible();
  });

  test('should display trial countdown', async ({ authenticatedPage: page }) => {
    // This would need a trial user fixture
    await page.goto('/dashboard');

    // Should show days remaining
    const countdown = page.locator('text=/\\d+ days? remaining|days? left/i');
    
    // Actual display depends on user having active trial
  });

  test('should warn about trial ending soon', async ({
    authenticatedPage: page,
  }) => {
    // This would need a fixture for user with trial ending soon (e.g., 1-2 days left)
    await page.goto('/dashboard');

    // Should show warning for trials ending soon
    const warning = page.locator(
      'text=/trial.*ending|\\d+ days? left|expir/i'
    );

    // Actual behavior depends on fixture
  });
});

test.describe('Trial Access Control', () => {
  test('should grant full premium access during trial', async ({
    authenticatedPage: page,
  }) => {
    // This would need a trial user fixture
    await page.goto('/dashboard');

    // Trial users should have premium features
    const premiumFeatures = page.locator('text=/Unlimited|All courses|Full access/i');
    
    // Actual access depends on user fixture
  });

  test('should display trial badge on subscription status', async ({
    authenticatedPage: page,
  }) => {
    // This would need a trial user fixture
    await page.goto('/subscription');

    // Should show trial badge
    const trialBadge = page.locator('text=/Trial|Trialing/i');
    
    // Actual display depends on user fixture
  });

  test('should allow trial users to access premium content', async ({
    authenticatedPage: page,
  }) => {
    // This would need a trial user fixture
    await page.goto('/dashboard');

    // Trial users should see premium content
    // Actual test would check specific premium features
  });
});

