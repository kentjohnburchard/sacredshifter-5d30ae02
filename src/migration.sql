
-- Create earth_resonance_entries table to store user's cosmic identity information
CREATE TABLE IF NOT EXISTS public.earth_resonance_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  content TEXT NOT NULL,
  chakra_tag TEXT DEFAULT 'Heart',
  journey_id UUID,
  alignment_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy to allow users to see only their own entries
ALTER TABLE public.earth_resonance_entries ENABLE ROW LEVEL SECURITY;

-- Grant authenticated users ability to read their own entries
CREATE POLICY "Users can view their own earth resonance entries" ON public.earth_resonance_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can create their own earth resonance entries" ON public.earth_resonance_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update their own earth resonance entries" ON public.earth_resonance_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own entries
CREATE POLICY "Users can delete their own earth resonance entries" ON public.earth_resonance_entries
  FOR DELETE USING (auth.uid() = user_id);
