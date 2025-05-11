
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get a color with opacity
export function getColorWithOpacity(color: string, opacity: number): string {
  // Parse hex color
  if (color.startsWith('#')) {
    // Remove # and parse
    const hex = color.substring(1);
    // Handle both 3-digit and 6-digit hex
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle RGB/RGBA
  if (color.startsWith('rgb')) {
    // If already rgba, replace opacity
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/g, `${opacity})`);
    }
    // Convert rgb to rgba
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  // Default fallback
  return `rgba(155, 135, 245, ${opacity})`;
}

// Generate glassmorphism style properties
export function getGlassmorphismStyle(color = 'purple', opacity = 0.2, blur = 10) {
  const baseColor = color === 'purple' ? '155, 135, 245' : 
                    color === 'blue' ? '98, 147, 232' : 
                    color === 'pink' ? '236, 72, 153' : '155, 135, 245';
                    
  // Ensure opacity is always a number before arithmetic
  const opacityValue = typeof opacity === 'number' ? opacity : 
                       typeof opacity === 'string' ? parseFloat(opacity) || 0.2 : 0.2;
  
  // Store the calculation result in a separate variable
  const backgroundOpacity = opacityValue + 0.1;
  
  return {
    background: `rgba(15, 14, 31, ${backgroundOpacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(${baseColor}, 0.2)`,
    boxShadow: `0 4px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(${baseColor}, 0.1)`,
  };
}

// Generate neon text effect
export function getNeonTextStyle(color = 'purple', intensity = 'medium') {
  const glowColor = color === 'purple' ? '155, 135, 245' : 
                   color === 'blue' ? '98, 147, 232' : 
                   color === 'pink' ? '236, 72, 153' : 
                   color === 'green' ? '95, 232, 185' : '155, 135, 245';
                   
  const glowIntensity = intensity === 'low' ? '0.3' : 
                       intensity === 'medium' ? '0.5' : 
                       intensity === 'high' ? '0.7' : '0.5';
                       
  return {
    color: `rgba(${glowColor}, 1)`,
    textShadow: `0 0 5px rgba(${glowColor}, ${glowIntensity}), 0 0 10px rgba(${glowColor}, ${glowIntensity * 0.8})`,
  };
}

// Add a new function to apply Sacred Circle theme consistently across components
export function getSacredThemeStyles(variant = 'default') {
  switch(variant) {
    case 'card':
      return {
        background: 'rgba(15, 14, 31, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(155, 135, 245, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(155, 135, 245, 0.1)',
        borderRadius: '0.5rem',
      };
    case 'input':
      return {
        background: 'rgba(15, 14, 31, 0.5)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(155, 135, 245, 0.2)',
        color: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      };
    case 'button':
      return {
        background: 'linear-gradient(135deg, rgba(155, 135, 245, 0.8), rgba(98, 147, 232, 0.8))',
        border: '1px solid rgba(155, 135, 245, 0.4)',
        color: 'white',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
        boxShadow: '0 4px 12px rgba(98, 147, 232, 0.3)',
      };
    default:
      return {
        color: 'rgba(255, 255, 255, 0.9)',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
      };
  }
}
