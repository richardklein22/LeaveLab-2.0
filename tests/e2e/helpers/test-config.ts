/**
 * Test Configuration and Environment Validation
 * 
 * Validates that the test environment is properly configured before running tests.
 */

import { test as base } from '@playwright/test';

/**
 * Required environment variables for E2E tests
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_APP_URL',
] as const;

/**
 * Validate environment variables
 */
export function validateTestEnvironment() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check recommended variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please set these in .env.test.local or your environment.'
    );
  }

  if (warnings.length > 0) {
    console.warn(
      '⚠️  Missing recommended environment variables:\n' +
      warnings.join('\n') +
      '\n\nSome tests may fail or be skipped.'
    );
  }
}

/**
 * Test configuration
 */
export const testConfig = {
  // Base URLs
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,

  // Timeouts
  defaultTimeout: 30000,
  navigationTimeout: 10000,
  apiTimeout: 5000,

  // Retry configuration
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Screenshot/video
  screenshot: process.env.CI ? 'only-on-failure' : 'off',
  video: process.env.CI ? 'retain-on-failure' : 'off',

  // Test data
  testUserPassword: process.env.TEST_USER_PASSWORD || 'TestPassword123!',

  // Feature flags
  enableStripeMocking: true,
  enableDatabaseCleanup: true,

  // Stripe configuration (for mocking)
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
} as const;

/**
 * Check if we're running in CI environment
 */
export function isCI(): boolean {
  return !!process.env.CI;
}

/**
 * Check if we're running in debug mode
 */
export function isDebugMode(): boolean {
  return !!process.env.PWDEBUG;
}

/**
 * Get test environment info
 */
export function getTestEnvironmentInfo() {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    ci: isCI(),
    debug: isDebugMode(),
    baseUrl: testConfig.baseUrl,
    hasStripeConfig: !!(testConfig.stripe.publishableKey && testConfig.stripe.secretKey),
  };
}

/**
 * Wait for test environment to be ready
 */
export async function waitForTestEnvironment() {
  const maxAttempts = 30;
  const delayMs = 1000;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(testConfig.baseUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok || response.status === 404) {
        console.log('✅ Test environment is ready');
        return;
      }
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error(
          `Test environment not ready after ${maxAttempts} attempts.\n` +
          `Please ensure the dev server is running at ${testConfig.baseUrl}`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Database test helpers
 */
export const dbHelpers = {
  /**
   * Check if database has required tables
   */
  async checkDatabaseSchema() {
    const requiredTables = [
      'profiles',
      'subscription_tiers',
      'user_subscriptions',
      'subscription_events',
    ];

    // This would need to actually query the database
    // For now, just return true
    return true;
  },

  /**
   * Check if subscription tiers are seeded
   */
  async checkSubscriptionTiers() {
    const requiredTiers = ['free', 'basic', 'premium'];

    // This would need to query the database
    // For now, just return true
    return true;
  },
};

/**
 * Test utilities
 */
export const testUtils = {
  /**
   * Generate unique test email
   */
  generateTestEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}@test.example.com`;
  },

  /**
   * Generate unique test ID
   */
  generateTestId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  },

  /**
   * Sleep for specified milliseconds
   */
  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Retry function with exponential backoff
   */
  async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      backoffMultiplier?: number;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2,
    } = options;

    let lastError: Error | undefined;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          console.log(
            `Attempt ${attempt} failed, retrying in ${delay}ms...`
          );
          await this.sleep(delay);
          delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  },
};

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  startTime: 0,

  start() {
    this.startTime = Date.now();
  },

  elapsed(): number {
    return Date.now() - this.startTime;
  },

  log(label: string) {
    console.log(`⏱️  ${label}: ${this.elapsed()}ms`);
  },
};

/**
 * Test data factory
 */
export const testDataFactory = {
  /**
   * Create test user data
   */
  createUserData(overrides: Partial<{
    email: string;
    password: string;
    displayName: string;
  }> = {}) {
    return {
      email: overrides.email || testUtils.generateTestEmail('user'),
      password: overrides.password || testConfig.testUserPassword,
      displayName: overrides.displayName || 'Test User',
    };
  },

  /**
   * Create test subscription data
   */
  createSubscriptionData(overrides: Partial<{
    tierId: string;
    billingCycle: 'monthly' | 'annual';
    trial: boolean;
  }> = {}) {
    return {
      tierId: overrides.tierId || 'basic',
      billingCycle: overrides.billingCycle || 'monthly',
      trial: overrides.trial || false,
    };
  },
};

// Validate environment on import
try {
  validateTestEnvironment();
} catch (error) {
  console.error('❌ Test environment validation failed:');
  console.error(error);
  process.exit(1);
}

// Log test environment info
if (!isCI()) {
  const info = getTestEnvironmentInfo();
  console.log('\n📋 Test Environment Info:');
  console.log(`   Node: ${info.nodeVersion}`);
  console.log(`   Platform: ${info.platform}`);
  console.log(`   Base URL: ${info.baseUrl}`);
  console.log(`   Stripe Config: ${info.hasStripeConfig ? '✅' : '❌'}`);
  console.log('');
}

