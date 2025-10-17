'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { profileUpdateSchema, type ProfileUpdateInput } from '../lib/validation';
import { useProfile } from '../hooks/useProfile';

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { profile, updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      timezone: '',
      language: '',
    },
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        timezone: profile.timezone || '',
        language: profile.language || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileUpdateInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile(data);
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Profile updated successfully!
          </div>
        )}

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="tap-target"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                This is how your name will appear to other members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  {...field}
                  className="tap-target resize-none"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Write a short bio about your digital nomad journey (maximum 500 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Europe/London"
                  {...field}
                  className="tap-target"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your current timezone (e.g., Europe/London, Asia/Bangkok).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred language</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., en-GB"
                  {...field}
                  className="tap-target"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your preferred language code (e.g., en-GB, en-US, es-ES).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full tap-target"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </Form>
  );
}
