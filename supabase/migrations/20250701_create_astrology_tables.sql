
-- Create the user astrology data table
CREATE TABLE IF NOT EXISTS public.user_astrology_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  birth_time VARCHAR,
  birth_place VARCHAR NOT NULL,
  sun_sign VARCHAR,
  moon_sign VARCHAR,
  rising_sign VARCHAR,
  dominant_element VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE public.user_astrology_data ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own astrology data"
  ON public.user_astrology_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own astrology data"
  ON public.user_astrology_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own astrology data"
  ON public.user_astrology_data
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create zodiac compatibility table (for future use)
CREATE TABLE IF NOT EXISTS public.zodiac_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sign1 VARCHAR NOT NULL,
  sign2 VARCHAR NOT NULL,
  compatibility_score INTEGER NOT NULL,
  compatibility_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create planetary transits table (for future use)
CREATE TABLE IF NOT EXISTS public.planetary_transits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planet VARCHAR NOT NULL,
  sign VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_retrograde BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create astrological events table (for future use)
CREATE TABLE IF NOT EXISTS public.astrological_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  importance INTEGER DEFAULT 3, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create astrology sound journeys table (for future use)
CREATE TABLE IF NOT EXISTS public.astrology_sound_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zodiac_sign VARCHAR NOT NULL,
  element VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  frequency NUMERIC,
  audio_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
