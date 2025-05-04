import { supabase } from '@/integrations/supabase/client';

export interface Journey {
  id: number;
  filename: string;
  title: string;
  tags?: string;
  content?: string;
  veil_locked: boolean;
  visual_effects?: string;
  strobe_patterns?: string;
  assigned_songs?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpiralParams {
  coeffA: number;
  coeffB: number;
  coeffC: number;
  freqA: number;
  freqB: number;
  freqC: number;
  color?: string;
  opacity?: number;
  strokeWeight?: number;
  maxCycles?: number;
  speed?: number;
}

export const fetchJourneys = async (): Promise<Journey[]> => {
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }

  return data || [];
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

  return data;
};

export const updateJourney = async (journey: Partial<Journey> & { id: number }): Promise<Journey> => {
  const { data, error } = await supabase
    .from('journeys')
    .update({
      ...journey,
      updated_at: new Date().toISOString(),
    })
    .eq('id', journey.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating journey:', error);
    throw error;
  }

  return data;
};

export const createJourney = async (journey: Omit<Journey, 'id' | 'created_at' | 'updated_at'>): Promise<Journey> => {
  const { data, error } = await supabase
    .from('journeys')
    .insert({ ...journey })
    .select()
    .single();

  if (error) {
    console.error('Error creating journey:', error);
    throw error;
  }

  return data;
};

/**
 * Parse a journey markdown content to extract structured data
 * @param markdown The raw markdown content
 */
export const parseJourneyMarkdown = (markdown: string): {
  title: string;
  tags: string;
  veilLocked: boolean;
  content: string;
  spiralParams?: SpiralParams;
} => {
  let title = '';
  let tags = '';
  let veilLocked = false;
  let spiralParams: SpiralParams | undefined;
  
  // Extract front matter
  const frontMatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch && frontMatterMatch[1]) {
    const frontMatter = frontMatterMatch[1];
    
    // Extract title
    const titleMatch = frontMatter.match(/title:\s*(.*)/);
    if (titleMatch) title = titleMatch[1].trim();
    
    // Extract tags
    const tagsMatch = frontMatter.match(/tags:\s*\[(.*?)\]/);
    if (tagsMatch) tags = tagsMatch[1].trim();
    
    // Extract veil
    const veilMatch = frontMatter.match(/veil:\s*(.*)/);
    if (veilMatch) veilLocked = veilMatch[1].trim().toLowerCase() === 'true';
  }
  
  // Extract script tag with spiral params
  const scriptMatch = markdown.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch && scriptMatch[1]) {
    const script = scriptMatch[1];
    const paramsMatch = script.match(/window\.journeyParams\s*=\s*(\{[\s\S]*?\});/);
    if (paramsMatch && paramsMatch[1]) {
      try {
        // Use Function constructor to safely evaluate the JSON-like object
        spiralParams = Function(`return ${paramsMatch[1]}`)();
      } catch (error) {
        console.error('Failed to parse spiral parameters:', error);
      }
    }
  }
  
  // Remove front matter and script tag from content
  let content = markdown
    .replace(/^---\n[\s\S]*?\n---/, '')
    .replace(/<script>[\s\S]*?<\/script>/, '')
    .trim();
  
  return {
    title,
    tags,
    veilLocked,
    content,
    spiralParams
  };
};

/**
 * Generate formatted markdown content from structured data
 * @param data Structured journey data
 */
export const generateJourneyMarkdown = (data: {
  title: string;
  intent?: string;
  soundFrequencies?: string;
  script?: string;
  duration?: string;
  notes?: string;
}): string => {
  let markdown = `# ${data.title}\n\n`;
  
  if (data.intent) {
    markdown += `## Intent:\n${data.intent}\n\n`;
  }
  
  if (data.soundFrequencies) {
    markdown += `## Recommended Sound Frequencies:\n${data.soundFrequencies}\n\n`;
  }
  
  if (data.script) {
    markdown += `## Script:\n${data.script}\n\n`;
  }
  
  if (data.duration) {
    markdown += `## Duration:\n${data.duration}\n\n`;
  }
  
  if (data.notes) {
    markdown += `## Notes:\n${data.notes}\n\n`;
  }
  
  return markdown;
};

/**
 * Extract sections from markdown content
 * @param content The markdown content
 * @param sectionName The name of the section to extract
 */
export const extractContentSection = (content: string, sectionName: string): string => {
  const regex = new RegExp(`## ${sectionName}:[\\s\\S]*?(?=##|$)`, 'i');
  const match = content.match(regex);
  if (match && match[0]) {
    return match[0].replace(`## ${sectionName}:`, '').trim();
  }
  return '';
};

/**
 * Bulk import journeys from markdown content array
 * @param markdownContents Array of markdown contents
 */
export const bulkImportJourneys = async (
  markdownContents: string[]
): Promise<{successCount: number; errors: string[]}> => {
  const results = {
    successCount: 0,
    errors: [] as string[]
  };
  
  for (let i = 0; i < markdownContents.length; i++) {
    try {
      const markdown = markdownContents[i];
      const parsedData = parseJourneyMarkdown(markdown);
      
      // Generate filename from title if not present
      const filename = parsedData.title.toLowerCase().replace(/\s+/g, '-');
      
      const journeyData = {
        title: parsedData.title,
        tags: parsedData.tags,
        veil_locked: parsedData.veilLocked,
        filename,
        content: parsedData.content,
      };
      
      // Create journey
      const createdJourney = await createJourney(journeyData);
      
      // If spiral params exist, we'll need to register them
      if (parsedData.spiralParams && createdJourney) {
        // We need to import the addJourneyParams function to register the parameters
        // This would be done separately since it requires importing from a different module
        results.successCount++;
      } else if (createdJourney) {
        results.successCount++;
      }
    } catch (error) {
      results.errors.push(`Failed to import journey ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return results;
};
