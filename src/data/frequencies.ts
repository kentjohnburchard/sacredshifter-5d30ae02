
export interface HealingFrequency {
  id: string;
  name: string;
  frequency: number;
  description: string;
  benefits: string[];
  color: string;
  chakra?: string;
  duration?: number; // default duration in seconds
  history?: string;
  meditations?: string[];
}

export const healingFrequencies: HealingFrequency[] = [
  {
    id: "432hz",
    name: "Miracle Tone",
    frequency: 432,
    description: "The 432Hz frequency, also known as Verdi's A, is mathematically consistent with the patterns of the universe. This sacred frequency is said to resonate with the heart chakra, the Schumann Resonance, and the Golden Ratio. It creates a sensation of peace and well-being.",
    benefits: [
      "Reduces anxiety and stress levels",
      "Lowers blood pressure",
      "Improves sleep quality",
      "Enhances meditative states",
      "Promotes natural resonance with the body"
    ],
    color: "from-emerald-400 to-teal-600",
    chakra: "Heart",
    duration: 300,
    history: "432Hz was the standard tuning for orchestras worldwide until the early 20th century when it was changed to 440Hz. Many ancient instruments discovered by archaeologists have been found to be tuned to 432Hz.",
    meditations: [
      "Sit quietly and visualize a green light surrounding your heart as you listen",
      "Place your hands on your heart center while breathing deeply to the rhythm of the tone",
      "Imagine waves of green healing energy pulsing through your body with each beat"
    ]
  },
  {
    id: "528hz",
    name: "Love Frequency",
    frequency: 528,
    description: "Known as the 'Miracle' or 'Love Frequency', 528Hz is one of the most powerful healing sounds in the Solfeggio scale. It's the exact frequency used by genetic biochemists to repair broken DNA - the genetic blueprint upon which life is based.",
    benefits: [
      "DNA repair and regeneration",
      "Cell detoxification",
      "Increased energy levels",
      "Awakens creativity",
      "Promotes love and peace"
    ],
    color: "from-pink-400 to-rose-600",
    chakra: "Heart",
    duration: 300,
    history: "528Hz is the exact frequency used by genetic biochemists to repair DNA. This tone was used in ancient times in sacred music, including the Gregorian chants. Dr. Joseph Puleo rediscovered the frequency in the 1970s.",
    meditations: [
      "Visualize a pink light filling your heart and radiating outward to all beings",
      "Recite affirmations of self-love while listening to this frequency",
      "Place crystals like rose quartz near you while meditating to amplify the frequency"
    ]
  },
  {
    id: "639hz",
    name: "Connection Frequency",
    frequency: 639,
    description: "The 639Hz frequency is associated with harmonizing relationships and connecting with spiritual family. This tone encourages the creation of harmonious community and relationships through balance, understanding, and tolerance.",
    benefits: [
      "Enhances communication",
      "Improves relationships and understanding",
      "Encourages forgiveness",
      "Balances emotions",
      "Promotes harmony in communities"
    ],
    color: "from-amber-400 to-yellow-600",
    chakra: "Solar Plexus",
    duration: 300,
    history: "639Hz is part of the ancient Solfeggio scale and corresponds to the musical note 'Fa'. It was used in sacred music to encourage harmony and unconditional love in spiritual communities.",
    meditations: [
      "Visualize golden light connecting you with loved ones while listening",
      "Place your hands on your solar plexus and envision healing any relationship wounds",
      "Write the names of people you wish to harmonize with on paper and meditate with the paper nearby"
    ]
  },
  {
    id: "741hz",
    name: "Expression Frequency",
    frequency: 741,
    description: "The 741Hz frequency is used for solving problems, cleansing cells, and awakening intuition. This frequency helps in leading a more simple life and cleansing infections - both physically and energetically.",
    benefits: [
      "Cleanses cells from toxins",
      "Awakens intuition and inner knowing",
      "Solves complex problems",
      "Cleanses the body from electromagnetic radiation",
      "Promotes spiritual liberation"
    ],
    color: "from-indigo-400 to-blue-600",
    chakra: "Throat",
    duration: 300,
    history: "741Hz corresponds to the musical note 'Sol'. This frequency is said to have been used by ancient healers to detoxify and purify the body, mind and spirit. It was an integral part of sacred sound healing rituals.",
    meditations: [
      "Place your hands on your throat chakra and breathe deeply while visualizing blue light",
      "Speak truth affirmations while listening to this frequency",
      "Visualize a blue spinning wheel at your throat, clearing any blockages to self-expression"
    ]
  },
  {
    id: "852hz",
    name: "Spiritual Doorway",
    frequency: 852,
    description: "The 852Hz frequency is associated with the third eye chakra. It is the sound of returning to spiritual order. It awakens intuition and helps raise consciousness to connect with higher dimensions and universal wisdom.",
    benefits: [
      "Enhances intuition and inner wisdom",
      "Awakens spiritual connection",
      "Promotes clarity of thought",
      "Returns to spiritual balance",
      "Increases awareness and insight"
    ],
    color: "from-indigo-500 to-purple-700",
    chakra: "Third Eye",
    duration: 300,
    history: "852Hz corresponds to the musical note 'La' in the Solfeggio scale. Ancient spiritual practitioners used this tone to open the third eye and access higher states of consciousness. It was considered a sacred doorway to spiritual realms.",
    meditations: [
      "Focus your attention on the space between your eyebrows while listening",
      "Visualize a deep indigo light expanding from your third eye outward",
      "Ask questions during meditation and be receptive to intuitive answers"
    ]
  },
  {
    id: "963hz",
    name: "Divine Frequency",
    frequency: 963,
    description: "The 963Hz frequency is connected with the Light and all-embracing Spirit, enabling direct experience of the divine. It awakens any system to its original, perfect state and reconnects it with the Source.",
    benefits: [
      "Crown chakra activation",
      "Connects to higher spiritual dimensions",
      "Awakens perfect state of consciousness",
      "Enables enlightenment experiences",
      "Facilitates return to oneness"
    ],
    color: "from-violet-500 to-purple-800",
    chakra: "Crown",
    duration: 300,
    history: "963Hz corresponds to the musical note 'Ti' in the Solfeggio scale. This frequency was considered the 'tone of the gods' in ancient spiritual practices. It was used to connect directly with the divine and universal consciousness.",
    meditations: [
      "Visualize a violet or white light entering through the crown of your head",
      "Silently repeat mantras like 'Om' or 'I am one with all that is'",
      "Sit with palms open upward to receive cosmic energy while listening"
    ]
  },
  {
    id: "schumann",
    name: "Earth's Heartbeat",
    frequency: 7.83,
    description: "The Schumann Resonance (7.83Hz) is Earth's natural heartbeat rhythm, discovered by physicist Winfried Otto Schumann in 1952. This frequency is the resonance produced by lightning strikes in the cavity between Earth's surface and the ionosphere.",
    benefits: [
      "Aligns human consciousness with Earth",
      "Normalizes circadian rhythms",
      "Promotes healing and vitality",
      "Enhances physical and mental well-being",
      "Creates a sense of groundedness"
    ],
    color: "from-amber-400 to-orange-600",
    duration: 300,
    history: "The Schumann Resonance was discovered scientifically in 1952, but ancient civilizations seemed aware of its importance. Many sacred sites and temples were built to resonate with this frequency. It's often called 'Earth's heartbeat'.",
    meditations: [
      "Visualize roots growing from your feet deep into the Earth while listening",
      "Place your bare feet on natural ground during meditation",
      "Imagine your heartbeat synchronizing with the pulse of the Earth"
    ]
  },
  {
    id: "396hz",
    name: "Liberation Tone",
    frequency: 396,
    description: "The 396Hz frequency is associated with liberating guilt and fear. It helps to remove subconscious blockages and supports the achievement of goals. This frequency cleanses the feeling of guilt which often represents one of the basic obstacles to realization.",
    benefits: [
      "Liberates guilt and fear",
      "Removes subconscious blockages",
      "Transforms grief into joy",
      "Cleanses traumatic experiences",
      "Supports the achievement of goals"
    ],
    color: "from-red-400 to-red-600",
    chakra: "Root",
    duration: 300,
    history: "396Hz is the first note in the ancient Solfeggio scale, corresponding to the musical note 'Ut'. This frequency was used in ancient sacred music, particularly in Gregorian chants, to turn grief into joy and liberate worshippers from feelings of guilt and fear.",
    meditations: [
      "Focus on your base/root chakra while placing hands on your lower abdomen",
      "Visualize a red light at the base of your spine, clearing blockages",
      "Release specific fears and guilt while breathing deeply"
    ]
  },
  {
    id: "417hz",
    name: "Transformation Tone",
    frequency: 417,
    description: "The 417Hz frequency is associated with facilitating change and removing negative energy from the body and home. This frequency cleanses traumatic experiences and undoes the damage of past events. It brings positive energy to help in difficult situations.",
    benefits: [
      "Facilitates change in life",
      "Cleanses traumatic experiences",
      "Removes negative energy",
      "Breaks down crystallized emotional energy",
      "Brings positive transformative energy"
    ],
    color: "from-orange-400 to-orange-600",
    chakra: "Sacral",
    duration: 300,
    history: "417Hz corresponds to the second note 'Re' in the ancient Solfeggio scale. In ancient times, this frequency was believed to transmute negative energy and help facilitate positive change. It was used in ceremonies marking important life transitions.",
    meditations: [
      "Place hands on your lower abdomen (sacral area) while listening",
      "Visualize orange light filling areas of stagnation in your life",
      "Write down what you wish to transform and meditate with the paper nearby"
    ]
  }
];
