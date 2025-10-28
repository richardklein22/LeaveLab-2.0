import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Get current user before signing out (for logging)
    const { data: { user } } = await supabase.auth.getUser();

    // Sign out
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return errorResponse(
        error.message || 'Failed to log out. Please try again.',
        400
      );
    }

    // Log logout event
    if (user) {
      try {
        await supabase.from('auth_logs').insert({
          user_id: user.id,
          event: 'logout',
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent'),
          metadata: {
            email: user.email,
            logout_time: new Date().toISOString(),
          },
        });
      } catch (logError) {
        // Don't fail logout if logging fails
        console.error('Failed to log logout event:', logError);
      }
    }

    return successResponse({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout route error:', error);
    return errorResponse(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
}
