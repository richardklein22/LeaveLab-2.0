import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse } from '@/lib/utils/response';

/**
 * GET /api/v1/account/sessions
 * Retrieves all active sessions for the authenticated user
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

    // Get all sessions for the user
    // Note: Supabase doesn't expose a direct sessions API, so we'll get the current session
    // For a full sessions list, you'd need to use the Supabase Management API or track sessions yourself
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      return errorResponse('Failed to fetch sessions', 500);
    }

    // For now, return the current session
    // In a production app, you'd query a sessions table or use Supabase Admin API
    const sessions = session
      ? [
          {
            id: session.access_token.substring(0, 16), // Use a portion of token as ID
            created_at: new Date(session.user.created_at).toISOString(),
            last_active: new Date().toISOString(), // Current time as last active
            ip_address: request.headers.get('x-forwarded-for') || 'Unknown',
            user_agent: request.headers.get('user-agent') || 'Unknown',
            is_current: true,
          },
        ]
      : [];

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return errorResponse('An error occurred while fetching sessions', 500);
  }
}

/**
 * DELETE /api/v1/account/sessions
 * Logs out from all other sessions (keeps current session)
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

    // Sign out from all other sessions (scope: 'others')
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'others' });

    if (signOutError) {
      console.error('Error signing out from other sessions:', signOutError);
      return errorResponse('Failed to sign out from other sessions', 500);
    }

    return NextResponse.json(
      { message: 'Successfully signed out from all other devices' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sessions delete error:', error);
    return errorResponse('An error occurred while signing out', 500);
  }
}
