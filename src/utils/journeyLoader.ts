
// Helper functions for loading and parsing journey content

/**
 * Parse frontmatter from journey content
 * Extracts YAML frontmatter between --- markers
 */
export const parseJourneyFrontmatter = (content: string): Record<string, any> => {
  try {
    const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
    
    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatter = frontmatterMatch[1];
      const data: Record<string, any> = {};
      
      // Simple YAML-like parsing
      frontmatter.split('\n').forEach(line => {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
          const [, key, value] = match;
          
          // Handle arrays (comma-separated values)
          if (value.includes(',')) {
            data[key.trim()] = value.split(',').map(v => v.trim());
          } else {
            data[key.trim()] = value.trim();
          }
        }
      });
      
      return data;
    }
    
    return {};
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return {};
  }
};

/**
 * Remove frontmatter from content
 */
export const removeFrontmatter = (content: string): string => {
  return content.replace(/^---\s*[\s\S]*?\s*---/, '').trim();
};

/**
 * Extract frequency values from a string
 */
export const extractFrequencyValue = (frequencyString?: string): string | null => {
  if (!frequencyString) return null;
  
  // Look for patterns like "432Hz" or "432 Hz"
  const match = frequencyString.match(/(\d+(?:\.\d+)?)\s*(?:hz|Hz)/i);
  if (match) {
    return match[1];
  }
  
  return null;
};

/**
 * Parse the full journey content to extract various components
 * Extended to include all required fields for JourneyPage
 */
export const parseJourneyContent = (content: string): {
  title?: string;
  frequencies?: string;
  description?: string;
  chakra?: string;
  intent?: string;
  veil?: boolean;
  frequency?: string | number;
  tags?: string[];
} => {
  // First get frontmatter data
  const frontmatter = parseJourneyFrontmatter(content);
  
  // Extract values from frontmatter first
  const result: Record<string, any> = {
    title: frontmatter.title,
    intent: frontmatter.intent || frontmatter.description,
    veil: frontmatter.veil === 'true' || frontmatter.veil === true,
    frequency: frontmatter.frequency,
    tags: frontmatter.tags,
    chakra: frontmatter.chakra
  };
  
  // If values are not in frontmatter, try to extract from content
  if (!result.frequencies) {
    const frequencyMatch = content.match(/frequencies?:?\s*([^.\n]+)/i);
    if (frequencyMatch) {
      result.frequencies = frequencyMatch[1].trim();
    }
  }
  
  if (!result.description) {
    const paragraphs = removeFrontmatter(content).split('\n\n');
    if (paragraphs[0] && !paragraphs[0].startsWith('#')) {
      result.description = paragraphs[0].trim();
    }
  }
  
  if (!result.chakra) {
    const chakraMatches = content.match(/\b(root|sacral|solar plexus|heart|throat|third eye|crown)\b/i);
    if (chakraMatches) {
      result.chakra = chakraMatches[1].trim();
    }
  }
  
  return result;
};

/**
 * Convert filename to URL slug
 */
export const fileNameToSlug = (fileName: string): string => {
  return fileName.replace(/\.md$/, '');
};
