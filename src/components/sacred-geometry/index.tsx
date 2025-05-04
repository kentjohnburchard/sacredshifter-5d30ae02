
import React, { useEffect, useState, useMemo } from 'react';

type Shape = 'flower-of-life' | 'sri-yantra' | 'metatron-cube' | 'seed-of-life' | 'torus' | 'vesica-pisces';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface SacredGeometryVisualizerProps {
  defaultShape?: Shape;
  size?: Size;
  className?: string;
  showControls?: boolean;
  isAudioReactive?: boolean;
  isStatic?: boolean;
}

export const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  defaultShape = 'flower-of-life',
  size = 'md',
  className = '',
  showControls = false,
  isAudioReactive = false,
  isStatic = false
}) => {
  const [currentShape, setCurrentShape] = useState<Shape>(defaultShape);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.5);
  
  // Only log once during component mount
  useEffect(() => {
    console.log("SacredVisualizer mounting shape:", defaultShape);
  }, [defaultShape]);

  // Get size dimensions
  const dimensions = useMemo(() => {
    switch(size) {
      case 'sm': return { width: 200, height: 200 };
      case 'md': return { width: 350, height: 350 };
      case 'lg': return { width: 500, height: 500 };
      case 'xl': return { width: 800, height: 800 };
      default: return { width: 350, height: 350 };
    }
  }, [size]);
  
  // Only animate if not static
  useEffect(() => {
    if (isStatic) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.05) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isStatic]);

  // Get SVG for current shape
  const renderShape = () => {
    // Base SVG path for each shape
    const paths: Record<Shape, string> = {
      'flower-of-life': 'M50,20 A30,30 0 1,0 80,50 A30,30 0 1,0 50,80 A30,30 0 1,0 20,50 A30,30 0 1,0 50,20 Z',
      'sri-yantra': 'M10,50 L90,50 L50,10 Z M10,90 L90,90 L50,10 Z M50,10 L50,90 Z M10,30 L90,70 Z M10,70 L90,30 Z',
      'metatron-cube': 'M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z M50,10 L50,90 Z M10,30 L90,30 Z M10,70 L90,70 Z M10,30 L50,90 Z M90,30 L50,90 Z M10,70 L50,10 Z M90,70 L50,10 Z',
      'seed-of-life': 'M50,20 A30,30 0 1,0 80,50 A30,30 0 1,0 50,80 A30,30 0 1,0 20,50 A30,30 0 1,0 50,20 Z',
      'torus': 'M20,50 A30,10 0 1,0 80,50 A30,10 0 1,0 20,50 Z M35,35 A10,30 0 1,0 65,65 A10,30 0 1,0 35,35 Z',
      'vesica-pisces': 'M40,50 A30,30 0 1,0 70,30 A30,30 0 1,0 40,50 Z'
    };
    
    return paths[currentShape] || paths['flower-of-life'];
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        style={{ 
          width: dimensions.width, 
          height: dimensions.height,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isStatic ? 'none' : 'transform 0.1s linear',
            opacity: opacity
          }}
        >
          <path 
            d={renderShape()} 
            stroke="white" 
            strokeWidth="0.5" 
            fill="none"
          />
        </svg>
      </div>
      
      {showControls && (
        <div className="mt-4 flex flex-col gap-2">
          <select 
            value={currentShape}
            onChange={(e) => setCurrentShape(e.target.value as Shape)}
            className="px-3 py-2 rounded bg-black/40 text-white border border-white/20"
          >
            <option value="flower-of-life">Flower of Life</option>
            <option value="sri-yantra">Sri Yantra</option>
            <option value="metatron-cube">Metatron's Cube</option>
            <option value="seed-of-life">Seed of Life</option>
            <option value="torus">Torus</option>
            <option value="vesica-pisces">Vesica Pisces</option>
          </select>
          
          <div>
            <label className="text-sm text-white/80">Opacity</label>
            <input 
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
