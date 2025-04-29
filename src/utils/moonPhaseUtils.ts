
import { format } from 'date-fns';

export type MoonPhase = 'new-moon' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 
                         'full-moon' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';

export interface MoonPhaseInfo {
  phase: MoonPhase;
  icon: string;
  name: string;
}

/**
 * Calculate the moon phase based on a date
 * This is a simplified algorithm that gives approximate moon phases
 */
export function getMoonPhase(date: Date): MoonPhaseInfo {
  // Moon cycle is approximately 29.53 days
  const MOON_CYCLE = 29.53;
  
  // Jan 6, 2000 was a new moon
  const KNOWN_NEW_MOON = new Date('2000-01-06T00:00:00Z');
  
  // Calculate days since known new moon
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in moon cycle (0 to 1)
  const position = (daysSinceNewMoon % MOON_CYCLE) / MOON_CYCLE;
  
  // Determine the moon phase based on position
  if (position < 0.03) return { phase: 'new-moon', icon: '🌑', name: 'New Moon' };
  else if (position < 0.22) return { phase: 'waxing-crescent', icon: '🌒', name: 'Waxing Crescent' };
  else if (position < 0.28) return { phase: 'first-quarter', icon: '🌓', name: 'First Quarter' };
  else if (position < 0.47) return { phase: 'waxing-gibbous', icon: '🌔', name: 'Waxing Gibbous' };
  else if (position < 0.53) return { phase: 'full-moon', icon: '🌕', name: 'Full Moon' };
  else if (position < 0.72) return { phase: 'waning-gibbous', icon: '🌖', name: 'Waning Gibbous' };
  else if (position < 0.78) return { phase: 'last-quarter', icon: '🌗', name: 'Last Quarter' };
  else return { phase: 'waning-crescent', icon: '🌘', name: 'Waning Crescent' };
}

/**
 * Get the zodiac sign based on a date
 */
export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

/**
 * Get time of day label
 */
export function getTimeOfDay(date: Date): string {
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 20) return "Evening";
  return "Night";
}

/**
 * Format a timestamp in a user-friendly way
 */
export function formatCosmicTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const formattedDate = format(date, "MMMM d, yyyy");
  const formattedTime = format(date, "h:mm a");
  const timeOfDay = getTimeOfDay(date);
  
  return `${timeOfDay} | ${formattedTime} | ${formattedDate}`;
}
