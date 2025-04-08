
export type HermeticPrinciple = "mentalism" | "correspondence" | "vibration" | "polarity" | "rhythm" | "cause_effect" | "gender";

export interface HermeticPrincipleDefinition {
  id: HermeticPrinciple;
  name: string;
  description: string;
  principle: string;
  chakra?: string;
  frequency?: number;
  symbol?: string;
  color?: string;
  element?: string;
}

export const hermeticPrinciples: Record<HermeticPrinciple, HermeticPrincipleDefinition> = {
  mentalism: {
    id: "mentalism",
    name: "The Principle of Mentalism",
    description: "The All is Mind; The Universe is Mental",
    principle: "THE ALL is MIND; The Universe is Mental.",
    chakra: "crown",
    frequency: 963,
    symbol: "Eye",
    color: "#7F00FF", // Violet
    element: "thought"
  },
  correspondence: {
    id: "correspondence",
    name: "The Principle of Correspondence",
    description: "As above, so below; as below, so above",
    principle: "As above, so below; as below, so above.",
    chakra: "third_eye",
    frequency: 852,
    symbol: "Mirror",
    color: "#000080", // Indigo
    element: "light"
  },
  vibration: {
    id: "vibration",
    name: "The Principle of Vibration",
    description: "Nothing rests; everything moves; everything vibrates",
    principle: "Nothing rests; everything moves; everything vibrates.",
    chakra: "throat",
    frequency: 741,
    symbol: "Waves",
    color: "#0000FF", // Blue
    element: "ether"
  },
  polarity: {
    id: "polarity",
    name: "The Principle of Polarity",
    description: "Everything is dual; everything has poles; everything has its pair of opposites",
    principle: "Everything is dual; everything has poles; everything has its pair of opposites.",
    chakra: "heart",
    frequency: 639,
    symbol: "Yin-Yang",
    color: "#00FF00", // Green
    element: "air"
  },
  rhythm: {
    id: "rhythm",
    name: "The Principle of Rhythm",
    description: "Everything flows, out and in; everything has its tides; all things rise and fall",
    principle: "Everything flows, out and in; everything has its tides; all things rise and fall.",
    chakra: "solar_plexus",
    frequency: 528,
    symbol: "Pendulum",
    color: "#FFFF00", // Yellow
    element: "fire"
  },
  cause_effect: {
    id: "cause_effect",
    name: "The Principle of Cause and Effect",
    description: "Every cause has its effect; every effect has its cause",
    principle: "Every Cause has its Effect; every Effect has its Cause.",
    chakra: "sacral",
    frequency: 417,
    symbol: "Chain",
    color: "#FFA500", // Orange
    element: "water"
  },
  gender: {
    id: "gender",
    name: "The Principle of Gender",
    description: "Gender is in everything; everything has its masculine and feminine principles",
    principle: "Gender is in everything; everything has its Masculine and Feminine Principles.",
    chakra: "root",
    frequency: 396,
    symbol: "Caduceus",
    color: "#FF0000", // Red
    element: "earth"
  }
};
