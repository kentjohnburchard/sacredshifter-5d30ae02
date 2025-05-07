
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind's merge function
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract page theme classes based on theme name
 */
export function getThemeClasses(theme?: string): string {
  switch (theme) {
    case 'dark':
      return 'bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white';
    case 'light':
      return 'bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900';
    case 'purple':
      return 'bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950 text-white';
    case 'blue':
      return 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white';
    default:
      return 'bg-black text-white'; // Default theme
  }
}

/**
 * Format a time value in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Checks if the current environment is development mode
 */
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse(jsonString: string, fallback: any = null): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
}
