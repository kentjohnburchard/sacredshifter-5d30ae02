
import { Journey } from '@/services/journeyService';

interface JourneyFrontmatter {
  title?: string;
  frequency?: string | number;
  tags?: string | string[];
  veil?: boolean;
  [key: string]: any;
}

export function parseJourneyFrontmatter(content: string): JourneyFrontmatter {
  const frontmatterRegex = /---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match || !match[1]) {
    return {};
  }
  
  const frontmatter: JourneyFrontmatter = {};
  const lines = match[1].split('\n');
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Handle arrays (comma-separated values)
      if (value.includes(',')) {
        frontmatter[key] = value.split(',').map(item => item.trim());
      } 
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        frontmatter[key] = value === 'true';
      }
      // Handle numbers
      else if (!isNaN(Number(value))) {
        frontmatter[key] = Number(value);
      }
      // Handle strings
      else {
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        frontmatter[key] = value;
      }
    }
  });
  
  return frontmatter;
}

export function removeFrontmatter(content: string): string {
  return content.replace(/---\n[\s\S]*?\n---/, '').trim();
}

interface ParsedJourneyContent {
  intent?: string;
  frequencies?: string;
  duration?: string;
  [key: string]: string | undefined;
}

export function parseJourneyContent(content: string): ParsedJourneyContent {
  const result: ParsedJourneyContent = {};
  const contentWithoutFrontmatter = removeFrontmatter(content);
  
  // Extract sections like "## Intent" or "## Frequencies"
  const sections = contentWithoutFrontmatter.split(/\n#{2}\s+/);
  
  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const sectionTitle = lines[0].toLowerCase();
    const sectionContent = lines.slice(1).join('\n').trim();
    
    if (sectionTitle === 'intent' || sectionTitle === 'intention') {
      result.intent = sectionContent;
    } else if (sectionTitle === 'frequencies' || sectionTitle === 'frequency') {
      result.frequencies = sectionContent;
    } else if (sectionTitle === 'duration') {
      result.duration = sectionContent;
    }
  });
  
  return result;
}

export function loadJourneyFromMarkdown(filename: string, content: string): Journey {
  const frontmatter = parseJourneyFrontmatter(content);
  const parsed = parseJourneyContent(content);
  
  return {
    id: 0, // Will be assigned by the database
    filename,
    title: frontmatter.title || filename,
    veil_locked: frontmatter.veil || false,
    // Only include fields that exist in the Journey interface
    sound_frequencies: frontmatter.frequency?.toString() || parsed.frequencies || '',
  };
}
