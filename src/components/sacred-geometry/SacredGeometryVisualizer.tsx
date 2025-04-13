
import React, { useState, useEffect } from 'react';
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
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  isVisible?: boolean;
  chakra?: string;
  frequency?: number;
  mode?: 'fractal' | 'spiral' | 'mandala';
  sensitivity?: number;
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
}) => {
  const [currentShape, setCurrentShape] = useState<GeometryShape>(defaultShape);
  
  // Update shape when defaultShape prop changes
  useEffect(() => {
    if (defaultShape !== currentShape) {
      setCurrentShape(defaultShape);
    }
  }, [defaultShape]);

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

  return (
    <div className={`sacred-geometry-container w-full h-[60vw] max-h-[400px] sm:h-[300px] lg:h-[384px] rounded-xl shadow-xl bg-black/20 ${className} relative`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative"
      >
        <div className="w-full h-full">
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
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-full px-2 sm:px-0 max-w-full sm:max-w-md">
            <ToggleGroup 
              type="single" 
              value={currentShape}
              onValueChange={(value) => {
                if (value) {
                  setCurrentShape(value as GeometryShape);
                }
              }}
              className="bg-black/80 backdrop-blur-md rounded-lg p-1 sm:p-2 flex flex-wrap justify-center shadow-lg overflow-x-auto"
            >
              {shapeOptions.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs text-white data-[state=on]:bg-purple-700 rounded"
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
