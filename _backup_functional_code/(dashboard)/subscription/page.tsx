/**
 * Subscription Management Page
 * 
 * Allows users to view and manage their subscription.
 */

'use client';

import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { SubscriptionStatus } from '@/features/subscriptions/components/SubscriptionStatus';
import { UpgradePrompt } from '@/features/subscriptions/components/UpgradePrompt';
import { useSubscription } from '@/features/subscriptions/hooks/useSubscription';
import { useCustomerPortal } from '@/features/subscriptions/hooks/useCheckout';
import { SUBSCRIPTION_MESSAGES } from '@/features/subscriptions/constants/messages';
import { useEffect } from 'react';

export default function SubscriptionPage() {
  const router = useRouter();
  const { subscription, isLoading, isError, error } = useSubscription();
  const { openPortal, isLoading: isPortalLoading, error: portalError } = useCustomerPortal();

  // Handle success/cancel URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const success = params.get('success');
      const cancelled = params.get('cancelled');

      if (success === 'true') {
        // Clear the URL parameters
        window.history.replaceState({}, '', '/subscription');
      }

      if (cancelled === 'true') {
        // Clear the URL parameters
        window.history.replaceState({}, '', '/subscription');
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || SUBSCRIPTION_MESSAGES.ERROR_LOADING_SUBSCRIPTION}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isFreeTier = !subscription || subscription.tier.name === 'free';
  const canUpgrade = !subscription || subscription.canUpgrade;
  const hasActiveSubscription = subscription && subscription.tier.name !== 'free';

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-4xl page-transition safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="mb-6 sm:mb-8 space-y-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Subscription</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Subscription Status */}
      <div className="space-y-6">
        <SubscriptionStatus subscription={subscription} />

        {/* Upgrade Prompt (for free users) */}
        {isFreeTier && (
          <UpgradePrompt
            requiredTier="Premium"
            title="Unlock premium features"
            description="Upgrade to Premium to get unlimited courses, 1-on-1 support, and access to all visa and accommodation information."
          />
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Manage Billing Button */}
          {hasActiveSubscription && (
            <Button
              onClick={() => openPortal()}
              disabled={isPortalLoading}
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
            >
              {isPortalLoading ? (
                'Opening portal...'
              ) : (
                <>
                  Manage Billing
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}

          {/* View Pricing Button */}
          {canUpgrade && (
            <Button
              onClick={() => router.push('/pricing')}
              variant={hasActiveSubscription ? 'outline' : 'default'}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isFreeTier ? 'View Plans' : 'Upgrade Plan'}
            </Button>
          )}
        </div>

        {/* Portal Error */}
        {portalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{portalError}</AlertDescription>
          </Alert>
        )}

        {/* Info Box */}
        <Alert>
          <AlertDescription>
            <p className="text-sm">
              <strong>Need help?</strong> Contact our support team at{' '}
              <a
                href="mailto:support@leavelab.com"
                className="text-primary hover:underline"
              >
                support@leavelab.com
              </a>
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

