
-- Create function to get a profile by user ID
CREATE OR REPLACE FUNCTION public.get_profile(user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record json;
BEGIN
  SELECT json_build_object(
    'id', id,
    'full_name', full_name,
    'display_name', display_name,
    'bio', bio,
    'avatar_url', avatar_url,
    'onboarding_completed', onboarding_completed,
    'initial_mood', initial_mood,
    'primary_intention', primary_intention,
    'energy_level', energy_level,
    'interests', interests,
    'updated_at', updated_at
  )
  INTO profile_record
  FROM profiles
  WHERE id = user_id;
  
  RETURN profile_record;
END;
$$;

-- Create function to update a profile
CREATE OR REPLACE FUNCTION public.update_profile(p_user_id UUID, p_updates JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET
    full_name = COALESCE(p_updates->>'full_name', full_name),
    display_name = COALESCE(p_updates->>'display_name', display_name),
    bio = COALESCE(p_updates->>'bio', bio),
    avatar_url = COALESCE(p_updates->>'avatar_url', avatar_url),
    onboarding_completed = COALESCE((p_updates->>'onboarding_completed')::boolean, onboarding_completed),
    initial_mood = COALESCE(p_updates->>'initial_mood', initial_mood),
    primary_intention = COALESCE(p_updates->>'primary_intention', primary_intention),
    energy_level = COALESCE((p_updates->>'energy_level')::integer, energy_level),
    interests = COALESCE(p_updates->'interests', to_jsonb(interests)),
    updated_at = COALESCE((p_updates->>'updated_at')::timestamp with time zone, updated_at)
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Create function to check onboarding status
CREATE OR REPLACE FUNCTION public.check_onboarding_status(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_completed BOOLEAN;
BEGIN
  SELECT onboarding_completed INTO is_completed
  FROM profiles
  WHERE id = user_id;
  
  RETURN COALESCE(is_completed, false);
END;
$$;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_profile(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_profile(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_onboarding_status(UUID) TO anon, authenticated;
