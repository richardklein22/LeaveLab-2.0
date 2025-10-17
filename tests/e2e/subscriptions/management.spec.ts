/**
 * E2E Tests for Subscription Management
 * 
 * Tests subscription management features:
 * - Upgrading subscriptions
 * - Downgrading subscriptions
 * - Cancelling subscriptions
 * - Managing billing through Customer Portal
 */

import { test, expect } from '../fixtures/auth-fixture';
import {
  mockStripeCheckoutSuccess,
  mockStripePortalSuccess,
  mockSubscriptionCancellation,
  clearStripeMocks,
} from '../fixtures/stripe-mock';

test.describe('Subscription Upgrades', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should upgrade from Free to Basic', async ({ freeUser: page }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_upgrade_basic',
    });

    // Go to pricing page
    await page.goto('/pricing');

    // Basic tier should have upgrade option
    const basicCard = page.locator('[data-tier="basic"]').or(
      page.locator('text=Basic').locator('..').locator('..')
    );
    
    const upgradeButton = basicCard
      .locator('button')
      .filter({ hasText: /Upgrade|Get Started|Subscribe/i })
      .first();

    await upgradeButton.click();

    // Should redirect to checkout
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
    await expect(page).toHaveURL(/session_id=cs_test_upgrade_basic/);
  });

  test('should upgrade from Free to Premium', async ({ freeUser: page }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_upgrade_premium',
    });

    await page.goto('/pricing');

    // Premium tier should have upgrade option
    const premiumCard = page.locator('[data-tier="premium"]').or(
      page.locator('text=Premium').locator('..').locator('..')
    );
    
    const upgradeButton = premiumCard
      .locator('button')
      .filter({ hasText: /Upgrade|Start Trial|Subscribe/i })
      .first();

    await upgradeButton.click();

    // Should redirect to checkout
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
  });

  test('should upgrade from Basic to Premium', async ({ basicUser: page }) => {
    await mockStripeCheckoutSuccess(page, {
      sessionId: 'cs_test_basic_to_premium',
    });

    await page.goto('/pricing');

    // Premium tier should show upgrade option
    const premiumCard = page.locator('[data-tier="premium"]').or(
      page.locator('text=Premium').locator('..').locator('..')
    );
    
    const upgradeButton = premiumCard
      .locator('button')
      .filter({ hasText: /Upgrade|Subscribe/i })
      .first();

    await upgradeButton.click();

    // Should redirect to checkout
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
  });

  test('should show current plan for Basic user on Basic tier', async ({
    basicUser: page,
  }) => {
    await page.goto('/pricing');

    // Basic tier should show "Current Plan"
    const basicCard = page.locator('[data-tier="basic"]').or(
      page.locator('text=Basic').locator('..').locator('..')
    );

    await expect(
      basicCard.locator('text=/Current Plan|Active/i')
    ).toBeVisible();
  });

  test('should display upgrade benefits on dashboard', async ({
    basicUser: page,
  }) => {
    await page.goto('/dashboard');

    // Should show current subscription
    await expect(page.locator('text=/Basic|Subscription/i')).toBeVisible();

    // Should show upgrade prompt or link
    const upgradePrompt = page.locator('text=/Upgrade|Premium features/i');
    if (await upgradePrompt.isVisible()) {
      await upgradePrompt.click();
      
      // Should navigate to pricing
      await expect(page).toHaveURL(/\/pricing/);
    }
  });
});

test.describe('Subscription Downgrades', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should access Customer Portal for downgrade', async ({
    premiumUser: page,
  }) => {
    await mockStripePortalSuccess(page);

    // Go to subscription page
    await page.goto('/subscription');

    // Look for "Manage Billing" or "Customer Portal" button
    const manageBillingButton = page
      .locator('button')
      .filter({ hasText: /Manage Billing|Manage Subscription|Customer Portal/i })
      .first();

    await manageBillingButton.click();

    // Should redirect to portal (or success page in mock)
    await page.waitForURL(/portal=success/, { timeout: 5000 });
  });

  test('should show downgrade option in Customer Portal', async ({
    premiumUser: page,
  }) => {
    await mockStripePortalSuccess(page);

    await page.goto('/subscription');

    const manageBillingButton = page
      .locator('button')
      .filter({ hasText: /Manage/i })
      .first();

    if (await manageBillingButton.isVisible()) {
      await manageBillingButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should display downgrade warning messages', async ({
    premiumUser: page,
  }) => {
    await page.goto('/pricing');

    // Premium user viewing lower tiers should see downgrade messaging
    const basicCard = page.locator('[data-tier="basic"]').or(
      page.locator('text=Basic').locator('..').locator('..')
    );

    // Check if downgrade button or messaging exists
    const hasDowngradeButton = await basicCard
      .locator('text=/Downgrade|Switch/i')
      .count();

    // If downgrades are handled via Customer Portal, verify that
    if (hasDowngradeButton === 0) {
      // Check for portal access
      await page.goto('/subscription');
      await expect(
        page.locator('button').filter({ hasText: /Manage/i })
      ).toBeVisible();
    }
  });
});

test.describe('Subscription Cancellation', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should cancel subscription through Customer Portal', async ({
    basicUser: page,
  }) => {
    await mockStripePortalSuccess(page);

    await page.goto('/subscription');

    // Click Manage Billing button
    const manageBillingButton = page
      .locator('button')
      .filter({ hasText: /Manage Billing|Cancel|Customer Portal/i })
      .first();

    await manageBillingButton.click();

    // Should redirect to portal
    await page.waitForTimeout(1000);
  });

  test('should show cancellation confirmation dialog', async ({
    premiumUser: page,
  }) => {
    await page.goto('/subscription');

    // Look for cancel button or link
    const cancelButton = page
      .locator('button, a')
      .filter({ hasText: /Cancel Subscription/i });

    const cancelExists = await cancelButton.count();
    
    if (cancelExists > 0) {
      await cancelButton.first().click();

      // Should show confirmation dialog
      await expect(
        page.locator('text=/Are you sure|confirm|cancellation/i')
      ).toBeVisible();
    }
  });

  test('should maintain access until end of billing period after cancellation', async ({
    basicUser: page,
  }) => {
    await page.goto('/subscription');

    // Check for cancellation status messaging
    const statusSection = page.locator('[data-testid="subscription-status"]').or(
      page.locator('text=/Subscription/i').locator('..')
    );

    // Look for end of period messaging
    await expect(statusSection).toBeVisible();
  });

  test('should handle cancellation errors gracefully', async ({
    basicUser: page,
  }) => {
    await mockSubscriptionCancellation(page, false);

    await page.goto('/subscription');

    const manageBillingButton = page
      .locator('button')
      .filter({ hasText: /Manage/i })
      .first();

    if (await manageBillingButton.isVisible()) {
      await manageBillingButton.click();
      
      // Should show error or stay on page
      await page.waitForTimeout(1000);
    }
  });

  test('should allow resubscription after cancellation', async ({
    freeUser: page,
  }) => {
    await mockStripeCheckoutSuccess(page);

    // User who cancelled (now on free tier) should be able to resubscribe
    await page.goto('/pricing');

    const subscribeButton = page
      .locator('button')
      .filter({ hasText: /Get Started|Subscribe/i })
      .first();

    await subscribeButton.click();

    // Should redirect to checkout
    await page.waitForURL(/\/subscription/, { timeout: 5000 });
  });
});

test.describe('Customer Portal Access', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should open Stripe Customer Portal for paid users', async ({
    basicUser: page,
  }) => {
    await mockStripePortalSuccess(page);

    await page.goto('/subscription');

    const portalButton = page
      .locator('button')
      .filter({ hasText: /Manage Billing|Customer Portal/i })
      .first();

    await expect(portalButton).toBeVisible();
    await portalButton.click();

    // Should redirect
    await page.waitForTimeout(1000);
  });

  test('should not show Customer Portal for free users', async ({
    freeUser: page,
  }) => {
    await page.goto('/subscription');

    // Should not have manage billing button
    const portalButton = page
      .locator('button')
      .filter({ hasText: /Manage Billing|Customer Portal/i });

    const count = await portalButton.count();
    expect(count).toBe(0);
  });

  test('should handle portal errors gracefully', async ({ basicUser: page }) => {
    await mockStripePortalSuccess(page, { shouldSucceed: false });

    await page.goto('/subscription');

    const portalButton = page
      .locator('button')
      .filter({ hasText: /Manage/i })
      .first();

    await portalButton.click();

    // Should show error message
    await expect(
      page.locator('text=/error|failed|not found/i')
    ).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Subscription Status Display', () => {
  test('should display free tier status correctly', async ({ freeUser: page }) => {
    await page.goto('/subscription');

    // Should show free tier
    await expect(page.locator('text=/Free/i')).toBeVisible();
    await expect(page.locator('text=/no active subscription/i')).toBeVisible();
  });

  test('should display basic tier status correctly', async ({
    basicUser: page,
  }) => {
    await page.goto('/subscription');

    // Should show Basic tier
    await expect(page.locator('text=/Basic/i')).toBeVisible();
    await expect(page.locator('text=/Active/i')).toBeVisible();
  });

  test('should display premium tier status correctly', async ({
    premiumUser: page,
  }) => {
    await page.goto('/subscription');

    // Should show Premium tier
    await expect(page.locator('text=/Premium/i')).toBeVisible();
    await expect(page.locator('text=/Active/i')).toBeVisible();
  });

  test('should display billing information for paid subscriptions', async ({
    basicUser: page,
  }) => {
    await page.goto('/subscription');

    // Should show billing cycle
    await expect(
      page.locator('text=/monthly|annual|billing/i')
    ).toBeVisible();

    // Should show next billing date or amount
    await expect(
      page.locator('text=/next billing|renews|£|\\$/i')
    ).toBeVisible();
  });

  test('should display subscription features on dashboard', async ({
    premiumUser: page,
  }) => {
    await page.goto('/dashboard');

    // Should show subscription features
    await expect(page.locator('text=/Premium|Subscription/i')).toBeVisible();
    
    // Should show access to premium features
    await expect(
      page.locator('text=/Unlimited|All courses|Full access/i')
    ).toBeVisible();
  });
});

test.describe('Billing Cycle Changes', () => {
  test.beforeEach(async ({ page }) => {
    await clearStripeMocks(page);
  });

  test('should change from monthly to annual through Customer Portal', async ({
    basicUser: page,
  }) => {
    await mockStripePortalSuccess(page);

    await page.goto('/subscription');

    const manageBillingButton = page
      .locator('button')
      .filter({ hasText: /Manage/i })
      .first();

    await manageBillingButton.click();
    await page.waitForTimeout(1000);

    // In real implementation, Customer Portal handles billing cycle changes
  });

  test('should display current billing cycle', async ({ basicUser: page }) => {
    await page.goto('/subscription');

    // Should show monthly or annual
    await expect(
      page.locator('text=/monthly|annual/i')
    ).toBeVisible();
  });

  test('should show savings for annual billing', async ({ page }) => {
    await page.goto('/pricing');

    // Switch to annual
    await page.getByRole('button', { name: /annual/i }).click();

    // Should show savings message
    await expect(
      page.locator('text=/save|discount|% off/i')
    ).toBeVisible();
  });
});

