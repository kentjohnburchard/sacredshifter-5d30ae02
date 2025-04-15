
// Sacred geometry visualization types and utilities
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

// Define types for 2D canvas visualizer components to replace Three.js components
export type SacredGeometryType = 
  | 'flowerOfLife' 
  | 'merkaba' 
  | 'metatronCube' 
  | 'sriYantra' 
  | 'fibonacciSpiral' 
  | 'chakraBeam'
  | 'primeFlow'
  | 'chakraSpiral'
  | 'multi';

// Configuration interface for geometry visualizers
export interface GeometryConfig {
  type: SacredGeometryType;
  chakra?: ChakraType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isActive?: boolean;
  color?: string;
}

// Export placeholder components that will be replaced with canvas implementations
// These are dummy exports to satisfy the imports in other files
export const FlowerOfLifeGeometry = () => null;
export const MerkabaGeometry = () => null;
export const MetatronCubeGeometry = () => null;
export const SriYantraGeometry = () => null;
export const FibonacciSpiralGeometry = () => null;
export const ChakraBeamGeometry = () => null;

// Simplified sacred geometry props for canvas visualizers
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
