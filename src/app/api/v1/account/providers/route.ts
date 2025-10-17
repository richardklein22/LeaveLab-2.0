import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse } from '@/lib/utils/response';

/**
 * GET /api/v1/account/providers
 * Retrieves all connected OAuth providers for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    // Get user identities (OAuth providers)
    const identities = user.identities || [];

    // Check if user has a password set (email provider)
    const hasPassword = identities.some((identity) => identity.provider === 'email');

    // Map identities to a cleaner format
    const providers = identities
      .filter((identity) => identity.provider !== 'email') // Exclude email provider
      .map((identity) => ({
        id: identity.id,
        provider: identity.provider,
        email: identity.identity_data?.email || user.email,
        created_at: identity.created_at,
      }));

    return NextResponse.json(
      {
        providers,
        hasPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Providers fetch error:', error);
    return errorResponse('An error occurred while fetching connected accounts', 500);
  }
}

/**
 * DELETE /api/v1/account/providers
 * Unlinks an OAuth provider from the user's account
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { provider_id } = body;

    if (!provider_id) {
      return errorResponse('Provider ID is required', 400);
    }

    // Check if user has other login methods
    const identities = user.identities || [];
    const hasPassword = identities.some((identity) => identity.provider === 'email');
    const oauthProviders = identities.filter((identity) => identity.provider !== 'email');

    // Prevent unlinking if it's the only login method
    if (oauthProviders.length === 1 && !hasPassword) {
      return errorResponse(
        'Cannot disconnect your only sign-in method. Add another method first.',
        400
      );
    }

    // Unlink the identity
    // Note: Supabase doesn't provide a direct client-side method to unlink identities
    // You would typically use the Supabase Management API or Admin SDK for this
    // For now, we'll return an error indicating the feature requires backend implementation
    
    return errorResponse(
      'Provider unlinking requires additional backend setup. This feature will be available soon.',
      501
    );
  } catch (error) {
    console.error('Provider delete error:', error);
    return errorResponse('An error occurred while disconnecting the account', 500);
  }
}
