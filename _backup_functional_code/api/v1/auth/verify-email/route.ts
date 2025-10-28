import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return errorResponse('Verification token is required', 400);
    }

    // Create Supabase client
    const supabase = await createClient();

    // Verify the email token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) {
      console.error('Email verification error:', error);
      
      // Handle specific error cases with British English messages
      if (error.message.includes('expired')) {
        return errorResponse(
          'This verification link has expired. Please request a new one.',
          400
        );
      }
      
      if (error.message.includes('invalid')) {
        return errorResponse(
          'This verification link is invalid. Please check your email or request a new link.',
          400
        );
      }
      
      return errorResponse(
        error.message || 'Failed to verify email. Please try again.',
        400
      );
    }

    if (!data.user) {
      return errorResponse('Failed to verify email. Please try again.', 500);
    }

    // Log successful email verification
    try {
      await supabase.from('auth_logs').insert({
        user_id: data.user.id,
        event: 'email_verified',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        metadata: {
          email: data.user.email,
          email_confirmed: true,
        },
      });
    } catch (logError) {
      // Don't fail verification if logging fails
      console.error('Failed to log email verification:', logError);
    }

    return successResponse({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      message: 'Email verified successfully!',
    });
  } catch (error) {
    console.error('Verify email route error:', error);
    return errorResponse(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}
