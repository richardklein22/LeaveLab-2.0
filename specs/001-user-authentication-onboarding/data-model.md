# Data Model: User Authentication & Onboarding

**Feature**: 001-user-authentication-onboarding  
**Date**: 2025-10-08  
**Database**: Supabase PostgreSQL 15+

## Overview

This document defines the database schema for user authentication, profiles, sessions, and security logging. All tables implement Row-Level Security (RLS) policies to ensure users can only access their own data.

---

## Schema Organization

```
auth (Supabase-managed)
├── users                    # Core auth users (managed by Supabase Auth)
├── identities               # OAuth identities (managed by Supabase Auth)
└── sessions                 # Active sessions (managed by Supabase Auth)

public
├── profiles                 # User profile information
├── auth_logs                # Authentication event logging
└── (future tables for courses, memberships, etc.)

storage
└── avatars                  # Profile picture uploads
```

---

## Tables

### 1. auth.users (Supabase-Managed)

**Purpose**: Core authentication table managed by Supabase Auth. Stores user credentials and OAuth identities.

**Schema** (key fields, Supabase-managed):

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | TEXT | UNIQUE, NOT NULL | User email address |
| `encrypted_password` | TEXT | NULLABLE | Hashed password (null for OAuth-only users) |
| `email_confirmed_at` | TIMESTAMPTZ | NULLABLE | When email was verified |
| `last_sign_in_at` | TIMESTAMPTZ | NULLABLE | Last successful login |
| `created_at` | TIMESTAMPTZ | NOT NULL | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update timestamp |
| `raw_user_meta_data` | JSONB | DEFAULT '{}' | Additional user metadata |
| `raw_app_meta_data` | JSONB | DEFAULT '{}' | App-specific metadata |

**Note**: This table is fully managed by Supabase Auth. Direct modifications not recommended.

---

### 2. public.profiles

**Purpose**: Extended user profile information (display name, avatar, preferences).

**Schema**:

```sql
CREATE TABLE public.profiles (
  -- Identity
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Information
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  
  -- Preferences
  timezone TEXT DEFAULT 'Europe/London',
  language TEXT DEFAULT 'en-GB',
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  
  -- Future membership integration
  membership_tier TEXT DEFAULT 'free', -- 'free', 'basic', 'premium'
  
  -- Soft deletion
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at) 
WHERE deleted_at IS NULL;

CREATE INDEX idx_profiles_membership_tier ON public.profiles(membership_tier);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

**Validation Rules**:

- `display_name`: 1-50 characters, no profanity check (deferred to moderation feature)
- `avatar_url`: Valid URL, HTTPS only
- `bio`: Max 500 characters
- `timezone`: Valid IANA timezone identifier
- `language`: ISO 639-1 language code + ISO 3166-1 country code (e.g., 'en-GB')

**RLS Policies**:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all non-deleted profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (deleted_at IS NULL);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can soft-delete their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id AND deleted_at IS NULL)
WITH CHECK (auth.uid() = id AND deleted_at IS NOT NULL);
```

---

### 3. public.auth_logs

**Purpose**: Audit log for all authentication events (logins, failures, password changes).

**Schema**:

```sql
CREATE TABLE public.auth_logs (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event Details
  event TEXT NOT NULL, -- 'login', 'failed_login', 'logout', 'password_change', 'password_reset_request', 'email_verified', 'oauth_linked'
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  oauth_provider TEXT, -- 'google', null for email/password
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX idx_auth_logs_event ON public.auth_logs(event);
CREATE INDEX idx_auth_logs_user_event_time ON public.auth_logs(user_id, event, created_at DESC);
CREATE INDEX idx_auth_logs_created_at ON public.auth_logs(created_at DESC);

-- Retention policy: Delete logs older than 90 days
CREATE OR REPLACE FUNCTION delete_old_auth_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.auth_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run daily via pg_cron or external cron job)
-- SELECT cron.schedule('cleanup-auth-logs', '0 2 * * *', 'SELECT delete_old_auth_logs()');
```

**Event Types**:

| Event | Description | Triggers |
|-------|-------------|----------|
| `login` | Successful login | Email/password or OAuth login |
| `failed_login` | Failed login attempt | Wrong password, non-existent email |
| `logout` | User logged out | Manual logout, session expired |
| `password_change` | Password updated | From account settings |
| `password_reset_request` | Password reset initiated | Forgot password flow |
| `password_reset_complete` | Password reset completed | Reset link used |
| `email_verified` | Email verification completed | Verification link clicked |
| `oauth_linked` | OAuth provider linked | Google account linked to existing account |
| `account_deleted` | Account deletion requested | Soft delete triggered |

**RLS Policies**:

```sql
-- Enable RLS
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own auth logs
CREATE POLICY "Users can view own auth logs"
ON public.auth_logs FOR SELECT
USING (auth.uid() = user_id);

-- Only service role can insert logs (via Edge Functions)
CREATE POLICY "Service role can insert auth logs"
ON public.auth_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');
```

---

### 4. storage.objects (Supabase-Managed)

**Purpose**: Store profile pictures in the `avatars` bucket.

**Bucket Configuration**:

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

**RLS Policies**:

```sql
-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view avatars (public bucket)
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**File Naming Convention**: `{user_id}-{timestamp}.{extension}`

Example: `a1b2c3d4-e5f6-7890-abcd-ef1234567890-1696723200000.webp`

---

## Entity Relationships

```
┌─────────────────┐
│   auth.users    │ (Supabase-managed)
│                 │
│ - id            │◄────────┐
│ - email         │         │
│ - encrypted_pw  │         │ 1:1
│ - created_at    │         │
└─────────────────┘         │
                            │
┌─────────────────┐         │
│ public.profiles │         │
│                 │         │
│ - id            │─────────┘
│ - display_name  │
│ - avatar_url    │────────►  storage.objects (avatars bucket)
│ - membership    │
│ - deleted_at    │
└─────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│public.auth_logs │
│                 │
│ - id            │
│ - user_id       │
│ - event         │
│ - ip_address    │
│ - created_at    │
└─────────────────┘
```

---

## Database Functions

### 1. Check Failed Login Attempts

```sql
CREATE OR REPLACE FUNCTION check_failed_login_attempts(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO attempt_count
  FROM public.auth_logs
  WHERE user_id = p_user_id
    AND event = 'failed_login'
    AND created_at > NOW() - INTERVAL '10 minutes';
  
  RETURN attempt_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Get User Profile with Auth Details

```sql
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', u.id,
    'email', u.email,
    'email_confirmed', u.email_confirmed_at IS NOT NULL,
    'created_at', u.created_at,
    'last_sign_in_at', u.last_sign_in_at,
    'display_name', p.display_name,
    'avatar_url', p.avatar_url,
    'bio', p.bio,
    'timezone', p.timezone,
    'language', p.language,
    'membership_tier', p.membership_tier,
    'onboarding_completed', p.onboarding_completed
  )
  INTO result
  FROM auth.users u
  JOIN public.profiles p ON u.id = p.id
  WHERE u.id = p_user_id
    AND p.deleted_at IS NULL;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Soft Delete User Account

```sql
CREATE OR REPLACE FUNCTION soft_delete_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is calling for their own account
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Soft delete profile
  UPDATE public.profiles
  SET deleted_at = NOW()
  WHERE id = p_user_id;
  
  -- Log event
  INSERT INTO public.auth_logs (user_id, event, metadata)
  VALUES (p_user_id, 'account_deleted', json_build_object('deleted_at', NOW()));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Migrations

### Migration 1: Create Profiles Table

**File**: `supabase/migrations/20251008_001_create_profiles_table.sql`

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'Europe/London',
  language TEXT DEFAULT 'en-GB',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  membership_tier TEXT DEFAULT 'free',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_membership_tier ON public.profiles(membership_tier);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### Migration 2: Create Auth Logs Table

**File**: `supabase/migrations/20251008_002_create_auth_logs_table.sql`

```sql
-- Create auth_logs table
CREATE TABLE public.auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  oauth_provider TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX idx_auth_logs_event ON public.auth_logs(event);
CREATE INDEX idx_auth_logs_user_event_time ON public.auth_logs(user_id, event, created_at DESC);
CREATE INDEX idx_auth_logs_created_at ON public.auth_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own auth logs"
ON public.auth_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert auth logs"
ON public.auth_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Cleanup function
CREATE OR REPLACE FUNCTION delete_old_auth_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.auth_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
```

### Migration 3: Create Database Functions

**File**: `supabase/migrations/20251008_003_create_functions.sql`

```sql
-- Check failed login attempts
CREATE OR REPLACE FUNCTION check_failed_login_attempts(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO attempt_count
  FROM public.auth_logs
  WHERE user_id = p_user_id
    AND event = 'failed_login'
    AND created_at > NOW() - INTERVAL '10 minutes';
  
  RETURN attempt_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user profile with auth details
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', u.id,
    'email', u.email,
    'email_confirmed', u.email_confirmed_at IS NOT NULL,
    'created_at', u.created_at,
    'last_sign_in_at', u.last_sign_in_at,
    'display_name', p.display_name,
    'avatar_url', p.avatar_url,
    'bio', p.bio,
    'timezone', p.timezone,
    'language', p.language,
    'membership_tier', p.membership_tier,
    'onboarding_completed', p.onboarding_completed
  )
  INTO result
  FROM auth.users u
  JOIN public.profiles p ON u.id = p.id
  WHERE u.id = p_user_id
    AND p.deleted_at IS NULL;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete user account
CREATE OR REPLACE FUNCTION soft_delete_user(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  UPDATE public.profiles
  SET deleted_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO public.auth_logs (user_id, event, metadata)
  VALUES (p_user_id, 'account_deleted', json_build_object('deleted_at', NOW()));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Migration 4: Configure Storage

**File**: `supabase/migrations/20251008_004_configure_storage.sql`

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- RLS policies for storage
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

---

## TypeScript Type Generation

Generate TypeScript types from the database schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

**Generated Types** (example):

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          timezone: string
          language: string
          onboarding_completed: boolean
          onboarding_step: number
          membership_tier: string
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          membership_tier?: string
          deleted_at?: string | null
        }
        Update: {
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          membership_tier?: string
          deleted_at?: string | null
        }
      }
      auth_logs: {
        Row: {
          id: string
          user_id: string | null
          event: string
          ip_address: string | null
          user_agent: string | null
          oauth_provider: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event: string
          ip_address?: string | null
          user_agent?: string | null
          oauth_provider?: string | null
          metadata?: Json
          created_at?: string
        }
      }
    }
  }
}
```

---

## Summary

- **3 main tables**: `profiles` (user data), `auth_logs` (audit trail), `storage.objects` (avatars)
- **All tables** have Row-Level Security (RLS) enabled
- **Automatic profile creation** via database trigger on user signup
- **Soft deletion** support with `deleted_at` column
- **90-day retention** for auth logs
- **Type-safe**: Generated TypeScript types from schema
