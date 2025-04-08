
export interface ChakraData {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  bgColor: string;
  gradient: string;
  location: string;
  frequency: number;
  element: string;
  affirmation: string;
  emotionalThemes: string[];
  imbalances: string[];
  rebalancing: string[];
  journalPrompt: string;
  valesWisdom: string;
}

const chakraData: ChakraData[] = [
  {
    id: "root",
    name: "Root Chakra",
    sanskrit: "Muladhara",
    color: "bg-red-500",
    bgColor: "bg-red-50",
    gradient: "from-red-400 to-red-600",
    location: "Base of spine",
    frequency: 396,
    element: "Earth",
    affirmation: "I am safe. I am grounded.",
    emotionalThemes: ["Safety", "Survival", "Stability", "Security"],
    imbalances: ["Anxiety", "Fear", "Money stress", "Feeling unsafe"],
    rebalancing: ["Grounding practices", "Earthy food", "Breathwork", "Walking in nature"],
    journalPrompt: "Where do I feel most unsafe or ungrounded — and why?",
    valesWisdom: "If your Root's rattled, you'll feel like you're floating in chaos. Come back to your body, babe — the Earth's been holding you all along."
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    sanskrit: "Svadhisthana",
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    gradient: "from-orange-400 to-orange-600",
    location: "Lower abdomen",
    frequency: 417,
    element: "Water",
    affirmation: "I am creative. I allow pleasure.",
    emotionalThemes: ["Creativity", "Emotion", "Intimacy", "Pleasure"],
    imbalances: ["Guilt", "Repression", "Creative blocks", "Emotional numbness"],
    rebalancing: ["Dancing", "Sensuality", "Fluid movement", "Creative expression"],
    journalPrompt: "What emotions or desires have I been holding back?",
    valesWisdom: "You're not here to be a productivity robot. You're a sensual spark of stardust. Let it flow."
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus Chakra",
    sanskrit: "Manipura",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    gradient: "from-yellow-400 to-yellow-600",
    location: "Upper abdomen",
    frequency: 528,
    element: "Fire",
    affirmation: "I am powerful. I trust myself.",
    emotionalThemes: ["Confidence", "Willpower", "Self-esteem", "Personal power"],
    imbalances: ["Low self-worth", "Control issues", "Burnout", "Perfectionism"],
    rebalancing: ["Sunlight exposure", "Setting boundaries", "Core strengthening", "Empowerment practices"],
    journalPrompt: "Where am I giving my power away?",
    valesWisdom: "You don't need permission to take up space. Step into your fire — no apologies."
  },
  {
    id: "heart",
    name: "Heart Chakra",
    sanskrit: "Anahata",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    gradient: "from-green-400 to-green-600",
    location: "Center of chest",
    frequency: 639,
    element: "Air",
    affirmation: "I am love. I give and receive freely.",
    emotionalThemes: ["Love", "Compassion", "Forgiveness", "Connection"],
    imbalances: ["Isolation", "Jealousy", "Grief", "Resentment"],
    rebalancing: ["Compassion practices", "Breathwork", "Giving", "Heart-opening yoga"],
    journalPrompt: "Who (or what) do I still need to forgive — including myself?",
    valesWisdom: "This isn't about airy-fairy love. This is deep, messy, radical heart-opening. And you're ready."
  },
  {
    id: "throat",
    name: "Throat Chakra",
    sanskrit: "Vishuddha",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    gradient: "from-blue-400 to-blue-600",
    location: "Throat",
    frequency: 741,
    element: "Ether",
    affirmation: "I speak my truth with clarity.",
    emotionalThemes: ["Communication", "Truth", "Expression", "Authenticity"],
    imbalances: ["Fear of speaking", "Sore throat", "Communication blocks", "Lying"],
    rebalancing: ["Humming", "Speaking aloud", "Singing", "Writing"],
    journalPrompt: "Where in my life am I not being fully honest?",
    valesWisdom: "Your truth is sacred. Stop shrinking your voice to make others comfortable."
  },
  {
    id: "third-eye",
    name: "Third Eye Chakra",
    sanskrit: "Ajna",
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50",
    gradient: "from-indigo-400 to-indigo-600",
    location: "Between eyebrows",
    frequency: 852,
    element: "Light",
    affirmation: "I see clearly. I trust my inner wisdom.",
    emotionalThemes: ["Intuition", "Clarity", "Insight", "Vision"],
    imbalances: ["Confusion", "Indecision", "Cynicism", "Overthinking"],
    rebalancing: ["Visualization", "Meditation", "Journaling", "Dream work"],
    journalPrompt: "What do I know deep down, but keep ignoring?",
    valesWisdom: "Your intuition isn't broken — it's just been silenced. Quiet the noise. You'll hear it again."
  },
  {
    id: "crown",
    name: "Crown Chakra",
    sanskrit: "Sahasrara",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    gradient: "from-purple-400 to-purple-600",
    location: "Top of head",
    frequency: 963,
    element: "Thought/Spirit",
    affirmation: "I am connected to divine wisdom.",
    emotionalThemes: ["Oneness", "Spiritual connection", "Universal consciousness", "Transcendence"],
    imbalances: ["Overthinking", "Disconnection", "Spiritual cynicism", "Attachment"],
    rebalancing: ["Silence", "Time in nature", "Meditation", "Prayer"],
    journalPrompt: "When do I feel most connected to something greater?",
    valesWisdom: "You're not just part of the universe — the universe is encoded in you."
  }
];

export const getChakraById = (id: string): ChakraData | undefined => {
  return chakraData.find(chakra => chakra.id === id);
};

export default chakraData;
