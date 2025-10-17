import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/utils/response';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/v1/profile/avatar
 * Upload or update the current user's avatar
 */
export async function POST(request: NextRequest) {
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

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        'Invalid file type. Only JPG, PNG, and WebP images are allowed.',
        400
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('File size must be less than 5MB', 400);
    }

    // Get current avatar URL to delete old file
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Delete old avatar if it exists (and it's not a default/OAuth avatar)
    if (currentProfile?.avatar_url && currentProfile.avatar_url.includes('avatars/')) {
      const oldPath = currentProfile.avatar_url.split('/avatars/')[1];
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return errorResponse('Failed to upload avatar', 500);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile avatar update error:', updateError);
      // Try to clean up uploaded file
      await supabase.storage.from('avatars').remove([uploadData.path]);
      return errorResponse('Failed to update profile with new avatar', 500);
    }

    return successResponse(
      {
        avatarUrl: publicUrl,
        message: 'Avatar uploaded successfully',
      },
      200
    );
  } catch (error) {
    console.error('Avatar upload API error:', error);
    return errorResponse('An error occurred while uploading your avatar', 500);
  }
}

/**
 * DELETE /api/v1/profile/avatar
 * Remove the current user's avatar
 */
export async function DELETE(request: NextRequest) {
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

    // Get current avatar URL
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Delete avatar file if it exists in our storage
    if (currentProfile?.avatar_url && currentProfile.avatar_url.includes('avatars/')) {
      const filePath = currentProfile.avatar_url.split('/avatars/')[1];
      if (filePath) {
        await supabase.storage.from('avatars').remove([filePath]);
      }
    }

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile avatar removal error:', updateError);
      return errorResponse('Failed to remove avatar', 500);
    }

    return successResponse(
      {
        message: 'Avatar removed successfully',
      },
      200
    );
  } catch (error) {
    console.error('Avatar removal API error:', error);
    return errorResponse('An error occurred while removing your avatar', 500);
  }
}
