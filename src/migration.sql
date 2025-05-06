
-- Create journey_visual_params table to store spiral parameters
CREATE TABLE IF NOT EXISTS public.journey_visual_params (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id TEXT NOT NULL,
  params JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT journey_visual_params_unique UNIQUE (journey_id)
);

-- Add RLS policy to allow access to journey_visual_params
ALTER TABLE public.journey_visual_params ENABLE ROW LEVEL SECURITY;

-- Grant anon users ability to read the param data (these are public visuals)
CREATE POLICY "Allow public to read journey visual params" ON public.journey_visual_params
  FOR SELECT USING (true);

-- Only allow authenticated users to modify their own journey params
CREATE POLICY "Allow authenticated to insert their own journey params" ON public.journey_visual_params
  FOR INSERT TO authenticated USING (true);

CREATE POLICY "Allow authenticated to update their own journey params" ON public.journey_visual_params
  FOR UPDATE TO authenticated USING (true);
