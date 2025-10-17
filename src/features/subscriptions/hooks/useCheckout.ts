/**
 * useCheckout Hook
 * 
 * Handles Stripe Checkout session creation and redirection.
 * Manages loading states and errors during the checkout process.
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SUBSCRIPTION_MESSAGES } from '../constants/messages';

interface CheckoutParams {
  tierId: string;
  billingCycle: 'monthly' | 'annual';
  trial?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

interface UseCheckoutReturn {
  createCheckoutSession: (params: CheckoutParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook to handle Stripe Checkout flow
 * 
 * @example
 * ```tsx
 * function PricingCard({ tierId }) {
 *   const { createCheckoutSession, isLoading, error } = useCheckout();
 *   
 *   const handleSubscribe = async () => {
 *     await createCheckoutSession({
 *       tierId,
 *       billingCycle: 'annual',
 *       trial: true,
 *     });
 *   };
 *   
 *   return (
 *     <Button onClick={handleSubscribe} disabled={isLoading}>
 *       {isLoading ? 'Loading...' : 'Subscribe'}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = useCallback(
    async (params: CheckoutParams) => {
      setIsLoading(true);
      setError(null);

      try {
        // Default URLs if not provided
        const successUrl = params.successUrl || `${window.location.origin}/subscription?success=true`;
        const cancelUrl = params.cancelUrl || `${window.location.origin}/pricing?cancelled=true`;

        // Call API to create checkout session
        const response = await fetch('/api/v1/subscriptions/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            tierId: params.tierId,
            billingCycle: params.billingCycle,
            trial: params.trial || false,
            successUrl,
            cancelUrl,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          
          // Handle specific error cases
          if (response.status === 401) {
            // Not authenticated - redirect to login
            router.push('/login?redirect=/pricing');
            return;
          }
          
          if (response.status === 409) {
            setError(SUBSCRIPTION_MESSAGES.ERROR_ALREADY_SUBSCRIBED);
            return;
          }
          
          // Extract error message properly (could be string or object)
          const errorMessage = typeof errorData.error === 'string' 
            ? errorData.error 
            : errorData.error?.message || errorData.message || SUBSCRIPTION_MESSAGES.ERROR_CREATING_CHECKOUT;
          
          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.url) {
          throw new Error('No checkout URL received');
        }

        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } catch (err) {
        console.error('[useCheckout] Error creating checkout session:', err);
        setError(err instanceof Error ? err.message : SUBSCRIPTION_MESSAGES.ERROR_GENERIC);
        setIsLoading(false);
      }
      // Note: We don't setIsLoading(false) on success because we're redirecting
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createCheckoutSession,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook to open Stripe Customer Portal
 * 
 * @example
 * ```tsx
 * function ManageBillingButton() {
 *   const { openPortal, isLoading } = useCustomerPortal();
 *   
 *   return (
 *     <Button onClick={openPortal} disabled={isLoading}>
 *       Manage Billing
 *     </Button>
 *   );
 * }
 * ```
 */
export function useCustomerPortal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPortal = useCallback(async (returnUrl?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const defaultReturnUrl = `${window.location.origin}/subscription`;

      const response = await fetch('/api/v1/subscriptions/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          returnUrl: returnUrl || defaultReturnUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        if (response.status === 404) {
          setError(SUBSCRIPTION_MESSAGES.NO_SUBSCRIPTION);
          setIsLoading(false);
          return;
        }
        
        throw new Error(errorData.error || SUBSCRIPTION_MESSAGES.PORTAL_ERROR);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error('No portal URL received');
      }

      // Redirect to Customer Portal
      window.location.href = data.url;
    } catch (err) {
      console.error('[useCustomerPortal] Error opening portal:', err);
      setError(err instanceof Error ? err.message : SUBSCRIPTION_MESSAGES.ERROR_GENERIC);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    openPortal,
    isLoading,
    error,
    clearError,
  };
}

