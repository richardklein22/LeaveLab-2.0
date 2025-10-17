/**
 * PricingCard Component
 * 
 * Displays a subscription tier with pricing, features, and subscribe button.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BillingCycle } from '../constants/tiers';

interface PricingCardProps {
  name: string;
  displayName: string;
  description?: string;
  monthlyPrice: number;
  annualPrice?: number;
  billingCycle: BillingCycle;
  features: Array<{
    name: string;
    included: boolean;
  }>;
  isCurrent?: boolean;
  isPopular?: boolean;
  hasTrial?: boolean;
  trialDays?: number;
  onSubscribe?: () => void;
  isLoading?: boolean;
  className?: string;
}

function formatPrice(pounds: number): string {
  return `£${pounds.toFixed(2)}`;
}

export function PricingCard({
  displayName,
  description,
  monthlyPrice,
  annualPrice,
  billingCycle,
  features,
  isCurrent = false,
  isPopular = false,
  hasTrial = false,
  trialDays = 7,
  onSubscribe,
  isLoading = false,
  className,
}: PricingCardProps) {
  const isFree = monthlyPrice === 0;
  const isAnnual = billingCycle === 'annual';

  // Calculate displayed price
  let displayPrice = formatPrice(monthlyPrice);
  const displayPeriod = '/month';
  let savingsText: string | null = null;

  if (isAnnual && annualPrice) {
    const annualMonthly = annualPrice / 12;
    displayPrice = formatPrice(annualMonthly);
    const savings = monthlyPrice * 12 - annualPrice;
    savingsText = `Save ${formatPrice(savings)}/year`;
  }

  return (
    <Card
      className={cn(
        'relative flex flex-col bg-brand-dark-900 border-white/10 card-3d transition-all duration-300',
        isPopular && 'border-brand-red/50 shadow-2xl shadow-brand-red/20',
        isCurrent && 'ring-2 ring-brand-red',
        className
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 animate-pulse-scale">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-red px-4 py-1.5 text-xs font-bold text-white shadow-lg">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Current Tier Badge */}
      {isCurrent && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent px-4 py-1.5 text-xs font-bold text-white shadow-lg">
            <Check className="h-3 w-3" />
            Current Plan
          </span>
        </div>
      )}

      {/* Gradient Overlay for Popular */}
      {isPopular && (
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/10 to-transparent pointer-events-none" />
      )}

      <CardHeader className="text-center pb-4 relative z-10">
        <CardTitle className="text-3xl font-black text-white">{displayName}</CardTitle>
        {description && (
          <CardDescription className="mt-2 text-gray-400">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-6 relative z-10">
        {/* Pricing */}
        <div className="text-center space-y-2">
          {isFree ? (
            <div className="text-5xl font-black text-white">Free</div>
          ) : (
            <>
              <div className="text-5xl font-black text-white">
                {displayPrice}
                <span className="text-xl font-normal text-gray-400">
                  {displayPeriod}
                </span>
              </div>
              {savingsText && (
                <div className="inline-flex items-center gap-1 rounded-full bg-brand-accent/20 px-3 py-1 text-sm text-brand-accent font-bold">
                  {savingsText}
                </div>
              )}
              {isAnnual && annualPrice && (
                <div className="text-sm text-gray-500">
                  Billed {formatPrice(annualPrice)} annually
                </div>
              )}
            </>
          )}
        </div>

        {/* Trial Info */}
        {hasTrial && !isCurrent && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full glass-red px-4 py-2 text-sm font-semibold text-brand-red-200 animate-pulse-scale">
              <Sparkles className="h-4 w-4" />
              {trialDays}-day free trial
            </div>
          </div>
        )}

        {/* Features List */}
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check
                className={cn(
                  'h-5 w-5 shrink-0 mt-0.5',
                  feature.included
                    ? 'text-brand-red'
                    : 'text-gray-600'
                )}
              />
              <span
                className={cn(
                  'text-base',
                  feature.included ? 'text-gray-300' : 'text-gray-600 line-through'
                )}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="relative z-10">
        <Button
          className={cn(
            "w-full min-h-[44px] magnetic-button font-bold text-base",
            isPopular 
              ? 'bg-brand-red hover:bg-brand-red-600 text-white' 
              : 'glass border-white/20 text-white hover:bg-white/10 hover:border-brand-red/50'
          )}
          size="lg"
          disabled={isCurrent || isLoading || isFree}
          onClick={onSubscribe}
        >
          {isLoading
            ? 'Loading...'
            : isCurrent
            ? 'Current Plan'
            : isFree
            ? 'Always Free'
            : `Get ${displayName}`}
        </Button>
      </CardFooter>
    </Card>
  );
}

