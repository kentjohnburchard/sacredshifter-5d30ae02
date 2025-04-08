
-- Function to get journey templates with all their related details
CREATE OR REPLACE FUNCTION public.get_journey_templates_with_details()
RETURNS TABLE (
  id TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  purpose TEXT,
  chakras TEXT[],
  emoji TEXT,
  name TEXT,
  visual_theme TEXT,
  session_type TEXT,
  vibe TEXT,
  color TEXT,
  duration INTEGER,
  affirmation TEXT,
  guided_prompt TEXT,
  valeQuote TEXT,
  frequencies JSONB,
  features TEXT[],
  soundSources TEXT[],
  tags TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH template_frequencies AS (
    SELECT
      jt.id as template_id,
      jsonb_agg(
        jsonb_build_object(
          'name', jtf.name,
          'value', jtf.value,
          'description', jtf.description
        )
      ) as frequencies
    FROM
      public.journey_templates jt
    LEFT JOIN public.journey_template_frequencies jtf ON jt.id = jtf.journey_template_id
    GROUP BY jt.id
  ),
  template_features AS (
    SELECT
      jt.id as template_id,
      array_agg(jtfe.feature) as features
    FROM
      public.journey_templates jt
    LEFT JOIN public.journey_template_features jtfe ON jt.id = jtfe.journey_template_id
    GROUP BY jt.id
  ),
  template_sound_sources AS (
    SELECT
      jt.id as template_id,
      array_agg(jtss.source) as sound_sources
    FROM
      public.journey_templates jt
    LEFT JOIN public.journey_template_sound_sources jtss ON jt.id = jtss.journey_template_id
    GROUP BY jt.id
  )
  SELECT
    jt.id,
    jt.title,
    jt.subtitle,
    jt.description,
    jt.purpose,
    jt.chakras,
    jt.emoji,
    jt.name,
    jt.visual_theme,
    jt.session_type,
    jt.vibe,
    jt.color,
    jt.duration,
    jt.affirmation,
    jt.guided_prompt,
    jt.vale_quote as "valeQuote",
    COALESCE(tf.frequencies, '[]'::jsonb) as frequencies,
    COALESCE(tfeat.features, '{}'::text[]) as features,
    COALESCE(tss.sound_sources, '{}'::text[]) as "soundSources",
    '{}'::text[] as tags  -- Default empty tags
  FROM
    public.journey_templates jt
  LEFT JOIN template_frequencies tf ON jt.id = tf.template_id
  LEFT JOIN template_features tfeat ON jt.id = tfeat.template_id
  LEFT JOIN template_sound_sources tss ON jt.id = tss.template_id
  ORDER BY jt.title;
END;
$$;

-- Function to insert a journey audio mapping
CREATE OR REPLACE FUNCTION public.insert_journey_audio_mapping(
  template_id TEXT,
  file_name TEXT,
  url TEXT DEFAULT NULL,
  is_primary BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  inserted_id UUID;
BEGIN
  INSERT INTO public.journey_template_audio_mappings (
    journey_template_id, 
    audio_file_name,
    audio_url,
    is_primary
  ) VALUES (
    template_id,
    file_name,
    url,
    is_primary
  )
  RETURNING id INTO inserted_id;
  
  SELECT 
    jsonb_build_object(
      'id', inserted_id,
      'journey_template_id', template_id,
      'audio_file_name', file_name,
      'audio_url', url,
      'is_primary', is_primary
    ) INTO result;
    
  RETURN result;
END;
$$;

-- Update the get_journey_audio_mapping function to return all audio mappings when no template_id is provided
CREATE OR REPLACE FUNCTION public.get_journey_audio_mappings()
RETURNS TABLE (
  journey_template_id TEXT,
  audio_file_name TEXT,
  audio_url TEXT,
  is_primary BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    journey_template_id, 
    audio_file_name, 
    audio_url,
    is_primary
  FROM 
    public.journey_template_audio_mappings
  ORDER BY 
    is_primary DESC, 
    created_at ASC;
$$;
