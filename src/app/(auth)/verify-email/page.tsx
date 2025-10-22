'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AUTH_ROUTES } from '@/features/auth/constants/routes';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Please check your email for a verification link.');

  const token = searchParams.get('token');
  const type = searchParams.get('type');

  const verifyEmail = useCallback(async (verificationToken: string) => {
    setStatus('verifying');
    setMessage('Verifying your email...');

    try {
      const response = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Verification failed');
      }

      setStatus('success');
      setMessage('Email verified successfully! Redirecting to your dashboard...');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to verify email. Please try again or contact support.'
      );
    }
  }, [router]);

  useEffect(() => {
    // If there's a token in the URL, verify it automatically
    if (token && type === 'email') {
      verifyEmail(token);
    }
  }, [token, type, verifyEmail]);

  return (
    <Card className="w-full glass border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent pointer-events-none" />
      <CardHeader className="space-y-3 relative z-10">
        <CardTitle className="text-4xl font-black text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Email Verification
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-base">
          {status === 'pending' && 'Check your inbox for the verification link'}
          {status === 'verifying' && 'Please wait while we verify your email'}
          {status === 'success' && 'Your email has been verified'}
          {status === 'error' && 'Verification failed'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="flex flex-col items-center justify-center py-8">
          {status === 'pending' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full glass-red mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-brand-red" />
              </div>
              <p className="text-gray-300">
                We&apos;ve sent a verification email to your inbox. 
                Please click the link in the email to verify your account.
              </p>
              <p className="text-sm text-gray-500">
                The link will expire in 24 hours.
              </p>
            </div>
          )}

          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full glass-red flex items-center justify-center animate-pulse-scale">
                <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
              </div>
              <p className="text-gray-400">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-brand-accent" />
              </div>
              <Alert className="glass-red border-brand-accent/50 w-full">
                <AlertDescription className="text-brand-accent text-center">
                  {message}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-16 h-16 rounded-full bg-brand-red/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-brand-red" />
              </div>
              <Alert variant="destructive" className="glass-red border-brand-red/50 w-full">
                <AlertDescription className="text-gray-300 text-center">{message}</AlertDescription>
              </Alert>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 glass border-white/20 text-white hover:bg-white/10"
                  onClick={() => router.push(AUTH_ROUTES.SIGNUP)}
                >
                  Back to Signup
                </Button>
                <Button
                  className="flex-1 bg-brand-red hover:bg-brand-red-600 text-white magnetic-button"
                  onClick={() => router.push(AUTH_ROUTES.LOGIN)}
                >
                  Go to Login
                </Button>
              </div>
            </div>
          )}
        </div>

        {status === 'pending' && (
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400">
              Didn&apos;t receive the email?
            </p>
            <Button
              variant="outline"
              className="w-full glass border-white/20 text-white hover:bg-white/10 magnetic-button"
              onClick={() => {
                // TODO: Implement resend verification email
                alert('Resend functionality coming soon');
              }}
            >
              Resend verification email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Card className="w-full glass border-white/10 overflow-hidden">
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </CardContent>
      </Card>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
