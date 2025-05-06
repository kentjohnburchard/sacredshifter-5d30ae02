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

-- Create cosmic_blueprints table to store user's cosmic identity information
CREATE TABLE IF NOT EXISTS public.cosmic_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  sacred_blueprint_id UUID REFERENCES public.sacred_blueprints,
  dna_strand_status JSONB NOT NULL DEFAULT '[false, false, false, false, false, false, false, false, false, false, false, false]',
  starseed_resonance TEXT[],
  energetic_alignment_score INTEGER DEFAULT 0,
  personal_code_pattern TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Add RLS policy to allow users to see only their own cosmic blueprint
ALTER TABLE public.cosmic_blueprints ENABLE ROW LEVEL SECURITY;

-- Grant authenticated users ability to read their own cosmic blueprints
CREATE POLICY "Users can view their own cosmic blueprints" ON public.cosmic_blueprints
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own cosmic blueprints
CREATE POLICY "Users can update their own cosmic blueprints" ON public.cosmic_blueprints
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own cosmic blueprints
CREATE POLICY "Users can create their own cosmic blueprints" ON public.cosmic_blueprints
  FOR INSERT WITH CHECK (auth.uid() = user_id);
