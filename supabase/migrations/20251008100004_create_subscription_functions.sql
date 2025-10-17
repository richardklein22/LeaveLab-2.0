-- Create database helper functions for subscription management

-- Function to get user's current tier name
CREATE OR REPLACE FUNCTION get_user_tier(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  tier_name TEXT;
BEGIN
  SELECT st.name INTO tier_name
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
  LIMIT 1;
  
  -- Default to free if no subscription found
  RETURN COALESCE(tier_name, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access specific content
CREATE OR REPLACE FUNCTION can_access_content(
  user_uuid UUID,
  content_type TEXT, -- 'course', 'community', 'visa_info', 'accommodation_info', 'email_support', 'one_on_one_support'
  content_level TEXT DEFAULT NULL -- 'short_term', 'all', etc.
)
RETURNS BOOLEAN AS $$
DECLARE
  tier_features JSONB;
  tier_name TEXT;
BEGIN
  -- Get user's tier features
  SELECT st.features, st.name INTO tier_features, tier_name
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
  LIMIT 1;
  
  -- If no subscription, use free tier
  IF tier_features IS NULL THEN
    SELECT features, name INTO tier_features, tier_name
    FROM subscription_tiers
    WHERE name = 'free'
    LIMIT 1;
  END IF;
  
  -- Return false if no tier found
  IF tier_features IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check access based on content type
  CASE content_type
    WHEN 'course' THEN
      -- Check if user can access courses
      RETURN COALESCE((tier_features->>'max_courses')::INTEGER, 999) > 0 
             OR (tier_features->>'first_lesson_only')::BOOLEAN = true;
    
    WHEN 'community' THEN
      RETURN COALESCE((tier_features->>'community_access')::BOOLEAN, false);
    
    WHEN 'email_support' THEN
      RETURN COALESCE((tier_features->>'email_support')::BOOLEAN, false);
    
    WHEN 'one_on_one_support' THEN
      RETURN COALESCE((tier_features->>'one_on_one_support')::BOOLEAN, false);
    
    WHEN 'visa_info' THEN
      IF content_level = 'short_term' THEN
        RETURN (tier_features->>'visa_info') IN ('short_term', 'all');
      ELSIF content_level = 'all' THEN
        RETURN (tier_features->>'visa_info') = 'all';
      ELSE
        -- No level specified, check if any access
        RETURN (tier_features->>'visa_info') != 'none';
      END IF;
    
    WHEN 'accommodation_info' THEN
      IF content_level = 'short_term' THEN
        RETURN (tier_features->>'accommodation_info') IN ('short_term', 'all');
      ELSIF content_level = 'all' THEN
        RETURN (tier_features->>'accommodation_info') = 'all';
      ELSE
        -- No level specified, check if any access
        RETURN (tier_features->>'accommodation_info') != 'none';
      END IF;
    
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's subscription details (for API endpoints)
CREATE OR REPLACE FUNCTION get_user_subscription_details(user_uuid UUID)
RETURNS TABLE (
  subscription_id UUID,
  tier_id UUID,
  tier_name TEXT,
  tier_display_name TEXT,
  status TEXT,
  billing_cycle TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  is_trialing BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id as subscription_id,
    st.id as tier_id,
    st.name as tier_name,
    st.display_name as tier_display_name,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.cancel_at_period_end,
    us.trial_start,
    us.trial_end,
    (us.trial_end IS NOT NULL AND us.trial_end > NOW()) as is_trialing
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = user_uuid
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION get_user_tier IS 'Returns the user''s current tier name (free, basic, premium)';
COMMENT ON FUNCTION can_access_content IS 'Checks if user can access specific content type based on their tier';
COMMENT ON FUNCTION get_user_subscription_details IS 'Returns full subscription details for a user';
