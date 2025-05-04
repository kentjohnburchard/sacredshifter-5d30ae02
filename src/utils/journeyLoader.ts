
import { Journey } from '@/services/journeyService';

// This maps filenames to their slugs for consistent routing
export function fileNameToSlug(fileName: string): string {
  return fileName
    .replace(/^journey_/, '')
    .replace(/\.md$/, '')
    .toLowerCase();
}

// This maps chakras to background colors for consistent theming
export function chakraToBackgroundClass(chakra?: string): string {
  switch (chakra?.toLowerCase()) {
    case 'root':
      return 'bg-gradient-to-br from-red-900/30 to-black';
    case 'sacral':
      return 'bg-gradient-to-br from-orange-900/30 to-black';
    case 'solar plexus':
      return 'bg-gradient-to-br from-yellow-900/30 to-black';
    case 'heart':
      return 'bg-gradient-to-br from-green-900/30 to-black';
    case 'throat':
      return 'bg-gradient-to-br from-blue-900/30 to-black';
    case 'third eye':
      return 'bg-gradient-to-br from-indigo-900/30 to-black';
    case 'crown':
      return 'bg-gradient-to-br from-purple-900/30 to-black';
    default:
      return 'bg-gradient-to-br from-purple-900/20 to-black';
  }
}

// Extract frequency values from text to set visualization parameters
export function extractFrequencyValue(text?: string): number | undefined {
  if (!text) return undefined;
  
  // Look for common frequency patterns (e.g., "396Hz", "528 Hz")
  const frequencyMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hz|hertz)/i);
  if (frequencyMatch && frequencyMatch[1]) {
    return parseFloat(frequencyMatch[1]);
  }
  
  return undefined;
}

// Parse frontmatter from a journey markdown file
export function parseJourneyFrontmatter(content: string): {
  title?: string;
  tags?: string[];
  chakra?: string;
  frequency?: number;
  veil?: boolean;
} {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontMatterRegex);
  
  if (!match || !match[1]) {
    return {};
  }
  
  const frontMatter = match[1];
  const result: any = {};
  
  // Extract key-value pairs
  const titleMatch = frontMatter.match(/title:\s*(.*)/);
  if (titleMatch && titleMatch[1]) {
    result.title = titleMatch[1].trim();
  }
  
  const tagsMatch = frontMatter.match(/tags:\s*\[(.*)\]/);
  if (tagsMatch && tagsMatch[1]) {
    result.tags = tagsMatch[1]
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag);
  }
  
  const chakraMatch = frontMatter.match(/chakra:\s*(.*)/);
  if (chakraMatch && chakraMatch[1]) {
    result.chakra = chakraMatch[1].trim();
  }
  
  const frequencyMatch = frontMatter.match(/frequency:\s*(.*)/);
  if (frequencyMatch && frequencyMatch[1]) {
    result.frequency = parseFloat(frequencyMatch[1].trim());
  }
  
  const veilMatch = frontMatter.match(/veil:\s*(.*)/);
  if (veilMatch && veilMatch[1]) {
    result.veil = veilMatch[1].trim() === 'true';
  }
  
  return result;
}

// Remove the frontmatter from markdown content
export function removeFrontmatter(content: string): string {
  return content.replace(/^---\s*\n[\s\S]*?\n---/, '').trim();
}

// Parse journey content sections
export function parseJourneyContent(content: string): {
  intent?: string;
  frequencies?: string;
  script?: string;
  duration?: string;
  notes?: string;
} {
  const cleanContent = removeFrontmatter(content);
  const result: any = {};
  
  // Extract Intent section
  const intentMatch = cleanContent.match(/## Intent[:\s]*\n([\s\S]*?)(?=##|$)/);
  if (intentMatch && intentMatch[1]) {
    result.intent = intentMatch[1]
      .replace(/^-\s*/gm, '')
      .trim();
  }
  
  // Extract Recommended Sound Frequencies section
  const frequenciesMatch = cleanContent.match(/## Recommended Sound Frequencies[:\s]*\n([\s\S]*?)(?=##|$)/);
  if (frequenciesMatch && frequenciesMatch[1]) {
    result.frequencies = frequenciesMatch[1]
      .replace(/^-\s*/gm, '')
      .trim();
  }
  
  // Extract Script section
  const scriptMatch = cleanContent.match(/## Script[:\s]*\n([\s\S]*?)(?=##|$)/);
  if (scriptMatch && scriptMatch[1]) {
    result.script = scriptMatch[1].trim();
  }
  
  // Extract Duration section
  const durationMatch = cleanContent.match(/## Duration[:\s]*\n([\s\S]*?)(?=##|$)/);
  if (durationMatch && durationMatch[1]) {
    result.duration = durationMatch[1]
      .replace(/^-\s*/gm, '')
      .trim();
  }
  
  // Extract Notes section
  const notesMatch = cleanContent.match(/## Notes[:\s]*\n([\s\S]*?)(?=##|$)/);
  if (notesMatch && notesMatch[1]) {
    result.notes = notesMatch[1]
      .replace(/^-\s*/gm, '')
      .trim();
  }
  
  return result;
}

// Detect frequency values from a journey markdown file
export function detectJourneyFrequency(content: string): number | undefined {
  const frontMatter = parseJourneyFrontmatter(content);
  
  // First try to get it from frontmatter
  if (frontMatter.frequency) {
    return frontMatter.frequency;
  }
  
  // Then check for frequencies in the content
  const journeyContent = parseJourneyContent(content);
  return extractFrequencyValue(journeyContent.frequencies);
}
