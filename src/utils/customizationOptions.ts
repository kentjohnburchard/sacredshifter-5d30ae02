
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

export interface SoundscapeOption {
  id: string;
  name: string;
  description: string;
  element: string;
}

// Quotes for standard mode
const standardQuotes = [
  "Your vibe creates your reality.",
  "Sound heals what words cannot.",
  "Tune in, turn up, and transcend.",
  "Breath connects body, mind, and spirit.",
  "Energy flows where intention goes.",
  "You are a spiritual being having a human experience.",
  "Every sound carries a vibration that echoes through eternity.",
  "Let your inner light guide the way.",
  "Align your energy with your aspirations.",
  "In stillness, find your true vibration.",
  "Every sound is a doorway to deeper consciousness.",
  "When frequency aligns with intention, manifestation follows.",
  "Your energy doesn't lie - listen to what it tells you.",
  "The frequency of gratitude attracts more to be grateful for.",
  "Trust the wisdom of your highest self."
];

// Quotes for Kent mode
const kentQuotes = [
  "Choose a chakra and make your ancestors vibrate in awe.",
  "Draggy aura? Shift it like you own the damn multiverse.",
  "You're not just picking a frequency. You're picking your timeline, darling.",
  "That's not Mercury retrograde, honey. It's your vibe on airplane mode.",
  "Your third eye isn't blind, it's just waiting for better content.",
  "If your chakras were any more aligned, the universe would give you a medal.",
  "Manifest like everyone's watching, because the cosmos definitely is.",
  "Your frequency is so high right now, even angels are getting FOMO.",
  "Crown chakra so lit, your past lives are jealous.",
  "That's not anxiety, sweetie. That's your kundalini saying 'let's party!'",
  "Vibrate higher than your ex's expectations.",
  "If your aura was any cleaner, it'd squeak.",
  "Raising my vibration and the cosmic bar, simultaneously.",
  "Your energy field is serving main character energy today.",
  "This isn't just a meditation, it's a cosmic revolution in your DNA."
];

export const getRandomQuote = (kentMode: boolean): string => {
  const quotes = kentMode ? kentQuotes : standardQuotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

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

export const soundscapeOptions: SoundscapeOption[] = [
  {
    id: "bubbles",
    name: "Oceanic Bliss",
    description: "Gentle water sounds to soothe and calm",
    element: "water"
  },
  {
    id: "fire_crackle",
    name: "Hearth Flame",
    description: "Warm crackling sounds for transformation",
    element: "fire"
  },
  {
    id: "wind_chimes",
    name: "Ethereal Winds",
    description: "Delicate chimes carried on the breeze",
    element: "air"
  },
  {
    id: "earth_hum",
    name: "Terra Resonance",
    description: "Deep grounding tones from the earth",
    element: "earth"
  },
  {
    id: "crystal_tones",
    name: "Crystal Symphony",
    description: "Pure harmonic frequencies from crystal bowls",
    element: "all"
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
