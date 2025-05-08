
/**
 * Gets Tailwind CSS classes based on theme name
 * Used by Layout component to apply chakra-specific styling
 */
export function getThemeClasses(theme?: string): string {
  const baseClasses = 'transition-colors duration-300';
  
  switch (theme?.toLowerCase()) {
    case 'root':
      return `${baseClasses} theme-root`;
    case 'sacral':
      return `${baseClasses} theme-sacral`;
    case 'solar-plexus':
      return `${baseClasses} theme-solar-plexus`;
    case 'heart':
      return `${baseClasses} theme-heart`;
    case 'throat':
      return `${baseClasses} theme-throat`;
    case 'third-eye':
      return `${baseClasses} theme-third-eye`;
    case 'crown':
      return `${baseClasses} theme-crown`;
    case 'cosmic':
      return `${baseClasses} theme-cosmic`;
    default:
      return baseClasses;
  }
}

/**
 * Maps a chakra to its associated color
 */
export function getChakraColor(chakraName?: string): string {
  switch (chakraName?.toLowerCase()) {
    case 'root':
      return '#FF0000'; // Red
    case 'sacral':
      return '#FF7F00'; // Orange
    case 'solar plexus':
      return '#FFFF00'; // Yellow
    case 'heart':
      return '#00FF00'; // Green
    case 'throat':
      return '#00FFFF'; // Light Blue
    case 'third eye':
      return '#0000FF'; // Deep Blue
    case 'crown':
      return '#8B00FF'; // Violet
    case 'cosmic':
      return '#FFFFFF'; // White
    default:
      return '#9933FF'; // Default Purple
  }
}

/**
 * Determines if a route should show the navigation sidebar
 */
export function shouldShowNavbar(pathname: string): boolean {
  // Routes where sidebar should be hidden
  const noNavbarRoutes = [
    '/auth',
    '/login',
    '/signup',
    '/reset-password',
    '/onboarding',
  ];
  
  // Check if the current path should hide navbar
  return !noNavbarRoutes.some(route => pathname.startsWith(route));
}
