
import { MeditationType } from "@/types/meditation";

export const meditationTypes: MeditationType[] = [
  {
    id: "root-chakra",
    title: "Root Chakra Grounding",
    description: "Connect to the earth and establish a sense of safety and stability.",
    longDescription: "This meditation helps you establish a strong connection with the earth, releasing fear and insecurity. By focusing on your root chakra, you'll cultivate a deep sense of security, stability, and presence.",
    frequency: 396,
    duration: 10,
    level: "Beginner",
    focus: "Grounding",
    audioUrl: "https://pixabay.com/music/meditationspiritual-zen-spiritual-yoga-meditation-relaxing-music-21400.mp3",
    guidanceUrl: "https://pixabay.com/music/meditationspiritual-calm-meditation-music-for-peace-and-relaxation-67104.mp3",
    chakra: "Root",
    colorGradient: "from-red-400 to-red-600"
  },
  {
    id: "heart-opening",
    title: "Heart Opening",
    description: "Open your heart center to cultivate compassion and unconditional love.",
    longDescription: "This heart-centered meditation helps you release emotional blockages and open yourself to giving and receiving love. By focusing on your heart chakra, you'll develop a greater capacity for compassion, forgiveness, and joy.",
    frequency: 639,
    duration: 15,
    level: "Intermediate",
    focus: "Compassion",
    audioUrl: "https://pixabay.com/music/beautiful-plays-meditation-yoga-zen-music-for-meditation-calm-and-balance-120999.mp3",
    guidanceUrl: "https://pixabay.com/music/meditationspiritual-healing-water-light-energy-meditation-music-22291.mp3",
    chakra: "Heart",
    colorGradient: "from-green-400 to-green-600"
  },
  {
    id: "third-eye",
    title: "Third Eye Activation",
    description: "Enhance intuition and clarity through third eye meditation.",
    longDescription: "This meditation focuses on awakening your intuitive abilities and enhancing your inner vision. By activating your third eye chakra, you'll develop greater insight, clarity of thought, and access to your inner wisdom.",
    frequency: 852,
    duration: 20,
    level: "Advanced",
    focus: "Intuition",
    audioUrl: "https://pixabay.com/music/meditationspiritual-calm-relaxing-meditation-music-148284.mp3",
    guidanceUrl: null,
    chakra: "Third Eye",
    colorGradient: "from-indigo-400 to-indigo-600"
  },
  {
    id: "sacral-creativity",
    title: "Sacral Creativity Flow",
    description: "Unlock your creative potential and emotional fluidity.",
    longDescription: "This meditation focuses on your sacral chakra to increase creative energy flow and emotional intelligence. By connecting with this energy center, you'll release creative blocks and rediscover the joy of expression.",
    frequency: 417,
    duration: 12,
    level: "Beginner",
    focus: "Creativity",
    audioUrl: "https://pixabay.com/music/meditationspiritual-meditation-forest-6873.mp3",
    guidanceUrl: null,
    chakra: "Sacral",
    colorGradient: "from-orange-400 to-orange-600"
  },
  {
    id: "crown-connection",
    title: "Crown Connection",
    description: "Connect to higher consciousness and spiritual awareness.",
    longDescription: "This meditation helps you establish a connection with higher states of consciousness and the universal energy. By focusing on your crown chakra, you'll experience a sense of oneness, spiritual connection, and expanded awareness.",
    frequency: 963,
    duration: 25,
    level: "Advanced",
    focus: "Spirituality",
    audioUrl: "https://pixabay.com/music/meditationspiritual-relax-meditation-peaceful-sleep-meditation-relaxation-stress-relief-21903.mp3",
    guidanceUrl: "https://pixabay.com/music/meditationspiritual-peaceful-garden-healing-light-meditation-music-22304.mp3",
    chakra: "Crown",
    colorGradient: "from-purple-400 to-purple-600"
  },
  {
    id: "solar-plexus",
    title: "Solar Plexus Empowerment",
    description: "Build confidence and personal power through this energizing meditation.",
    longDescription: "This meditation focuses on strengthening your sense of self, personal power, and confidence. By activating your solar plexus chakra, you'll develop greater self-esteem, willpower, and the courage to be authentically you.",
    frequency: 528,
    duration: 15,
    level: "Intermediate",
    focus: "Confidence",
    audioUrl: "https://pixabay.com/music/meditationspiritual-zen-spiritual-yoga-meditation-relaxing-music-21400.mp3",
    guidanceUrl: null,
    chakra: "Solar Plexus",
    colorGradient: "from-yellow-400 to-yellow-600"
  }
];

// Helper function to find a meditation by ID
export const getMeditationById = (id: string): MeditationType | undefined => {
  return meditationTypes.find(meditation => meditation.id === id);
};

// Helper function to filter meditations by focus
export const getMeditationsByFocus = (focus: string): MeditationType[] => {
  return meditationTypes.filter(meditation => 
    meditation.focus.toLowerCase() === focus.toLowerCase()
  );
};

// Helper function to filter meditations by chakra
export const getMeditationsByChakra = (chakra: string): MeditationType[] => {
  return meditationTypes.filter(meditation => 
    meditation.chakra.toLowerCase() === chakra.toLowerCase()
  );
};
