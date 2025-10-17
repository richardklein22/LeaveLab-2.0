'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordRequirements } from './PasswordRequirements';
import { OAuthButtons } from './OAuthButtons';
import { OAuthDivider } from './OAuthDivider';

import { signupSchema, type SignupInput } from '@/features/auth/lib/validation';
import { AUTH_ROUTES } from '@/features/auth/constants/routes';

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const passwordValue = form.watch('password');

  async function onSubmit(data: SignupInput) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to create account');
      }

      // Redirect to email verification page
      router.push(AUTH_ROUTES.VERIFY_EMAIL);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <OAuthButtons mode="signup" />

      <OAuthDivider />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="glass-red border-brand-red/50">
              <AlertDescription className="text-gray-300">{error}</AlertDescription>
            </Alert>
          )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-semibold">Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="tap-target glass border-white/20 text-white placeholder:text-gray-500 focus:border-brand-red/50 focus:ring-brand-red/20"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-brand-red" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-semibold">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="tap-target glass border-white/20 text-white placeholder:text-gray-500 focus:border-brand-red/50 focus:ring-brand-red/20"
                  onFocus={() => setShowPasswordRequirements(true)}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-brand-red" />
              
              {showPasswordRequirements && (
                <PasswordRequirements
                  password={passwordValue}
                  className="mt-3"
                />
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full tap-target bg-brand-red hover:bg-brand-red-600 text-white magnetic-button h-12 text-base font-bold"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href={AUTH_ROUTES.LOGIN}
              className="font-semibold text-brand-red hover:text-brand-red-400 transition-colors"
            >
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
