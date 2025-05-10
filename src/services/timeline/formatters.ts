
/**
 * Timeline ID formatting utilities
 */

/**
 * Checks if a string is a valid UUID format
 */
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Creates a deterministic UUID-like string from a numeric ID
 * This allows us to use numeric IDs in the timeline_snapshots table
 */
export const createPseudoUUID = (numericId: string | number): string => {
  // Create a proper UUID format based on the numeric ID
  const id = String(numericId).padStart(8, '0');
  return `a0000000-${id.slice(0, 4)}-${id.slice(4, 8)}-0000-000000000000`;
};

/**
 * Safely formats journey ID to ensure compatibility with the database
 * If it's a valid UUID, it returns it directly
 * If it's a numeric ID, it converts it to a valid UUID format
 * Returns null if the ID is invalid or missing
 */
export const formatJourneyId = (id?: string | number): string | null => {
  if (!id) return null;
  
  const strId = String(id).trim();
  
  // If it's already a valid UUID, use it directly
  if (isValidUUID(strId)) {
    return strId;
  }
  
  // For numeric IDs, create a deterministic UUID
  if (/^\d+$/.test(strId)) {
    return createPseudoUUID(strId);
  }
  
  // Handle legacy journey- prefixed IDs
  if (strId.startsWith('journey-')) {
    // If it's already a UUID format with journey- prefix, extract it
    if (isValidUUID(strId.replace('journey-', ''))) {
      return strId.replace('journey-', '');
    }
    
    // For numeric journey IDs with prefix
    const numPart = strId.replace('journey-', '').split('-')[0].replace(/^0+/, '');
    if (numPart && /^\d+$/.test(numPart)) {
      return createPseudoUUID(numPart);
    }
  }
  
  // For any other format, log a warning but don't break functionality
  console.warn(`Invalid journey ID format: ${strId}, cannot log timeline event`);
  return null;
};
