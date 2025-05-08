
/**
 * Normalize a string array that might be malformed
 */
export function normalizeStringArray(value: string | string[] | undefined | null): string[] {
  if (!value) return [];
  
  if (Array.isArray(value)) {
    // Filter out any non-string values and empty strings
    return value
      .filter(item => typeof item === 'string' && item.trim() !== '')
      .map(item => item.trim());
  }
  
  if (typeof value === 'string') {
    // Try to parse as JSON if it's a string representation of an array
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return normalizeStringArray(parsed);
        }
      } catch (e) {
        // Fall back to comma-separated parsing if JSON parsing fails
      }
    }
    
    // Process as comma-separated list
    return value.split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
  
  return [];
}

/**
 * Normalize an ID that might be a number, string, or undefined
 */
export function normalizeId(id: string | number | undefined | null): string {
  if (id === undefined || id === null) return '';
  return String(id);
}
