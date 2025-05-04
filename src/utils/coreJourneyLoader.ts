
import { Journey } from '@/services/journeyService';
import { parseJourneyFrontmatter, fileNameToSlug, parseJourneyContent } from '@/utils/journeyLoader';

// This function scans the core_content/journeys directory and loads journey data
export async function loadCoreJourneys(): Promise<Journey[]> {
  try {
    // In a browser environment, we'll need to fetch the file list first
    const journeyFiles = import.meta.glob('/src/core_content/journeys/*.md', { query: '?raw', import: 'default' });
    const journeys: Journey[] = [];
    
    // Process each journey file
    for (const path in journeyFiles) {
      try {
        // Load the file content as raw text
        const content = await journeyFiles[path]();
        
        // Extract the filename from the path
        const filename = path.split('/').pop()?.replace('.md', '') || '';
        
        // Parse frontmatter to get journey metadata
        const frontmatter = parseJourneyFrontmatter(content);
        
        // Parse journey sections
        const parsedContent = parseJourneyContent(content);
        
        // Create a journey object
        const journey: Journey = {
          id: journeys.length + 1000, // Use a high number to avoid conflicts with DB IDs
          filename: filename,
          title: frontmatter.title || filename,
          tags: frontmatter.tags?.join(', '),
          content: content,
          veil_locked: frontmatter.veil || false,
          description: parsedContent.intent || '',
          intent: parsedContent.intent || '',
          sound_frequencies: frontmatter.frequency?.toString() || parsedContent.frequencies || ''
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
