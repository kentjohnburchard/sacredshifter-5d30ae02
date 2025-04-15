
// Placeholder for future 2D canvas visualizers
export type ChakraType = 
  | 'root' 
  | 'sacral' 
  | 'solar plexus' 
  | 'heart' 
  | 'throat' 
  | 'third eye' 
  | 'crown';

// Helper function to get chakra colors
export const getChakraColor = (chakra: ChakraType): string => {
  const chakraColors: Record<ChakraType, string> = {
    'root': '#ef4444',
    'sacral': '#f97316',
    'solar plexus': '#facc15',
    'heart': '#22c55e',
    'throat': '#3b82f6',
    'third eye': '#6366f1',
    'crown': '#a855f7'
  };
  
  return chakraColors[chakra] || '#a855f7';
};
