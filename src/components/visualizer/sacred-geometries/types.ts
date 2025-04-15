
export type ChakraType = 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';

export type SacredGeometryType = 
  | 'flowerOfLife' 
  | 'merkaba' 
  | 'metatronCube' 
  | 'sriYantra' 
  | 'fibonacciSpiral'
  | 'chakraBeam';

export interface GeometryConfig {
  type: SacredGeometryType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  chakra?: ChakraType;
  isActive?: boolean;
  color?: string;
}

export interface SacredGeometryProps {
  chakra?: ChakraType;
  intensity?: number;
  frequencyData?: Uint8Array;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isActive?: boolean;
  color?: string;
}

// Function to get chakra color based on chakra type
export function getChakraColor(chakra: ChakraType = 'crown'): string {
  const chakraColors: Record<ChakraType, string> = {
    'root': '#ef4444',
    'sacral': '#f97316',
    'solar plexus': '#facc15',
    'heart': '#22c55e',
    'throat': '#3b82f6',
    'third eye': '#6366f1',
    'crown': '#a855f7'
  };
  
  return chakraColors[chakra];
}
