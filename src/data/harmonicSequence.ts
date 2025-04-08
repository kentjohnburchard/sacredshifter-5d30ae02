
import { HermeticPrinciple } from "./hermeticPrinciples";

export interface HarmonicInterval {
  id: string;
  ratio: string;
  name: string;
  frequency?: number;
  hertz?: number | string;
  description: string;
  hermeticPrinciple: HermeticPrinciple;
  teslaSignificance: string;
  healingProperties: string[];
  color: string; // For visualization
  note?: string;
}

export interface HarmonicCategory {
  id: string;
  name: string;
  description: string;
  intervals: HarmonicInterval[];
}

// Tesla's 3-6-9
export const teslaPrinciples = {
  three: "The number 3 represents the creative force that brings things into physical form.",
  six: "The number 6 represents harmony and balance, creating resonance between different systems.",
  nine: "The number 9 represents completion and the connection to universal energy patterns."
};

// Define the harmonic intervals with their relationships to Hermetic principles and Tesla's insights
export const harmonicIntervals: HarmonicInterval[] = [
  {
    id: "unison",
    ratio: "1:1",
    name: "Unison/Octave",
    hertz: 1024,
    note: "C6",
    description: "The fundamental relationship where frequencies align perfectly, representing unity and wholeness.",
    hermeticPrinciple: "mentalism",
    teslaSignificance: "The number 1 is the source from which all manifestation begins, representing the unity principle.",
    healingProperties: ["Grounding", "Centering", "Unity consciousness"],
    color: "#FF5733" // Red-orange
  },
  {
    id: "fifth",
    ratio: "3:2",
    name: "Perfect Fifth",
    hertz: 768,
    note: "G#",
    description: "The most harmonious interval after the octave, representing balance and harmony.",
    hermeticPrinciple: "correspondence",
    teslaSignificance: teslaPrinciples.three + " The 3:2 ratio demonstrates the creative force taking shape.",
    healingProperties: ["Harmony", "Balance", "Integration"],
    color: "#33FF57" // Green
  },
  {
    id: "fourth",
    ratio: "4:3",
    name: "Perfect Fourth",
    hertz: 683,
    note: "F",
    description: "Represents stability and foundation, creating a sense of resolution.",
    hermeticPrinciple: "vibration",
    teslaSignificance: "The 4:3 ratio demonstrates organized energy patterns taking form.",
    healingProperties: ["Stability", "Clarity", "Foundation"],
    color: "#3357FF" // Blue
  },
  {
    id: "major_third",
    ratio: "5:4",
    name: "Major Third",
    hertz: 640,
    note: "E",
    description: "Creates a bright, uplifting quality associated with joy and expansion.",
    hermeticPrinciple: "polarity",
    teslaSignificance: "The 5 represents regenerative energy that creates new patterns.",
    healingProperties: ["Joy", "Expansion", "Vitality"],
    color: "#FFFF33" // Yellow
  },
  {
    id: "minor_third",
    ratio: "6:5",
    name: "Minor Third",
    hertz: 614,
    note: "E♭",
    description: "Creates a contemplative, introspective quality often associated with deeper emotions.",
    hermeticPrinciple: "rhythm",
    teslaSignificance: teslaPrinciples.six + " The 6:5 ratio demonstrates balance in emotional patterns.",
    healingProperties: ["Emotional healing", "Introspection", "Empathy"],
    color: "#9933FF" // Purple
  },
  {
    id: "major_sixth",
    ratio: "5:3",
    name: "Major Sixth",
    hertz: 512,
    note: "C5",
    description: "Creates a sense of yearning and forward movement toward resolution.",
    hermeticPrinciple: "cause_effect",
    teslaSignificance: "The 5:3 ratio demonstrates the golden ratio patterns found throughout nature.",
    healingProperties: ["Aspiration", "Hope", "Forward movement"],
    color: "#FF33A8" // Pink
  },
  {
    id: "minor_sixth",
    ratio: "8:5",
    name: "Minor Sixth",
    hertz: 480,
    note: "B",
    description: "Creates a bittersweet quality that balances tension and resolution.",
    hermeticPrinciple: "gender",
    teslaSignificance: "The 8:5 ratio approaches the Fibonacci sequence, showing nature's spiral patterns.",
    healingProperties: ["Integration", "Acceptance", "Balance of opposites"],
    color: "#33FFF6" // Cyan
  },
  {
    id: "major_second",
    ratio: "9:8",
    name: "Major Second",
    hertz: 432,
    note: "A",
    description: "Creates tension that seeks resolution, representing the creative impulse.",
    hermeticPrinciple: "mentalism",
    teslaSignificance: teslaPrinciples.nine + " The 9:8 ratio demonstrates completion seeking new beginning.",
    healingProperties: ["Motivation", "Action", "Creative tension"],
    color: "#FF9933" // Orange
  },
  {
    id: "minor_second",
    ratio: "16:15",
    name: "Minor Second",
    hertz: 384,
    note: "G",
    description: "The smallest interval, creating the most tension and dissonance.",
    hermeticPrinciple: "polarity",
    teslaSignificance: "The extreme tension represents the polarity principle at its most potent.",
    healingProperties: ["Breakthrough", "Release", "Catharsis"],
    color: "#7F00FF" // Violet
  },
  {
    id: "minor_seventh",
    ratio: "16:9",
    name: "Minor Seventh",
    hertz: 362,
    note: "F#",
    description: "Creates a sense of anticipation and yearning for resolution.",
    hermeticPrinciple: "rhythm",
    teslaSignificance: "The relationship between 16 and 9 demonstrates cyclical patterns seeking completion.",
    healingProperties: ["Transformation", "Yearning", "Preparation for change"],
    color: "#33FFBD" // Mint
  },
  {
    id: "major_seventh",
    ratio: "15:8",
    name: "Major Seventh",
    hertz: 341,
    note: "F",
    description: "Creates strong tension that resolves upward to the octave.",
    hermeticPrinciple: "correspondence",
    teslaSignificance: "The relationship between 15 and 8 demonstrates the principle of upward transformation.",
    healingProperties: ["Aspiration", "Spiritual awakening", "Transcendence"],
    color: "#FF3333" // Pure red
  },
  {
    id: "tritone",
    ratio: "45:32",
    name: "Tritone",
    hertz: 256,
    note: "C4",
    description: "The most dissonant interval, historically known as 'diabolus in musica' (the devil in music).",
    hermeticPrinciple: "vibration",
    teslaSignificance: "The 45:32 ratio demonstrates the extreme tension that seeks resolution, an energetic pattern Tesla recognized in electrical systems.",
    healingProperties: ["Breaking patterns", "Stimulating change", "Disruption for growth"],
    color: "#000000" // Black
  }
];

export const harmonicSequenceCategories: HarmonicCategory[] = [
  {
    id: "primary",
    name: "Primary Harmonics",
    description: "The fundamental harmonic relationships that form the basis of musical harmony",
    intervals: harmonicIntervals.filter(interval => 
      ["unison", "fifth", "fourth"].includes(interval.id))
  },
  {
    id: "secondary",
    name: "Secondary Harmonics",
    description: "The next level of harmonic complexity, building upon primary relationships",
    intervals: harmonicIntervals.filter(interval => 
      ["major_third", "minor_third", "major_sixth", "minor_sixth"].includes(interval.id))
  },
  {
    id: "tertiary",
    name: "Tertiary Harmonics",
    description: "More complex harmonic relationships that add richness and tension",
    intervals: harmonicIntervals.filter(interval => 
      ["major_second", "minor_second", "major_seventh", "minor_seventh", "tritone"].includes(interval.id))
  }
];

// Based on Tesla's 3-6-9 principles
export const teslaThreeSixNine = {
  title: "Tesla's 3-6-9 Principle & The Harmonic Sequence",
  description: "Nikola Tesla said: 'If you only knew the magnificence of the 3, 6 and 9, then you would have a key to the universe.' These numbers are represented throughout the harmonic sequence.",
  principles: [
    {
      number: 3,
      title: "The Creative Force",
      description: "The number 3 represents the creative force that brings things into physical form. In harmonics, we see this in the 3:2 ratio (perfect fifth).",
      frequencies: [768], // G# - Perfect Fifth
      applications: "Used for creative inspiration, manifestation, and bringing ideas into form."
    },
    {
      number: 6,
      title: "Harmony and Balance",
      description: "The number 6 represents harmony and balance, creating resonance between different systems. The 6:5 ratio (minor third) demonstrates this principle.",
      frequencies: [614], // Eb - Minor Third
      applications: "Used for creating harmony, balance, and emotional equilibrium."
    },
    {
      number: 9,
      title: "Completion and Universal Connection",
      description: "The number 9 represents completion and the connection to universal energy patterns. The 9:8 ratio (major second) embodies this principle.",
      frequencies: [432], // A - Major Second
      applications: "Used for completion of cycles, universal connection, and spiritual awareness."
    }
  ]
};

// Relationship between Hermetic principles and harmonic intervals
export const hermeticHarmonicRelationships = {
  title: "Hermetic Principles in the Harmonic Sequence",
  description: "The seven Hermetic principles are reflected in the harmonic sequence, revealing the mathematical and vibrational basis of these ancient teachings.",
  relationships: [
    {
      principle: "mentalism",
      primaryInterval: "unison",
      description: "The principle that all is mind is reflected in the unison (1:1), representing unity consciousness."
    },
    {
      principle: "correspondence",
      primaryInterval: "fifth",
      description: "As above, so below is reflected in the perfect fifth (3:2), showing the relationship between higher and lower octaves."
    },
    {
      principle: "vibration",
      primaryInterval: "fourth",
      description: "Nothing rests; everything vibrates is embodied in the perfect fourth (4:3), a stabilizing frequency."
    },
    {
      principle: "polarity",
      primaryInterval: "major_third",
      description: "Everything has its opposite is demonstrated in the major third (5:4), which creates brightness through tension and resolution."
    },
    {
      principle: "rhythm",
      primaryInterval: "minor_third",
      description: "Everything flows in cycles is reflected in the minor third (6:5), which creates emotional depth through cyclical patterns."
    },
    {
      principle: "cause_effect",
      primaryInterval: "major_sixth",
      description: "Every cause has its effect is demonstrated in the major sixth (5:3), which creates forward movement and resolution."
    },
    {
      principle: "gender",
      primaryInterval: "minor_sixth",
      description: "Gender is in everything is reflected in the minor sixth (8:5), balancing masculine and feminine energies."
    }
  ]
};

