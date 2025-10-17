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
    RAISE EXCEPTION 'Unauthorised';
  END IF;
  
  UPDATE public.profiles
  SET deleted_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO public.auth_logs (user_id, event, metadata)
  VALUES (p_user_id, 'account_deleted', json_build_object('deleted_at', NOW()));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
