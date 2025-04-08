
import { SongMapping, FunctionalityMap, AppFunctionality } from "@/types/music";

// Descriptions for each functionality type
export const functionalityDescriptions: FunctionalityMap = {
  'meditation': {
    name: 'Meditation',
    description: 'Sounds that help deepen your meditation practice',
    color: 'from-purple-500 to-indigo-500'
  },
  'chakra-healing': {
    name: 'Chakra Healing',
    description: 'Target specific chakras for healing and balancing',
    color: 'from-red-500 to-orange-500'
  },
  'hermetic-principle': {
    name: 'Hermetic Wisdom',
    description: 'Sounds aligned with the seven Hermetic principles',
    color: 'from-amber-500 to-yellow-500'
  },
  'frequency-shift': {
    name: 'Frequency Shift',
    description: 'Helps shift your vibrational frequency',
    color: 'from-teal-500 to-emerald-500'
  },
  'journey': {
    name: 'Sound Journey',
    description: 'Guided audio journeys for transformation',
    color: 'from-blue-500 to-cyan-500'
  },
  'focus': {
    name: 'Focus',
    description: 'Enhance concentration and mental clarity',
    color: 'from-indigo-500 to-violet-500'
  },
  'sleep': {
    name: 'Sleep',
    description: 'Sounds to help you fall asleep and rest deeply',
    color: 'from-blue-800 to-indigo-800'
  },
  'energy-boost': {
    name: 'Energy Boost',
    description: 'Increase energy and motivation',
    color: 'from-orange-500 to-red-500'
  },
  'heart-opening': {
    name: 'Heart Opening',
    description: 'Open and heal the heart center',
    color: 'from-green-500 to-emerald-500'
  },
  'grounding': {
    name: 'Grounding',
    description: 'Connect with the earth and stabilize energy',
    color: 'from-stone-500 to-green-800'
  }
};

// Sample song mappings
const songMappings: SongMapping[] = [
  // Meditation Songs
  {
    id: "med-1",
    title: "Cosmic Breath",
    artist: "Sacred Soundscapes",
    frequency: 432,
    chakra: "Crown",
    functionality: "meditation",
    description: "Deep meditation sound for spiritual connection",
    duration: 600, // 10 minutes
    audioUrl: "meditation/cosmic-breath.mp3"
  },
  {
    id: "med-2",
    title: "Ocean Mindfulness",
    artist: "Healing Vibrations",
    frequency: 396,
    functionality: "meditation",
    description: "Wave-like patterns to calm the mind",
    duration: 900, // 15 minutes
    audioUrl: "meditation/ocean-mindfulness.mp3"
  },
  
  // Chakra Healing Songs
  {
    id: "chk-1",
    title: "Root Stability",
    artist: "Chakra Tones",
    frequency: 396,
    chakra: "Root",
    functionality: "chakra-healing",
    description: "Grounding frequencies for the Root chakra",
    duration: 480, // 8 minutes
    audioUrl: "chakra/root-stability.mp3"
  },
  {
    id: "chk-2",
    title: "Heart Bloom",
    artist: "Chakra Tones",
    frequency: 639,
    chakra: "Heart",
    functionality: "chakra-healing",
    description: "Opening frequencies for the Heart chakra",
    duration: 480, // 8 minutes
    audioUrl: "chakra/heart-bloom.mp3"
  },
  {
    id: "chk-3",
    title: "Third Eye Vision",
    artist: "Chakra Tones",
    frequency: 852,
    chakra: "Third Eye",
    functionality: "chakra-healing",
    description: "Activation frequencies for the Third Eye chakra",
    duration: 480, // 8 minutes
    audioUrl: "chakra/third-eye-vision.mp3"
  },
  
  // Hermetic Principle Songs
  {
    id: "herm-1",
    title: "Mentalism Echo",
    artist: "Hermetic Sounds",
    frequency: 528,
    functionality: "hermetic-principle",
    description: "Sound aligned with the principle of Mentalism",
    duration: 540, // 9 minutes
    audioUrl: "hermetic/mentalism-echo.mp3"
  },
  {
    id: "herm-2",
    title: "Vibration Essence",
    artist: "Hermetic Sounds",
    frequency: 639,
    functionality: "hermetic-principle",
    description: "Sound aligned with the principle of Vibration",
    duration: 540, // 9 minutes
    audioUrl: "hermetic/vibration-essence.mp3"
  },
  
  // Frequency Shift Songs
  {
    id: "freq-1",
    title: "Ascension Shift",
    artist: "Frequency Healers",
    frequency: 963,
    functionality: "frequency-shift",
    description: "Helps elevate your vibrational frequency",
    duration: 720, // 12 minutes
    audioUrl: "frequency/ascension-shift.mp3"
  },
  {
    id: "freq-2",
    title: "Divine Harmony",
    artist: "Frequency Healers",
    frequency: 528,
    functionality: "frequency-shift",
    description: "Aligns with the frequency of love and repair",
    duration: 600, // 10 minutes
    audioUrl: "frequency/divine-harmony.mp3"
  },
  
  // Journey Songs
  {
    id: "journey-1",
    title: "Inner Temple Journey",
    artist: "Sound Voyagers",
    functionality: "journey",
    description: "Guided journey to your inner sanctuary",
    duration: 1200, // 20 minutes
    audioUrl: "journeys/inner-temple.mp3"
  },
  {
    id: "journey-2",
    title: "Become The One",
    artist: "Sound Voyagers",
    frequency: 528,
    functionality: "journey",
    description: "Journey to embody your highest self",
    duration: 1500, // 25 minutes
    audioUrl: "journeys/become-the-one.mp3"
  },
  
  // Focus Songs
  {
    id: "focus-1",
    title: "Clear Mind",
    artist: "Cognitive Audio",
    frequency: 852,
    functionality: "focus",
    description: "Enhanced brain waves for clear thinking",
    duration: 3600, // 60 minutes
    audioUrl: "focus/clear-mind.mp3"
  },
  {
    id: "focus-2",
    title: "Deep Work",
    artist: "Cognitive Audio",
    frequency: 417,
    functionality: "focus",
    description: "Background sounds for productive flow states",
    duration: 3600, // 60 minutes
    audioUrl: "focus/deep-work.mp3"
  },
  
  // Sleep Songs
  {
    id: "sleep-1",
    title: "Dreamscape",
    artist: "Sleep Soundscapes",
    frequency: 174,
    functionality: "sleep",
    description: "Gentle frequencies for falling asleep",
    duration: 2700, // 45 minutes
    audioUrl: "sleep/dreamscape.mp3"
  },
  {
    id: "sleep-2",
    title: "Night Restoration",
    artist: "Sleep Soundscapes",
    frequency: 285,
    functionality: "sleep",
    description: "Healing frequencies for restorative sleep",
    duration: 28800, // 8 hours
    audioUrl: "sleep/night-restoration.mp3"
  },
  
  // Energy Boost Songs
  {
    id: "energy-1",
    title: "Morning Activation",
    artist: "Energy Waves",
    frequency: 852,
    functionality: "energy-boost",
    description: "Energizing frequencies for morning routines",
    duration: 300, // 5 minutes
    audioUrl: "energy/morning-activation.mp3"
  },
  {
    id: "energy-2",
    title: "Solar Power",
    artist: "Energy Waves",
    frequency: 741,
    functionality: "energy-boost",
    description: "Midday energy boost through sound",
    duration: 360, // 6 minutes
    audioUrl: "energy/solar-power.mp3"
  },
  
  // Heart Opening Songs
  {
    id: "heart-1",
    title: "Love Expansion",
    artist: "Heart Harmonics",
    frequency: 639,
    chakra: "Heart",
    functionality: "heart-opening",
    description: "Open the heart to give and receive love",
    duration: 720, // 12 minutes
    audioUrl: "heart/love-expansion.mp3"
  },
  {
    id: "heart-2",
    title: "Compassion Flow",
    artist: "Heart Harmonics",
    frequency: 639,
    chakra: "Heart",
    functionality: "heart-opening",
    description: "Cultivate self-compassion and empathy",
    duration: 600, // 10 minutes
    audioUrl: "heart/compassion-flow.mp3"
  },
  
  // Grounding Songs
  {
    id: "ground-1",
    title: "Earth Connection",
    artist: "Grounding Tones",
    frequency: 396,
    chakra: "Root",
    functionality: "grounding",
    description: "Connect with Earth's stabilizing energy",
    duration: 600, // 10 minutes
    audioUrl: "grounding/earth-connection.mp3"
  },
  {
    id: "ground-2",
    title: "Stable Foundation",
    artist: "Grounding Tones",
    frequency: 285,
    chakra: "Root",
    functionality: "grounding",
    description: "Build a stable energetic foundation",
    duration: 540, // 9 minutes
    audioUrl: "grounding/stable-foundation.mp3"
  }
];

/**
 * Get songs by functionality type
 * @param functionality The type of functionality to filter by
 * @returns Array of songs for that functionality
 */
export const getSongsByFunctionality = (functionality: AppFunctionality): SongMapping[] => {
  return songMappings.filter(song => song.functionality === functionality);
};

/**
 * Get songs by chakra
 * @param chakra The chakra to filter by
 * @returns Array of songs for that chakra
 */
export const getSongsByChakra = (chakra: string): SongMapping[] => {
  return songMappings.filter(song => song.chakra === chakra);
};

/**
 * Get songs by frequency range
 * @param minFreq Minimum frequency
 * @param maxFreq Maximum frequency
 * @returns Array of songs within the frequency range
 */
export const getSongsByFrequencyRange = (minFreq: number, maxFreq: number): SongMapping[] => {
  return songMappings.filter(song => 
    song.frequency && song.frequency >= minFreq && song.frequency <= maxFreq
  );
};

/**
 * Get a song by its ID
 * @param id The song ID to find
 * @returns The song or undefined if not found
 */
export const getSongById = (id: string): SongMapping | undefined => {
  return songMappings.find(song => song.id === id);
};

export default songMappings;
