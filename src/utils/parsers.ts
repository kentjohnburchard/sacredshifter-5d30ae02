
/**
 * Utility functions for parsing and normalizing data
 */

/**
 * Normalize an array of strings
 * Handles cases where the input might be a string, array, or undefined
 */
export function normalizeStringArray(input: string | string[] | undefined): string[] {
  if (!input) return [];
  
  if (Array.isArray(input)) {
    return input.filter(Boolean);
  }
  
  if (typeof input === 'string') {
    // Handle JSON string arrays
    if (input.startsWith('[') && input.endsWith(']')) {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean).map(item => String(item));
        }
      } catch (e) {
        // If parsing fails, treat it as a comma-separated string
      }
    }
    
    // Handle comma-separated strings
    return input.split(',').map(item => item.trim()).filter(Boolean);
  }
  
  return [];
}

/**
 * Normalize ID values to strings
 * Handles cases where the ID might be a number or string
 */
export function normalizeId(id: string | number | undefined): string {
  if (id === undefined || id === null) return '';
  return String(id);
}

/**
 * Parse numerical frequency from a string
 */
export function parseFrequency(frequencyString?: string): number | null {
  if (!frequencyString) return null;
  
  // Extract numbers from the string
  const match = frequencyString.match(/(\d+(?:\.\d+)?)/);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  
  return null;
}

/**
 * Format a duration in seconds to a readable time string
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Check if a string is valid JSON
 */
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Parse a string that might be JSON or a regular string
 */
export function parseJsonOrString(input: string): any {
  if (!input) return null;
  
  try {
    if (typeof input === 'string' && (input.startsWith('{') || input.startsWith('['))) {
      return JSON.parse(input);
    }
  } catch (e) {
    // If parsing fails, return the original string
  }
  
  return input;
}
