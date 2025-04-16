
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

interface PrimeAudioVisualizerProps {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  colorMode?: 'standard' | 'veil-lifted' | 'chakra';
  chakraColor?: string;
  visualMode?: 'spectrum' | 'waveform' | 'prime';
  layout?: 'vertical' | 'radial';
  sensitivity?: number;
  onPrimeDetected?: (prime: number) => void;
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying,
  colorMode = 'standard',
  chakraColor,
  visualMode = 'spectrum',
  layout = 'vertical',
  sensitivity = 1.0,
  onPrimeDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastPrimeDetectionRef = useRef<number>(0);
  
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [dominantFrequency, setDominantFrequency] = useState<number | null>(null);
  
  // Initialize frequency data
  useEffect(() => {
    if (!analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    setFrequencyData(dataArray);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser]);
  
  // Animation and frequency analysis
  useEffect(() => {
    if (!isPlaying || !analyser || !frequencyData || !canvasRef.current) return;
    
    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      
      // Find dominant frequency
      if (visualMode === 'prime' && audioContext) {
        const maxIndex = findDominantFrequencyIndex(frequencyData);
        if (maxIndex !== null) {
          // Convert bin index to actual frequency
          const frequency = Math.round(maxIndex * audioContext.sampleRate / (analyser.frequencyBinCount * 2));
          setDominantFrequency(frequency);
          
          // Check if it's a prime number and notify
          if (frequency > 10 && isPrime(frequency)) {
            const now = Date.now();
            // Only notify once every 2 seconds
            if (now - lastPrimeDetectionRef.current > 2000) {
              lastPrimeDetectionRef.current = now;
              if (onPrimeDetected) {
                onPrimeDetected(frequency);
              }
            }
          }
        }
      }
      
      drawVisualizer();
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, analyser, frequencyData, visualMode, audioContext, onPrimeDetected]);
  
  const findDominantFrequencyIndex = (data: Uint8Array): number | null => {
    if (!data.length) return null;
    
    let maxValue = 0;
    let maxIndex = 0;
    
    // Skip the first few bins as they often contain noise
    for (let i = 5; i < data.length / 4; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIndex = i;
      }
    }
    
    // If signal is too weak, return null
    return maxValue > 140 ? maxIndex : null;
  };
  
  const drawVisualizer = () => {
    if (!canvasRef.current || !frequencyData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get dimensions, accounting for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale for high DPI screens
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Set visualization style
    if (layout === 'radial') {
      drawRadialVisualizer(ctx, rect.width, rect.height);
    } else {
      drawVerticalBars(ctx, rect.width, rect.height);
    }
  };
  
  const drawVerticalBars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!frequencyData) return;
    
    // Use smaller number of bars for vertical display
    const barCount = Math.min(64, frequencyData.length);
    const barWidth = width / barCount;
    const barSpacing = 1;
    
    // Sample the frequency data
    const step = Math.floor(frequencyData.length / barCount);
    
    for (let i = 0; i < barCount; i++) {
      // Get the frequency value (0-255)
      const value = frequencyData[i * step];
      
      // Scale the height (make it more sensitive)
      const scaledValue = value * sensitivity;
      const barHeight = (scaledValue / 255) * height;
      
      // Choose color based on mode
      const { fillColor, glowColor } = getBarColors(i, barCount, value);
      
      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, glowColor);
      
      ctx.fillStyle = gradient;
      
      // Add glow effect for higher values
      if (value > 180) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }
      
      // Draw the bar
      ctx.fillRect(
        i * (barWidth + barSpacing), 
        height - barHeight, 
        barWidth - barSpacing, 
        barHeight
      );
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }
  };
  
  const drawRadialVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!frequencyData) return;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Use more bars for radial display
    const barCount = Math.min(128, frequencyData.length);
    const angleStep = (2 * Math.PI) / barCount;
    
    // Sample the frequency data
    const step = Math.floor(frequencyData.length / barCount);
    
    for (let i = 0; i < barCount; i++) {
      // Get the frequency value (0-255)
      const value = frequencyData[i * step];
      
      // Scale the height (make it more sensitive)
      const scaledValue = value * sensitivity;
      const barHeight = ((scaledValue / 255) * radius) * 0.5;
      
      // Calculate angle and positions
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * radius * 0.5;
      const y1 = centerY + Math.sin(angle) * radius * 0.5;
      const x2 = centerX + Math.cos(angle) * (radius * 0.5 + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius * 0.5 + barHeight);
      
      // Choose color based on mode
      const { fillColor, glowColor } = getBarColors(i, barCount, value);
      
      // Draw line from center to outer edge
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 3;
      
      // Add glow for higher frequencies
      if (value > 180) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = glowColor;
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = fillColor;
      }
      
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Add circle for prime frequency indicators
      if (isPrime(i) && value > 140) {
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, Math.PI * 2);
        ctx.fillStyle = colorMode === 'veil-lifted' ? '#ec4899' : '#a855f7';
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = colorMode === 'veil-lifted' ? '#be185d' : '#7e22ce';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = colorMode === 'veil-lifted' ? '#ec4899' : '#a855f7';
    ctx.fill();
    
    // Add glow to center
    ctx.shadowColor = colorMode === 'veil-lifted' ? '#be185d' : '#7e22ce';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Add dominant frequency text
    if (dominantFrequency) {
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(`${dominantFrequency}Hz`, centerX, centerY + 5);
    }
  };
  
  const getBarColors = (index: number, barCount: number, value: number) => {
    if (colorMode === 'veil-lifted') {
      return {
        fillColor: `rgba(236, 72, 153, ${Math.min(0.7, value / 255 + 0.2)})`,
        glowColor: `rgba(219, 39, 119, ${Math.min(0.9, value / 255 + 0.4)})`
      };
    } else if (colorMode === 'chakra' && chakraColor) {
      // Chakra-specific colors would go here
      return {
        fillColor: `rgba(139, 92, 246, ${Math.min(0.7, value / 255 + 0.2)})`,
        glowColor: `rgba(109, 40, 217, ${Math.min(0.9, value / 255 + 0.4)})`
      };
    } else {
      // Standard gradient based on index position
      const hue = index / barCount * 270; // Purple-ish range
      return {
        fillColor: `hsla(${hue}, 80%, 70%, ${Math.min(0.7, value / 255 + 0.2)})`,
        glowColor: `hsla(${hue}, 90%, 60%, ${Math.min(0.9, value / 255 + 0.4)})`
      };
    }
  };
  
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
      />
    </motion.div>
  );
};

export default PrimeAudioVisualizer;
