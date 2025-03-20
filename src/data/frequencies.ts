
export interface HealingFrequency {
  id: string;
  name: string;
  frequency: number;
  description: string;
  benefits: string[];
  color: string;
  chakra?: string;
  duration?: number; // default duration in seconds
}

export const healingFrequencies: HealingFrequency[] = [
  {
    id: "432hz",
    name: "Miracle Tone",
    frequency: 432,
    description: "The 432Hz frequency is said to be mathematically consistent with the patterns of the universe. It is said to be the natural frequency of the universe, with healing effects on our mind, body and spirit.",
    benefits: [
      "Reduces anxiety",
      "Lowers blood pressure",
      "Improves sleep quality",
      "Enhances relaxation",
      "Promotes natural resonance with the body"
    ],
    color: "from-green-400 to-teal-500",
    chakra: "Heart",
    duration: 300
  },
  {
    id: "528hz",
    name: "Love Frequency",
    frequency: 528,
    description: "Known as the 'Love Frequency', 528Hz is one of the most powerful healing sounds. This frequency is used for DNA repair, and is known to create transformation and miracles.",
    benefits: [
      "DNA repair",
      "Cell regeneration",
      "Increased energy",
      "Awakens creativity",
      "Promotes love and peace"
    ],
    color: "from-pink-400 to-pink-600",
    chakra: "Heart",
    duration: 300
  },
  {
    id: "639hz",
    name: "Relationship Harmonizer",
    frequency: 639,
    description: "The 639Hz frequency is associated with harmonizing relationships and connecting with spiritual family. It encourages clearer communication and understanding.",
    benefits: [
      "Enhances communication",
      "Improves relationships",
      "Encourages forgiveness",
      "Balances emotions",
      "Promotes harmony and understanding"
    ],
    color: "from-green-400 to-emerald-500",
    chakra: "Solar Plexus",
    duration: 300
  },
  {
    id: "741hz",
    name: "Spiritual Detoxifier",
    frequency: 741,
    description: "The 741Hz frequency is used for solving problems and cleaning the body from toxins. It helps in leading a more simple life and also in waking up intuition.",
    benefits: [
      "Detoxifies cells",
      "Cleanses the body",
      "Solves problems",
      "Awakens intuition",
      "Promotes spiritual liberation"
    ],
    color: "from-indigo-400 to-blue-500",
    chakra: "Throat",
    duration: 300
  },
  {
    id: "852hz",
    name: "Third Eye Activator",
    frequency: 852,
    description: "The 852Hz frequency is associated with the third eye chakra. It can help you in opening up a higher consciousness and spiritual connection.",
    benefits: [
      "Enhances intuition",
      "Awakens inner strength",
      "Promotes clarity of mind",
      "Returns spiritual order",
      "Increases awareness and insight"
    ],
    color: "from-indigo-500 to-purple-600",
    chakra: "Third Eye",
    duration: 300
  },
  {
    id: "963hz",
    name: "Crown Chakra Connector",
    frequency: 963,
    description: "The 963Hz frequency is connected with the Light and all-embracing Spirit, and enables direct experience, the return to Oneness and experiencing the Absolute.",
    benefits: [
      "Crown chakra activation",
      "Connects to spiritual realms",
      "Awakens perfect state",
      "Enables enlightenment",
      "Promotes oneness and unity"
    ],
    color: "from-violet-500 to-purple-700",
    chakra: "Crown",
    duration: 300
  },
  {
    id: "schumann",
    name: "Schumann Resonance",
    frequency: 7.83,
    description: "The Schumann Resonance (7.83Hz) is Earth's natural heartbeat rhythm. This frequency is said to be the fundamental frequency of the planet, resonating between the Earth's surface and the ionosphere.",
    benefits: [
      "Grounds human consciousness",
      "Synchronizes biorhythms",
      "Promotes healing",
      "Enhances physical and mental well-being",
      "Connects to Earth's natural frequency"
    ],
    color: "from-amber-400 to-orange-500",
    duration: 300
  }
];
