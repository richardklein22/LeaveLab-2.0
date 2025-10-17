/**
 * Subscription Messages (British English)
 * 
 * User-facing messages for subscription flows, errors, and notifications.
 */

export const SUBSCRIPTION_MESSAGES = {
  // Checkout
  CHECKOUT_LOADING: 'Redirecting to checkout...',
  CHECKOUT_SUCCESS: 'Subscription created successfully!',
  CHECKOUT_CANCELLED: 'Checkout cancelled. You can try again anytime.',
  CHECKOUT_ERROR: 'Unable to start checkout. Please try again.',
  
  // Trial
  TRIAL_ACTIVE: (days: number) => `${days} day${days !== 1 ? 's' : ''} remaining in your free trial`,
  TRIAL_BANNER: 'Try Premium free for 7 days',
  TRIAL_SUBTEXT: 'No charge today. Cancel anytime.',
  TRIAL_ENDING_SOON: (days: number) => `Your trial ends in ${days} day${days !== 1 ? 's' : ''}`,
  
  // Subscription Management
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled',
  SUBSCRIPTION_WILL_CANCEL: (date: string) => `Your subscription will end on ${date}`,
  SUBSCRIPTION_REACTIVATED: 'Subscription reactivated',
  
  // Portal
  PORTAL_LOADING: 'Opening billing portal...',
  PORTAL_ERROR: 'Unable to open billing portal. Please try again.',
  NO_SUBSCRIPTION: 'You don\'t have an active subscription',
  
  // Upgrade Prompts
  UPGRADE_REQUIRED: (tier: string) => `This content requires a ${tier} membership`,
  UPGRADE_TO_ACCESS: (tier: string) => `Upgrade to ${tier} to access this content`,
  UPGRADE_CTA: (tier: string) => `Upgrade to ${tier}`,
  
  // Errors
  ERROR_LOADING_SUBSCRIPTION: 'Unable to load subscription details',
  ERROR_LOADING_TIERS: 'Unable to load pricing information',
  ERROR_CREATING_CHECKOUT: 'Unable to create checkout session',
  ERROR_INVALID_TIER: 'Invalid subscription tier selected',
  ERROR_ALREADY_SUBSCRIBED: 'You already have an active subscription to this tier',
  ERROR_PAYMENT_FAILED: 'Payment failed. Please update your payment method.',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  
  // Success Messages
  SUCCESS_SUBSCRIBED: (tier: string) => `Successfully subscribed to ${tier}!`,
  SUCCESS_UPGRADED: (tier: string) => `Successfully upgraded to ${tier}!`,
  SUCCESS_DOWNGRADED: (tier: string) => `Successfully downgraded to ${tier}`,
  
  // Billing
  NEXT_BILLING: (date: string, amount: string) => `Next billing: ${date} for ${amount}`,
  PAYMENT_METHOD_UPDATE_REQUIRED: 'Please update your payment method',
  
  // Status Labels
  STATUS_ACTIVE: 'Active',
  STATUS_TRIALING: 'Trial',
  STATUS_PAST_DUE: 'Past Due',
  STATUS_CANCELLED: 'Cancelled',
  STATUS_UNPAID: 'Unpaid',
  STATUS_INCOMPLETE: 'Incomplete',
  
  // Cancellation
  CANCEL_CONFIRMATION: 'Are you sure you want to cancel your subscription?',
  CANCEL_DETAIL: 'You\'ll keep access until the end of your billing period',
  CANCEL_BUTTON: 'Yes, cancel subscription',
  CANCEL_KEEP: 'Keep subscription',
  
  // Loading States
  LOADING: 'Loading...',
  LOADING_PRICING: 'Loading pricing...',
  LOADING_SUBSCRIPTION: 'Loading subscription...',
} as const;

export const FAQ_ITEMS = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be charged a prorated amount. If you downgrade, the change will take effect at the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment partner, Stripe. All payments are processed securely with PCI-DSS compliance.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. When you cancel, you\'ll keep full access to your subscription benefits until the end of your current billing period. No refunds are provided for partial periods.',
  },
  {
    question: 'What\'s included in the free trial?',
    answer: 'The Premium plan includes a 7-day free trial with full access to all Premium features. You can cancel anytime during the trial period without being charged. After the trial, you\'ll be charged the monthly or annual rate you selected.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee on all paid subscriptions. If you\'re not satisfied within the first 14 days, contact us for a full refund.',
  },
  {
    question: 'What happens if my payment fails?',
    answer: 'If a payment fails, we\'ll retry the charge and send you an email notification. You\'ll have a grace period to update your payment method. If the payment continues to fail, your subscription may be cancelled.',
  },
  {
    question: 'Are prices in British Pounds?',
    answer: 'Yes, all prices are listed in GBP (£). If you\'re paying from outside the UK, your bank may apply currency conversion fees.',
  },
  {
    question: 'Can I get a receipt for my subscription?',
    answer: 'Yes, you\'ll receive an email receipt for each payment. You can also view and download all invoices from your billing portal.',
  },
] as const;

