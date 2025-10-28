/**
 * Premium Data API Endpoint (Demo)
 * 
 * This is a demonstration API endpoint that requires Premium subscription access.
 * It showcases how to use the subscription middleware to protect API routes
 * on the server side.
 * 
 * @route GET /api/v1/premium/data
 * @access Premium subscribers only
 */

import { NextRequest } from 'next/server';
import { requireSubscription } from '@/lib/utils/subscription-middleware';
import { successResponse } from '@/lib/utils/response';

/**
 * GET /api/v1/premium/data
 * 
 * Returns premium-only data for authenticated Premium subscribers.
 * 
 * @returns JSON response with premium data
 * 
 * Response codes:
 * - 200: Success - User has Premium access
 * - 401: Unauthorized - User is not authenticated
 * - 403: Forbidden - User doesn't have Premium subscription
 * - 500: Internal server error
 * 
 * @example
 * ```typescript
 * // Client-side usage:
 * const response = await fetch('/api/v1/premium/data', {
 *   method: 'GET',
 *   credentials: 'include',
 * });
 * 
 * if (response.ok) {
 *   const data = await response.json();
 *   console.log(data.analytics, data.insights);
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // Require Premium subscription to access this endpoint
    const { authorized, error, userId, currentTierDisplay } = await requireSubscription('premium');

    // If not authorized, return the error response
    if (!authorized) {
      console.log('[premium/data] Access denied - insufficient subscription');
      return error;
    }

    console.log('[premium/data] Access granted for user:', userId);

    // User has Premium access - return premium data
    const premiumData = {
      // Example: Advanced analytics data
      analytics: {
        visitorTrends: {
          last30Days: 15420,
          growth: '+12.5%',
          topCountries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
          peakHours: ['14:00-16:00 UTC', '20:00-22:00 UTC'],
        },
        engagement: {
          avgSessionDuration: '8m 42s',
          bounceRate: '32.4%',
          pagesPerSession: 4.2,
          conversionRate: '3.8%',
        },
      },

      // Example: Exclusive insights
      insights: {
        personalizedRecommendations: [
          {
            id: 1,
            title: 'Best Long-term Visa Options for Your Profile',
            description: 'Based on your activity, these visa options may be ideal for you.',
            relevanceScore: 95,
          },
          {
            id: 2,
            title: 'Top Accommodation Deals in Your Preferred Cities',
            description: 'Exclusive deals on long-term rentals in Barcelona, Lisbon, and Chiang Mai.',
            relevanceScore: 88,
          },
          {
            id: 3,
            title: 'Immigration Policy Changes Affecting Digital Nomads',
            description: 'Recent updates that may impact your travel plans.',
            relevanceScore: 82,
          },
        ],
      },

      // Example: Premium resources
      resources: {
        downloadableGuides: [
          {
            id: 'guide-1',
            title: 'Complete Digital Nomad Tax Guide 2025',
            format: 'PDF',
            pages: 87,
            downloadUrl: '/premium/downloads/tax-guide-2025.pdf',
          },
          {
            id: 'guide-2',
            title: 'Long-term Visa Application Templates',
            format: 'DOCX',
            files: 12,
            downloadUrl: '/premium/downloads/visa-templates.zip',
          },
        ],
        exclusiveWebinars: [
          {
            id: 'webinar-1',
            title: 'Immigration Law Q&A with Experts',
            date: '2025-11-15T18:00:00Z',
            duration: '90 minutes',
            registrationUrl: '/premium/webinars/immigration-qa',
          },
        ],
      },

      // User's subscription info
      subscription: {
        tier: currentTierDisplay,
        premiumSince: new Date().toISOString(),
        features: [
          'Unlimited course access',
          'Full visa and accommodation information',
          'Priority email support',
          'One-on-one consultations',
          'Advanced analytics dashboard',
          'Exclusive webinars and events',
        ],
      },

      // Metadata
      meta: {
        requestedAt: new Date().toISOString(),
        dataVersion: '1.0',
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour cache
      },
    };

    return successResponse(premiumData);
  } catch (error) {
    console.error('[premium/data] Unexpected error:', error);
    
    // Don't expose internal error details to client
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred while fetching premium data',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * POST /api/v1/premium/data
 * 
 * Example endpoint for creating premium data (requires Premium subscription).
 * This demonstrates how to protect write operations.
 */
export async function POST(request: NextRequest) {
  try {
    // Require Premium subscription
    const { authorized, error, userId } = await requireSubscription('premium');

    if (!authorized) {
      console.log('[premium/data] POST access denied');
      return error;
    }

    // Parse request body
    const body = await request.json().catch(() => null);

    if (!body) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[premium/data] POST request from user:', userId);

    // Process the premium data (example)
    // In a real implementation, you would save this to the database
    const result = {
      message: 'Premium data processed successfully',
      userId,
      processedData: {
        ...body,
        processedAt: new Date().toISOString(),
      },
    };

    return successResponse(result);
  } catch (error) {
    console.error('[premium/data] POST error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

