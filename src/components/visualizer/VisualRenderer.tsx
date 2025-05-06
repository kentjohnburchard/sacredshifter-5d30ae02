
import React, { useEffect, useState } from 'react';
import { useVisualTheme, VisualTheme } from '@/context/VisualThemeContext';
import SacredGridVisualizer from '@/components/SacredGridVisualizer';
import { VisualizationSettings } from '@/types/visualization';
import VisualizerScene from '@/components/visualizer/VisualizerScene';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface VisualRendererProps {
  className?: string;
  height?: string | number;
  containerId?: string;
  showControls?: boolean;
}

const VisualRenderer: React.FC<VisualRendererProps> = ({
  className = '',
  height = '100%',
  containerId = 'visualRenderer',
  showControls = true
}) => {
  const { currentTheme, toggleVisuals, areVisualsEnabled } = useVisualTheme();
  const [visualSettings, setVisualSettings] = useState<VisualizationSettings | null>(null);
  const [visualizerScene, setVisualizerScene] = useState<string>('nebula');

  // Map theme to appropriate visualizer settings
  useEffect(() => {
    if (!areVisualsEnabled) return;

    const themeToSettings: Record<VisualTheme, Partial<VisualizationSettings>> = {
      'cymaticGrid': {
        activeShapes: ['flower-of-life', 'fibonacci-spiral'],
        colorTheme: 'cosmic-violet',
        mode: '2d',
        showPrimeAffirmations: true,
        visualizerType: 'sacred-geometry',
      },
      'starlightField': {
        activeShapes: ['flower-of-life', 'vesica-piscis'],
        colorTheme: 'ethereal-mist',
        mode: '3d',
        showPrimeAffirmations: false,
        visualizerType: 'sacred-geometry',
      },
      'fractalOcean': {
        activeShapes: ['fibonacci-spiral', 'metatron-cube'],
        colorTheme: 'ocean-depths',
        mode: '3d',
        showGrid: true,
        gridIntensity: 0.8,
        visualizerType: 'sacred-geometry',
      },
      'merkabaChamber': {
        activeShapes: ['metatron-cube', 'sri-yantra'],
        colorTheme: 'chakra-rainbow',
        mode: '3d',
        showGrid: true,
        visualizerType: 'sacred-geometry',
      },
      'sacredSpiral': {
        activeShapes: ['fibonacci-spiral', 'prime-spiral'],
        colorTheme: 'cosmic-violet',
        mode: '2d',
        showGrid: false,
        visualizerType: 'sacred-geometry',
      },
      'chakraField': {
        activeShapes: ['flower-of-life'],
        colorTheme: 'chakra-rainbow',
        mode: '2d',
        visualizerType: 'sacred-geometry',
      },
      'cosmicCollision': {
        activeShapes: ['torus', 'metatron-cube'],
        colorTheme: 'fire-essence',
        mode: '3d',
        sensitivity: 1.5,
        brightness: 1.5,
        visualizerType: 'prime-audio',
      },
      'default': {
        activeShapes: ['flower-of-life', 'fibonacci-spiral'],
        colorTheme: 'cosmic-violet',
        mode: '3d',
        showGrid: true,
        visualizerType: 'sacred-geometry',
      }
    };

    const baseSettings: VisualizationSettings = {
      activeShapes: ['flower-of-life', 'fibonacci-spiral'],
      speed: Math.min(5, Math.max(0.5, currentTheme.intensity / 5 * 3)),
      colorTheme: 'cosmic-violet',
      symmetry: 6,
      mode: '3d',
      mirrorEnabled: true,
      chakraAlignmentMode: !!currentTheme.chakraTag,
      sensitivity: Math.min(2.0, Math.max(0.5, currentTheme.intensity / 5 * 2)),
      brightness: Math.min(2.0, Math.max(0.8, currentTheme.intensity / 5 * 1.8)),
      showGrid: true,
      gridIntensity: Math.min(1.0, Math.max(0.3, currentTheme.intensity / 5)),
      showPrimeAffirmations: false,
      visualizerType: 'sacred-geometry',
      rotationSpeed: Math.min(3.0, Math.max(0.2, currentTheme.intensity / 5 * 2)),
    };

    // Apply theme-specific settings
    const themeSettings = themeToSettings[currentTheme.theme] || themeToSettings.default;
    setVisualSettings({
      ...baseSettings,
      ...themeSettings
    });

    // Map theme to scene for VisualizerScene component
    const themeToScene: Record<VisualTheme, string> = {
      'cymaticGrid': 'cymatics',
      'starlightField': 'galaxy',
      'fractalOcean': 'fractal',
      'merkabaChamber': 'metatron',
      'sacredSpiral': 'fractal-audio',
      'chakraField': 'mandala',
      'cosmicCollision': 'cosmic-collision',
      'default': 'nebula'
    };

    setVisualizerScene(themeToScene[currentTheme.theme] || 'nebula');
  }, [currentTheme, areVisualsEnabled]);

  // If visuals are disabled, only show toggle button
  if (!areVisualsEnabled) {
    return showControls ? (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <Button 
          onClick={toggleVisuals}
          variant="outline" 
          size="sm"
          className="bg-purple-900/30 border-purple-400/30 text-purple-100 hover:bg-purple-900/50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Show Visuals
        </Button>
      </div>
    ) : null;
  }

  // Choose visualization based on theme type
  const renderVisualization = () => {
    if (!visualSettings) return null;

    // Use SacredGridVisualizer for most themes
    if (currentTheme.theme !== 'default' && 
       (visualSettings.visualizerType === 'sacred-geometry' || 
        visualSettings.visualizerType === 'prime-audio')) {
      return (
        <SacredGridVisualizer 
          width="100%"
          height={height}
          autoConnect={true}
          showControls={false}
          initialSettings={visualSettings}
          expandable={false}
        />
      );
    }
    
    // Use VisualizerScene for simpler themes
    return (
      <div style={{ width: '100%', height: height }}>
        <VisualizerScene 
          scene={visualizerScene} 
          isPlaying={true}
        />
      </div>
    );
  };

  return (
    <div id={containerId} className={`relative ${className}`}>
      {renderVisualization()}
      
      {showControls && (
        <div className="absolute top-2 right-2 z-10">
          <Button 
            onClick={toggleVisuals} 
            variant="outline" 
            size="sm"
            className="bg-black/30 border-white/20 text-white/80 hover:bg-black/50"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Hide Visuals
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisualRenderer;
