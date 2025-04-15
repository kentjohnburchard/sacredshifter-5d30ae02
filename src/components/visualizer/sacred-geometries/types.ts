
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';

export interface SacredGeometryProps {
  frequencyData?: Uint8Array;
  chakra?: 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';
  intensity?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  isActive?: boolean;
}

// Sacred geometry types - these are the core geometries we're implementing
export type SacredGeometryType = 'flowerOfLife' | 'merkaba' | 'metatronCube' | 'sriYantra' | 'fibonacciSpiral' | 'chakraBeam' | 'multi';

export interface GeometryConfig {
  type: SacredGeometryType;
  chakra?: 'root' | 'sacral' | 'solar plexus' | 'heart' | 'throat' | 'third eye' | 'crown';
  intensity?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  isActive?: boolean;
}

export const getChakraColor = (chakra?: string): string => {
  const chakraColors: Record<string, string> = {
    root: '#ef4444',
    sacral: '#f97316',
    'solar plexus': '#facc15',
    heart: '#22c55e',
    throat: '#3b82f6',
    'third eye': '#6366f1',
    crown: '#a855f7'
  };
  return chakraColors[chakra || ''] || '#a855f7';
};
