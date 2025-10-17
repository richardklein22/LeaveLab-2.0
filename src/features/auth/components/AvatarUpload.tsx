'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, User } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function AvatarUpload() {
  const { profile, uploadAvatar, removeAvatar } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setLoading(true);
    setError(null);

    try {
      await uploadAvatar(file);
      setPreview(null);
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      setPreview(null);
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    setError(null);

    try {
      await removeAvatar();
      setPreview(null);
    } catch (err) {
      console.error('Avatar removal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove avatar');
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = preview || profile?.avatarUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Avatar Display */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-border bg-muted overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="tap-target"
            >
              <Upload className="mr-2 h-4 w-4" />
              {profile?.avatarUrl ? 'Change avatar' : 'Upload avatar'}
            </Button>

            {profile?.avatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={loading}
                className="tap-target"
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP. Maximum size: 5MB.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
