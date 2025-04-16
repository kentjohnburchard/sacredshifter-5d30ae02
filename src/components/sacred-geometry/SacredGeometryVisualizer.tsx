
import React, { useState } from 'react';
import SacredVisualizer from './SacredVisualizer';

export interface SacredGeometryVisualizerProps {
  defaultShape?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  chakra?: string;
  frequency?: number;
  mode?: 'static' | 'animate' | 'fractal';
  liftedVeil?: boolean;
  showControls?: boolean;
  isVisible?: boolean;
  className?: string;
}

const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  defaultShape = 'flower-of-life',
  size = 'md',
  isAudioReactive = false,
  audioContext = null,
  analyser = null,
  chakra,
  frequency,
  mode = 'animate',
  liftedVeil = false,
  showControls = false,
  isVisible = true,
  className = '',
}) => {
  const [selectedShape, setSelectedShape] = useState(defaultShape);

  // Get size class based on size prop
  const sizeClass = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-96',
    xl: 'h-[500px]'
  }[size] || 'h-64';

  // Shape options that users can select if controls are shown
  const shapeOptions = [
    { id: 'flower-of-life', label: 'Flower of Life' },
    { id: 'metatrons-cube', label: 'Metatron\'s Cube' },
    { id: 'sri-yantra', label: 'Sri Yantra' },
    { id: 'merkaba', label: 'Merkaba' },
    { id: 'torus', label: 'Torus' }
  ];

  return (
    <div className={`sacred-geometry-visualizer relative ${sizeClass} ${className} ${isVisible ? '' : 'hidden'}`}>
      {/* Visualizer Component */}
      <div className="visualization-container h-full w-full">
        <SacredVisualizer
          shape={selectedShape}
          size={size}
          isAudioReactive={isAudioReactive}
          audioContext={audioContext || undefined}
          analyser={analyser || undefined}
          chakra={chakra}
          frequency={frequency}
          liftedVeil={liftedVeil}
        />
      </div>

      {/* Controls */}
      {showControls && (
        <div className="visualization-controls absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-1 flex space-x-2">
            {shapeOptions.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setSelectedShape(shape.id)}
                className={`text-xs px-2 py-1 rounded ${
                  selectedShape === shape.id
                    ? 'bg-purple-500 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SacredGeometryVisualizer;
