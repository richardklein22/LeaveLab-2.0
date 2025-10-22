// POST /api/v1/subscriptions/checkout
// Creates a Stripe Checkout session for subscription

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse,
  handleStripeErrorResponse,
  handleDatabaseErrorResponse,
  handleErrorResponse,
} from '@/lib/utils/response';
import { 
  AuthenticationError, 
  ConflictError, 
  NotFoundError,
  ValidationError,
  isStripeError,
} from '@/lib/utils/errors';
import { logger, extractRequestContext } from '@/lib/utils/logger';
import { getOrCreateStripeCustomer, createCheckoutSession } from '@/features/subscriptions/lib/stripe-server';
import { getStripePriceId } from '@/features/subscriptions/lib/subscription-helpers';
import type { CheckoutSessionRequest } from '@/features/subscriptions/types/subscription';

export async function POST(request: NextRequest) {
  const context = extractRequestContext(request);
  logger.logRequest('POST', '/api/v1/subscriptions/checkout', context);
  
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Require authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to create a checkout session');
    }
    
    context.userId = user.id;
    
    // Parse and validate request body
    let body: CheckoutSessionRequest;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body');
    }
    
    const { tierId, billingCycle, trial = false, successUrl, cancelUrl } = body;
    
    // Validate required fields
    if (!tierId || !billingCycle) {
      throw new ValidationError('tierId and billingCycle are required', {
        tierId: !tierId ? ['Tier ID is required'] : [],
        billingCycle: !billingCycle ? ['Billing cycle is required'] : [],
      });
    }
    
    if (!['monthly', 'annual'].includes(billingCycle)) {
      throw new ValidationError('billingCycle must be "monthly" or "annual"', {
        billingCycle: ['Must be either "monthly" or "annual"'],
      });
    }
    
    logger.debug('Fetching subscription tier', { ...context, tierId });
    
    // Fetch the target tier
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .single();
    
    if (tierError) {
      logger.error('Failed to fetch tier', context, tierError);
      throw new NotFoundError('Subscription tier not found');
    }
    
    if (!tier) {
      throw new NotFoundError('Subscription tier not found');
    }
    
    // Don't allow checkout for free tier
    if (tier.name === 'free') {
      throw new ValidationError('Cannot create checkout session for free tier');
    }
    
    logger.debug('Checking current subscription', { ...context, tierName: tier.name });
    
    // Get user's current subscription
    const { data: currentSubscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('tier_id, stripe_subscription_id, status')
      .eq('user_id', user.id)
      .single();
    
    if (subError && subError.code !== 'PGRST116') {
      // PGRST116 = not found, which is ok
      logger.error('Failed to fetch current subscription', context, subError);
      throw new Error('Failed to check current subscription');
    }
    
    // Check if already subscribed to this tier with an active subscription
    if (currentSubscription?.tier_id === tierId && currentSubscription?.stripe_subscription_id) {
      if (['active', 'trialing'].includes(currentSubscription.status)) {
        throw new ConflictError(
          `You are already subscribed to the ${tier.display_name} plan. Please manage your subscription from the customer portal.`
        );
      }
    }
    
    // Get Stripe price ID
    const priceId = getStripePriceId(tier, billingCycle);
    
    if (!priceId) {
      logger.error('Missing Stripe price ID', { 
        ...context, 
        tierId, 
        tierName: tier.name,
        billingCycle 
      });
      throw new Error(
        'Pricing not configured for this subscription tier. Please contact support.'
      );
    }
    
    logger.debug('Fetching user profile', context);
    
    // Get user profile for email and name
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, display_name')
      .eq('id', user.id)
      .single();
    
    const userEmail = user.email || profile?.email;
    
    if (!userEmail) {
      throw new ValidationError('User email is required for checkout');
    }
    
    logger.debug('Creating or fetching Stripe customer', context);
    
    // Get or create Stripe customer
    let customerId: string;
    try {
      customerId = await getOrCreateStripeCustomer(
        user.id,
        userEmail,
        profile?.display_name || undefined
      );
    } catch (error) {
      logger.error('Failed to create Stripe customer', context, error);
      
      if (isStripeError(error)) {
        throw error;
      }
      
      throw new Error('Failed to create customer account. Please try again.');
    }
    
    // Determine trial days
    let trialDays = 0;
    if (trial && tier.features.has_trial && tier.features.trial_days) {
      trialDays = tier.features.trial_days;
      logger.debug('Trial enabled', { ...context, trialDays });
    }
    
    logger.debug('Creating Stripe checkout session', { 
      ...context, 
      customerId, 
      priceId,
      trialDays 
    });
    
    // Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let session;
    
    try {
      session = await createCheckoutSession({
        customerId,
        priceId,
        successUrl: successUrl || `${appUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: cancelUrl || `${appUrl}/pricing`,
        metadata: {
          userId: user.id,
          tierId,
          billingCycle,
        },
        trialDays,
      });
    } catch (error) {
      logger.error('Failed to create checkout session', context, error);
      
      if (isStripeError(error)) {
        throw error;
      }
      
      throw new Error('Failed to create checkout session. Please try again.');
    }
    
    const duration = Date.now() - startTime;
    logger.logResponse('POST', '/api/v1/subscriptions/checkout', 200, duration, {
      ...context,
      sessionId: session.id,
    });
    
    logger.logPayment('checkout_session_created', user.id, undefined, {
      ...context,
      tierId,
      billingCycle,
      trialDays,
    });
    
    return successResponse({
      sessionId: session.id,
      url: session.url,
    }, 200);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Checkout endpoint error', context, error);
    
    if (isStripeError(error)) {
      logger.logResponse('POST', '/api/v1/subscriptions/checkout', 500, duration, context);
      return handleStripeErrorResponse(error);
    }
    
    logger.logResponse(
      'POST', 
      '/api/v1/subscriptions/checkout', 
      500, 
      duration, 
      context
    );
    
    return handleErrorResponse(error);
  }
}
