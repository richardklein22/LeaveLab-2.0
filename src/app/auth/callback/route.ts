import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  // Handle OAuth errors (user cancelled, access denied, etc.)
  if (error) {
    console.error('OAuth error:', error, error_description);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    );
  }

  const supabase = await createClient();

  // Handle OAuth callback and password reset (both use code parameter)
  if (code) {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      
      // Check if this might be a password reset error
      if (exchangeError.message.includes('code verifier')) {
        return NextResponse.redirect(
          new URL(`/reset-password?error=${encodeURIComponent('Invalid or expired reset link. Please request a new one.')}`, request.url)
        );
      }
      
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
      );
    }

    // Check if this is a password reset flow by examining the session
    // Password reset sessions will have a specific type
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Check if user needs to update their password (recovery flow)
      // This is indicated by the next parameter or by checking user metadata
      const needsPasswordUpdate = next === '/update-password' || 
                                   requestUrl.searchParams.get('type') === 'recovery';
      
      if (needsPasswordUpdate) {
        return NextResponse.redirect(new URL('/update-password', request.url));
      }
    }

    // Successfully authenticated via OAuth or other flow
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Handle email verification and password reset callbacks
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!verifyError) {
      // Check if this is a password reset or email verification
      if (type === 'recovery' || type === 'password_reset') {
        // Password reset - redirect to update password page
        return NextResponse.redirect(new URL('/update-password', request.url));
      }
      
      // Email verification - redirect to dashboard
      return NextResponse.redirect(new URL(next, request.url));
    }

    // If verification failed, redirect to appropriate error page
    if (type === 'recovery' || type === 'password_reset') {
      return NextResponse.redirect(
        new URL(`/reset-password?error=${encodeURIComponent(verifyError.message)}`, request.url)
      );
    }
    
    return NextResponse.redirect(
      new URL(`/verify-email?error=${encodeURIComponent(verifyError.message)}`, request.url)
    );
  }

  // If no code or token, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
