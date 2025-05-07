
/**
 * Normalizes an input that could be a string, array of strings, or undefined
 * into a consistent array of strings
 */
export const normalizeStringArray = (input: string | string[] | undefined): string[] => {
  if (!input) {
    return [];
  }
  
  if (Array.isArray(input)) {
    return input.filter(Boolean).map(item => item.trim());
  }
  
  // If it's a comma-separated string, split it
  if (typeof input === 'string' && input.includes(',')) {
    return input.split(',').map(item => item.trim()).filter(Boolean);
  }
  
  // If it's a single string, wrap in array
  return input ? [input.trim()] : [];
};

/**
 * Normalize ID values to ensure they're strings
 */
export const normalizeId = (id: string | number | undefined): string => {
  if (id === undefined || id === null) {
    return '';
  }
  return String(id);
};

/**
 * Convert array to comma-separated string for database storage
 */
export const stringifyArrayForDb = (arr: string[] | undefined): string | null => {
  if (!arr || arr.length === 0) {
    return null;
  }
  return arr.join(', ');
};

/**
 * Safely parse a JSON string without throwing an error
 * Returns null if parsing fails
 */
export const safelyParseJson = (jsonString: string): Record<string, any> | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};
