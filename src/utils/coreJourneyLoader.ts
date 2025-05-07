
import { Journey } from '@/types/journey';
import { parseJourneyFrontmatter, parseJourneyContent } from './journeyLoader';
import { normalizeStringArray } from './parsers';

/**
 * Gets all available journeys by combining database journeys 
 * with ones from core_content folder
 */
export const getAllJourneys = async (dbJourneys: Journey[]): Promise<Journey[]> => {
  try {
    // Create a map of existing DB journeys by filename for quick lookup
    const dbJourneysByFilename = new Map<string, Journey>();
    dbJourneys.forEach(journey => {
      if (journey.filename) {
        dbJourneysByFilename.set(journey.filename, journey);
      }
    });
    
    // Load journey files from core_content
    const journeyFiles = import.meta.glob('/src/core_content/journeys/*.md', { query: '?raw', import: 'default' });
    
    // Generate an array of promises for loading each journey file
    const filePromises = Object.keys(journeyFiles).map(async (path) => {
      try {
        // Load the file content
        const contentLoader = journeyFiles[path];
        const content = await contentLoader() as string;
        
        // Extract the filename from the path
        const filename = path.split('/').pop()?.replace('.md', '') || '';
        
        // Skip if this journey already exists in the database
        if (dbJourneysByFilename.has(filename)) {
          return null;
        }
        
        // Parse frontmatter to get journey metadata
        const frontmatter = parseJourneyFrontmatter(content);
        
        // Create a journey object from the content
        const parsedContent = parseJourneyContent(content);
        
        // Ensure tags is an array
        const tags = normalizeStringArray(frontmatter.tags || []);
        
        const journey: Journey = {
          id: `core-${filename}`, // Use a special ID format for core content journeys
          filename,
          title: frontmatter.title || filename,
          veil_locked: frontmatter.veil || false,
          sound_frequencies: frontmatter.frequency?.toString() || parsedContent.frequencies || '',
          description: frontmatter.description || parsedContent.description || '',
          tags: tags,
          content: content,
          source: 'core',
          isEditable: false,
          isCoreContent: true
        };
        
        return journey;
      } catch (error) {
        console.error(`Error loading journey file ${path}:`, error);
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const coreJourneys = (await Promise.all(filePromises)).filter((j): j is Journey => j !== null);
    
    console.log(`Loaded ${coreJourneys.length} journeys from core_content`);
    
    // Combine database journeys with core content journeys
    const allJourneys = [...dbJourneys, ...coreJourneys];
    
    return allJourneys;
  } catch (error) {
    console.error('Error loading core journeys:', error);
    // If there's an error loading core journeys, just return the database journeys
    return dbJourneys;
  }
};
