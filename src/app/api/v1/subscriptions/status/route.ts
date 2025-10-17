// GET /api/v1/subscriptions/status
// Returns current user's subscription status

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleErrorResponse, handleDatabaseErrorResponse } from '@/lib/utils/response';
import { AuthenticationError, NotFoundError, DatabaseError } from '@/lib/utils/errors';
import { logger, extractRequestContext } from '@/lib/utils/logger';
import {
  isTrialing,
  getTrialDaysRemaining,
  canUpgrade,
  canDowngrade,
  penceToGbp,
} from '@/features/subscriptions/lib/subscription-helpers';
import type { SubscriptionStatusResponse } from '@/features/subscriptions/types/subscription';
import { createCachedResponse, serverCache, cacheKeys, CACHE_DURATION } from '@/lib/utils/cache';
import { PerformanceTimer, createPerformanceMetrics } from '@/lib/utils/performance';

export async function GET(request: NextRequest) {
  const timer = new PerformanceTimer();
  const context = extractRequestContext(request);
  logger.logRequest('GET', '/api/v1/subscriptions/status', context);
  
  try {
    const supabase = await createClient();
    
    // Require authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to view subscription status');
    }
    
    context.userId = user.id;
    timer.mark('auth_complete');
    
    // Check cache first
    const cacheKey = cacheKeys.subscriptionStatus(user.id);
    const cached = serverCache.get(cacheKey);
    
    if (cached) {
      const metrics = createPerformanceMetrics('subscription_status', timer.elapsed(), 'api', {
        cached: true,
        userId: user.id,
      });
      logger.debug('Subscription status served from cache', {
        ...context,
        ...metrics,
      });
      
      return createCachedResponse(cached, {
        cacheType: 'subscription-status',
        status: 200,
      });
    }
    
    logger.debug('Fetching subscription status from database', context);
    
    // Get user's subscription with tier details - optimized query
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        user_id,
        tier_id,
        stripe_customer_id,
        stripe_subscription_id,
        stripe_price_id,
        status,
        billing_cycle,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        cancelled_at,
        trial_start,
        trial_end,
        tier:subscription_tiers!inner(
          id,
          name,
          display_name,
          price_monthly_pence,
          price_annual_pence
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (subscriptionError) {
      logger.error('Error fetching subscription', context, subscriptionError);
      
      if (subscriptionError.code === 'PGRST116') {
        throw new NotFoundError('No active subscription found');
      }
      
      throw new DatabaseError('Failed to fetch subscription status');
    }
    
    timer.mark('db_complete');
    
    const subscription = subscriptionData;
    const tier = (subscriptionData as any).tier;
    
    // Check if trialing
    const isOnTrial = isTrialing(subscription);
    const trialDaysRemaining = isOnTrial ? getTrialDaysRemaining(subscription) : 0;
    
    // Determine upgrade/downgrade options
    const tierName = tier.name;
    const canUpgradeToAny = tierName !== 'premium';
    const canDowngradeToAny = tierName !== 'free';
    
    const response: SubscriptionStatusResponse = {
      subscription: {
        tier: {
          id: tier.id,
          name: tier.name,
          displayName: tier.display_name,
        },
        status: subscription.status,
        canUpgrade: canUpgradeToAny,
        canDowngrade: canDowngradeToAny,
      },
    };
    
    // Add subscription details if not on free tier
    if (subscription.stripe_subscription_id) {
      response.subscription.id = subscription.id;
      response.subscription.billingCycle = subscription.billing_cycle;
      response.subscription.currentPeriodStart = subscription.current_period_start;
      response.subscription.currentPeriodEnd = subscription.current_period_end;
      response.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
      
      // Add trial info
      if (isOnTrial) {
        response.subscription.trial = {
          active: true,
          start: subscription.trial_start,
          end: subscription.trial_end,
          daysRemaining: trialDaysRemaining,
        };
      }
      
      // Add next billing info
      if (subscription.current_period_end && !subscription.cancel_at_period_end) {
        response.subscription.nextBillingDate = subscription.current_period_end;
        
        // Calculate next billing amount
        if (subscription.billing_cycle === 'monthly') {
          response.subscription.nextBillingAmount = penceToGbp(tier.price_monthly_pence);
        } else if (subscription.billing_cycle === 'annual') {
          response.subscription.nextBillingAmount = penceToGbp(tier.price_annual_pence);
        }
      }
    }
    
    // Cache the response
    serverCache.set(cacheKey, response, CACHE_DURATION.SUBSCRIPTION_STATUS);
    
    // Log performance
    const metrics = createPerformanceMetrics('subscription_status', timer.elapsed(), 'api', {
      cached: false,
      userId: user.id,
      dbTime: timer.measure('auth_complete', 'db_complete'),
    });
    
    if (metrics.rating === 'slow') {
      console.warn('[Performance] Slow subscription status query:', metrics);
    }
    
    return createCachedResponse(response, {
      cacheType: 'subscription-status',
      status: 200,
    });
    
  } catch (error) {
    const duration = timer.elapsed();
    logger.error('Subscription status endpoint error', {
      ...context,
      duration: `${duration}ms`,
    }, error);
    
    logger.logResponse('GET', '/api/v1/subscriptions/status', 500, duration, context);
    
    return handleErrorResponse(error);
  }
}

