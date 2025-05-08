
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/types/journey';
import { normalizeStringArray, normalizeId } from '@/utils/parsers';

// Helper function to normalize journey data from database
const normalizeJourneyData = (data: any): Journey => {
  return {
    ...data,
    id: normalizeId(data.id),
    tags: typeof data.tags === 'string' ? normalizeStringArray(data.tags) : data.tags || [],
    sound_frequencies: data.sound_frequencies || '',
    assigned_songs: normalizeStringArray(data.assigned_songs),
    visual_effects: normalizeStringArray(data.visual_effects),
    strobe_patterns: normalizeStringArray(data.strobe_patterns),
    recommended_users: normalizeStringArray(data.recommended_users),
    source: 'database' as const,
    isEditable: true
  };
};

// Helper function to prepare journey data for database
const prepareJourneyForDb = (journey: Partial<Journey>): Record<string, any> => {
  // Without stringifyArrayForDb, convert arrays to JSON strings
  return {
    ...journey,
    id: journey.id && !isNaN(Number(journey.id)) ? parseInt(journey.id) : undefined,
    tags: Array.isArray(journey.tags) ? JSON.stringify(journey.tags) : journey.tags,
    assigned_songs: Array.isArray(journey.assigned_songs) ? JSON.stringify(journey.assigned_songs) : journey.assigned_songs,
    visual_effects: Array.isArray(journey.visual_effects) ? JSON.stringify(journey.visual_effects) : journey.visual_effects,
    strobe_patterns: Array.isArray(journey.strobe_patterns) ? JSON.stringify(journey.strobe_patterns) : journey.strobe_patterns,
    recommended_users: Array.isArray(journey.recommended_users) ? JSON.stringify(journey.recommended_users) : journey.recommended_users,
  };
};

export const fetchJourneys = async (): Promise<Journey[]> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('id, title, filename, veil_locked, audio_filename, tags, sound_frequencies')
    .order('id');

  if (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }

  // Mark all database journeys as editable and set source
  const dbJourneys = (data || []).map(journey => normalizeJourneyData(journey));

  return dbJourneys;
};

export const fetchJourneyBySlug = async (slug: string): Promise<Journey | null> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .eq('filename', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching journey with slug ${slug}:`, error);
    throw error;
  }

  if (data) {
    return normalizeJourneyData(data);
  }
  
  return null;
};

export const updateJourney = async (journey: Partial<Journey> & { id: string }): Promise<Journey> => {
  console.log("Updating journey with data:", journey);
  
  const dbJourney = prepareJourneyForDb(journey);
  
  // Ensure we're dealing with numeric ID for database operations
  const journeyId = parseInt(journey.id);
  
  const { data, error } = await supabase
    .from('journeys')
    .update(dbJourney)
    .eq('id', journeyId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating journey:', error);
    throw error;
  }

  return normalizeJourneyData(data);
};

export const createJourney = async (journey: Omit<Journey, 'id' | 'created_at' | 'updated_at'>): Promise<Journey> => {
  console.log("Creating new journey with data:", journey);
  
  const dbJourney = prepareJourneyForDb(journey);
  
  // Create new journey record with properly formatted data
  const { data, error } = await supabase
    .from('journeys')
    .insert({
      title: journey.title,
      filename: journey.filename,
      tags: Array.isArray(journey.tags) ? JSON.stringify(journey.tags) : journey.tags,
      veil_locked: journey.veil_locked,
      audio_filename: journey.audio_filename,
      sound_frequencies: journey.sound_frequencies,
      intent: journey.intent,
      duration: journey.duration,
      assigned_songs: Array.isArray(journey.assigned_songs) ? JSON.stringify(journey.assigned_songs) : journey.assigned_songs,
      visual_effects: Array.isArray(journey.visual_effects) ? JSON.stringify(journey.visual_effects) : journey.visual_effects,
      strobe_patterns: Array.isArray(journey.strobe_patterns) ? JSON.stringify(journey.strobe_patterns) : journey.strobe_patterns,
      recommended_users: Array.isArray(journey.recommended_users) ? JSON.stringify(journey.recommended_users) : journey.recommended_users,
      env_lighting: journey.env_lighting,
      env_temperature: journey.env_temperature,
      env_incense: journey.env_incense,
      env_posture: journey.env_posture,
      env_tools: journey.env_tools,
      script: journey.script,
      notes: journey.notes,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    throw error;
  }

  console.log("Journey created successfully:", data);
  return normalizeJourneyData(data);
};
