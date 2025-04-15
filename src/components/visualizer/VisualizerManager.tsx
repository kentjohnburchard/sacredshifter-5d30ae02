
import React, { useRef, useEffect } from 'react';

interface VisualizerManagerProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  audioRef,
  isAudioReactive = false,
  colorScheme = 'purple',
  size = 'md',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  
  // Set up canvas and audio analyzer
  useEffect(() => {
    if (!canvasRef.current || !audioRef?.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up audio analyzer if needed
    if (isAudioReactive && audioRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzerRef.current = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContext.destination);
    }

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get base color
      const baseColor = colorScheme === 'purple' ? '#9370db' : 
                       colorScheme === 'blue' ? '#1e90ff' : 
                       colorScheme === 'pink' ? '#ff69b4' : '#9370db';

      // Draw visualization
      if (isAudioReactive && analyzerRef.current) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);

        // Calculate average frequency
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        const radius = (canvas.height / 4) * (1 + average / 512);

        // Draw circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}40`;
        ctx.fill();
      } else {
        // Simple pulsing circle when not audio reactive
        const time = Date.now() / 1000;
        const radius = canvas.height / 4 * (1 + Math.sin(time) * 0.1);
        
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}40`;
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioRef, isAudioReactive, colorScheme]);

  // Handle canvas resize
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sizeClass = {
    'sm': 'h-40',
    'md': 'h-64',
    'lg': 'h-96',
    'xl': 'h-screen'
  }[size] || 'h-64';

  return (
    <div className={`w-full ${sizeClass} overflow-hidden rounded-lg`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black/10 backdrop-blur-sm" 
      />
    </div>
  );
};
