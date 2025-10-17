-- Fix RLS policies for profiles table
-- Add INSERT policy to allow user creation via triggers

-- Allow service role to insert profiles (for the trigger)
CREATE POLICY "Service role can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- Also add INSERT policy for authenticated users (for manual profile creation if needed)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

