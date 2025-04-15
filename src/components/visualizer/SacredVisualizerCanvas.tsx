
import React from 'react';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { useTheme } from '@/context/ThemeContext';
import { ChakraType, SacredGeometryType } from './sacred-geometries';

interface GeometryConfig {
  type: SacredGeometryType;
  chakra?: ChakraType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

type SacredVisualizerCanvasProps = {
  frequencyData?: Uint8Array;
  chakra?: ChakraType;
  visualizerMode?: VisualizerMode | SacredGeometryType;
  enableControls?: boolean;
  enablePostProcessing?: boolean;
  intensity?: number;
  multiView?: boolean;
  geometryConfigs?: GeometryConfig[];
};

// This is now a simple 2D canvas visualizer rather than a Three.js component
const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode = 'flowerOfLife', 
  enableControls = true,
  enablePostProcessing = false,
  intensity = 0,
  multiView = false,
  geometryConfigs = [],
}) => {
  // Only include the geometry types we know we properly support
  const supportedGeometryTypes: SacredGeometryType[] = [
    'flowerOfLife', 'merkaba', 'metatronCube', 'sriYantra', 'fibonacciSpiral', 'chakraBeam',
    'primeFlow', 'chakraSpiral', 'multi'
  ];
  
  // Check if visualizerMode is one of our supported types
  const isSupportedGeometry = supportedGeometryTypes.includes(visualizerMode as SacredGeometryType);
  const shouldRender = typeof visualizerMode === 'string';
  const { liftTheVeil } = useTheme();
  
  if (!shouldRender) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
        <p className="text-white/50">Visualizer unavailable</p>
      </div>
    );
  }
  
  // If multiView is enabled, use a grid layout
  if (multiView || visualizerMode === 'multi') {
    return (
      <div className="w-full h-full bg-gradient-to-r from-purple-900/30 to-indigo-900/30 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl font-semibold mb-4">Multi-Visualizer Mode</div>
          <div className="grid grid-cols-3 gap-4">
            {supportedGeometryTypes.map((type, index) => (
              <div 
                key={`geometry-${type}-${index}`}
                className="w-16 h-16 rounded-full bg-purple-700/50 flex items-center justify-center"
              >
                <span className="text-xs">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const getColor = () => {
    if (!chakra) return '#a855f7';
    
    switch (chakra) {
      case 'root': return '#ef4444';
      case 'sacral': return '#f97316';
      case 'solar plexus': return '#facc15';
      case 'heart': return '#22c55e';
      case 'throat': return '#3b82f6';
      case 'third eye': return '#6366f1';
      case 'crown': return '#a855f7';
      default: return '#a855f7';
    }
  };
  
  const color = getColor();
  
  return (
    <div className="w-full h-full bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
      <canvas 
        id="geometry-canvas"
        className="w-full h-full absolute top-0 left-0"
        style={{ 
          opacity: 0.8 
        }}
      />
      <div className="text-white text-center z-10">
        <div className="text-xl font-semibold">
          {visualizerMode}
        </div>
        <div className="text-sm opacity-70 mt-2">
          {chakra} chakra visualization
        </div>
      </div>
    </div>
  );
};

export default SacredVisualizerCanvas;
