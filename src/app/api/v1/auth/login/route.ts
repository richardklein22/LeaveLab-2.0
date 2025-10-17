import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/features/auth/lib/validation';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/response';
import { trackFailedLogin, checkAndAlertFailedLogins } from '@/features/auth/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password, rememberMe } = validation.data;

    // Create Supabase client
    const supabase = await createClient();

    // Attempt to sign in
    // Note: Session duration is controlled by Supabase settings (7 days default)
    // "Remember me" can extend this to 30 days via cookie settings
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Handle failed login
    if (error) {
      console.error('Login error:', error);

      // Track failed login attempt
      try {
        await trackFailedLogin({
          email,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        });

        // Check if we need to send security alert
        await checkAndAlertFailedLogins(email);
      } catch (trackError) {
        console.error('Failed to track login attempt:', trackError);
      }

      // Return user-friendly error based on error type
      if (error.message.includes('Invalid login credentials')) {
        return errorResponse(
          'Invalid email or password. Please check your credentials and try again.',
          401
        );
      }

      if (error.message.includes('Email not confirmed')) {
        return errorResponse(
          'Please verify your email address before logging in. Check your inbox for the verification link.',
          403
        );
      }

      return errorResponse(
        error.message || 'Failed to log in. Please try again.',
        400
      );
    }

    if (!data.user || !data.session) {
      return errorResponse('Failed to log in. Please try again.', 500);
    }

    // Check if email is verified (FR-005: Block unverified emails)
    if (!data.user.email_confirmed_at) {
      return errorResponse(
        'Please verify your email address before logging in. Check your inbox for the verification link.',
        403
      );
    }

    // Log successful login event
    try {
      await supabase.from('auth_logs').insert({
        user_id: data.user.id,
        event: 'login',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
        metadata: {
          email: email,
          remember_me: rememberMe || false,
          session_expires_at: data.session.expires_at,
        },
      });
    } catch (logError) {
      // Don't fail login if logging fails
      console.error('Failed to log login event:', logError);
    }

    return successResponse(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: {
          access_token: data.session.access_token,
          expires_at: data.session.expires_at,
        },
        message: 'Logged in successfully!',
      },
      200
    );
  } catch (error) {
    console.error('Login route error:', error);
    return errorResponse(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}
