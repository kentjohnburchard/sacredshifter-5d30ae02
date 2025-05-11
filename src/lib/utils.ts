
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChakraTag } from "@/types/chakras"
 
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
                       
  // Ensure we're working with numbers for the arithmetic operation
  const intensityValue = parseFloat(glowIntensity);
  
  return {
    color: `rgba(${glowColor}, 1)`,
    textShadow: `0 0 5px rgba(${glowColor}, ${glowIntensity}), 0 0 10px rgba(${glowColor}, ${intensityValue * 0.8})`,
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

// Helper function for handling potentially empty select values
export function ensureValidSelectValue<T extends string>(value: T | null | undefined, fallback: T = 'none' as T): T {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return value;
}

// Helper function for displaying placeholder text when no items are available
export function getNoItemsMessage(itemType: string): string {
  return `No ${itemType} available`;
}

// Get appropriate chakra color based on page context
export function getAmbientChakraForRoute(pathname: string): ChakraTag {
  if (pathname.includes('/heart')) return 'Heart';
  if (pathname.includes('/root')) return 'Root';
  if (pathname.includes('/throat')) return 'Throat';
  if (pathname.includes('/third-eye')) return 'Third Eye';
  if (pathname.includes('/crown')) return 'Crown';
  if (pathname.includes('/solar')) return 'Solar Plexus';
  if (pathname.includes('/sacral')) return 'Sacral';
  
  // Default chakras for common sections
  if (pathname.includes('/journey')) return 'Crown';
  if (pathname.includes('/love') || pathname.includes('/community')) return 'Heart';
  if (pathname.includes('/meditation')) return 'Third Eye';
  if (pathname.includes('/frequency')) return 'Throat';
  if (pathname.includes('/dashboard')) return 'Solar Plexus';
  
  // Fallback to crown chakra
  return 'Crown';
}

// Function to determine appropriate background intensity based on page content
export function getBackgroundIntensity(pathname: string): number {
  // Reduce intensity on content-heavy pages for better readability
  if (pathname.includes('/journey/') || 
      pathname.includes('/meditation/') || 
      pathname.includes('/read/')) {
    return 0.3;
  }
  
  // Lower intensity for dashboard and data-heavy pages
  if (pathname.includes('/dashboard') || 
      pathname.includes('/profile') || 
      pathname.includes('/settings')) {
    return 0.35;
  }
  
  // Medium intensity for most pages
  if (pathname === '/' || pathname.includes('/about')) {
    return 0.5;
  }
  
  // Default moderate intensity
  return 0.4;
}

// Function to check device performance capability
export function shouldReduceEffects(): boolean {
  // Check if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  
  // Check if device is likely mobile/low-power
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowPowerMode = window.navigator.hardwareConcurrency && window.navigator.hardwareConcurrency <= 4;
  
  return isMobileOrTablet || isLowPowerMode;
}
