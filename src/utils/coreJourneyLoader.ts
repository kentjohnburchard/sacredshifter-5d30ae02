
import { Journey } from '@/types/journey';
import { parseJourneyFrontmatter } from '@/utils/journeyLoader';

/**
 * Get all journeys from core_content/journeys folder and combine with DB journeys
 */
export const getAllJourneys = async (dbJourneys: Journey[] = []): Promise<Journey[]> => {
  try {
    // Create a map of existing journeys by filename
    const journeyMap = new Map<string, Journey>();
    
    // Add DB journeys to the map
    dbJourneys.forEach(journey => {
      if (journey.filename) {
        journeyMap.set(journey.filename, journey);
      } else if (journey.id) {
        journeyMap.set(`id-${journey.id}`, journey);
      }
    });
    
    // Get all markdown files from core_content/journeys folder
    const journeyFiles = import.meta.glob('/src/core_content/journeys/*.md', { query: '?raw', import: 'default' });
    
    // Load each journey file and parse it
    const coreJourneyPromises = Object.entries(journeyFiles).map(async ([path, loader]) => {
      try {
        // Extract filename from path
        const filename = path.split('/').pop()?.replace('.md', '');
        if (!filename) return null;
        
        // Skip if we already have this journey from DB
        if (journeyMap.has(filename)) return null;
        
        // Load content
        const content = await loader() as string;
        
        // Parse frontmatter
        const frontmatter = parseJourneyFrontmatter(content);
        
        // Get chakra value, defaulting to null
        const chakraValue = frontmatter.chakra || null;
        
        // Create journey object
        const journey: Journey = {
          id: `core-${filename}`,
          filename,
          title: frontmatter.title || filename.replace(/_/g, ' '),
          description: frontmatter.intent || '',
          sound_frequencies: frontmatter.frequency || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                frontmatter.tags ? [frontmatter.tags] : [],
          content,
          isCoreContent: true,
          // Ensure both chakra and chakra_tag fields are set for consistency
          chakra: chakraValue,
          chakra_tag: chakraValue
        };
        
        return journey;
      } catch (err) {
        console.error(`Error loading journey file ${path}:`, err);
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const coreJourneys = (await Promise.all(coreJourneyPromises)).filter(Boolean) as Journey[];
    
    console.log(`Loaded ${coreJourneys.length} journeys from core_content`);
    
    // Combine DB and core journeys
    const allJourneys = [...dbJourneys, ...coreJourneys];
    
    return allJourneys;
  } catch (err) {
    console.error('Error in getAllJourneys:', err);
    // Return DB journeys if there was an error
    return dbJourneys;
  }
};
