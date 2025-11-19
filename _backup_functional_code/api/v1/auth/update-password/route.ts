import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updatePasswordSchema } from '@/features/auth/lib/validation';
import { validationErrorResponse, errorResponse, successResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = updatePasswordSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { password } = validation.data;
    const supabase = await createClient();

    // Check if user is authenticated (from password reset flow)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Invalid or expired reset link. Please request a new one.', 401);
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return errorResponse('Failed to update password. Please try again.', 500);
    }

    // Sign out user after password change (they'll need to log in with new password)
    await supabase.auth.signOut();

    return successResponse(
      {
        message: 'Password updated successfully. Please log in with your new password.',
      },
      200
    );
  } catch (error) {
    console.error('Password update error:', error);
    return errorResponse('An error occurred while updating your password', 500);
  }
}
