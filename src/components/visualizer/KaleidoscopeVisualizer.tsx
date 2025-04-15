
import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface KaleidoscopeVisualizerProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: string;
  speed?: number;
  reflections?: number;
}

const KaleidoscopeVisualizer: React.FC<KaleidoscopeVisualizerProps> = ({
  audioRef,
  isAudioReactive = false,
  colorScheme = 'purple',
  size = 'md',
  speed = 1,
  reflections = 8
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { liftTheVeil } = useTheme();
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Get color based on scheme
  const getBaseColor = () => {
    if (liftTheVeil) return '#ff69b4'; // Pink for lifted veil
    
    switch (colorScheme) {
      case 'blue': return '#1e90ff';
      case 'gold': return '#ffd700';
      case 'green': return '#00ff00';
      case 'red': return '#ff0000';
      default: return '#9370db'; // Purple default
    }
  };

  // Set up audio analyzer if audio reactive is enabled
  useEffect(() => {
    if (!isAudioReactive || !audioRef?.current) return;

    const setupAudioAnalyzer = () => {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      const analyzerNode = context.createAnalyser();
      analyzerNode.fftSize = 256;
      setAnalyzer(analyzerNode);
      
      // Connect audio element to analyzer
      if (audioRef.current) {
        const source = context.createMediaElementSource(audioRef.current);
        source.connect(analyzerNode);
        analyzerNode.connect(context.destination);
        sourceRef.current = source;
      }

      // Create data array for frequency data
      const bufferLength = analyzerNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      setAudioData(dataArray);
    };

    try {
      setupAudioAnalyzer();
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isAudioReactive, audioRef]);

  // Main drawing function
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas responsive
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    // Set up canvas
    resize();
    window.addEventListener('resize', resize);

    // Create initial pattern
    let angle = 0;
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Define multiple colors for the kaleidoscope
    const baseColor = getBaseColor();
    const colorTransform = liftTheVeil ? 
      (idx: number) => `hsl(${(idx * 25 + angle) % 360}, 100%, 70%)` :
      (idx: number) => {
        const hue = colorScheme === 'purple' ? 270 : 
                    colorScheme === 'blue' ? 210 : 
                    colorScheme === 'gold' ? 45 :
                    colorScheme === 'green' ? 120 :
                    colorScheme === 'red' ? 0 : 270;
        return `hsl(${(hue + idx * 15 + angle/10) % 360}, 80%, ${55 + (idx % 3) * 10}%)`;
      };
    
    // Animation function
    const draw = () => {
      if (!ctx) return;
      
      // Update audio data if available
      let audioInfluence = 1;
      if (isAudioReactive && analyzer && audioData) {
        analyzer.getByteFrequencyData(audioData);
        const average = Array.from(audioData).reduce((sum, value) => sum + value, 0) / audioData.length;
        audioInfluence = 1 + (average / 255) * 0.5;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Increment angle for animation
      angle += 0.5 * speed * audioInfluence;
      
      // Draw kaleidoscope
      for (let r = 0; r < reflections; r++) {
        const segmentAngle = (Math.PI * 2) / reflections;
        
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(r * segmentAngle);
        
        // Draw multiple shapes with different colors
        for (let i = 0; i < 5; i++) {
          const color = colorTransform(i);
          const size = radius * (0.3 + i * 0.15) * audioInfluence;
          const offset = size * 0.5;
          
          ctx.beginPath();
          ctx.fillStyle = color;
          
          // Create various shapes based on the index
          switch (i % 3) {
            case 0:
              // Circle
              ctx.arc(offset, 0, size / 3, 0, Math.PI * 2);
              break;
            case 1:
              // Triangle
              ctx.moveTo(offset, -size/3);
              ctx.lineTo(offset + size/3, size/3);
              ctx.lineTo(offset - size/3, size/3);
              break;
            case 2:
              // Square
              ctx.fillRect(offset - size/4, -size/4, size/2, size/2);
              break;
          }
          
          ctx.fill();
        }
        
        ctx.restore();
      }
      
      // Draw outer ring
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.05 * audioInfluence, 0, Math.PI * 2);
      ctx.strokeStyle = liftTheVeil ? 'rgba(255, 105, 180, 0.3)' : 'rgba(147, 112, 219, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAudioReactive, audioData, analyzer, colorScheme, liftTheVeil, speed, reflections]);

  // Size mapping
  const sizeClass = {
    'sm': 'h-40',
    'md': 'h-64',
    'lg': 'h-96',
    'xl': 'h-screen'
  }[size] || 'h-64';

  return (
    <div className={`kaleidoscope-container w-full ${sizeClass} overflow-hidden rounded-lg`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black/10 backdrop-blur-sm" 
      />
    </div>
  );
};

export default KaleidoscopeVisualizer;
