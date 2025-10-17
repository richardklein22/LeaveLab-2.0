-- Fix RLS policies for user_subscriptions table
-- Add explicit INSERT policy for the trigger

-- Allow any INSERT to user_subscriptions table (trigger will handle it)
CREATE POLICY "Allow insert for new user subscriptions"
ON user_subscriptions FOR INSERT
WITH CHECK (true);

