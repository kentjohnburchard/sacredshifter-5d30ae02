
import { Journey } from '@/types/journey';
import { normalizeStringArray, normalizeId } from './parsers';

/**
 * Normalizes a Journey object to ensure all properties have consistent types
 * and required fields are present
 * @param journey Any Journey-like object
 * @returns Normalized Journey object with consistent types
 */
export function normalizeJourney(journey: any): Journey {
  if (!journey) return {} as Journey;
  
  // Determine chakra value from either chakra or chakra_tag field
  // Explicitly convert to string or null for type safety
  const chakraValue = journey.chakra || journey.chakra_tag || null;
  
  return {
    id: normalizeId(journey.id),
    title: journey.title || '',
    slug: journey.slug || journey.filename,
    description: journey.description,
    content: journey.content,
    filename: journey.filename,
    audio_filename: journey.audio_filename,
    veil_locked: journey.veil_locked || false,
    tags: normalizeStringArray(journey.tags),
    intent: journey.intent,
    sound_frequencies: journey.sound_frequencies,
    duration: journey.duration,
    source: journey.source,
    isEditable: journey.isEditable,
    isCoreContent: journey.isCoreContent,
    assigned_songs: normalizeStringArray(journey.assigned_songs),
    recommended_users: normalizeStringArray(journey.recommended_users),
    visual_effects: normalizeStringArray(journey.visual_effects),
    strobe_patterns: normalizeStringArray(journey.strobe_patterns),
    env_lighting: journey.env_lighting,
    env_temperature: journey.env_temperature,
    env_incense: journey.env_incense,
    env_posture: journey.env_posture,
    env_tools: journey.env_tools,
    script: journey.script,
    notes: journey.notes,
    created_at: journey.created_at,
    updated_at: journey.updated_at,
    user_id: journey.user_id,
    is_published: journey.is_published,
    frequencies: Array.isArray(journey.frequencies) ? journey.frequencies : 
               (journey.frequencies ? normalizeStringArray(journey.frequencies) : []),
    category: journey.category,
    image_url: journey.image_url,
    is_featured: journey.is_featured,
    needs_moderation: journey.needs_moderation,
    is_approved: journey.is_approved,
    // Ensure both chakra fields are always set consistently to the same value
    // This is critical for type safety across the application
    chakra: chakraValue,
    chakra_tag: chakraValue,
    
    // Optional legacy support
    frontmatter: journey.frontmatter
  };
}
