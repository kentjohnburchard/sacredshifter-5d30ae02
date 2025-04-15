
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';

interface AdvancedVisualizerManagerProps {
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  chakra?: string;
  initialMode?: VisualizerMode;
}

// Simple canvas-based visualizer
const CanvasVisualizer = ({ 
  mode = 'bars', 
  audioData = new Uint8Array(), 
  colorScheme = 'purple' 
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw the visualization
    switch (mode) {
      case 'bars':
        ctx.fillStyle = colorScheme;
        const barWidth = width / audioData.length;
        for (let i = 0; i < audioData.length; i++) {
          const barHeight = (audioData[i] / 255) * height;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        }
        break;
      
      case 'wave':
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let i = 0; i < audioData.length; i++) {
          const x = (i / audioData.length) * width;
          const y = (audioData[i] / 255) * height;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colorScheme;
        ctx.stroke();
        break;
        
      case 'circle':
        const radius = Math.min(width, height) / 4;
        ctx.beginPath();
        for (let i = 0; i < audioData.length; i++) {
          const angle = (i / audioData.length) * Math.PI * 2;
          const amplitude = (audioData[i] / 255) * radius + radius;
          const x = width / 2 + Math.cos(angle) * amplitude;
          const y = height / 2 + Math.sin(angle) * amplitude;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = colorScheme;
        ctx.stroke();
        break;
        
      case 'particles':
        for (let i = 0; i < audioData.length; i += 5) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = (audioData[i] / 255) * 10 + 1;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = colorScheme;
          ctx.fill();
        }
        break;
    }
  }, [audioData, mode, colorScheme]);
  
  return <canvas ref={canvasRef} width={300} height={200} />;
};

const AdvancedVisualizerManager: React.FC<AdvancedVisualizerManagerProps> = ({
  isAudioReactive = false,
  colorScheme = 'purple',
  size = 'md',
  chakra,
  initialMode = 'bars'
}) => {
  const { audioData } = useAppStore();
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(initialMode);
  const [chakraColor, setChakraColor] = useState<string>(getChakraColor(chakra));
  
  // Detect chakra color
  useEffect(() => {
    if (chakra) {
      setChakraColor(getChakraColor(chakra));
    }
  }, [chakra]);
  
  // Convert size prop to dimensions
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-32';
      case 'lg': return 'h-80';
      case 'xl': return 'h-96';
      case 'md':
      default: return 'h-64';
    }
  };

  return (
    <div className={`w-full ${getSizeClasses()} bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden`}>
      <div className="w-full h-full flex items-center justify-center">
        {isAudioReactive && audioData ? (
          <CanvasVisualizer 
            mode={visualizerMode} 
            audioData={audioData}
            colorScheme={chakraColor || getColorFromScheme(colorScheme)}
          />
        ) : (
          <div className="text-white/50">Audio visualizer</div>
        )}
      </div>
    </div>
  );
};

// Helper function to get color from chakra name
function getChakraColor(chakra?: string): string {
  if (!chakra) return '#a855f7';
  
  switch (chakra.toLowerCase()) {
    case 'root': return '#ef4444';
    case 'sacral': return '#f97316';
    case 'solar plexus': return '#facc15';
    case 'heart': return '#22c55e';
    case 'throat': return '#3b82f6';
    case 'third eye': return '#6366f1';
    case 'crown': return '#a855f7';
    default: return '#a855f7';
  }
}

// Helper function to get color from scheme name
function getColorFromScheme(scheme: string): string {
  switch (scheme) {
    case 'red': return '#ef4444';
    case 'orange': return '#f97316';
    case 'yellow': return '#facc15';
    case 'green': return '#22c55e';
    case 'blue': return '#3b82f6';
    case 'indigo': return '#6366f1';
    case 'purple': return '#a855f7';
    case 'pink': return '#ec4899';
    default: return '#a855f7';
  }
}

export default AdvancedVisualizerManager;
