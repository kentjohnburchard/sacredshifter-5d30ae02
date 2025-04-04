
import { HealingFrequency } from "./frequencies";

export interface JourneyTemplate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  purpose: string;
  frequencies: {
    name: string;
    value: string;
    description: string;
  }[];
  soundSources: string[];
  guidedPrompt: string;
  valeQuote: string;
  affirmation: string;
  features: string[];
  tags: string[];
  chakras?: string[];
  imageUrl?: string;
  duration?: number;
  emoji?: string;
  name?: string;
  visualTheme?: string;
  sessionType?: string;
  vibe?: string;
  color?: string;
}

const journeyTemplates: JourneyTemplate[] = [
  {
    id: "silent-tune",
    title: "Silent Tune",
    subtitle: "Realigning the Inner Ear",
    description: "A healing journey designed to soothe the perception of ringing in the ears through frequency balancing, nervous system regulation, and deep auditory relaxation.",
    purpose: "Soothe the perception of ringing in the ears through frequency balancing, nervous system regulation, and deep auditory relaxation.",
    frequencies: [
      {
        name: "Alpha Waves",
        value: "8-12 Hz",
        description: "Entrains relaxed alertness via binaural beats"
      },
      {
        name: "Delta Waves",
        value: "1-4 Hz",
        description: "For deep regeneration and sleep alignment"
      },
      {
        name: "Solfeggio Frequency",
        value: "528 Hz",
        description: "Cellular repair & vibrational healing"
      },
      {
        name: "Solfeggio Frequency",
        value: "741 Hz",
        description: "Detox, clarity, emotional release"
      },
      {
        name: "Solfeggio Frequency",
        value: "963 Hz",
        description: "Crown silence + deep surrender"
      }
    ],
    soundSources: [
      "Gentle rain + ambient soundbed",
      "Low-volume frequency overlays (optional headphone setting)",
      "Pink noise option toggle"
    ],
    guidedPrompt: "Sit comfortably or lie down.\nLet your awareness drop into your breath.\nImagine the ringing as ripples.\nEach breath softens them. Each tone realigns them.\nYou are tuning yourself back into silence.",
    valeQuote: "Sometimes the world gets loud inside your head. So we breathe, we vibe, and we tune out the static. You don't have to fight the ringing—you just have to meet it with peace.",
    affirmation: "I release inner noise. I tune to silence. I allow healing.",
    features: [
      "\"Low Sensitivity Mode\" toggle (limits high-pitched overtones)",
      "\"No Headphones\" option (play via speaker for hypersensitive users)",
      "Sleep Timer integration (5–60 minutes)",
      "Save to Timeline with \"Silent Tune\" tag"
    ],
    tags: ["Tinnitus", "Ear Health", "Sound Healing", "Relaxation", "Sleep Support"],
    chakras: ["Crown", "Third Eye", "Throat"],
    duration: 30,
    emoji: "🎵",
    name: "Silent Tune",
    visualTheme: "Gentle blue waves",
    sessionType: "Sound Healing",
    vibe: "Calming",
    color: "#4a90e2"
  }
];

// Function to find a template based on frequency
export const getTemplateByFrequency = (frequency: number): JourneyTemplate | null => {
  // Look for a template that has a frequency matching the provided value
  const template = journeyTemplates.find(template => {
    return template.frequencies.some(freq => {
      // Extract the numeric part from frequency values like "528 Hz"
      const freqValue = freq.value.split(' ')[0];
      return parseFloat(freqValue) === frequency;
    });
  });
  
  return template || null;
};

export default journeyTemplates;
