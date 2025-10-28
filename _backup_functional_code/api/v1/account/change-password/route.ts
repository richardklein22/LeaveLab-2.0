import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { changePasswordSchema } from '@/features/auth/lib/validation';
import { validationErrorResponse, errorResponse, successResponse } from '@/lib/utils/response';

/**
 * POST /api/v1/account/change-password
 * Change the current user's password (requires current password verification)
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

    // Parse and validate request body
    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { currentPassword, newPassword } = validation.data;

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (verifyError) {
      return errorResponse('Current password is incorrect', 400);
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return errorResponse('Failed to update password', 500);
    }

    // Log the password change event
    await supabase.from('auth_logs').insert({
      user_id: user.id,
      event_type: 'password_change',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    // Optionally, invalidate all other sessions for security
    // This logs the user out on all other devices
    await supabase.auth.signOut({ scope: 'others' });

    return successResponse(
      {
        message: 'Password changed successfully. You have been logged out on all other devices.',
      },
      200
    );
  } catch (error) {
    console.error('Change password API error:', error);
    return errorResponse('An error occurred while changing your password', 500);
  }
}
