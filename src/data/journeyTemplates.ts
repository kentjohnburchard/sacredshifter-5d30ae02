
import { HealingFrequency } from "@/data/frequencies";

export interface JourneyTemplate {
  id: string;
  frequency: number;
  name: string;
  chakra: string;
  vibe: string;
  visualTheme: string;
  affirmation: string;
  sessionType: string;
  color: string;
  emoji: string;
}

export const journeyTemplates: JourneyTemplate[] = [
  {
    id: "396hz",
    frequency: 396,
    name: "Grounded Release",
    chakra: "Root",
    vibe: "Safety, stability, releasing fear",
    visualTheme: "Deep red earth ripple",
    affirmation: "I am safe. I am rooted. I let go of fear.",
    sessionType: "Body scan, breath + grounding",
    color: "from-red-400 to-red-600",
    emoji: "🔴"
  },
  {
    id: "417hz",
    frequency: 417,
    name: "Flow & Renewal",
    chakra: "Sacral",
    vibe: "Creativity, pleasure, clearing shame",
    visualTheme: "Orange water bloom",
    affirmation: "I embrace change. I create with joy.",
    sessionType: "Movement or emotional detox",
    color: "from-orange-400 to-orange-600",
    emoji: "🟠"
  },
  {
    id: "528hz",
    frequency: 528,
    name: "Radiant Transformation",
    chakra: "Solar Plexus",
    vibe: "Empowerment, love, cellular healing",
    visualTheme: "Golden solar pulse",
    affirmation: "I am powerful. I transform with love.",
    sessionType: "Intention-setting + frequency bath",
    color: "from-yellow-400 to-yellow-600",
    emoji: "🟡"
  },
  {
    id: "639hz",
    frequency: 639,
    name: "Open Heart Alignment",
    chakra: "Heart",
    vibe: "Connection, healing relationships, inner peace",
    visualTheme: "Green aura bloom",
    affirmation: "I open my heart to love and forgiveness.",
    sessionType: "Heart coherence + emotional release",
    color: "from-green-400 to-green-600",
    emoji: "💚"
  },
  {
    id: "741hz",
    frequency: 741,
    name: "Speak Your Truth",
    chakra: "Throat",
    vibe: "Detox, self-expression, authenticity",
    visualTheme: "Blue harmonic waves",
    affirmation: "I express myself freely and clearly.",
    sessionType: "Breath + guided vocal release",
    color: "from-blue-400 to-blue-600",
    emoji: "🔵"
  },
  {
    id: "852hz",
    frequency: 852,
    name: "Inner Vision",
    chakra: "Third Eye",
    vibe: "Intuition, clarity, wisdom",
    visualTheme: "Indigo fractal bloom",
    affirmation: "I trust my inner guidance.",
    sessionType: "Meditation + intuitive activation",
    color: "from-indigo-400 to-indigo-600",
    emoji: "🟣"
  },
  {
    id: "963hz",
    frequency: 963,
    name: "Cosmic Connection",
    chakra: "Crown",
    vibe: "Unity, spiritual awakening, oneness",
    visualTheme: "Violet spiral mandala",
    affirmation: "I am connected to all that is.",
    sessionType: "Deep sound journey + silence space",
    color: "from-purple-400 to-purple-600",
    emoji: "⚪"
  }
];

// Helper function to find a template by frequency
export const getTemplateByFrequency = (frequency: number): JourneyTemplate | undefined => {
  return journeyTemplates.find(template => template.frequency === frequency);
};

// Helper function to find a template by chakra
export const getTemplateByChakra = (chakra: string): JourneyTemplate | undefined => {
  return journeyTemplates.find(template => 
    template.chakra.toLowerCase() === chakra.toLowerCase()
  );
};
