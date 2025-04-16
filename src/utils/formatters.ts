/**
 * Format seconds into a human-readable duration string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "15 min")
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  } else if (remainingSeconds === 0) {
    return `${minutes} min`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
  }
};

/**
 * Format a date string for astrology display
 */
export const formatAstroData = (dateString: string): string => {
  if (!dateString) return "Not specified";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateString;
  }
};
