
import { 
  Palette, 
  Star, 
  Moon, 
  Sun, 
  Droplet, 
  Heart, 
  Music, 
  Activity, 
  Sparkles, 
  Brain,
  Flame 
} from "lucide-react";

export interface ThemeOption {
  name: string;
  gradient: string;
  description: string;
  chakra?: string;
  element?: string;
}

export interface WatermarkOption {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export interface ElementOption {
  id: string;
  name: string;
  description: string;
  color: string;
  gradient: string;
  icon: any;
  soundEffect?: string;
}

export interface ZodiacSign {
  id: string;
  name: string;
  element: string;
  dateRange: string;
  symbol: string;
}

export const themeOptions: ThemeOption[] = [
  { 
    name: "Root Chakra", 
    gradient: "linear-gradient(to right, #ff416c, #ff4b2b)",
    description: "Grounding energy for stability and security",
    chakra: "root" 
  },
  { 
    name: "Sacral Chakra", 
    gradient: "linear-gradient(to right, #f09819, #ff5858)",
    description: "Creative energy center for passion and joy",
    chakra: "sacral" 
  },
  { 
    name: "Solar Plexus Chakra", 
    gradient: "linear-gradient(to right, #f2994a, #f2c94c)",
    description: "Power center for confidence and personal will",
    chakra: "solarPlexus" 
  },
  { 
    name: "Heart Chakra", 
    gradient: "linear-gradient(to right, #56ab2f, #a8e063)",
    description: "Love and compassion energy center",
    chakra: "heart" 
  },
  { 
    name: "Throat Chakra", 
    gradient: "linear-gradient(to right, #00c6ff, #0072ff)",
    description: "Communication and self-expression center",
    chakra: "throat" 
  },
  { 
    name: "Third Eye Chakra", 
    gradient: "linear-gradient(to right, #834d9b, #d04ed6)",
    description: "Intuition and higher awareness center",
    chakra: "thirdEye" 
  },
  { 
    name: "Crown Chakra", 
    gradient: "linear-gradient(to right, #8e2de2, #4a00e0)",
    description: "Connection to higher consciousness",
    chakra: "crown" 
  },
  { 
    name: "Fire Element", 
    gradient: "linear-gradient(to right, #ff416c, #ff4b2b)",
    description: "Transformative and passionate energy",
    element: "fire" 
  },
  { 
    name: "Water Element", 
    gradient: "linear-gradient(to right, #4facfe, #00f2fe)",
    description: "Flowing and intuitive energy",
    element: "water" 
  },
  { 
    name: "Earth Element", 
    gradient: "linear-gradient(to right, #a8caba, #5d4157)",
    description: "Stable and grounding energy",
    element: "earth" 
  },
  { 
    name: "Air Element", 
    gradient: "linear-gradient(to right, #e0eafc, #cfdef3)",
    description: "Intellectual and communicative energy",
    element: "air" 
  },
  { 
    name: "Cosmic Ocean", 
    gradient: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)",
    description: "Deep space energy for transcendence",
  },
  { 
    name: "Mystic Forest", 
    gradient: "linear-gradient(to top, #e6b980 0%, #eacda3 100%)",
    description: "Ancient wisdom from natural realms",
  },
  { 
    name: "Custom", 
    gradient: "",
    description: "Create your own unique energy signature",
  }
];

export const watermarkOptions: WatermarkOption[] = [
  {
    id: "zodiac",
    name: "Zodiac Signs",
    description: "Celestial symbols of the 12 star signs",
    icon: Star
  },
  {
    id: "sacred_geometry",
    name: "Sacred Geometry",
    description: "Ancient patterns of creation and consciousness",
    icon: Sparkles
  },
  {
    id: "planets",
    name: "Planets",
    description: "Cosmic bodies of our solar system",
    icon: Moon
  },
  {
    id: "crystals",
    name: "Crystal Formations",
    description: "Earth's natural healing structures",
    icon: Activity
  },
  {
    id: "chakras",
    name: "Chakra Symbols",
    description: "Energy center visual representations",
    icon: Heart
  },
  {
    id: "none",
    name: "None",
    description: "No background watermark",
    icon: Palette
  }
];

export const elementOptions: ElementOption[] = [
  {
    id: "fire",
    name: "Fire",
    description: "Transformative, passionate, energetic",
    color: "#ff4b2b",
    gradient: "linear-gradient(to right, #ff416c, #ff4b2b)",
    icon: Flame,
    soundEffect: "fire_crackle"
  },
  {
    id: "water",
    name: "Water",
    description: "Flowing, intuitive, emotional",
    color: "#00c6ff",
    gradient: "linear-gradient(to right, #4facfe, #00f2fe)",
    icon: Droplet,
    soundEffect: "bubbles"
  },
  {
    id: "earth",
    name: "Earth",
    description: "Stable, grounded, nurturing",
    color: "#56ab2f",
    gradient: "linear-gradient(to right, #a8caba, #5d4157)",
    icon: Sun,
    soundEffect: "earth_hum"
  },
  {
    id: "air",
    name: "Air",
    description: "Intellectual, communicative, free",
    color: "#e0eafc",
    gradient: "linear-gradient(to right, #e0eafc, #cfdef3)",
    icon: Brain,
    soundEffect: "wind_chimes"
  }
];

export const zodiacSigns: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    element: "fire",
    dateRange: "March 21 - April 19",
    symbol: "♈"
  },
  {
    id: "taurus",
    name: "Taurus",
    element: "earth",
    dateRange: "April 20 - May 20",
    symbol: "♉"
  },
  {
    id: "gemini",
    name: "Gemini",
    element: "air",
    dateRange: "May 21 - June 20",
    symbol: "♊"
  },
  {
    id: "cancer",
    name: "Cancer",
    element: "water",
    dateRange: "June 21 - July 22",
    symbol: "♋"
  },
  {
    id: "leo",
    name: "Leo",
    element: "fire",
    dateRange: "July 23 - August 22",
    symbol: "♌"
  },
  {
    id: "virgo",
    name: "Virgo",
    element: "earth",
    dateRange: "August 23 - September 22",
    symbol: "♍"
  },
  {
    id: "libra",
    name: "Libra",
    element: "air",
    dateRange: "September 23 - October 22",
    symbol: "♎"
  },
  {
    id: "scorpio",
    name: "Scorpio",
    element: "water",
    dateRange: "October 23 - November 21",
    symbol: "♏"
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    element: "fire",
    dateRange: "November 22 - December 21",
    symbol: "♐"
  },
  {
    id: "capricorn",
    name: "Capricorn",
    element: "earth",
    dateRange: "December 22 - January 19",
    symbol: "♑"
  },
  {
    id: "aquarius",
    name: "Aquarius",
    element: "air",
    dateRange: "January 20 - February 18",
    symbol: "♒"
  },
  {
    id: "pisces",
    name: "Pisces",
    element: "water",
    dateRange: "February 19 - March 20",
    symbol: "♓"
  }
];

export const getElementForZodiac = (zodiacId: string): string => {
  const sign = zodiacSigns.find(sign => sign.id === zodiacId);
  return sign?.element || "water";
};

export const getSoundscapeForElement = (elementId: string): string => {
  const element = elementOptions.find(el => el.id === elementId);
  return element?.soundEffect || "bubbles";
};
