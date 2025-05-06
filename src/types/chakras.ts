
export type ChakraTag = 
  | 'Root' 
  | 'Sacral' 
  | 'Solar Plexus' 
  | 'Heart' 
  | 'Throat' 
  | 'Third Eye' 
  | 'Crown' 
  | 'Transpersonal';

export interface ChakraInfo {
  name: ChakraTag;
  color: string;
  bgColor: string;
  hoverColor: string;
  description: string;
  element?: string;
  frequency?: number;
  icon?: string;
}

export const CHAKRA_COLORS: Record<ChakraTag, { color: string; bgColor: string; hoverColor: string }> = {
  'Root': { 
    color: '#ea384c', 
    bgColor: 'rgba(234, 56, 76, 0.15)', 
    hoverColor: 'rgba(234, 56, 76, 0.25)' 
  },
  'Sacral': { 
    color: '#ff7e47', 
    bgColor: 'rgba(255, 126, 71, 0.15)', 
    hoverColor: 'rgba(255, 126, 71, 0.25)' 
  },
  'Solar Plexus': { 
    color: '#ffd034', 
    bgColor: 'rgba(255, 208, 52, 0.15)', 
    hoverColor: 'rgba(255, 208, 52, 0.25)' 
  },
  'Heart': { 
    color: '#4ade80', 
    bgColor: 'rgba(74, 222, 128, 0.15)', 
    hoverColor: 'rgba(74, 222, 128, 0.25)' 
  },
  'Throat': { 
    color: '#48cae7', 
    bgColor: 'rgba(72, 202, 231, 0.15)', 
    hoverColor: 'rgba(72, 202, 231, 0.25)' 
  },
  'Third Eye': { 
    color: '#7e69ab', 
    bgColor: 'rgba(126, 105, 171, 0.15)', 
    hoverColor: 'rgba(126, 105, 171, 0.25)' 
  },
  'Crown': { 
    color: '#9b87f5', 
    bgColor: 'rgba(155, 135, 245, 0.15)', 
    hoverColor: 'rgba(155, 135, 245, 0.25)' 
  },
  'Transpersonal': { 
    color: '#e5deff', 
    bgColor: 'rgba(229, 222, 255, 0.15)', 
    hoverColor: 'rgba(229, 222, 255, 0.25)' 
  }
};

export const CHAKRAS: ChakraInfo[] = [
  {
    name: 'Root',
    color: CHAKRA_COLORS.Root.color,
    bgColor: CHAKRA_COLORS.Root.bgColor,
    hoverColor: CHAKRA_COLORS.Root.hoverColor,
    description: 'Foundation, security, survival, and grounding',
    element: 'Earth',
    frequency: 396
  },
  {
    name: 'Sacral',
    color: CHAKRA_COLORS.Sacral.color,
    bgColor: CHAKRA_COLORS.Sacral.bgColor,
    hoverColor: CHAKRA_COLORS.Sacral.hoverColor,
    description: 'Creativity, passion, pleasure, and emotional flow',
    element: 'Water',
    frequency: 417
  },
  {
    name: 'Solar Plexus',
    color: CHAKRA_COLORS['Solar Plexus'].color,
    bgColor: CHAKRA_COLORS['Solar Plexus'].bgColor,
    hoverColor: CHAKRA_COLORS['Solar Plexus'].hoverColor,
    description: 'Personal power, confidence, and self-esteem',
    element: 'Fire',
    frequency: 528
  },
  {
    name: 'Heart',
    color: CHAKRA_COLORS.Heart.color,
    bgColor: CHAKRA_COLORS.Heart.bgColor,
    hoverColor: CHAKRA_COLORS.Heart.hoverColor,
    description: 'Love, compassion, and connection',
    element: 'Air',
    frequency: 639
  },
  {
    name: 'Throat',
    color: CHAKRA_COLORS.Throat.color,
    bgColor: CHAKRA_COLORS.Throat.bgColor,
    hoverColor: CHAKRA_COLORS.Throat.hoverColor,
    description: 'Communication, expression, and truth',
    element: 'Ether',
    frequency: 741
  },
  {
    name: 'Third Eye',
    color: CHAKRA_COLORS['Third Eye'].color,
    bgColor: CHAKRA_COLORS['Third Eye'].bgColor,
    hoverColor: CHAKRA_COLORS['Third Eye'].hoverColor,
    description: 'Intuition, imagination, and inner wisdom',
    element: 'Light',
    frequency: 852
  },
  {
    name: 'Crown',
    color: CHAKRA_COLORS.Crown.color,
    bgColor: CHAKRA_COLORS.Crown.bgColor,
    hoverColor: CHAKRA_COLORS.Crown.hoverColor,
    description: 'Spiritual connection, enlightenment, and higher consciousness',
    element: 'Thought',
    frequency: 963
  },
  {
    name: 'Transpersonal',
    color: CHAKRA_COLORS.Transpersonal.color,
    bgColor: CHAKRA_COLORS.Transpersonal.bgColor,
    hoverColor: CHAKRA_COLORS.Transpersonal.hoverColor,
    description: 'Connection to all that is, transcendence, and universal consciousness',
    element: 'Cosmos',
    frequency: 1074
  }
];

export const getChakraInfo = (chakraTag?: string): ChakraInfo | undefined => {
  if (!chakraTag) return undefined;
  return CHAKRAS.find(chakra => chakra.name === chakraTag);
};

export const getChakraColor = (chakraTag?: string): string => {
  if (!chakraTag) return '#9ca3af'; // Default gray color
  const chakra = CHAKRAS.find(c => c.name === chakraTag);
  return chakra?.color || '#9ca3af';
};
