-- Fix the create_free_subscription_for_new_user function to use explicit schema
-- The auth admin user can't see tables without explicit schema qualification

DROP FUNCTION IF EXISTS create_free_subscription_for_new_user() CASCADE;

CREATE OR REPLACE FUNCTION create_free_subscription_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_tier_id UUID;
BEGIN
  -- Get the free tier ID (explicitly reference public schema)
  SELECT id INTO free_tier_id
  FROM public.subscription_tiers
  WHERE name = 'free'
  LIMIT 1;
  
  -- Create a free subscription for the new user
  IF free_tier_id IS NOT NULL THEN
    INSERT INTO public.user_subscriptions (user_id, tier_id, status)
    VALUES (NEW.id, free_tier_id, 'active')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER create_free_subscription_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_free_subscription_for_new_user();

COMMENT ON FUNCTION create_free_subscription_for_new_user IS 'Creates a free subscription for new users with explicit schema references';

