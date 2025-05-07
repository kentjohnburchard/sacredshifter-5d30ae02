
import { extractFrequenciesFromText } from '@/utils/frequencyUtils';

interface JourneyFrontmatter {
  title?: string;
  tags?: string[] | string;
  veil?: boolean;
  frequency?: number | number[] | string;
  duration?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Parses frontmatter from markdown content
 */
export function parseJourneyFrontmatter(content: string): JourneyFrontmatter {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match || !match[1]) {
    return {};
  }
  
  const frontmatter: JourneyFrontmatter = {};
  const lines = match[1].split('\n');
  
  lines.forEach(line => {
    const parts = line.split(':').map(part => part.trim());
    if (parts.length >= 2) {
      const key = parts[0];
      const value = parts.slice(1).join(':').trim();
      
      // Handle array values (comma-separated)
      if (value.includes(',')) {
        frontmatter[key] = value.split(',').map(v => v.trim());
      } 
      // Handle boolean values
      else if (value === 'true' || value === 'false') {
        frontmatter[key] = value === 'true';
      } 
      // Handle numeric values
      else if (!isNaN(Number(value))) {
        frontmatter[key] = Number(value);
      } 
      // Handle string values
      else {
        frontmatter[key] = value;
      }
    }
  });
  
  return frontmatter;
}

/**
 * Removes frontmatter from markdown content
 */
export function removeFrontmatter(content: string): string {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
}

/**
 * Parse journey content to extract metadata
 */
export function parseJourneyContent(content: string): {
  title?: string;
  tags?: string[];
  frequencies?: string;
} {
  const result = {
    title: undefined,
    tags: undefined,
    frequencies: undefined
  } as {
    title?: string;
    tags?: string[];
    frequencies?: string;
  };
  
  // Extract title from first heading
  const titleMatch = content.match(/# (.*)/);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }
  
  // Extract frequencies from content
  const frequencies = extractFrequenciesFromText(content);
  if (frequencies.length > 0) {
    result.frequencies = frequencies.join(', ');
  }
  
  // Extract tags from content (this is a simplified implementation)
  const tagMatches = content.match(/#([a-zA-Z0-9]+)/g);
  if (tagMatches) {
    result.tags = tagMatches.map(tag => tag.replace('#', ''));
  }
  
  return result;
}
