import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse } from '@/lib/utils/response';

/**
 * DELETE /api/v1/account
 * Soft deletes the user's account (30-day recovery period)
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

    const body = await request.json();
    const { confirmation } = body;

    // Require exact confirmation text
    if (confirmation !== 'DELETE') {
      return errorResponse('Please type DELETE to confirm account deletion', 400);
    }

    // Soft delete: Set deleted_at timestamp
    const { error: deleteError } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', user.id);

    if (deleteError) {
      console.error('Error soft deleting account:', deleteError);
      return errorResponse('Failed to delete account', 500);
    }

    // Log the deletion request
    await supabase.from('auth_logs').insert({
      user_id: user.id,
      event_type: 'account_deletion',
      ip_address: request.headers.get('x-forwarded-for') || 'Unknown',
      user_agent: request.headers.get('user-agent') || 'Unknown',
      success: true,
    });

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json(
      {
        message:
          'Account scheduled for deletion. You have 30 days to recover your account by logging in again.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Account deletion error:', error);
    return errorResponse('An error occurred while deleting your account', 500);
  }
}
