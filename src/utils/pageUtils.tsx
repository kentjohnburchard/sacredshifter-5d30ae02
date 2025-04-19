
import React from 'react';

// This is a utility file to help transition pages that were using the 'theme' prop
// which isn't directly supported in the Layout component

/**
 * Helper function to apply theme-specific classes based on theme name
 * @param theme Theme name
 * @returns CSS class string to apply
 */
export const getThemeClasses = (theme?: string): string => {
  if (!theme) return '';
  
  switch (theme) {
    case 'dark':
      return 'bg-gray-900 text-white';
    case 'light':
      return 'bg-gray-50 text-gray-900';
    case 'cosmic':
      return 'bg-gradient-to-br from-purple-900 to-indigo-900 text-white';
    case 'nature':
      return 'bg-gradient-to-br from-green-800 to-teal-700 text-white';
    default:
      return '';
  }
};

/**
 * Wraps content in a themed container div
 * @param children Content to wrap
 * @param theme Theme name to apply
 * @returns Themed container with children
 */
export const ThemedContainer: React.FC<{
  children: React.ReactNode;
  theme?: string;
}> = ({ children, theme }) => {
  return (
    <div className={getThemeClasses(theme)}>
      {children}
    </div>
  );
};
