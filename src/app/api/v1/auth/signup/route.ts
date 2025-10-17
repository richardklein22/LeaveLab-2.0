import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { signupSchema } from '@/features/auth/lib/validation';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email, password, displayName } = validation.data;

    // Create Supabase client
    const supabase = await createClient();

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          display_name: displayName,
          email_verified: false,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases with British English messages
      if (error.message.includes('already registered')) {
        return errorResponse(
          'This email address is already registered. Please log in instead.',
          409
        );
      }
      
      return errorResponse(
        error.message || 'Failed to create account. Please try again.',
        400
      );
    }

    if (!data.user) {
      return errorResponse('Failed to create account. Please try again.', 500);
    }

    // Log successful signup event
    if (data.user) {
      try {
        await supabase.from('auth_logs').insert({
          user_id: data.user.id,
          event: 'signup',
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent'),
          metadata: {
            email: email,
            email_confirmed: false,
          },
        });
      } catch (logError) {
        // Don't fail signup if logging fails
        console.error('Failed to log signup event:', logError);
      }
    }

    return successResponse(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        message: 'Account created successfully! Please check your email to verify your account.',
      },
      201
    );
  } catch (error) {
    console.error('Signup route error:', error);
    return errorResponse(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}
