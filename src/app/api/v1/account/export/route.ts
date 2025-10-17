import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse } from '@/lib/utils/response';

/**
 * GET /api/v1/account/export
 * Exports all user data in JSON format (GDPR compliance)
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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    // Fetch authentication logs (last 100 entries)
    const { data: authLogs, error: logsError } = await supabase
      .from('auth_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (logsError) {
      console.error('Error fetching auth logs:', logsError);
    }

    // Compile all user data
    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        format: 'JSON',
        version: '1.0',
        description: 'LeaveLab User Data Export (GDPR Article 20 - Right to Data Portability)',
      },
      account: {
        id: user.id,
        email: user.email,
        email_confirmed: !!user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        providers: user.identities?.map((identity) => ({
          provider: identity.provider,
          created_at: identity.created_at,
        })),
      },
      profile: profile || null,
      authentication_logs: authLogs || [],
      metadata: user.user_metadata || {},
    };

    // Log the export request
    await supabase.from('auth_logs').insert({
      user_id: user.id,
      event_type: 'data_export',
      ip_address: request.headers.get('x-forwarded-for') || 'Unknown',
      user_agent: request.headers.get('user-agent') || 'Unknown',
      success: true,
    });

    // Return as downloadable JSON file
    const filename = `leavelab-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return errorResponse('An error occurred while exporting your data', 500);
  }
}
