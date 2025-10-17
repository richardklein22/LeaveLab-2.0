// Subscription type definitions

export type BillingCycle = 'monthly' | 'annual';

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'cancelled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid';

export interface TierFeatures {
  max_courses: number | null; // null = unlimited
  first_lesson_only: boolean;
  community_access: boolean;
  email_support: boolean;
  one_on_one_support: boolean;
  visa_info: 'none' | 'short_term' | 'all';
  accommodation_info: 'none' | 'short_term' | 'all';
  has_trial: boolean;
  trial_days: number | null;
}

export interface SubscriptionTier {
  id: string;
  name: 'free' | 'basic' | 'premium';
  display_name: string;
  description: string;
  stripe_product_id: string | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_annual: string | null;
  price_monthly_pence: number;
  price_annual_pence: number;
  features: TierFeatures;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_source: 'stripe' | 'system' | 'user' | 'n8n';
  stripe_event_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  metadata: Record<string, unknown> | null;
  processed: boolean;
  processed_at: string | null;
  error: string | null;
  created_at: string;
}

// API Response types
export interface PricingInfo {
  monthly: number; // in GBP
  annual: number; // in GBP
  annualMonthly?: number; // effective monthly price for annual
  savings?: number; // total savings on annual
  savingsPercent?: number; // percentage savings
  currency: 'GBP';
}

export interface TrialInfo {
  days: number;
  available: boolean;
}

export interface TierResponse {
  id: string;
  name: string;
  displayName: string;
  description: string;
  pricing: PricingInfo;
  features: {
    maxCourses: number | null;
    firstLessonOnly: boolean;
    communityAccess: boolean;
    emailSupport: boolean;
    oneOnOneSupport: boolean;
    visaInfo: 'none' | 'short_term' | 'all';
    accommodationInfo: 'none' | 'short_term' | 'all';
  };
  trial?: TrialInfo;
  isCurrent: boolean;
  stripeMonthlyPriceId?: string | null;
  stripeAnnualPriceId?: string | null;
}

// API Response type for user's subscription status
export interface UserSubscriptionResponse {
  id?: string;
  tier: {
    id: string;
    name: string;
    displayName: string;
    features?: TierResponse['features'];
  };
  status: SubscriptionStatus;
  billingCycle?: BillingCycle | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  trial?: {
    active: boolean;
    start?: string | null;
    end?: string | null;
    daysRemaining?: number;
  };
  canUpgrade: boolean;
  canDowngrade: boolean;
  nextBillingDate?: string | null;
  nextBillingAmount?: number | null;
}

export interface SubscriptionStatusResponse {
  subscription: UserSubscriptionResponse;
}

export interface CheckoutSessionRequest {
  tierId: string;
  billingCycle: BillingCycle;
  trial?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface CustomerPortalRequest {
  returnUrl?: string;
}

export interface CustomerPortalResponse {
  url: string;
}

