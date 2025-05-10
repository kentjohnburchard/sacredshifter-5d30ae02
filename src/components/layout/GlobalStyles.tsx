
import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

/**
 * GlobalStyles - Applies consistent CSS variables and global styles based on the theme
 * This ensures that all pages share the same aesthetic as the Sacred Circle
 */
const GlobalStyles: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  useEffect(() => {
    // Apply global CSS variables when theme changes
    const root = document.documentElement;
    
    // Base theme colors
    if (liftTheVeil) {
      // Pink/fuchsia theme when veil is lifted
      root.style.setProperty('--primary-color', '#ec4899');
      root.style.setProperty('--primary-light', '#f472b6');
      root.style.setProperty('--primary-dark', '#be185d');
      root.style.setProperty('--accent-color', '#e879f9');
      root.style.setProperty('--accent-glow', 'rgba(236, 72, 153, 0.5)');
      root.style.setProperty('--glow-opacity', '0.6');
    } else {
      // Purple/indigo theme for standard mode
      root.style.setProperty('--primary-color', '#8b5cf6');
      root.style.setProperty('--primary-light', '#a78bfa');
      root.style.setProperty('--primary-dark', '#6d28d9');
      root.style.setProperty('--accent-color', '#818cf8');
      root.style.setProperty('--accent-glow', 'rgba(139, 92, 246, 0.5)');
      root.style.setProperty('--glow-opacity', '0.5');
    }
    
    // Shared UI variables regardless of theme
    root.style.setProperty('--card-bg', 'rgba(0, 0, 0, 0.3)');
    root.style.setProperty('--card-border', `rgba(var(--primary-rgb), 0.2)`);
    root.style.setProperty('--border-radius', '0.75rem');
    root.style.setProperty('--transition-speed', '0.3s');
    
    // Convert hex to RGB for opacity control
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
    };
    
    const primaryRgb = hexToRgb(liftTheVeil ? '#ec4899' : '#8b5cf6');
    if (primaryRgb) root.style.setProperty('--primary-rgb', primaryRgb);
    
  }, [liftTheVeil]);
  
  return null; // This component doesn't render anything
};

export default GlobalStyles;
