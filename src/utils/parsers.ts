
/**
 * Normalizes a string array that might be stored in different formats
 * Handles arrays, comma-separated strings, and null/undefined values
 */
export function normalizeStringArray(value: string | string[] | null | undefined): string[] {
  if (!value) {
    return [];
  }
  
  if (typeof value === 'string') {
    // Handle comma-separated string
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  if (Array.isArray(value)) {
    // Already an array, just ensure all items are strings and trim them
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  
  return [];
}

/**
 * Normalizes a numeric ID to a string
 */
export function normalizeId(id: string | number | null | undefined): string {
  if (id === null || id === undefined) {
    return '';
  }
  return String(id);
}

/**
 * Converts an array to a comma-separated string for database storage
 */
export function stringifyArrayForDb(arr: string[] | null | undefined): string | null {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  
  return arr.join(',');
}

/**
 * Parses a boolean value from various formats
 */
export function parseBoolean(value: string | boolean | null | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lowercaseValue = value.toLowerCase().trim();
    return lowercaseValue === 'true' || lowercaseValue === '1' || lowercaseValue === 'yes';
  }
  
  return false;
}

/**
 * Safely converts a value to a number, with fallback
 */
export function parseNumber(value: string | number | null | undefined, fallback: number = 0): number {
  if (value === null || value === undefined) {
    return fallback;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}
