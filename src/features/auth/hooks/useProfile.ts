import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ProfileUpdateInput } from '../lib/validation';

interface Profile {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  timezone?: string | null;
  language?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/profile');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data);
    } catch (err) {
      console.error('Fetch profile error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdateInput): Promise<void> => {
    try {
      setError(null);

      const response = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data);
    } catch (err) {
      console.error('Update profile error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      setError(null);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/v1/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload avatar');
      }

      // Update local profile state
      if (profile) {
        setProfile({ ...profile, avatarUrl: data.avatarUrl });
      }

      return data.avatarUrl;
    } catch (err) {
      console.error('Upload avatar error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeAvatar = async (): Promise<void> => {
    try {
      setError(null);

      const response = await fetch('/api/v1/profile/avatar', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove avatar');
      }

      // Update local profile state
      if (profile) {
        setProfile({ ...profile, avatarUrl: null });
      }
    } catch (err) {
      console.error('Remove avatar error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove avatar';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
}
