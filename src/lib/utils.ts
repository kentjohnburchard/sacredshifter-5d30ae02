
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
