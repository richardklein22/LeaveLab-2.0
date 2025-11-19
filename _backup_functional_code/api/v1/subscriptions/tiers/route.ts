// GET /api/v1/subscriptions/tiers
// Returns all available subscription tiers with pricing

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { calculatePricingInfo } from '@/features/subscriptions/lib/subscription-helpers';
import type { SubscriptionTier, TierResponse } from '@/features/subscriptions/types/subscription';
import { createCachedResponse, serverCache, cacheKeys, CACHE_DURATION, isContentFresh } from '@/lib/utils/cache';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Try to get from cache (only if not authenticated or guest)
    const cacheKey = user ? cacheKeys.subscriptionStatus(user.id) : cacheKeys.subscriptionTiers();
    const cached = serverCache.get(cacheKey);
    
    if (cached && !user) {
      // Return cached response for unauthenticated users
      return createCachedResponse(cached, {
        cacheType: 'subscription-tiers',
        status: 200,
      });
    }
    
    // Fetch all active tiers - optimized query with specific columns
    const { data: tiers, error: tiersError } = await supabase
      .from('subscription_tiers')
      .select('id, name, display_name, description, stripe_product_id, stripe_price_id_monthly, stripe_price_id_annual, price_monthly_pence, price_annual_pence, features, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (tiersError) {
      console.error('Error fetching tiers:', tiersError);
      return errorResponse('Failed to fetch subscription tiers', 500);
    }
    
    // Get user's current subscription if authenticated - optimized query
    let currentTierName: string | null = null;
    if (user) {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('tier:subscription_tiers!inner(name)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      currentTierName = (subscription as any)?.tier?.name || null;
    }
    
    // Format tiers for response
    const formattedTiers: TierResponse[] = (tiers as SubscriptionTier[]).map(tier => {
      const pricing = calculatePricingInfo(tier);
      
      const response: TierResponse = {
        id: tier.id,
        name: tier.name,
        displayName: tier.display_name,
        description: tier.description,
        pricing,
        features: {
          maxCourses: tier.features.max_courses,
          firstLessonOnly: tier.features.first_lesson_only,
          communityAccess: tier.features.community_access,
          emailSupport: tier.features.email_support,
          oneOnOneSupport: tier.features.one_on_one_support,
          visaInfo: tier.features.visa_info,
          accommodationInfo: tier.features.accommodation_info,
        },
        isCurrent: tier.name === currentTierName,
      };
      
      // Add trial info if available
      if (tier.features.has_trial && tier.features.trial_days) {
        response.trial = {
          days: tier.features.trial_days,
          available: true,
        };
      }
      
      // Add Stripe price IDs for paid tiers
      if (tier.name !== 'free') {
        response.stripeMonthlyPriceId = tier.stripe_price_id_monthly;
        response.stripeAnnualPriceId = tier.stripe_price_id_annual;
      }
      
      return response;
    });
    
    const responseData = { tiers: formattedTiers };
    
    // Cache the response
    if (!user) {
      serverCache.set(cacheKey, responseData, CACHE_DURATION.SUBSCRIPTION_TIERS);
    } else {
      serverCache.set(cacheKey, responseData, CACHE_DURATION.USER_DATA);
    }
    
    // Return with appropriate cache headers
    return createCachedResponse(responseData, {
      cacheType: user ? 'subscription-status' : 'subscription-tiers',
      status: 200,
    });
    
  } catch (error) {
    console.error('Error in /tiers endpoint:', error);
    return errorResponse('Internal server error', 500);
  }
}

