'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { updatePasswordSchema, type UpdatePasswordInput } from '../lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { PasswordRequirements } from './PasswordRequirements';
import { createClient } from '@/lib/supabase/client';

export function UpdatePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  // Watch password field for real-time validation feedback
  const watchedPassword = watch('password');

  // Verify user has a valid session (should be set by /auth/callback)
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session || sessionError) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
      setVerifying(false);
    };
    
    checkSession();
  }, []);

  const onSubmit = async (data: UpdatePasswordInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: data.password,
          confirmPassword: data.confirmPassword 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different error formats
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || result.message || 'Failed to update password';
        throw new Error(errorMessage);
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Update password error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while verifying the reset link
  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying reset link...</p>
      </div>
    );
  }

  // Show error state if verification failed and don't show the form
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => router.push('/reset-password')}
          >
            Request a new reset link
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription className="text-center">
            <strong>Password updated successfully!</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              You can now log in with your new password.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Redirecting to log in...
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          className="tap-target"
          {...register('password', {
            onChange: (e) => setPassword(e.target.value),
          })}
          disabled={loading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        
        <PasswordRequirements password={watchedPassword || password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          className="tap-target"
          {...register('confirmPassword')}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full tap-target"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating password...
          </>
        ) : (
          'Update password'
        )}
      </Button>

      <div className="text-center">
        <a
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to log in
        </a>
      </div>
    </form>
  );
}
