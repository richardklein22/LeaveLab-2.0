/**
 * useSubscription Hook
 * 
 * Fetches and manages the current user's subscription data.
 * Uses SWR for automatic caching, revalidation, and optimistic updates.
 */

'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import type { UserSubscriptionResponse } from '../types/subscription';

interface UseSubscriptionReturn {
  subscription: UserSubscriptionResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (data?: UserSubscriptionResponse | null, revalidate?: boolean) => Promise<UserSubscriptionResponse | null | undefined>;
}

const fetcher = async (url: string): Promise<UserSubscriptionResponse | null> => {
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      // User not authenticated - return null (they're on free tier)
      return null;
    }
    const error = await response.json().catch(() => ({ error: 'Failed to fetch subscription' }));
    throw new Error(error.error || 'Failed to fetch subscription');
  }

  const data = await response.json();
  return data.subscription || null;
};

/**
 * Hook to fetch and manage user's subscription status
 * 
 * @example
 * ```tsx
 * function SubscriptionBadge() {
 *   const { subscription, isLoading } = useSubscription();
 *   
 *   if (isLoading) return <Skeleton />;
 *   
 *   return <Badge>{subscription?.tier.displayName || 'Free'}</Badge>;
 * }
 * ```
 */
export function useSubscription(): UseSubscriptionReturn {
  const {
    data: subscription,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<UserSubscriptionResponse | null, Error>(
    '/api/v1/subscriptions/status',
    fetcher,
    {
      // Revalidate on window focus
      revalidateOnFocus: true,
      // Revalidate every 5 minutes
      refreshInterval: 5 * 60 * 1000,
      // Keep previous data while revalidating
      keepPreviousData: true,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  // Log subscription changes (helpful for debugging)
  useEffect(() => {
    if (subscription && process.env.NODE_ENV === 'development') {
      console.log('[useSubscription] Subscription loaded:', {
        tier: subscription.tier.name,
        status: subscription.status,
        trial: subscription.trial?.active ? `${subscription.trial.daysRemaining} days left` : 'none',
      });
    }
  }, [subscription]);

  const refetch = async () => {
    await mutate();
  };

  return {
    subscription: subscription ?? null,
    isLoading: isLoading || isValidating,
    isError: !!error,
    error: error || null,
    refetch,
    mutate,
  };
}

/**
 * Helper hook to check if user has a specific tier or higher
 * 
 * @example
 * ```tsx
 * function PremiumFeature() {
 *   const hasPremium = useHasTier('premium');
 *   
 *   if (!hasPremium) return <UpgradePrompt requiredTier="Premium" />;
 *   
 *   return <PremiumContent />;
 * }
 * ```
 */
export function useHasTier(requiredTier: 'free' | 'basic' | 'premium'): boolean {
  const { subscription } = useSubscription();
  
  if (!subscription) {
    return requiredTier === 'free';
  }

  const tierOrder: Record<string, number> = {
    free: 0,
    basic: 1,
    premium: 2,
  };

  const currentTierLevel = tierOrder[subscription.tier.name] || 0;
  const requiredTierLevel = tierOrder[requiredTier] || 0;

  return currentTierLevel >= requiredTierLevel;
}

/**
 * Helper hook to check if user is on a trial
 * 
 * @example
 * ```tsx
 * function TrialBanner() {
 *   const { isTrialing, daysRemaining } = useIsTrialing();
 *   
 *   if (!isTrialing) return null;
 *   
 *   return <Alert>{daysRemaining} days left in your trial</Alert>;
 * }
 * ```
 */
export function useIsTrialing(): { isTrialing: boolean; daysRemaining: number | null } {
  const { subscription } = useSubscription();
  
  if (!subscription || !subscription.trial) {
    return { isTrialing: false, daysRemaining: null };
  }

  return {
    isTrialing: subscription.trial.active,
    daysRemaining: subscription.trial.daysRemaining ?? null,
  };
}

