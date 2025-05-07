
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
export function safelyParseJson(value: string | Record<string, any> | null | undefined | number | boolean | any[]): Record<string, any> {
  if (value === null || value === undefined) return {};
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  
  // Handle primitive types
  if (typeof value === 'number') {
    return { value };
  }
  
  if (typeof value === 'boolean') {
    return { value };
  }
  
  // Handle arrays by converting to {items: []}
  if (Array.isArray(value)) {
    return { items: value };
  }
  
  // Handle string (potentially JSON)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null ? parsed : { value: parsed };
    } catch (e) {
      return { rawValue: value };
    }
  }
  
  // Fallback for any other type
  return { value };
}
