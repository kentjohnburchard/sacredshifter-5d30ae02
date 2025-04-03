
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
