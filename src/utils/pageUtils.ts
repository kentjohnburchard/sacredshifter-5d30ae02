
/**
 * Get CSS classes for a specific theme
 * @param theme Theme name
 * @returns CSS classes string
 */
export const getThemeClasses = (theme?: string): string => {
  switch(theme) {
    case 'heart':
      return 'theme-heart bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-pink-900/30';
    case 'cosmic':
      return 'theme-cosmic bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30';
    case 'earth':
      return 'theme-earth bg-gradient-to-br from-green-900/30 via-teal-900/20 to-emerald-900/30';
    case 'fire':
      return 'theme-fire bg-gradient-to-br from-red-900/30 via-orange-900/20 to-amber-900/30';
    case 'water':
      return 'theme-water bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-teal-900/30';
    case 'air':
      return 'theme-air bg-gradient-to-br from-sky-900/30 via-blue-900/20 to-indigo-900/30';
    case 'ether':
      return 'theme-ether bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-fuchsia-900/30';
    default:
      return 'theme-default bg-gradient-to-br from-gray-900/50 via-purple-900/30 to-gray-900/50';
  }
};

/**
 * Format a date string
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Calculate reading time for content
 * @param content Text content
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
};

/**
 * Create a URL-friendly slug from a string
 * @param text Text to slugify
 * @returns URL-friendly slug
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};
