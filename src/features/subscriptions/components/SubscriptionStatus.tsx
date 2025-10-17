/**
 * SubscriptionStatus Component
 * 
 * Displays the user's current subscription status, tier, and billing information.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { SUBSCRIPTION_MESSAGES } from '../constants/messages';
import type { UserSubscriptionResponse } from '../types/subscription';

interface SubscriptionStatusProps {
  subscription: UserSubscriptionResponse | null;
  className?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function SubscriptionStatus({ subscription, className }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>You&apos;re currently on the free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Free</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    tier,
    status,
    billingCycle,
    trial,
    nextBillingDate,
    nextBillingAmount,
    cancelAtPeriodEnd,
    currentPeriodEnd,
  } = subscription;

  // Status badge variant
  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trialing':
        return 'secondary';
      case 'past_due':
      case 'unpaid':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return SUBSCRIPTION_MESSAGES.STATUS_ACTIVE;
      case 'trialing':
        return SUBSCRIPTION_MESSAGES.STATUS_TRIALING;
      case 'past_due':
        return SUBSCRIPTION_MESSAGES.STATUS_PAST_DUE;
      case 'cancelled':
        return SUBSCRIPTION_MESSAGES.STATUS_CANCELLED;
      case 'unpaid':
        return SUBSCRIPTION_MESSAGES.STATUS_UNPAID;
      case 'incomplete':
        return SUBSCRIPTION_MESSAGES.STATUS_INCOMPLETE;
      default:
        return status;
    }
  };

  const showTrialInfo = trial?.active && trial.daysRemaining !== undefined;
  const showCancellationWarning = cancelAtPeriodEnd && currentPeriodEnd;
  const showPaymentIssue = status === 'past_due' || status === 'unpaid';

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Your subscription details and billing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tier and Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{tier.displayName}</h3>
              <p className="text-sm text-muted-foreground capitalize">{billingCycle} billing</p>
            </div>
            <Badge variant={getStatusVariant(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>

          {/* Trial Info */}
          {showTrialInfo && trial.daysRemaining !== undefined && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {SUBSCRIPTION_MESSAGES.TRIAL_ACTIVE(trial.daysRemaining)}
              </AlertDescription>
            </Alert>
          )}

          {/* Cancellation Warning */}
          {showCancellationWarning && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {SUBSCRIPTION_MESSAGES.SUBSCRIPTION_WILL_CANCEL(formatDate(currentPeriodEnd))}
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Issue */}
          {showPaymentIssue && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {SUBSCRIPTION_MESSAGES.PAYMENT_METHOD_UPDATE_REQUIRED}
              </AlertDescription>
            </Alert>
          )}

          {/* Next Billing */}
          {nextBillingDate && nextBillingAmount && !cancelAtPeriodEnd && status === 'active' && (
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Next payment</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(nextBillingDate)} — {formatCurrency(nextBillingAmount)}
                </p>
              </div>
            </div>
          )}

          {/* Upgrade/Downgrade Options */}
          <div className="pt-4 border-t space-y-2">
            {subscription.canUpgrade && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Upgrade available</p>
                  <p className="text-sm text-muted-foreground">
                    Get access to more features with Premium
                  </p>
                </div>
              </div>
            )}
            {subscription.canDowngrade && (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Change plan</p>
                  <p className="text-sm text-muted-foreground">
                    Manage your subscription in the billing portal
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

