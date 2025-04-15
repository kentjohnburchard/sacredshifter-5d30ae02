
// Map chakra names to color schemes for visualization
export interface ChakraColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  background: string;
}

export const chakraColors: Record<string, ChakraColorScheme> = {
  Root: {
    primary: '#ff0000',
    secondary: '#8B0000',
    tertiary: '#FF6347',
    accent: '#FF4500',
    background: '#200000',
  },
  Sacral: {
    primary: '#ff7f00',
    secondary: '#D2691E',
    tertiary: '#FFA07A',
    accent: '#FF8C00',
    background: '#201000',
  },
  SolarPlexus: {
    primary: '#ffff00',
    secondary: '#DAA520',
    tertiary: '#FFD700',
    accent: '#FFA500',
    background: '#202000',
  },
  Heart: {
    primary: '#00ff00',
    secondary: '#228B22',
    tertiary: '#90EE90',
    accent: '#32CD32',
    background: '#002000',
  },
  Throat: {
    primary: '#00ffff',
    secondary: '#20B2AA',
    tertiary: '#AFEEEE',
    accent: '#00CED1',
    background: '#002020',
  },
  ThirdEye: {
    primary: '#0000ff',
    secondary: '#0000CD',
    tertiary: '#B0E0E6',
    accent: '#1E90FF',
    background: '#000020',
  },
  Crown: {
    primary: '#8b00ff',
    secondary: '#4B0082',
    tertiary: '#E6E6FA',
    accent: '#9370DB',
    background: '#100020',
  },
  // Additional theme options
  "gentle-waves": {
    primary: '#4a90e2',
    secondary: '#5f9de7',
    tertiary: '#dbeeff',
    accent: '#2e6fc9',
    background: '#0a192f',
  },
  "cosmic-ocean": {
    primary: '#6d57ff',
    secondary: '#9c7dff',
    tertiary: '#e2d8ff',
    accent: '#4a2fdc',
    background: '#10053d',
  },
};

// Helper function to get chakra colors based on chakra name(s)
export const getChakraColorScheme = (chakras: string[] = []): ChakraColorScheme => {
  // Default to Crown chakra if no chakra is specified
  if (!chakras.length) {
    return chakraColors.Crown;
  }
  
  // If multiple chakras, use the first one
  const primaryChakra = chakras[0].replace(/\s+/g, '');
  
  return chakraColors[primaryChakra] || chakraColors.Crown;
};

// Get color based on frequency
export const getFrequencyColor = (frequency: number): string => {
  if (frequency < 200) return chakraColors.Root.primary;
  if (frequency < 300) return chakraColors.Sacral.primary;
  if (frequency < 400) return chakraColors.SolarPlexus.primary;
  if (frequency < 500) return chakraColors.Heart.primary;
  if (frequency < 600) return chakraColors.Throat.primary;
  if (frequency < 700) return chakraColors.ThirdEye.primary;
  return chakraColors.Crown.primary;
};

// Get gradient colors for visualizer based on chakras
export const getChakraGradient = (chakras: string[]): string[] => {
  if (!chakras.length) return [chakraColors.Crown.primary, chakraColors.ThirdEye.primary];
  
  if (chakras.length === 1) {
    const chakra = chakras[0].replace(/\s+/g, '');
    const colors = chakraColors[chakra] || chakraColors.Crown;
    return [colors.primary, colors.secondary];
  }
  
  // If multiple chakras, create a gradient between them
  const gradient: string[] = [];
  chakras.forEach(chakra => {
    const name = chakra.replace(/\s+/g, '');
    const colors = chakraColors[name] || chakraColors.Crown;
    gradient.push(colors.primary);
  });
  
  return gradient;
};
