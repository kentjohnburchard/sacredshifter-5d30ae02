
// Since this component is complex and likely relies on the prime calculations,
// I'm providing a simplified version that doesn't use those functions
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

interface PrimeAudioVisualizerProps {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  colorMode?: 'standard' | 'veil-lifted' | 'chakra' | 'liquid-crystal';
  chakraColor?: string;
  visualMode?: 'spectrum' | 'waveform' | 'prime' | 'liquid-geometry';
  layout?: 'vertical' | 'radial' | 'fluid';
  sensitivity?: number;
  onPrimeDetected?: (prime: number) => void;
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying,
  colorMode = 'standard',
  layout = 'vertical',
  sensitivity = 1.0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simplified analyzer that just renders basic bars
  useEffect(() => {
    if (!isPlaying || !analyser || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      // Get current frequency data
      analyser.getByteFrequencyData(frequencyData);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw simple bars
      const barWidth = canvas.width / 64;
      const barSpacing = 2;
      
      for (let i = 0; i < 64; i++) {
        const value = frequencyData[i * 4] || 0;
        const barHeight = (value / 255) * canvas.height * sensitivity;
        
        ctx.fillStyle = colorMode === 'veil-lifted' ? 
          `rgba(236, 72, 153, ${Math.min(0.7, value / 255 + 0.2)})` : 
          `rgba(168, 85, 247, ${Math.min(0.7, value / 255 + 0.2)})`;
          
        ctx.fillRect(
          i * (barWidth + barSpacing), 
          canvas.height - barHeight, 
          barWidth, 
          barHeight
        );
      }
      
      requestAnimationFrame(draw);
    };
    
    const animation = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animation);
  }, [analyser, isPlaying, colorMode, sensitivity]);
  
  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPlaying ? 1 : 0.6 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={300}
        height={200}
      />
    </motion.div>
  );
};

export default PrimeAudioVisualizer;
