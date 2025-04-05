
-- Create a function to fetch frequency feedback by track ID
CREATE OR REPLACE FUNCTION public.get_frequency_feedback(track_id_param UUID)
RETURNS SETOF public.frequency_feedback
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.frequency_feedback
  WHERE track_id = track_id_param
  ORDER BY created_at DESC;
END;
$$;
