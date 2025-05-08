
/**
 * Get theme classes based on theme name
 */
export function getThemeClasses(theme: string | undefined): string {
  if (!theme) return '';
  
  const themeMap: Record<string, string> = {
    'default': 'bg-gradient-to-b from-gray-900 to-black text-white',
    'purple': 'bg-gradient-to-b from-purple-900 to-black text-white',
    'blue': 'bg-gradient-to-b from-blue-900 to-black text-white',
    'green': 'bg-gradient-to-b from-green-900 to-black text-white',
    'amber': 'bg-gradient-to-b from-amber-900 to-black text-white',
    'cosmic': 'bg-gradient-to-b from-violet-900 via-indigo-900 to-black text-white',
    'journey': 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white',
    'sacred': 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white'
  };
  
  return themeMap[theme.toLowerCase()] || '';
}

/**
 * Parse string to array
 */
export function parseStringToArray(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  
  try {
    // Try to parse as JSON if it looks like an array
    if (value.startsWith('[') && value.endsWith(']')) {
      return JSON.parse(value);
    }
    
    // Try to split by commas if it's a comma-separated list
    return value.split(',').map(item => item.trim());
  } catch (e) {
    console.error('Error parsing string to array:', e);
    return [];
  }
}
