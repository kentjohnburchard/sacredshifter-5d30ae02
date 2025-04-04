
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
  },
  {
    id: "chakra-harmony",
    title: "Chakra Harmony",
    subtitle: "Balancing Energy Centers",
    description: "A comprehensive journey through all seven chakras to align and balance your energy centers.",
    purpose: "Align and harmonize all seven chakras for complete energetic balance and well-being.",
    frequencies: [
      {
        name: "Root Chakra",
        value: "396 Hz",
        description: "Grounding and security"
      },
      {
        name: "Sacral Chakra",
        value: "417 Hz",
        description: "Creativity and emotional flow"
      },
      {
        name: "Solar Plexus",
        value: "528 Hz",
        description: "Personal power and confidence"
      },
      {
        name: "Heart Chakra",
        value: "639 Hz",
        description: "Love and compassion"
      },
      {
        name: "Throat Chakra",
        value: "741 Hz",
        description: "Expression and truth"
      },
      {
        name: "Third Eye",
        value: "852 Hz",
        description: "Intuition and insight"
      },
      {
        name: "Crown Chakra",
        value: "963 Hz",
        description: "Connection to higher consciousness"
      }
    ],
    soundSources: [
      "Crystal singing bowls",
      "Harmonic overtone chanting",
      "Nature sounds corresponding to each chakra"
    ],
    guidedPrompt: "Begin at your root and feel the energy rise.\nWith each breath, allow the frequencies to resonate and clear blockages.\nMove up through each chakra, feeling them align and balance.\nAs you reach the crown, experience the harmony of your complete energy system.",
    valeQuote: "When all energetic centers are in harmony, you become a channel for pure life force. Every chakra has its wisdom—listen to them all.",
    affirmation: "I am balanced. I am aligned. My energy flows freely through all centers of my being.",
    features: [
      "Progressive chakra journey",
      "Visualizations for each energy center",
      "Option to focus on specific chakras",
      "Full-body energy scan"
    ],
    tags: ["Chakra", "Balance", "Energy Work", "Alignment", "Spiritual"],
    chakras: ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"],
    duration: 45,
    emoji: "🔄",
    visualTheme: "Rainbow spectrum",
    sessionType: "Chakra Alignment",
    vibe: "Balancing",
    color: "#9c27b0"
  },
  {
    id: "deep-sleep",
    title: "Deep Sleep",
    subtitle: "Theta Wave Immersion",
    description: "A gentle descent into deep, restorative sleep through theta wave entrainment and soothing soundscapes.",
    purpose: "Guide the mind and body into deep, rejuvenating sleep through gentle frequency shifts and calming soundscapes.",
    frequencies: [
      {
        name: "Theta Waves",
        value: "4-7 Hz",
        description: "Sleep preparation and dream state"
      },
      {
        name: "Delta Waves",
        value: "1-4 Hz",
        description: "Deep, restorative sleep"
      },
      {
        name: "Solfeggio Frequency",
        value: "396 Hz",
        description: "Releasing anxiety and fear"
      },
      {
        name: "Solfeggio Frequency",
        value: "528 Hz",
        description: "Harmonic repair while sleeping"
      }
    ],
    soundSources: [
      "Ocean waves",
      "Gentle rainfall",
      "Soft ambient pads",
      "Heart-rate synced rhythms"
    ],
    guidedPrompt: "Allow your body to sink deeply into your bed.\nFeel each muscle releasing tension with every exhale.\nYour mind slows as the frequencies guide you deeper.\nDrift naturally into sleep as the journey continues to work with your subconscious.",
    valeQuote: "Sleep is not just rest—it's active healing. While you dream, the frequencies speak to your cells, restoring what the day has taken.",
    affirmation: "I surrender to deep, healing sleep. My mind is calm, my body restores.",
    features: [
      "Auto-fading volume over time",
      "Sleep cycle tracking integration",
      "Ambient light adaptation",
      "Morning gentle wake option"
    ],
    tags: ["Sleep", "Relaxation", "Restoration", "Theta", "Delta"],
    chakras: ["Root", "Third Eye"],
    duration: 60,
    emoji: "💤",
    visualTheme: "Night sky gradient",
    sessionType: "Sleep Support",
    vibe: "Soothing",
    color: "#3f51b5"
  },
  {
    id: "focus-flow",
    title: "Focus Flow",
    subtitle: "Alpha Wave Activation",
    description: "Enhance concentration and mental clarity through alpha wave stimulation and focus-enhancing frequencies.",
    purpose: "Sharpen mental focus, enhance concentration, and boost productivity through brain wave optimization.",
    frequencies: [
      {
        name: "Alpha Waves",
        value: "10-12 Hz",
        description: "Focused alertness and concentration"
      },
      {
        name: "Gamma Bursts",
        value: "40 Hz",
        description: "Cognitive processing and problem-solving"
      },
      {
        name: "Solfeggio Frequency",
        value: "417 Hz",
        description: "Breaking patterns and facilitating change"
      },
      {
        name: "Beta Waves",
        value: "15-18 Hz",
        description: "Active mental engagement"
      }
    ],
    soundSources: [
      "Minimal ambient soundscape",
      "Light water elements",
      "Subtle tempo-based cues",
      "White noise undertones"
    ],
    guidedPrompt: "Center your awareness on your breath.\nFeel your mind becoming sharp yet calm.\nDistractions fade as the frequencies support your natural focus state.\nYour attention becomes laser-like, yet effortless.",
    valeQuote: "The focused mind is like a perfectly tuned instrument. These frequencies help you find that precise resonance where work becomes flow.",
    affirmation: "My mind is clear, sharp, and present. I focus with ease and purpose.",
    features: [
      "Pomodoro technique integration",
      "Focus metrics tracking",
      "Focus retention indicators",
      "Low distraction mode"
    ],
    tags: ["Focus", "Productivity", "Concentration", "Work", "Study"],
    chakras: ["Solar Plexus", "Third Eye"],
    duration: 25,
    emoji: "🔍",
    visualTheme: "Clear blue gradient",
    sessionType: "Productivity",
    vibe: "Energizing",
    color: "#2196f3"
  },
  {
    id: "anxiety-release",
    title: "Anxiety Release",
    subtitle: "Theta-Alpha Blend",
    description: "A gentle journey to release anxiety and restore calm through soothing frequency combinations and guided breathwork.",
    purpose: "Release anxiety, calm the nervous system, and restore inner peace through targeted frequency work.",
    frequencies: [
      {
        name: "Theta Waves",
        value: "6-7 Hz",
        description: "Stress reduction and emotional release"
      },
      {
        name: "Alpha Waves",
        value: "8-10 Hz",
        description: "Relaxed awareness and presence"
      },
      {
        name: "Solfeggio Frequency",
        value: "396 Hz",
        description: "Releasing fear patterns and blockages"
      },
      {
        name: "Solfeggio Frequency",
        value: "639 Hz",
        description: "Heart healing and emotional balance"
      }
    ],
    soundSources: [
      "Flowing water sounds",
      "Gentle wind chimes",
      "Ambient nature sounds",
      "Subtle heartbeat rhythm (60 BPM)"
    ],
    guidedPrompt: "Notice where you're holding tension in your body.\nWith each exhale, release that tension a little more.\nFeel the frequencies washing through you like gentle waves.\nYou are safe here, supported in this space between breaths.",
    valeQuote: "Anxiety isn't your enemy—it's just energy asking for direction. We're not shutting it down; we're transforming it into something useful.",
    affirmation: "I release what doesn't serve me. I am safe in this moment. My breath is my anchor.",
    features: [
      "Guided breathing patterns",
      "Progressive muscle relaxation sequence",
      "Anxiety intensity tracking",
      "SOS quick-relief mode"
    ],
    tags: ["Anxiety", "Stress Relief", "Emotional Balance", "Calm", "Breathwork"],
    chakras: ["Heart", "Solar Plexus", "Root"],
    duration: 20,
    emoji: "🌊",
    visualTheme: "Ocean waves gradient",
    sessionType: "Emotional Release",
    vibe: "Calming",
    color: "#4caf50"
  },
  {
    id: "creativity-boost",
    title: "Creativity Boost",
    subtitle: "Gamma-Theta Combination",
    description: "Activate creative flow states and remove creative blocks through a unique blend of frequency patterns.",
    purpose: "Stimulate creative thinking, remove blocks, and enhance artistic expression through frequency activation.",
    frequencies: [
      {
        name: "Gamma Waves",
        value: "30-40 Hz",
        description: "Heightened perception and insights"
      },
      {
        name: "Theta Waves",
        value: "4-7 Hz",
        description: "Access to subconscious creativity"
      },
      {
        name: "Solfeggio Frequency",
        value: "417 Hz",
        description: "Breaking creative patterns and blocks"
      },
      {
        name: "Solfeggio Frequency",
        value: "528 Hz",
        description: "Transformation and inspiration"
      }
    ],
    soundSources: [
      "Ambient harmonics",
      "Subtle percussion elements",
      "Water droplet sounds",
      "Wind through trees"
    ],
    guidedPrompt: "Close your eyes and see colors forming behind your eyelids.\nLet images and ideas arise without judgment.\nNotice connections forming between seemingly unrelated concepts.\nYour creative mind is a vessel being filled with inspiration.",
    valeQuote: "Creativity isn't about being special—it's about being receptive. These frequencies are tuning you to receive the ideas that have been waiting for you to notice them.",
    affirmation: "I am a vessel for creative expression. Ideas flow through me effortlessly.",
    features: [
      "Visual imagery prompts",
      "Idea capture integration",
      "Inspirational quote generator",
      "Creative challenge suggestions"
    ],
    tags: ["Creativity", "Inspiration", "Artistic Flow", "Innovation", "Ideation"],
    chakras: ["Sacral", "Third Eye", "Crown"],
    duration: 25,
    emoji: "✨",
    visualTheme: "Vibrant color bursts",
    sessionType: "Creative Flow",
    vibe: "Inspiring",
    color: "#ff9800"
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
