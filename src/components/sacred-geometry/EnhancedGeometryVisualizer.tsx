
import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion } from 'framer-motion';
import SacredVisualizer from './SacredVisualizer';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Play, Flower, Hexagon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

type GeometryShape = 'flower-of-life' | 'seed-of-life' | 'metatrons-cube' | 
                      'merkaba' | 'torus' | 'tree-of-life' | 'sri-yantra' | 
                      'vesica-piscis' | 'sphere';

interface EnhancedGeometryVisualizerProps {
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
  expandable?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
}

const EnhancedGeometryVisualizer: React.FC<EnhancedGeometryVisualizerProps> = ({
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
  mode: initialMode,
  sensitivity = 1,
  expandable = false,
  onExpandStateChange,
}) => {
  const { liftTheVeil } = useTheme();
  const [currentShape, setCurrentShape] = useState<GeometryShape>(defaultShape);
  const [expanded, setExpanded] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<'fractal' | 'spiral' | 'mandala'>(
    liftTheVeil ? 'spiral' : initialMode || 'fractal'
  );
  
  // Update shape when defaultShape prop changes
  useEffect(() => {
    if (defaultShape !== currentShape) {
      setCurrentShape(defaultShape);
    }
  }, [defaultShape, currentShape]);

  // Update mode when theme changes
  useEffect(() => {
    setVisualizerMode(liftTheVeil ? 'spiral' : initialMode || 'fractal');
  }, [liftTheVeil, initialMode]);

  // Log audio context and analyser on mount for debugging
  useEffect(() => {
    console.log("EnhancedGeometryVisualizer: Received audioContext?", !!audioContext);
    console.log("EnhancedGeometryVisualizer: Received analyser?", !!analyser);
    if (analyser) {
      console.log("EnhancedGeometryVisualizer: Analyser FFT size:", analyser.fftSize);
    }
  }, [audioContext, analyser]);

  const shouldShow = isVisible !== false;
  
  const toggleExpand = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onExpandStateChange) {
      onExpandStateChange(newExpandedState);
    }
  };

  const effectiveSize = expanded ? 'xl' : size;

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

  const modeOptions = [
    { value: 'fractal', label: 'Fractal', icon: <Flower className="w-4 h-4" /> },
    { value: 'spiral', label: 'Spiral', icon: <Hexagon className="w-4 h-4" /> },
    { value: 'mandala', label: 'Mandala', icon: <Play className="w-4 h-4 rotate-90" /> },
  ];

  if (!shouldShow) {
    return null;
  }
  
  // Container classes based on expanded state
  const containerBaseClass = "sacred-geometry-container rounded-xl shadow-xl relative";
  const containerSizeClass = expanded 
    ? "fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/80 pt-12" 
    : `w-full h-[60vw] max-h-[400px] sm:h-[300px] lg:h-[384px] ${className}`;

  // Apply mode-specific styles
  const bgClass = liftTheVeil 
    ? 'bg-pink-900/10' 
    : 'bg-purple-900/10';

  return (
    <div className={`${containerBaseClass} ${containerSizeClass} ${bgClass}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative"
      >
        {expandable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            className={`
              absolute top-2 right-2 z-30 
              ${liftTheVeil ? 'bg-pink-900/40 hover:bg-pink-900/60' : 'bg-purple-900/40 hover:bg-purple-900/60'} 
              text-white
            `}
            title={expanded ? "Minimize" : "Maximize"}
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        )}
        
        <div className={expanded ? "w-full h-[80vh]" : "w-full h-full"}>
          <motion.div
            key={`${currentShape}-${visualizerMode}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <SacredVisualizer 
              shape={currentShape} 
              size={effectiveSize} 
              isAudioReactive={isAudioReactive || !!analyser}
              audioContext={audioContext}
              analyser={analyser}
              chakra={chakra}
              frequency={frequency}
              mode={visualizerMode}
              sensitivity={sensitivity}
              liftedVeil={liftTheVeil}
            />
          </motion.div>
        </div>
        
        {showControls && expanded && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
            <ToggleGroup 
              type="single" 
              value={visualizerMode}
              onValueChange={(value) => {
                if (value) {
                  setVisualizerMode(value as 'fractal' | 'spiral' | 'mandala');
                }
              }}
              className="bg-black/60 backdrop-blur-md rounded-lg p-2 flex flex-wrap justify-center shadow-lg"
            >
              {modeOptions.map((option) => (
                <ToggleGroupItem 
                  key={option.value} 
                  value={option.value}
                  className={`
                    px-3 py-1 text-xs text-white rounded flex items-center gap-2
                    data-[state=on]:${liftTheVeil ? 'bg-pink-700' : 'bg-purple-700'}
                  `}
                >
                  {option.icon} {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
        
        {showControls && (
          <div className={`${expanded ? "absolute bottom-8" : "absolute bottom-2 sm:bottom-4"} left-1/2 transform -translate-x-1/2 z-20 w-full px-2 sm:px-0 max-w-full sm:max-w-md`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-black/80 backdrop-blur-md rounded-lg p-1 sm:p-2 flex flex-wrap justify-center shadow-lg overflow-x-auto"
            >
              <ToggleGroup 
                type="single" 
                value={currentShape}
                onValueChange={(value) => {
                  if (value) {
                    setCurrentShape(value as GeometryShape);
                  }
                }}
                className="flex flex-wrap justify-center"
              >
                {shapeOptions.map((option) => (
                  <ToggleGroupItem 
                    key={option.value} 
                    value={option.value}
                    className={`
                      px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs text-white rounded
                      data-[state=on]:${liftTheVeil ? 'bg-pink-700' : 'bg-purple-700'}
                    `}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </motion.div>
          </div>
        )}
        
        {expanded && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <Button
              variant="outline"
              onClick={toggleExpand}
              className={`
                ${liftTheVeil 
                  ? 'bg-pink-900/30 border-pink-400/30 text-pink-100 hover:bg-pink-900/50' 
                  : 'bg-purple-900/30 border-purple-400/30 text-purple-100 hover:bg-purple-900/50'}
              `}
            >
              Return to Player
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedGeometryVisualizer;
