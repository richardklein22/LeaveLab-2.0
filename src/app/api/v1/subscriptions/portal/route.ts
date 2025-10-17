// POST /api/v1/subscriptions/portal
// Creates a Stripe Customer Portal session

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  successResponse, 
  handleStripeErrorResponse,
  handleErrorResponse,
} from '@/lib/utils/response';
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  isStripeError,
} from '@/lib/utils/errors';
import { logger, extractRequestContext } from '@/lib/utils/logger';
import { createCustomerPortalSession } from '@/features/subscriptions/lib/stripe-server';
import type { CustomerPortalRequest } from '@/features/subscriptions/types/subscription';

export async function POST(request: NextRequest) {
  const context = extractRequestContext(request);
  logger.logRequest('POST', '/api/v1/subscriptions/portal', context);
  
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    
    // Require authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to access the customer portal');
    }
    
    context.userId = user.id;
    
    // Parse request body
    let body: CustomerPortalRequest;
    try {
      body = await request.json();
    } catch (error) {
      // Empty body is acceptable
      body = {};
    }
    
    const { returnUrl } = body;
    
    logger.debug('Fetching user subscription', context);
    
    // Get user's Stripe customer ID
    const { data: subscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', user.id)
      .single();
    
    if (subscriptionError) {
      logger.error('Failed to fetch subscription', context, subscriptionError);
      
      if (subscriptionError.code === 'PGRST116') {
        throw new NotFoundError(
          'No subscription found. Please subscribe to a plan first.'
        );
      }
      
      throw new Error('Failed to fetch subscription information');
    }
    
    if (!subscription) {
      throw new NotFoundError(
        'No subscription found. Please subscribe to a plan first.'
      );
    }
    
    if (!subscription.stripe_customer_id) {
      throw new NotFoundError(
        'No billing account found. Please create a subscription first to access the customer portal.'
      );
    }
    
    logger.debug('Creating customer portal session', {
      ...context,
      customerId: subscription.stripe_customer_id,
    });
    
    // Create Customer Portal session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let portalSession;
    
    try {
      portalSession = await createCustomerPortalSession(
        subscription.stripe_customer_id,
        returnUrl || `${appUrl}/subscription`
      );
    } catch (error) {
      logger.error('Failed to create portal session', context, error);
      
      if (isStripeError(error)) {
        throw error;
      }
      
      throw new Error('Failed to create customer portal session. Please try again.');
    }
    
    const duration = Date.now() - startTime;
    logger.logResponse('POST', '/api/v1/subscriptions/portal', 200, duration, {
      ...context,
      portalUrl: portalSession.url,
    });
    
    return successResponse({
      url: portalSession.url,
    }, 200);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Portal endpoint error', context, error);
    
    if (isStripeError(error)) {
      logger.logResponse('POST', '/api/v1/subscriptions/portal', 500, duration, context);
      return handleStripeErrorResponse(error);
    }
    
    logger.logResponse(
      'POST',
      '/api/v1/subscriptions/portal',
      500,
      duration,
      context
    );
    
    return handleErrorResponse(error);
  }
}

