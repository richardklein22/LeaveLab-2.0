// Stripe-specific type definitions
import Stripe from 'stripe';

// Stripe Webhook Event Types
export type StripeWebhookEvent = 
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'customer.subscription.trial_will_end';

// Checkout Session Metadata
export interface CheckoutSessionMetadata {
  userId: string;
  tierId: string;
  billingCycle: 'monthly' | 'annual';
}

// Webhook Event Payload (for n8n)
export interface N8nWebhookPayload {
  event: string;
  timestamp: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  subscription: {
    id: string;
    tier: 'basic' | 'premium';
    billingCycle: 'monthly' | 'annual';
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  payment: {
    amountGbp: number;
    currency: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripeInvoiceId?: string;
  };
  trial: {
    active: boolean;
    daysRemaining: number;
  };
}

// Stripe Event Handler Response
export interface StripeEventHandlerResult {
  success: boolean;
  error?: string;
  n8nSent?: boolean;
}

