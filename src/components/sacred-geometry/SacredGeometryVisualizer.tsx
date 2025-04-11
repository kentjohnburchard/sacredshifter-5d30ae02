
import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion } from 'framer-motion';
import SacredVisualizer from './SacredVisualizer';
import { CosmicContainer } from '.';

type GeometryShape = 'flower-of-life' | 'seed-of-life' | 'metatrons-cube' | 
                      'merkaba' | 'torus' | 'tree-of-life' | 'sri-yantra' | 
                      'vesica-piscis' | 'sphere';

interface SacredGeometryVisualizerProps {
  defaultShape?: GeometryShape;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showControls?: boolean;
  isAudioReactive?: boolean;
  className?: string;
  // Add audio analysis props
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  isVisible?: boolean;
  chakra?: string;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
  scale?: number; // New prop to control the scale of the visualizer
}

const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  defaultShape = 'flower-of-life',
  size = 'lg',
  showControls = true,
  isAudioReactive = false,
  className = '',
  audioContext,
  analyser,
  isVisible = true,
  chakra,
  frequency,
  mode,
  sensitivity = 1,
  scale = 1, // Default scale factor
}) => {
  const [currentShape, setCurrentShape] = useState<GeometryShape>(defaultShape);

  // Only show visualizer if explicitly visible
  const shouldShow = isVisible !== false;

  const shapeOptions: { value: GeometryShape; label: string }[] = [
    { value: 'flower-of-life', label: 'Flower of Life' },
    { value: 'seed-of-life', label: 'Seed of Life' },
    { value: 'metatrons-cube', label: 'Metatron\'s Cube' },
    { value: 'merkaba', label: 'Merkaba' },
    { value: 'torus', label: 'Torus' },
    { value: 'tree-of-life', label: 'Tree of Life' },
    { value: 'sri-yantra', label: 'Sri Yantra' },
    { value: 'vesica-piscis', label: 'Vesica Piscis' },
  ];

  if (!shouldShow) {
    return null;
  }

  // Apply the scale factor to the container size
  const containerStyle = {
    transform: `scale(${scale})`,
  };

  return (
    <div className={`sacred-geometry-container ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative"
        style={containerStyle}
      >
        <div className="w-full h-full overflow-hidden">
          <SacredVisualizer 
            shape={currentShape} 
            size={size} 
            isAudioReactive={isAudioReactive}
            audioContext={audioContext}
            analyser={analyser}
            chakra={chakra}
            frequency={frequency}
            mode={mode}
            sensitivity={sensitivity}
          />
        </div>
        
        {showControls && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <ToggleGroup 
              type="single" 
              value={currentShape}
              onValueChange={(value) => {
                if (value) setCurrentShape(value as GeometryShape);
              }}
              className="bg-black/70 backdrop-blur-md rounded-lg p-1 flex flex-wrap justify-center" // Increased contrast
            >
              {shapeOptions.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="px-2 py-1 text-xs text-white data-[state=on]:bg-purple-700/80" // Increased contrast
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SacredGeometryVisualizer;
