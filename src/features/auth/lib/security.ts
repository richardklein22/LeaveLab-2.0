import { createClient } from '@/lib/supabase/server';

interface FailedLoginAttempt {
  email: string;
  ipAddress: string;
  userAgent: string;
}

/**
 * Track a failed login attempt in the database
 */
export async function trackFailedLogin(attempt: FailedLoginAttempt) {
  const supabase = await createClient();

  try {
    // Get user ID if the email exists (for tracking purposes)
    const { data: userData } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', attempt.email)
      .single();

    // Insert failed login event
    await supabase.from('auth_logs').insert({
      user_id: userData?.user_id || null,
      event: 'failed_login',
      ip_address: attempt.ipAddress,
      user_agent: attempt.userAgent,
      metadata: {
        email: attempt.email,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error tracking failed login:', error);
    // Don't throw - we don't want to break the login flow
  }
}

/**
 * Check for multiple failed login attempts and send security alert if needed
 * FR-033: After 5 failed attempts in 10 minutes, send security alert email
 */
export async function checkAndAlertFailedLogins(email: string) {
  const supabase = await createClient();

  try {
    // Get failed login attempts in the last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { data: recentAttempts, error } = await supabase
      .from('auth_logs')
      .select('*')
      .eq('event', 'failed_login')
      .gte('created_at', tenMinutesAgo)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error checking failed logins:', error);
      return;
    }

    // Filter by email from metadata
    const attemptsForEmail = recentAttempts.filter(
      (attempt) => attempt.metadata && (attempt.metadata as any).email === email
    );

    // If 5 or more attempts, send security alert
    if (attemptsForEmail.length >= 5) {
      // Check if we've already sent an alert in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data: recentAlerts } = await supabase
        .from('auth_logs')
        .select('*')
        .eq('event', 'security_alert_sent')
        .gte('created_at', oneHourAgo);

      const alertsForEmail = recentAlerts?.filter(
        (alert) => alert.metadata && (alert.metadata as any).email === email
      );

      // Only send if we haven't sent one in the last hour
      if (!alertsForEmail || alertsForEmail.length === 0) {
        await sendSecurityAlert(email, attemptsForEmail);
      }
    }
  } catch (error) {
    console.error('Error checking failed logins:', error);
  }
}

/**
 * Send security alert email for multiple failed login attempts
 */
async function sendSecurityAlert(
  email: string,
  attempts: any[]
) {
  const supabase = await createClient();

  try {
    // Get user data if exists
    const { data: userData } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .single();

    // In a real application, you would send an email here using a service like Resend
    // For now, we'll just log the security event
    console.log(`🚨 Security Alert: ${attempts.length} failed login attempts for ${email}`);
    
    // Log that we sent a security alert
    await supabase.from('auth_logs').insert({
      user_id: userData?.user_id || null,
      event: 'security_alert_sent',
      metadata: {
        email,
        attempt_count: attempts.length,
        first_attempt: attempts[attempts.length - 1]?.created_at,
        last_attempt: attempts[0]?.created_at,
        ip_addresses: [...new Set(attempts.map(a => a.ip_address))],
        message: `${attempts.length} failed login attempts detected in the last 10 minutes`,
      },
    });

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // await sendEmail({
    //   to: email,
    //   subject: 'Security Alert: Multiple Failed Login Attempts',
    //   template: 'security-alert',
    //   data: {
    //     attemptCount: attempts.length,
    //     timestamp: new Date().toISOString(),
    //     ipAddresses: [...new Set(attempts.map(a => a.ip_address))],
    //     resetPasswordUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    //   },
    // });
  } catch (error) {
    console.error('Error sending security alert:', error);
  }
}
