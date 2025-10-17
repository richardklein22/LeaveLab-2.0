'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OAuthButtons } from './OAuthButtons';
import { OAuthDivider } from './OAuthDivider';

import { loginSchema, type LoginInput } from '@/features/auth/lib/validation';
import { AUTH_ROUTES } from '@/features/auth/constants/routes';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to log in');
      }

      // Redirect to the original page or dashboard on success
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
      router.refresh();
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
      <OAuthButtons mode="login" />

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
              <div className="flex items-center justify-between">
                <FormLabel className="text-white font-semibold">Password</FormLabel>
                <Link
                  href={AUTH_ROUTES.RESET_PASSWORD}
                  className="text-sm font-medium text-brand-red hover:text-brand-red-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="tap-target border-white/20 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer text-gray-300">
                Remember me for 30 days
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full tap-target bg-brand-red hover:bg-brand-red-600 text-white magnetic-button h-12 text-base font-bold"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href={AUTH_ROUTES.SIGNUP}
              className="font-semibold text-brand-red hover:text-brand-red-400 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
