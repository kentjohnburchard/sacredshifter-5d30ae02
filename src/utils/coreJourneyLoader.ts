
import { Journey } from '@/types/journey';

// This function will load all core journey content from the /core_content/journeys directory
export const getCoreJourneys = async (): Promise<Journey[]> => {
  try {
    // Use Vite's glob import to get all markdown files in the journeys directory
    const journeyFiles = import.meta.glob('/src/core_content/journeys/*.md', { 
      query: '?raw', 
      import: 'default' 
    });
    
    const journeys: Journey[] = [];
    
    // Process each journey file
    const importPromises = Object.entries(journeyFiles).map(async ([path, importFn]) => {
      try {
        // Extract the filename (slug) from the path
        const filename = path.split('/').pop()?.replace('.md', '');
        
        if (!filename) return null;
        
        // Load the file content
        const content = await importFn() as string;
        
        // Extract frontmatter from content
        const frontmatter = extractFrontmatter(content);
        
        // Create a journey object
        const journey: Journey = {
          id: `core-${filename}`,
          title: frontmatter.title || filename,
          slug: filename,
          filename,
          description: frontmatter.description,
          tags: extractTags(frontmatter.tags),
          veil_locked: frontmatter.veil_locked === true || frontmatter.veil === true,
          sound_frequencies: frontmatter.frequency?.toString(),
          chakra: frontmatter.chakra,
          chakra_tag: frontmatter.chakra_tag || frontmatter.chakra,
          isCoreContent: true,
          source: 'core_content'
        };
        
        return journey;
      } catch (error) {
        console.error(`Error loading journey from ${path}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(importPromises);
    
    // Filter out null results and add to journeys array
    results.forEach(journey => {
      if (journey) {
        journeys.push(journey);
      }
    });
    
    return journeys;
  } catch (error) {
    console.error('Error loading core journeys:', error);
    return [];
  }
};

// This function loads core journeys and combines them with database journeys
export const getAllJourneys = async (dbJourneys: Journey[] = []): Promise<Journey[]> => {
  try {
    // Get core journeys
    const coreJourneys = await getCoreJourneys();
    
    // Create a map of existing filenames to avoid duplicates
    const filenameMap = new Map<string, boolean>();
    dbJourneys.forEach(journey => {
      if (journey.filename) {
        filenameMap.set(journey.filename, true);
      }
    });
    
    // Filter out core journeys that already exist in DB journeys
    const uniqueCoreJourneys = coreJourneys.filter(journey => 
      journey.filename && !filenameMap.has(journey.filename)
    );
    
    // Combine the arrays
    return [...dbJourneys, ...uniqueCoreJourneys];
  } catch (error) {
    console.error('Error getting all journeys:', error);
    return dbJourneys;
  }
};

// Fix the extractFrontmatter function to convert booleans and numbers to strings
function extractFrontmatter(content: string): Record<string, any> {
  try {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = content.match(frontmatterRegex);
    
    if (!match || !match[1]) {
      return {};
    }
    
    const frontmatterStr = match[1];
    const frontmatterLines = frontmatterStr.split('\n');
    
    const frontmatter: Record<string, any> = {};
    
    frontmatterLines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        
        // Handle quoted strings
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Convert booleans to strings
        if (value === 'true') value = 'true';
        if (value === 'false') value = 'false';
        
        // Convert numbers to strings
        if (!isNaN(Number(value))) value = value.toString();
        
        frontmatter[key] = value;
      }
    });
    
    return frontmatter;
  } catch (error) {
    console.error('Error extracting frontmatter:', error);
    return {};
  }
}

// Helper function to extract tags from frontmatter
function extractTags(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.map(tag => tag.trim()).filter(Boolean);
  }
  
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  
  return [];
}

// Helper function to parse journey content
export function parseJourneyContent(content: string): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Extract content without frontmatter
  const contentWithoutFrontmatter = removeFrontmatter(content);
  
  // Look for specific markers in content
  const frequencyMatch = contentWithoutFrontmatter.match(/frequency:?\s*(\d+(\.\d+)?)/i);
  if (frequencyMatch) {
    result.frequencies = frequencyMatch[1];
  }
  
  return result;
}

// Remove frontmatter from content
export function removeFrontmatter(content: string): string {
  return content.replace(/^---\s*[\s\S]*?---\s*/m, '').trim();
}

// Extract frontmatter into object
export function parseJourneyFrontmatter(content: string): Record<string, any> {
  return extractFrontmatter(content);
}
