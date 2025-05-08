
/**
 * ChakraTag type definition
 */
export type ChakraTag = 
  | 'Root'
  | 'Sacral'
  | 'Solar Plexus'
  | 'Heart'
  | 'Throat'
  | 'Third Eye'
  | 'Crown'
  | 'Transpersonal'
  | 'Cosmic'
  | 'Earth Star'
  | 'Soul Star';

export const CHAKRA_COLORS: Record<ChakraTag, string> = {
  'Root': '#FF0000',
  'Sacral': '#FF7F00',
  'Solar Plexus': '#FFFF00',
  'Heart': '#00FF00',
  'Throat': '#00FFFF',
  'Third Eye': '#0000FF',
  'Crown': '#8B00FF',
  'Transpersonal': '#FFFFFF',
  'Cosmic': '#C0C0C0',
  'Earth Star': '#8B4513',
  'Soul Star': '#E6E6FA'
};

export const CHAKRA_FREQUENCIES: Record<ChakraTag, number> = {
  'Root': 396,
  'Sacral': 417,
  'Solar Plexus': 528,
  'Heart': 639,
  'Throat': 741,
  'Third Eye': 852,
  'Crown': 963,
  'Transpersonal': 1074,
  'Cosmic': 1185,
  'Earth Star': 174,
  'Soul Star': 285
};

export const getChakraColor = (chakra?: ChakraTag): string => {
  if (!chakra || !CHAKRA_COLORS[chakra]) {
    return '#8B00FF'; // Default to purple
  }
  return CHAKRA_COLORS[chakra];
};
