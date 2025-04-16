
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PrimeAudioVisualizerProps {
  audioContext?: AudioContext | null;
  analyser?: AnalyserNode | null;
  isPlaying?: boolean;
  colorMode?: 'standard' | 'veil-lifted';
  visualMode?: 'basic' | 'prime';
  layout?: 'vertical' | 'radial';
  onPrimeDetected?: (prime: number) => void;
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying = false,
  colorMode = 'standard',
  visualMode = 'basic',
  layout = 'vertical',
  onPrimeDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Setup and cleanup the visualization
  useEffect(() => {
    if (!canvasRef.current || !analyser || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    updateCanvasSize();
    
    // Create data array for frequency data
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    // Animation function
    const draw = () => {
      if (!ctx || !analyser || !isPlaying) return;
      
      animationRef.current = requestAnimationFrame(draw);
      
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width / devicePixelRatio;
      const height = canvas.height / devicePixelRatio;
      
      // Calculate how many bars to display
      const barCount = Math.min(64, dataArray.length);
      const barWidth = width / barCount;
      
      // Draw frequency bars
      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] / 255;
        const barHeight = value * height * 0.8;
        
        // Choose color based on mode
        let barColor;
        if (colorMode === 'veil-lifted') {
          barColor = `rgba(236, 72, 153, ${value * 0.8 + 0.2})`;
        } else {
          barColor = `rgba(139, 92, 246, ${value * 0.8 + 0.2})`;
        }
        
        ctx.fillStyle = barColor;
        
        if (layout === 'vertical') {
          // Vertical layout
          ctx.fillRect(
            i * barWidth, 
            height - barHeight, 
            barWidth - 1, 
            barHeight
          );
        } else {
          // Radial layout
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) * 0.3;
          const angle = (i / barCount) * Math.PI * 2;
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillRect(0, 0, value * 50, 2);
          ctx.restore();
        }
      }
    };
    
    // Start animation if playing
    if (isPlaying) {
      draw();
    }
    
    // Handle window resize
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [analyser, isPlaying, colorMode, layout]);
  
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPlaying ? 0.8 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default PrimeAudioVisualizer;
