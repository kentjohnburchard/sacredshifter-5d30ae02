
import { Journey } from '@/services/journeyService';
import { parseJourneyFrontmatter, fileNameToSlug } from '@/utils/journeyLoader';

// This function scans the core_content/journeys directory and loads journey data
export async function loadCoreJourneys(): Promise<Journey[]> {
  try {
    // In a browser environment, we'll need to fetch the file list first
    const journeyFiles = import.meta.glob('/src/core_content/journeys/*.md');
    const journeys: Journey[] = [];
    
    // Process each journey file
    for (const path in journeyFiles) {
      try {
        // Load the file content
        const module = await journeyFiles[path]();
        const content = module.default;
        
        // Extract the filename from the path
        const filename = path.split('/').pop()?.replace('.md', '') || '';
        
        // Parse frontmatter to get journey metadata
        const frontmatter = parseJourneyFrontmatter(content);
        
        // Create a journey object
        const journey: Journey = {
          id: journeys.length + 1000, // Use a high number to avoid conflicts with DB IDs
          filename: filename,
          title: frontmatter.title || filename,
          tags: frontmatter.tags?.join(', '),
          content: content,
          veil_locked: frontmatter.veil || false,
          description: frontmatter.description || '',
          intent: frontmatter.intent || '',
          sound_frequencies: frontmatter.frequency?.toString() || ''
        };
        
        journeys.push(journey);
      } catch (err) {
        console.error(`Error loading journey file: ${path}`, err);
      }
    }
    
    return journeys;
  } catch (err) {
    console.error("Failed to load core journeys:", err);
    return [];
  }
}

// Utility function to combine journeys from core content and database
export async function getAllJourneys(dbJourneys: Journey[]): Promise<Journey[]> {
  try {
    const coreJourneys = await loadCoreJourneys();
    
    // Create a set of existing filenames to avoid duplicates
    const existingFilenames = new Set(dbJourneys.map(j => j.filename));
    
    // Only add core journeys that don't exist in the database
    const uniqueCoreJourneys = coreJourneys.filter(j => !existingFilenames.has(j.filename));
    
    return [...dbJourneys, ...uniqueCoreJourneys];
  } catch (err) {
    console.error("Failed to combine journeys:", err);
    return dbJourneys;
  }
}
