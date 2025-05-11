
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChakraTag } from "@/types/chakras";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PulseIntensity = 'subtle' | 'light' | 'medium' | 'strong';

export function getChakraPulseStyle(color: string, intensity: PulseIntensity = 'medium') {
  // Base animation properties
  const baseStyle = {
    animationDuration: '3s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  };
  
  // Adjust opacity and size based on intensity
  switch (intensity) {
    case 'subtle':
      return {
        ...baseStyle,
        boxShadow: `0 0 10px ${color}30, 0 0 20px ${color}10`,
        animation: `pulse-subtle 4s infinite ease-in-out`,
      };
    case 'light':
      return {
        ...baseStyle,
        boxShadow: `0 0 15px ${color}40, 0 0 25px ${color}20`,
        animation: `pulse-light 3.5s infinite ease-in-out`,
      };
    case 'strong':
      return {
        ...baseStyle,
        boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}40, 0 0 60px ${color}20`,
        animation: `pulse-strong 3s infinite ease-in-out`,
      };
    case 'medium':
    default:
      return {
        ...baseStyle,
        boxShadow: `0 0 15px ${color}50, 0 0 30px ${color}30`,
        animation: `pulse-medium 3s infinite ease-in-out`,
      };
  }
}

// Add the missing utility functions that ThemeEnhancer.tsx is importing
export function getAmbientChakraForRoute(pathname: string): ChakraTag {
  // Default chakra for unknown routes
  let chakra: ChakraTag = 'Crown';
  
  // Map routes to chakras
  if (pathname.includes('/journey')) {
    // For journey pages, use a soothing violet color
    chakra = 'Crown';
  } else if (pathname.includes('/heart') || pathname.includes('/love')) {
    chakra = 'Heart';
  } else if (pathname.includes('/throat') || pathname.includes('/communication')) {
    chakra = 'Throat';
  } else if (pathname.includes('/third-eye') || pathname.includes('/intuition')) {
    chakra = 'ThirdEye';
  } else if (pathname.includes('/sacral') || pathname.includes('/creativity')) {
    chakra = 'Sacral';
  } else if (pathname.includes('/root') || pathname.includes('/grounding')) {
    chakra = 'Root';
  } else if (pathname.includes('/solar') || pathname.includes('/power')) {
    chakra = 'SolarPlexus';
  }
  
  return chakra;
}

export function getBackgroundIntensity(pathname: string): number {
  // Higher intensity for important pages, lower for utility pages
  if (pathname === '/' || pathname === '/home') {
    return 0.7; // Home page gets a strong effect
  } else if (pathname.includes('/journey/')) {
    return 0.6; // Journey experience pages get medium-high intensity
  } else if (pathname.includes('/admin')) {
    return 0.3; // Admin pages get low intensity to avoid distraction
  } else if (pathname.includes('/profile') || pathname.includes('/settings')) {
    return 0.4; // User pages get medium-low intensity
  }
  
  // Default intensity for other pages
  return 0.5;
}
