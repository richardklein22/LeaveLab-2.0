import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resetPasswordSchema } from '@/features/auth/lib/validation';
import { validationErrorResponse, errorResponse, successResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email } = validation.data;
    const supabase = await createClient();

    // Request password reset - Supabase will send an email with a reset link
    // The link will go to /auth/callback which will handle the code exchange
    // and then redirect to /update-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
    });

    if (error) {
      console.error('Password reset request error:', error);
      // Don't reveal if email exists - return generic success message
    }

    // Always return success to prevent email enumeration
    return successResponse(
      {
        message: 'If an account exists with that email, we have sent password reset instructions.',
      },
      200
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return errorResponse('An error occurred while processing your request', 500);
  }
}
