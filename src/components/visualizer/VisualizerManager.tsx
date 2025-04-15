
import React, { useRef, useEffect } from 'react';
import { getColorFromScheme, calculateAudioMetrics } from '@/utils/audioVisuals';

interface VisualizerManagerProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  visualType?: 'circle' | 'bars' | 'wave';
}

export const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  audioRef,
  isAudioReactive = false,
  colorScheme = 'purple',
  size = 'md',
  visualType = 'circle',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  
  // Set up canvas and audio analyzer
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up audio analyzer if needed
    if (isAudioReactive && audioRef?.current) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyzerRef.current = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContext.destination);
      } catch (err) {
        console.error("Failed to set up audio analyzer:", err);
      }
    }

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get base color
      const baseColor = getColorFromScheme(colorScheme);

      // Draw visualization based on type
      if (visualType === 'circle') {
        drawCircleVisualizer(ctx, canvas, baseColor, isAudioReactive);
      } else if (visualType === 'bars') {
        drawBarsVisualizer(ctx, canvas, baseColor, isAudioReactive);
      } else if (visualType === 'wave') {
        drawWaveVisualizer(ctx, canvas, baseColor, isAudioReactive);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Helper functions for different visualizer types
    function drawCircleVisualizer(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      color: string,
      isAudioReactive: boolean
    ) {
      let radius;
      
      if (isAudioReactive && analyzerRef.current) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        const metrics = calculateAudioMetrics(dataArray);
        radius = (canvas.height / 4) * (1 + metrics.average / 512);
      } else {
        // Simple pulsing circle when not audio reactive
        const time = Date.now() / 1000;
        radius = canvas.height / 4 * (1 + Math.sin(time) * 0.1);
      }
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = `${color}40`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}80`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    function drawBarsVisualizer(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      color: string,
      isAudioReactive: boolean
    ) {
      const barCount = 30;
      const barWidth = canvas.width / barCount;
      
      if (isAudioReactive && analyzerRef.current) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * bufferLength / barCount);
          const value = dataArray[index];
          const height = (value / 255) * canvas.height * 0.8;
          
          ctx.fillStyle = `${color}80`;
          ctx.fillRect(
            i * barWidth, 
            canvas.height - height, 
            barWidth - 2, 
            height
          );
        }
      } else {
        // Simple animated bars when not audio reactive
        for (let i = 0; i < barCount; i++) {
          const time = Date.now() / 1000;
          const height = (
            0.2 + 
            0.3 * Math.sin(time + i * 0.2) + 
            0.2 * Math.sin(time * 0.7 + i * 0.3)
          ) * canvas.height;
          
          ctx.fillStyle = `${color}80`;
          ctx.fillRect(
            i * barWidth, 
            canvas.height - height, 
            barWidth - 2, 
            height
          );
        }
      }
    }
    
    function drawWaveVisualizer(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      color: string,
      isAudioReactive: boolean
    ) {
      const points = 100;
      
      ctx.strokeStyle = `${color}80`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      if (isAudioReactive && analyzerRef.current) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        ctx.moveTo(0, canvas.height / 2);
        
        for (let i = 0; i < points; i++) {
          const index = Math.floor(i * bufferLength / points);
          const value = dataArray[index];
          const amplitude = (value / 255) * canvas.height * 0.4;
          const x = (i / points) * canvas.width;
          const y = canvas.height / 2 + amplitude * Math.sin(i * 0.1);
          
          ctx.lineTo(x, y);
        }
      } else {
        // Simple sine wave when not audio reactive
        const time = Date.now() / 1000;
        
        ctx.moveTo(0, canvas.height / 2);
        
        for (let i = 0; i < points; i++) {
          const x = (i / points) * canvas.width;
          const y = canvas.height / 2 + 
                   (Math.sin(i * 0.05 + time) * 30) + 
                   (Math.sin(i * 0.02 + time * 0.7) * 15);
          
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioRef, isAudioReactive, colorScheme, visualType]);

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

export default VisualizerManager;
