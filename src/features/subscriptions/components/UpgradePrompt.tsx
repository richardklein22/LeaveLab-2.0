/**
 * UpgradePrompt Component
 * 
 * Displays a prompt to upgrade when user tries to access locked content.
 */

'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_MESSAGES } from '../constants/messages';

interface UpgradePromptProps {
  requiredTier: string;
  contentType?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function UpgradePrompt({
  requiredTier,
  title,
  description,
  className,
}: UpgradePromptProps) {
  const defaultTitle = SUBSCRIPTION_MESSAGES.UPGRADE_REQUIRED(requiredTier);
  const defaultDescription = SUBSCRIPTION_MESSAGES.UPGRADE_TO_ACCESS(requiredTier);

  return (
    <Alert className={className}>
      <Lock className="h-4 w-4" />
      <AlertTitle>{title || defaultTitle}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">{description || defaultDescription}</p>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/pricing">
            {SUBSCRIPTION_MESSAGES.UPGRADE_CTA(requiredTier)}
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Inline upgrade prompt (smaller, more subtle)
 */
export function InlineUpgradePrompt({
  requiredTier,
  className,
}: {
  requiredTier: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2 rounded-md border border-muted bg-muted/50 px-3 py-1.5 text-sm">
        <Lock className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">
          Requires {requiredTier}
        </span>
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
          <Link href="/pricing">Upgrade</Link>
        </Button>
      </div>
    </div>
  );
}

