
import { parseJourneyFrontmatter, removeFrontmatter } from '@/utils/journeyLoader';
import { ChakraTag } from '@/types/chakras';

interface ParsedJourney {
  title: string;
  intent?: string;
  script?: string;
  frequency?: number;
  chakra?: ChakraTag;
  audioFile?: string;
  id?: string;
  [key: string]: any;
}

/**
 * Parse a journey markdown string into structured data
 * @param markdown The markdown content with YAML frontmatter
 * @returns Structured journey data
 */
export const parseJourneyMarkdown = (markdown: string): ParsedJourney => {
  if (!markdown) {
    return { title: 'Untitled Journey' };
  }

  // Extract frontmatter
  const frontmatter = parseJourneyFrontmatter(markdown);
  
  // Extract content without frontmatter
  const content = removeFrontmatter(markdown);

  // Extract frequency from frontmatter or content
  let frequency: number | undefined = undefined;
  if (frontmatter.frequency) {
    frequency = typeof frontmatter.frequency === 'number' 
      ? frontmatter.frequency 
      : parseInt(String(frontmatter.frequency), 10);
  } else {
    // Try to find frequency in content
    const frequencyMatch = content.match(/frequency:?\s*(\d+)\s*hz/i);
    if (frequencyMatch && frequencyMatch[1]) {
      frequency = parseInt(frequencyMatch[1], 10);
    }
  }

  // Build the parsed journey object
  const parsedJourney: ParsedJourney = {
    title: frontmatter.title || 'Untitled Journey',
    intent: frontmatter.intent || frontmatter.description,
    script: content,
    frequency,
    chakra: frontmatter.chakra as ChakraTag,
    audioFile: frontmatter.audioFile || frontmatter.audio
  };

  // Copy all other frontmatter fields
  Object.keys(frontmatter).forEach(key => {
    if (!parsedJourney[key]) {
      parsedJourney[key] = frontmatter[key];
    }
  });

  return parsedJourney;
};

/**
 * Extract sections from the journey script markdown
 * @param markdown The markdown content
 * @returns Object with sections like affirmations, reflections, etc.
 */
export const extractJourneySections = (markdown: string) => {
  const content = removeFrontmatter(markdown);
  
  // Split content by headers
  const sections: Record<string, string> = {};
  let currentSection = 'intro';
  let currentContent: string[] = [];
  
  content.split('\n').forEach(line => {
    // Check if line is a header
    const headerMatch = line.match(/^(#+)\s+(.*)$/);
    if (headerMatch) {
      // Save the current section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      
      // Start a new section
      currentSection = headerMatch[2].toLowerCase().replace(/\s+/g, '_');
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  });
  
  // Save the last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
};
