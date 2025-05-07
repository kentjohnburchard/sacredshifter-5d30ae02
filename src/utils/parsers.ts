
export function normalizeStringArray(value: string | string[] | undefined | null): string[] {
  if (!value) return [];
  
  // If already an array, return it
  if (Array.isArray(value)) {
    return value.map(item => item.trim());
  }
  
  // If it's a string, split by commas and trim
  return value.split(',').map(item => item.trim());
}

// Helper for converting values to string safely
export function normalizeId(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

// Helper for stringify arrays when saving to DB
export function stringifyArrayForDb(arr: string[]): string {
  if (!arr || arr.length === 0) return '';
  return arr.join(', ');
}

/**
 * Safely parses a JSON string to a Record or returns a default object
 * @param value JSON string or already parsed object
 * @returns Record<string, any> object
 */
export function safelyParseJson(value: string | Record<string, any> | null | undefined | number): Record<string, any> {
  if (!value) return {};
  
  if (typeof value === 'object') {
    return value;
  }
  
  // Handle number values by converting to a simple object
  if (typeof value === 'number') {
    return { value };
  }
  
  try {
    return JSON.parse(value) as Record<string, any>;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return { rawValue: value };
  }
}
