/**
 * Subscription Tier Constants
 * 
 * Defines tier names and feature keys used throughout the subscription system.
 */

// Tier names (must match database values)
export const TIER_NAMES = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
} as const;

export type TierName = typeof TIER_NAMES[keyof typeof TIER_NAMES];

// Display names for tiers
export const TIER_DISPLAY_NAMES: Record<TierName, string> = {
  [TIER_NAMES.FREE]: 'Free',
  [TIER_NAMES.BASIC]: 'Basic',
  [TIER_NAMES.PREMIUM]: 'Premium',
};

// Feature keys (must match database JSONB structure)
export const FEATURE_KEYS = {
  // Courses
  COURSE_ACCESS: 'courseAccess',
  COURSE_LIMIT: 'courseLimit',
  
  // Community
  COMMUNITY_ACCESS: 'communityAccess',
  
  // Visa & Immigration
  VISA_INFO_ACCESS: 'visaInfoAccess',
  VISA_INFO_LEVEL: 'visaInfoLevel',
  
  // Accommodation
  ACCOMMODATION_INFO_ACCESS: 'accommodationInfoAccess',
  ACCOMMODATION_INFO_LEVEL: 'accommodationInfoLevel',
  
  // Support
  SUPPORT_LEVEL: 'supportLevel',
  
  // Trial
  TRIAL_DAYS: 'trialDays',
} as const;

// Support levels
export const SUPPORT_LEVELS = {
  NONE: 'none',
  EMAIL: 'email',
  ONE_ON_ONE: 'one-on-one',
} as const;

export type SupportLevel = typeof SUPPORT_LEVELS[keyof typeof SUPPORT_LEVELS];

// Content access levels
export const ACCESS_LEVELS = {
  NONE: 'none',
  SHORT_TERM: 'short-term',
  LONG_TERM: 'long-term',
  ALL: 'all',
} as const;

export type AccessLevel = typeof ACCESS_LEVELS[keyof typeof ACCESS_LEVELS];

// Billing cycles
export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const;

export type BillingCycle = typeof BILLING_CYCLES[keyof typeof BILLING_CYCLES];

// Subscription statuses (matches Stripe)
export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  UNPAID: 'unpaid',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  PAUSED: 'paused',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUSES[keyof typeof SUBSCRIPTION_STATUSES];

// Tier order (for sorting)
export const TIER_ORDER: Record<TierName, number> = {
  [TIER_NAMES.FREE]: 0,
  [TIER_NAMES.BASIC]: 1,
  [TIER_NAMES.PREMIUM]: 2,
};

