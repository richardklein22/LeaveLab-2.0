// Subscription helper utilities
import type { SubscriptionTier, UserSubscription, PricingInfo, BillingCycle } from '../types/subscription';

/**
 * Format price in pence to GBP string
 */
export function formatPrice(pence: number): string {
  const pounds = pence / 100;
  return `£${pounds.toFixed(2)}`;
}

/**
 * Convert pence to GBP number
 */
export function penceToGbp(pence: number): number {
  return pence / 100;
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(monthlyPence: number, annualPence: number): {
  savings: number; // in GBP
  savingsPercent: number;
  annualMonthly: number; // effective monthly price
} {
  const monthlyTotal = monthlyPence * 12;
  const savingsPence = monthlyTotal - annualPence;
  const savingsPercent = Math.round((savingsPence / monthlyTotal) * 100);
  const annualMonthlyPence = annualPence / 12;
  
  return {
    savings: penceToGbp(savingsPence),
    savingsPercent,
    annualMonthly: penceToGbp(annualMonthlyPence),
  };
}

/**
 * Calculate pricing info for a tier
 */
export function calculatePricingInfo(tier: SubscriptionTier): PricingInfo {
  const monthly = penceToGbp(tier.price_monthly_pence);
  const annual = penceToGbp(tier.price_annual_pence);
  
  const pricing: PricingInfo = {
    monthly,
    annual,
    currency: 'GBP',
  };
  
  // Add savings info for paid tiers
  if (tier.price_monthly_pence > 0 && tier.price_annual_pence > 0) {
    const savingsInfo = calculateAnnualSavings(
      tier.price_monthly_pence,
      tier.price_annual_pence
    );
    pricing.annualMonthly = savingsInfo.annualMonthly;
    pricing.savings = savingsInfo.savings;
    pricing.savingsPercent = savingsInfo.savingsPercent;
  }
  
  return pricing;
}

/**
 * Check if user is currently on a trial
 */
export function isTrialing(subscription: UserSubscription): boolean {
  if (!subscription.trial_end) {
    return false;
  }
  
  const trialEnd = new Date(subscription.trial_end);
  const now = new Date();
  
  return trialEnd > now && subscription.status === 'trialing';
}

/**
 * Calculate days remaining in trial
 */
export function getTrialDaysRemaining(subscription: UserSubscription): number {
  if (!subscription.trial_end || !isTrialing(subscription)) {
    return 0;
  }
  
  const trialEnd = new Date(subscription.trial_end);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Check if user can upgrade to a tier
 */
export function canUpgrade(currentTierName: string, targetTierName: string): boolean {
  const tierOrder = { free: 0, basic: 1, premium: 2 };
  const currentOrder = tierOrder[currentTierName as keyof typeof tierOrder] ?? 0;
  const targetOrder = tierOrder[targetTierName as keyof typeof tierOrder] ?? 0;
  
  return targetOrder > currentOrder;
}

/**
 * Check if user can downgrade to a tier
 */
export function canDowngrade(currentTierName: string, targetTierName: string): boolean {
  const tierOrder = { free: 0, basic: 1, premium: 2 };
  const currentOrder = tierOrder[currentTierName as keyof typeof tierOrder] ?? 0;
  const targetOrder = tierOrder[targetTierName as keyof typeof tierOrder] ?? 0;
  
  return targetOrder < currentOrder;
}

/**
 * Get the appropriate Stripe price ID for a tier and billing cycle
 */
export function getStripePriceId(
  tier: SubscriptionTier,
  billingCycle: BillingCycle
): string | null {
  if (billingCycle === 'monthly') {
    return tier.stripe_price_id_monthly;
  } else {
    return tier.stripe_price_id_annual;
  }
}

/**
 * Format subscription status for display
 */
export function formatSubscriptionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'Active',
    trialing: 'Trialling',
    past_due: 'Past Due',
    cancelled: 'Cancelled',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    unpaid: 'Unpaid',
  };
  
  return statusMap[status] || status;
}

/**
 * Check if subscription is active (including trial)
 */
export function isSubscriptionActive(subscription: UserSubscription): boolean {
  return subscription.status === 'active' || subscription.status === 'trialing';
}

