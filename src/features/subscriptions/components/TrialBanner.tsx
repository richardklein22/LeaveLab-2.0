/**
 * TrialBanner Component
 * 
 * Displays information about the free trial for Premium tier.
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { SUBSCRIPTION_MESSAGES } from '../constants/messages';

interface TrialBannerProps {
  trialDays?: number;
  className?: string;
}

export function TrialBanner({ className }: TrialBannerProps) {
  return (
    <Alert className={className}>
      <Sparkles className="h-4 w-4" />
      <AlertDescription className="ml-2">
        <span className="font-semibold">{SUBSCRIPTION_MESSAGES.TRIAL_BANNER}</span>
        <span className="text-muted-foreground ml-2">{SUBSCRIPTION_MESSAGES.TRIAL_SUBTEXT}</span>
      </AlertDescription>
    </Alert>
  );
}

