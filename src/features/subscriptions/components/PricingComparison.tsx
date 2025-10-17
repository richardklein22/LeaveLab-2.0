/**
 * PricingComparison Component
 * 
 * Displays all subscription tiers with toggle for billing cycle.
 * Fetches tiers from API and handles checkout flow.
 */

'use client';

import { useState, useEffect } from 'react';
import { PricingToggle } from './PricingToggle';
import { PricingCard } from './PricingCard';
import { TrialBanner } from './TrialBanner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useCheckout } from '../hooks/useCheckout';
import { BILLING_CYCLES, type BillingCycle } from '../constants/tiers';
import { SUBSCRIPTION_MESSAGES } from '../constants/messages';
import type { TierResponse } from '../types/subscription';

interface PricingComparisonProps {
  defaultBillingCycle?: BillingCycle;
  className?: string;
}

export function PricingComparison({
  defaultBillingCycle = BILLING_CYCLES.ANNUAL,
  className,
}: PricingComparisonProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(defaultBillingCycle);
  const [tiers, setTiers] = useState<TierResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { createCheckoutSession, isLoading: isCheckoutLoading, error: checkoutError } = useCheckout();

  // Fetch tiers on mount
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/v1/subscriptions/tiers', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load pricing');
        }

        const data = await response.json();
        setTiers(data.tiers || []);
      } catch (err) {
        console.error('[PricingComparison] Error fetching tiers:', err);
        setError(SUBSCRIPTION_MESSAGES.ERROR_LOADING_TIERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const handleSubscribe = async (tierId: string, hasTrial: boolean) => {
    await createCheckoutSession({
      tierId,
      billingCycle,
      trial: hasTrial,
    });
  };

  // Convert tier features to array format for PricingCard
  const formatFeatures = (tier: TierResponse) => {
    const features = tier.features;
    const featureList: Array<{ name: string; included: boolean }> = [];

    // Course access
    const maxCourses = features.maxCourses;
    if (maxCourses !== null && maxCourses !== 0) {
      if (maxCourses === -1) {
        featureList.push({
          name: 'Unlimited courses',
          included: true,
        });
      } else {
        featureList.push({
          name: `${maxCourses} full course${maxCourses !== 1 ? 's' : ''}`,
          included: true,
        });
      }
    } else {
      featureList.push({
        name: 'Course access',
        included: false,
      });
    }

    // Community access
    featureList.push({
      name: 'Community access',
      included: features.communityAccess,
    });

    // Visa info
    const visaInfoLevel = features.visaInfo;
    if (visaInfoLevel && visaInfoLevel !== 'none') {
      featureList.push({
        name: visaInfoLevel === 'all' ? 'All visa information' : `${visaInfoLevel.replace('_', '-')} visa info`,
        included: true,
      });
    } else {
      featureList.push({
        name: 'Visa information',
        included: false,
      });
    }

    // Accommodation info
    const accommodationLevel = features.accommodationInfo;
    if (accommodationLevel && accommodationLevel !== 'none') {
      featureList.push({
        name: accommodationLevel === 'all' ? 'All accommodation info' : `${accommodationLevel.replace('_', '-')} accommodation info`,
        included: true,
      });
    } else {
      featureList.push({
        name: 'Accommodation information',
        included: false,
      });
    }

    // Support
    if (features.oneOnOneSupport) {
      featureList.push({
        name: '1-on-1 support',
        included: true,
      });
    } else if (features.emailSupport) {
      featureList.push({
        name: 'Email support',
        included: true,
      });
    } else {
      featureList.push({
        name: 'Priority support',
        included: false,
      });
    }

    return featureList;
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="text-center py-20">
          <div className="inline-block animate-pulse-scale">
            <div className="w-16 h-16 rounded-full glass-red mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-brand-red animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 text-lg">{SUBSCRIPTION_MESSAGES.LOADING_PRICING}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive" className="glass-red border-brand-red/50">
          <AlertCircle className="h-5 w-5 text-brand-red" />
          <AlertDescription className="text-gray-300">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const premiumTier = tiers.find((t) => t.name === 'premium');
  const showTrialBanner = premiumTier && premiumTier.trial?.available;

  return (
    <div className={className}>
      {/* Billing Cycle Toggle */}
      <div className="mb-8">
        <PricingToggle value={billingCycle} onChange={setBillingCycle} />
      </div>

      {/* Trial Banner (for Premium) */}
      {showTrialBanner && !premiumTier?.isCurrent && (
        <TrialBanner trialDays={premiumTier.trial?.days} className="mb-8" />
      )}

      {/* Checkout Error */}
      {checkoutError && (
        <Alert variant="destructive" className="mb-8 glass-red border-brand-red/50">
          <AlertCircle className="h-5 w-5 text-brand-red" />
          <AlertDescription className="text-gray-300">{checkoutError}</AlertDescription>
        </Alert>
      )}

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8 items-start pt-6">
        {tiers.map((tier, index) => {
          const isPopular = tier.name === 'premium';
          const hasTrial = tier.trial?.available || false;
          const features = formatFeatures(tier);

          return (
            <div
              key={tier.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms`, animationDuration: '500ms' }}
            >
              <PricingCard
                name={tier.name}
                displayName={tier.displayName}
                description={tier.description}
                monthlyPrice={tier.pricing.monthly}
                annualPrice={tier.pricing.annual}
                billingCycle={billingCycle}
                features={features}
                isCurrent={tier.isCurrent}
                isPopular={isPopular}
                hasTrial={hasTrial}
                trialDays={tier.trial?.days}
                onSubscribe={() => handleSubscribe(tier.id, hasTrial)}
                isLoading={isCheckoutLoading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

