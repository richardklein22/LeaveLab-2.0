import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileUpdateSchema } from '@/features/auth/lib/validation';
import { validationErrorResponse, errorResponse, successResponse } from '@/lib/utils/response';
import { createCachedResponse, serverCache, cacheKeys, CACHE_DURATION } from '@/lib/utils/cache';

/**
 * GET /api/v1/profile
 * Fetch the current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Unauthorised', 401);
    }

    // Check cache first
    const cacheKey = cacheKeys.userProfile(user.id);
    const cached = serverCache.get(cacheKey);
    
    if (cached) {
      return createCachedResponse(cached, {
        cacheType: 'user-profile',
        status: 200,
      });
    }

    // Fetch profile from database - optimized query with specific columns
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bio, timezone, language, created_at, updated_at')
      .eq('id', user.id)
      .is('deleted_at', null)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return errorResponse('Failed to fetch profile', 500);
    }

    // Combine user data with profile data
    const combinedProfile = {
      id: user.id,
      email: user.email,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      timezone: profile.timezone,
      language: profile.language,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };

    // Cache the response
    serverCache.set(cacheKey, combinedProfile, CACHE_DURATION.USER_PROFILE);

    return createCachedResponse(combinedProfile, {
      cacheType: 'user-profile',
      status: 200,
      lastModified: profile.updated_at,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return errorResponse('An error occurred while fetching your profile', 500);
  }
}

/**
 * PATCH /api/v1/profile
 * Update the current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Unauthorised', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { displayName, bio, timezone, language } = validation.data;

    // Build update object (only include provided fields)
    const updates: any = {};
    if (displayName !== undefined) updates.display_name = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (timezone !== undefined) updates.timezone = timezone;
    if (language !== undefined) updates.language = language;

    // Update profile in database
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, display_name, avatar_url, bio, timezone, language, updated_at')
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return errorResponse('Failed to update profile', 500);
    }

    // Return updated profile
    const response = {
      id: user.id,
      email: user.email,
      displayName: updatedProfile.display_name,
      avatarUrl: updatedProfile.avatar_url,
      bio: updatedProfile.bio,
      timezone: updatedProfile.timezone,
      language: updatedProfile.language,
      updatedAt: updatedProfile.updated_at,
    };

    // Invalidate cache
    const cacheKey = cacheKeys.userProfile(user.id);
    serverCache.delete(cacheKey);

    return successResponse(response, 200);
  } catch (error) {
    console.error('Profile update API error:', error);
    return errorResponse('An error occurred while updating your profile', 500);
  }
}
