/**
 * Playwright Fixtures for Authentication
 * 
 * Provides authenticated page contexts and test users for E2E tests.
 */

import { test as base, expect, Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for E2E tests');
}

// Service client for test setup/teardown
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface TestUser {
  id: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthFixtures {
  authenticatedPage: Page;
  testUser: TestUser;
  freeUser: Page;
  basicUser: Page;
  premiumUser: Page;
}

/**
 * Create a test user with credentials
 */
async function createTestUser(email: string, password: string): Promise<TestUser> {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    throw new Error(`Failed to create test user: ${authError?.message}`);
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email,
      display_name: email.split('@')[0],
      email_verified: true,
    });

  if (profileError) {
    throw new Error(`Failed to create profile: ${profileError.message}`);
  }

  // Sign in to get tokens
  const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !sessionData.session) {
    throw new Error(`Failed to sign in test user: ${signInError?.message}`);
  }

  return {
    id: authData.user.id,
    email,
    password,
    accessToken: sessionData.session.access_token,
    refreshToken: sessionData.session.refresh_token,
  };
}

/**
 * Delete a test user and all associated data
 */
async function deleteTestUser(userId: string) {
  try {
    // Delete user subscriptions
    await supabase.from('user_subscriptions').delete().eq('user_id', userId);
    
    // Delete profile
    await supabase.from('profiles').delete().eq('id', userId);
    
    // Delete auth user
    await supabase.auth.admin.deleteUser(userId);
  } catch (error) {
    console.error('Error deleting test user:', error);
  }
}

/**
 * Set authentication cookies in the browser
 */
async function setAuthCookies(page: Page, user: TestUser) {
  await page.context().addCookies([
    {
      name: 'sb-access-token',
      value: user.accessToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'sb-refresh-token',
      value: user.refreshToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * Assign a subscription tier to a user
 */
async function assignSubscriptionTier(
  userId: string,
  tierName: 'free' | 'basic' | 'premium'
) {
  // Get tier ID
  const { data: tier, error: tierError } = await supabase
    .from('subscription_tiers')
    .select('id')
    .eq('name', tierName)
    .single();

  if (tierError || !tier) {
    throw new Error(`Failed to get ${tierName} tier: ${tierError?.message}`);
  }

  // Create or update subscription
  const { error: subError } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      tier_id: tier.id,
      status: tierName === 'free' ? 'active' : 'active',
      stripe_customer_id: tierName === 'free' ? null : `cus_test_${userId}`,
      stripe_subscription_id: tierName === 'free' ? null : `sub_test_${userId}`,
      billing_cycle: tierName === 'free' ? null : 'monthly',
      current_period_start: tierName === 'free' ? null : new Date().toISOString(),
      current_period_end: tierName === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

  if (subError) {
    throw new Error(`Failed to assign subscription: ${subError.message}`);
  }
}

// Extend Playwright test with fixtures
export const test = base.extend<AuthFixtures>({
  /**
   * Generic authenticated page with a fresh test user
   */
  authenticatedPage: async ({ page }, use, testInfo) => {
    const testId = testInfo.testId.replace(/[^a-z0-9]/gi, '');
    const email = `test-${testId}-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const user = await createTestUser(email, password);
    await setAuthCookies(page, user);

    await use(page);

    await deleteTestUser(user.id);
  },

  /**
   * Test user object for accessing user details
   */
  testUser: async ({ page }, use, testInfo) => {
    const testId = testInfo.testId.replace(/[^a-z0-9]/gi, '');
    const email = `test-${testId}-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const user = await createTestUser(email, password);

    await use(user);

    await deleteTestUser(user.id);
  },

  /**
   * Authenticated page with a free tier user
   */
  freeUser: async ({ page }, use, testInfo) => {
    const testId = testInfo.testId.replace(/[^a-z0-9]/gi, '');
    const email = `free-${testId}-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const user = await createTestUser(email, password);
    await assignSubscriptionTier(user.id, 'free');
    await setAuthCookies(page, user);

    await use(page);

    await deleteTestUser(user.id);
  },

  /**
   * Authenticated page with a basic tier user
   */
  basicUser: async ({ page }, use, testInfo) => {
    const testId = testInfo.testId.replace(/[^a-z0-9]/gi, '');
    const email = `basic-${testId}-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const user = await createTestUser(email, password);
    await assignSubscriptionTier(user.id, 'basic');
    await setAuthCookies(page, user);

    await use(page);

    await deleteTestUser(user.id);
  },

  /**
   * Authenticated page with a premium tier user
   */
  premiumUser: async ({ page }, use, testInfo) => {
    const testId = testInfo.testId.replace(/[^a-z0-9]/gi, '');
    const email = `premium-${testId}-${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const user = await createTestUser(email, password);
    await assignSubscriptionTier(user.id, 'premium');
    await setAuthCookies(page, user);

    await use(page);

    await deleteTestUser(user.id);
  },
});

export { expect };

