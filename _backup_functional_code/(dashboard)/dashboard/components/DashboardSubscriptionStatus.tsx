'use client';

import Link from 'next/link';
import { useSubscription } from '@/features/subscriptions/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface DashboardSubscriptionStatusProps {
  showUpgradePrompt?: boolean;
}

export function DashboardSubscriptionStatus({ 
  showUpgradePrompt = false 
}: DashboardSubscriptionStatusProps) {
  const { subscription, isLoading } = useSubscription();

  // Loading state
  if (isLoading) {
    if (showUpgradePrompt) {
      return null; // Don't show anything while loading for the prompt variant
    }
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Determine current tier
  const tierName = subscription?.tier.name || 'free';
  const displayName = subscription?.tier.displayName || 'Free';
  const isFreeTier = tierName === 'free';
  const isBasicTier = tierName === 'basic';
  const isPremiumTier = tierName === 'premium';

  // Get badge styling based on tier
  const getBadgeVariant = () => {
    if (isPremiumTier) return 'default';
    if (isBasicTier) return 'secondary';
    return 'outline';
  };

  const getBadgeClassName = () => {
    if (isPremiumTier) return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0';
    if (isBasicTier) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'border-gray-300';
  };

  // Render tier badge and upgrade button in header
  if (!showUpgradePrompt) {
    return (
      <div className="flex items-center gap-3">
        {/* Tier Badge */}
        <Badge 
          variant={getBadgeVariant()} 
          className={`px-3 py-1 text-sm ${getBadgeClassName()}`}
        >
          {isPremiumTier && <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
          {displayName} Plan
        </Badge>

        {/* Upgrade Button - Show for Free and Basic tiers */}
        {!isPremiumTier && (
          <Link href="/pricing">
            <Button 
              size="sm" 
              className="tap-target"
              variant={isFreeTier ? "default" : "outline"}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    );
  }

  // Render upgrade prompt for Free tier users
  if (showUpgradePrompt && isFreeTier) {
    return (
      <Alert className="border-blue-200 bg-blue-50/50">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-900">Unlock Premium Features</AlertTitle>
        <AlertDescription className="text-blue-800">
          <p className="mb-3">
            You&apos;re currently on the <strong>Free Plan</strong>. Upgrade to unlock advanced features, 
            increased limits, and priority support.
          </p>
          <Link href="/pricing">
            <Button size="sm" className="tap-target">
              View Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  // Render upgrade prompt for Basic tier users (subtle)
  if (showUpgradePrompt && isBasicTier) {
    return (
      <Alert className="border-purple-200 bg-purple-50/50">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <AlertTitle className="text-purple-900">Upgrade to Premium</AlertTitle>
        <AlertDescription className="text-purple-800">
          <p className="mb-3">
            Get the most out of LeaveLab with <strong>Premium</strong>. Enjoy unlimited access, 
            advanced analytics, and exclusive features.
          </p>
          <Link href="/pricing">
            <Button size="sm" variant="outline" className="tap-target border-purple-300 hover:bg-purple-100">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show upgrade prompt for Premium users
  return null;
}

