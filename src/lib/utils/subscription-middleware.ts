/**
 * Server-Side Subscription Middleware
 * 
 * Provides server-side subscription verification for protecting API routes.
 * Use this to ensure users have the required subscription tier before
 * accessing premium API endpoints.
 * 
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const { authorized, error, userId } = await requireSubscription('premium');
 *   
 *   if (!authorized) {
 *     return error; // Returns appropriate error response
 *   }
 *   
 *   // User has Premium access, proceed with request...
 * }
 * ```
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse } from './response';

/**
 * Subscription tier levels in ascending order of access
 */
const TIER_HIERARCHY = {
  free: 0,
  basic: 1,
  premium: 2,
} as const;

export type SubscriptionTier = keyof typeof TIER_HIERARCHY;

/**
 * Result of subscription verification
 */
export interface SubscriptionCheckResult {
  /** Whether the user is authorized (has required tier or higher) */
  authorized: boolean;
  /** Error response to return if not authorized */
  error?: NextResponse;
  /** User ID if authorized */
  userId?: string;
  /** User's current tier name */
  currentTier?: SubscriptionTier;
  /** User's current tier display name */
  currentTierDisplay?: string;
}

/**
 * Require a minimum subscription tier for API access
 * 
 * Checks if the authenticated user has the required subscription tier or higher.
 * Returns an error response if the user is not authenticated or doesn't have
 * sufficient subscription level.
 * 
 * @param requiredTier - Minimum required tier ('free', 'basic', or 'premium')
 * @returns Promise resolving to authorization result
 * 
 * @example
 * ```typescript
 * // Require Premium subscription
 * const { authorized, error, userId } = await requireSubscription('premium');
 * if (!authorized) return error;
 * 
 * // Require at least Basic subscription
 * const { authorized, error } = await requireSubscription('basic');
 * if (!authorized) return error;
 * ```
 */
export async function requireSubscription(
  requiredTier: SubscriptionTier
): Promise<SubscriptionCheckResult> {
  try {
    // Create authenticated Supabase client
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[requireSubscription] Authentication error:', authError);
      return {
        authorized: false,
        error: errorResponse('Authentication required', 401),
      };
    }

    // Get user's current subscription with tier information
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(
        `
        id,
        status,
        tier_id,
        subscription_tiers (
          id,
          name,
          display_name
        )
      `
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      console.error('[requireSubscription] Error fetching subscription:', subError);
      return {
        authorized: false,
        error: errorResponse(
          'Unable to verify subscription status. Please try again.',
          500
        ),
      };
    }

    // Extract tier information
    // Supabase returns nested select as an array or object depending on the relationship
    const tierData = Array.isArray(subscription.subscription_tiers)
      ? subscription.subscription_tiers[0]
      : subscription.subscription_tiers;
    
    if (!tierData || !tierData.name) {
      console.error('[requireSubscription] Invalid tier data:', tierData);
      return {
        authorized: false,
        error: errorResponse('Invalid subscription configuration', 500),
      };
    }

    const currentTier = tierData.name as SubscriptionTier;
    const currentTierDisplay = tierData.display_name as string;

    // Check if user's tier meets the requirement
    const userTierLevel = TIER_HIERARCHY[currentTier];
    const requiredTierLevel = TIER_HIERARCHY[requiredTier];

    if (userTierLevel === undefined || requiredTierLevel === undefined) {
      console.error('[requireSubscription] Invalid tier comparison:', {
        currentTier,
        requiredTier,
      });
      return {
        authorized: false,
        error: errorResponse('Invalid subscription tier', 500),
      };
    }

    // User has sufficient access
    if (userTierLevel >= requiredTierLevel) {
      return {
        authorized: true,
        userId: user.id,
        currentTier,
        currentTierDisplay,
      };
    }

    // User's tier is insufficient
    const requiredTierDisplay = requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1);
    
    return {
      authorized: false,
      currentTier,
      currentTierDisplay,
      error: errorResponse(
        `${requiredTierDisplay} subscription required. Your current plan is ${currentTierDisplay}.`,
        403
      ),
    };
  } catch (error) {
    console.error('[requireSubscription] Unexpected error:', error);
    return {
      authorized: false,
      error: errorResponse('Internal server error', 500),
    };
  }
}

/**
 * Check if a user has a specific subscription feature enabled
 * 
 * This is more granular than tier checking - it verifies specific features
 * from the subscription_tiers table (e.g., community_access, email_support).
 * 
 * @param userId - User ID to check
 * @param feature - Feature column name from subscription_tiers table
 * @returns Promise resolving to whether the feature is enabled
 * 
 * @example
 * ```typescript
 * const hasEmailSupport = await hasSubscriptionFeature(userId, 'email_support');
 * const hasCommunityAccess = await hasSubscriptionFeature(userId, 'community_access');
 * ```
 */
export async function hasSubscriptionFeature(
  userId: string,
  feature: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select(
        `
        subscription_tiers (
          ${feature}
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      console.error('[hasSubscriptionFeature] Error:', error);
      return false;
    }

    // @ts-expect-error - Dynamic feature access
    const tierData = subscription.subscription_tiers;
    return tierData?.[feature] === true;
  } catch (error) {
    console.error('[hasSubscriptionFeature] Unexpected error:', error);
    return false;
  }
}

/**
 * Get user's current subscription tier
 * 
 * Retrieves the user's active subscription tier information.
 * Returns null if the user has no active subscription.
 * 
 * @param userId - User ID to check
 * @returns Promise resolving to tier info or null
 * 
 * @example
 * ```typescript
 * const tier = await getUserSubscriptionTier(userId);
 * if (tier?.name === 'premium') {
 *   // Grant premium access
 * }
 * ```
 */
export async function getUserSubscriptionTier(userId: string): Promise<{
  name: SubscriptionTier;
  displayName: string;
  id: string;
} | null> {
  try {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select(
        `
        subscription_tiers (
          id,
          name,
          display_name
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      console.error('[getUserSubscriptionTier] Error:', error);
      return null;
    }

    // Supabase returns nested select as an array or object depending on the relationship
    const tierData = Array.isArray(subscription.subscription_tiers)
      ? subscription.subscription_tiers[0]
      : subscription.subscription_tiers;

    if (!tierData) {
      return null;
    }

    return {
      id: tierData.id,
      name: tierData.name as SubscriptionTier,
      displayName: tierData.display_name,
    };
  } catch (error) {
    console.error('[getUserSubscriptionTier] Unexpected error:', error);
    return null;
  }
}

