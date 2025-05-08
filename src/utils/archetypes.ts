
import { ChakraTag } from '@/types/chakras';

export interface Archetype {
  name: string;
  symbol: string;
  themeColor: string;
  description?: string;
}

export const archetypes: Record<string, Archetype> = {
  'Root': { 
    name: "The Warrior", 
    symbol: "/symbols/sword.svg", 
    themeColor: "#a83232",
    description: "Embodies strength, courage, and protection. The warrior archetype helps you establish security and stability."
  },
  'Sacral': { 
    name: "The Creator", 
    symbol: "/symbols/wave.svg", 
    themeColor: "#ff7a00",
    description: "Embodies passion, pleasure, and creative expression. The creator archetype nurtures your creative flow."
  },
  'Solar Plexus': { 
    name: "The Hero", 
    symbol: "/symbols/sun.svg", 
    themeColor: "#ffd700",
    description: "Embodies confidence, willpower, and autonomy. The hero archetype empowers your authentic self."
  },
  'Heart': { 
    name: "The Lover", 
    symbol: "/symbols/rose.svg", 
    themeColor: "#e94560",
    description: "Embodies compassion, connection, and harmony. The lover archetype opens your capacity to give and receive love."
  },
  'Throat': { 
    name: "The Messenger", 
    symbol: "/symbols/wing.svg", 
    themeColor: "#4ca1ff",
    description: "Embodies truth, expression, and communication. The messenger archetype amplifies your authentic voice."
  },
  'Third Eye': { 
    name: "The Seer", 
    symbol: "/symbols/eye.svg", 
    themeColor: "#6a0dad",
    description: "Embodies insight, intuition, and clarity. The seer archetype awakens your inner wisdom."
  },
  'Crown': { 
    name: "The Divine", 
    symbol: "/symbols/lotus.svg", 
    themeColor: "#ffffff",
    description: "Embodies connection, enlightenment, and transcendence. The divine archetype connects you with higher consciousness."
  },
  'Transpersonal': { 
    name: "The Mystic", 
    symbol: "/symbols/infinity.svg", 
    themeColor: "#8E44AD",
    description: "Embodies mystery, divine knowledge, and cosmic connection. The mystic archetype transcends ordinary reality."
  },
  'Cosmic': { 
    name: "The Universe", 
    symbol: "/symbols/galaxy.svg", 
    themeColor: "#C0C0C0",
    description: "Embodies oneness, expansion, and cosmic consciousness. The universe archetype connects you to all that is."
  },
  'Earth Star': { 
    name: "The Guardian", 
    symbol: "/symbols/tree.svg", 
    themeColor: "#8B4513",
    description: "Embodies grounding, stability, and earth connection. The guardian archetype anchors you to physical reality."
  },
  'Soul Star': { 
    name: "The Illuminator", 
    symbol: "/symbols/prism.svg", 
    themeColor: "#E6E6FA",
    description: "Embodies soul purpose, higher self, and divine light. The illuminator archetype connects you with your soul's mission."
  }
};

export const getArchetypeForChakra = (chakra?: ChakraTag): Archetype | undefined => {
  if (!chakra) return undefined;
  return archetypes[chakra];
};
