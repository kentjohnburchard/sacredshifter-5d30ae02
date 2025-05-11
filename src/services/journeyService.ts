
import { supabase } from '@/integrations/supabase/client';
import { Journey } from '@/types/journey';
import { getAllJourneys } from '@/utils/coreJourneyLoader';

// Fetch a specific journey by slug
export async function fetchJourneyBySlug(slug: string): Promise<Journey | null> {
  console.log(`Fetching journey with slug: ${slug}`);
  
  try {
    // Normalize the slug (remove .md extension if present)
    const normalizedSlug = slug.replace(/\.md$/, '');
    
    // First try to get journey from database by slug
    let { data: journeyData, error } = await supabase
      .from('journeys')
      .select('*')
      .eq('slug', normalizedSlug)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching journey from database:', error);
    }
    
    // If found in database, return it
    if (journeyData) {
      console.log('Found journey in database:', journeyData.title);
      return journeyData as Journey;
    }
    
    // If not found in database, try to get from core_content
    console.log('Journey not found in database, checking core_content');
    const coreJourneys = await getAllJourneys([]);
    
    // First try direct match on slug
    let journey = coreJourneys.find(j => j.slug === normalizedSlug);
    
    // Then try to match by filename (with or without .md)
    if (!journey) {
      journey = coreJourneys.find(j => {
        if (!j.filename) return false;
        const cleanFilename = j.filename.replace(/\.md$/, '');
        return cleanFilename === normalizedSlug || 
               // Allow for journey_ prefix in filenames
               cleanFilename === `journey_${normalizedSlug}` ||
               // Try kebab-case conversion from snake_case (without journey_ prefix)
               cleanFilename.replace(/^journey_/, '').replace(/_/g, '-') === normalizedSlug;
      });
    }
    
    // Try matching by ID as string
    if (!journey) {
      journey = coreJourneys.find(j => j.id && j.id.toString() === normalizedSlug);
    }
    
    if (journey) {
      console.log('Found journey in core_content:', journey.title);
      return journey;
    }
    
    console.error(`Journey with slug "${slug}" not found in any source`);
    return null;
  } catch (err) {
    console.error('Error in fetchJourneyBySlug:', err);
    throw err;
  }
}

// Fetch all journeys
export async function fetchJourneys(): Promise<Journey[]> {
  try {
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching journeys:', error);
      return [];
    }
    
    return data as Journey[];
  } catch (err) {
    console.error('Error in fetchJourneys:', err);
    return [];
  }
}
