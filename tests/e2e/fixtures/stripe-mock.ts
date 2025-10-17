/**
 * Stripe Mock Utilities for E2E Testing
 * 
 * Provides utilities to mock Stripe API responses and simulate payment flows.
 */

import { Page, Route } from '@playwright/test';

export interface StripeMockConfig {
  shouldSucceed?: boolean;
  delayMs?: number;
  customerId?: string;
  subscriptionId?: string;
  sessionId?: string;
}

/**
 * Mock successful Stripe Checkout session creation
 */
export async function mockStripeCheckoutSuccess(
  page: Page,
  config: StripeMockConfig = {}
) {
  const {
    shouldSucceed = true,
    delayMs = 100,
    sessionId = 'cs_test_mock_session',
  } = config;

  await page.route('**/api/v1/subscriptions/checkout', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      if (shouldSucceed) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            sessionId,
            url: `http://localhost:3000/subscription?session_id=${sessionId}`,
          }),
        });
      } else {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Failed to create checkout session',
          }),
        });
      }
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock Stripe Customer Portal session creation
 */
export async function mockStripePortalSuccess(
  page: Page,
  config: StripeMockConfig = {}
) {
  const {
    shouldSucceed = true,
    delayMs = 100,
  } = config;

  await page.route('**/api/v1/subscriptions/portal', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      if (shouldSucceed) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            url: 'http://localhost:3000/subscription?portal=success',
          }),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Subscription not found',
          }),
        });
      }
    } else {
      await route.continue();
    }
  });
}

/**
 * Simulate a successful subscription creation via webhook
 */
export async function simulateSubscriptionWebhook(
  page: Page,
  userId: string,
  tierId: string,
  billingCycle: 'monthly' | 'annual' = 'monthly'
) {
  // This simulates what happens when Stripe sends a webhook after successful payment
  const webhookPayload = {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: `cs_test_${Date.now()}`,
        customer: `cus_test_${userId}`,
        subscription: `sub_test_${Date.now()}`,
        metadata: {
          userId,
          tierId,
          billingCycle,
        },
      },
    },
  };

  // Call the webhook endpoint directly (bypassing Stripe signature verification in tests)
  await page.evaluate(
    async ({ payload, userId, tierId, billingCycle }) => {
      // Update the subscription in the database directly via API
      await fetch('/api/v1/subscriptions/test/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tierId,
          billingCycle,
          status: 'active',
          stripeCustomerId: `cus_test_${userId}`,
          stripeSubscriptionId: `sub_test_${Date.now()}`,
        }),
      });
    },
    { payload: webhookPayload, userId, tierId, billingCycle }
  );
}

/**
 * Mock subscription upgrade flow
 */
export async function mockSubscriptionUpgrade(
  page: Page,
  fromTier: string,
  toTier: string
) {
  await page.route('**/api/v1/subscriptions/checkout', async (route: Route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      const body = request.postDataJSON();
      
      // Simulate upgrade
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: `cs_test_upgrade_${Date.now()}`,
          url: `http://localhost:3000/subscription?upgraded=true&from=${fromTier}&to=${toTier}`,
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock subscription cancellation
 */
export async function mockSubscriptionCancellation(
  page: Page,
  shouldSucceed: boolean = true
) {
  await page.route('**/api/v1/subscriptions/portal', async (route: Route) => {
    if (route.request().method() === 'POST') {
      if (shouldSucceed) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            url: 'http://localhost:3000/subscription?cancelled=true',
          }),
        });
      } else {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Failed to cancel subscription',
          }),
        });
      }
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock already subscribed error
 */
export async function mockAlreadySubscribed(page: Page) {
  await page.route('**/api/v1/subscriptions/checkout', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Already subscribed to this tier',
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Clear all Stripe-related route mocks
 */
export async function clearStripeMocks(page: Page) {
  await page.unroute('**/api/v1/subscriptions/checkout');
  await page.unroute('**/api/v1/subscriptions/portal');
  await page.unroute('**/api/v1/subscriptions/webhook');
}

/**
 * Wait for subscription status to update
 */
export async function waitForSubscriptionUpdate(
  page: Page,
  expectedStatus: string,
  timeoutMs: number = 5000
) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    const response = await page.request.get('/api/v1/subscriptions/status', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok()) {
      const data = await response.json();
      if (data.subscription?.status === expectedStatus) {
        return data.subscription;
      }
    }

    await page.waitForTimeout(500);
  }

  throw new Error(`Subscription status did not update to ${expectedStatus} within ${timeoutMs}ms`);
}

