
/**
 * Normalize input to string array format
 * Handles both string and string[] inputs for compatibility
 */
export const normalizeStringArray = (input: string | string[] | undefined): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input.split(',').map(t => t.trim());
};

/**
 * Safely converts any ID to string format
 */
export const normalizeId = (id: string | number | undefined): string => {
  if (id === undefined) return '';
  return String(id);
};

/**
 * Safely prepare array data for database storage
 * Converts arrays to comma-separated strings
 */
export const stringifyArrayForDb = (input: string | string[] | undefined): string | undefined => {
  if (!input) return undefined;
  if (Array.isArray(input)) return input.join(',');
  return input;
};
