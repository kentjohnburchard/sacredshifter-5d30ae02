
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FrequencyEqualizerProps {
  frequencyData: Uint8Array;
  barCount?: number;
  chakraColor?: string;
  isLiftedVeil?: boolean;
  colorScheme?: string;
}

const FrequencyEqualizer: React.FC<FrequencyEqualizerProps> = ({
  frequencyData,
  barCount = 32,
  chakraColor = 'purple',
  isLiftedVeil = false,
  colorScheme = 'purple'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Optimized drawing function using requestAnimationFrame
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Clear previous frame
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Calculate bar width based on available bars and canvas width
    const effectiveBarCount = Math.min(barCount, frequencyData.length);
    const barWidth = rect.width / effectiveBarCount;
    const barSpacing = 2; // Space between bars
    
    // Sample the frequency data at regular intervals
    const step = Math.floor(frequencyData.length / effectiveBarCount);
    
    // Draw each bar
    for (let i = 0; i < effectiveBarCount; i++) {
      // Get data point, normalized between 0-1
      const dataIndex = i * step;
      const value = frequencyData[dataIndex] / 255;
      
      // Calculate bar height as percentage of canvas height
      const barHeight = value * rect.height;
      
      // Get gradient colors based on chakra and veil state
      const { startColor, endColor } = getBarColors(chakraColor, isLiftedVeil, colorScheme);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, rect.height - barHeight, 0, rect.height);
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, endColor);
      
      // Set fill style
      ctx.fillStyle = gradient;
      
      // Draw the bar
      ctx.fillRect(
        i * (barWidth + barSpacing), 
        rect.height - barHeight, 
        barWidth - barSpacing, 
        barHeight
      );
      
      // Add glow effect for higher values
      if (value > 0.7) {
        ctx.shadowColor = startColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(
          i * (barWidth + barSpacing), 
          rect.height - barHeight, 
          barWidth - barSpacing, 
          barHeight
        );
        ctx.shadowBlur = 0;
      }
      
      // Add frequency wave line overlay
      if (i > 0) {
        const prevDataIndex = (i - 1) * step;
        const prevValue = frequencyData[prevDataIndex] / 255;
        const prevHeight = prevValue * rect.height;
        
        ctx.beginPath();
        ctx.moveTo((i - 1) * (barWidth + barSpacing) + barWidth / 2, rect.height - prevHeight);
        ctx.lineTo(i * (barWidth + barSpacing) + barWidth / 2, rect.height - barHeight);
        ctx.strokeStyle = `${startColor}88`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [frequencyData, barCount, chakraColor, isLiftedVeil, colorScheme]);
  
  const getBarColors = (chakraColor: string, isLiftedVeil: boolean, colorScheme: string) => {
    // Base colors when veil is lifted
    if (isLiftedVeil) {
      return {
        startColor: 'rgba(236, 72, 153, 0.9)', // pink-500
        endColor: 'rgba(219, 39, 119, 0.5)'    // pink-600
      };
    }
    
    // Handle color scheme first
    if (colorScheme) {
      switch (colorScheme) {
        case 'purple':
          return {
            startColor: 'rgba(139, 92, 246, 0.9)', // purple-500
            endColor: 'rgba(109, 40, 217, 0.5)'    // purple-700
          };
        case 'blue':
          return {
            startColor: 'rgba(59, 130, 246, 0.9)', // blue-500
            endColor: 'rgba(29, 78, 216, 0.5)'     // blue-700
          };
        case 'gold':
          return {
            startColor: 'rgba(245, 158, 11, 0.9)', // amber-500
            endColor: 'rgba(180, 83, 9, 0.5)'      // amber-700
          };
        case 'rainbow':
          // For rainbow, we'll use a dynamic gradient based on position
          const hue1 = (Date.now() / 50) % 360; // Slowly cycling hue
          const hue2 = (hue1 + 180) % 360; // Opposite color
          return {
            startColor: `hsla(${hue1}, 100%, 70%, 0.9)`,
            endColor: `hsla(${hue2}, 100%, 60%, 0.5)`
          };
      }
    }
    
    // Colors based on chakra if colorScheme is 'chakra' or chakraColor is specified
    if (colorScheme === 'chakra' || chakraColor) {
      switch (chakraColor) {
        case 'red': // Root chakra
          return {
            startColor: 'rgba(239, 68, 68, 0.9)', // red-500
            endColor: 'rgba(185, 28, 28, 0.5)'    // red-700
          };
        case 'orange': // Sacral chakra
          return {
            startColor: 'rgba(249, 115, 22, 0.9)', // orange-500
            endColor: 'rgba(194, 65, 12, 0.5)'     // orange-700
          };
        case 'yellow': // Solar plexus chakra
          return {
            startColor: 'rgba(234, 179, 8, 0.9)',  // yellow-500
            endColor: 'rgba(161, 98, 7, 0.5)'      // yellow-700
          };
        case 'green': // Heart chakra
          return {
            startColor: 'rgba(34, 197, 94, 0.9)',  // green-500
            endColor: 'rgba(21, 128, 61, 0.5)'     // green-700
          };
        case 'blue': // Throat chakra
          return {
            startColor: 'rgba(59, 130, 246, 0.9)', // blue-500
            endColor: 'rgba(29, 78, 216, 0.5)'     // blue-700
          };
        case 'indigo': // Third eye chakra
          return {
            startColor: 'rgba(99, 102, 241, 0.9)', // indigo-500
            endColor: 'rgba(67, 56, 202, 0.5)'     // indigo-700
          };
        case 'violet': // Crown chakra
          return {
            startColor: 'rgba(139, 92, 246, 0.9)', // purple-500
            endColor: 'rgba(109, 40, 217, 0.5)'    // purple-700
          };
        default: // Default purple
          return {
            startColor: 'rgba(139, 92, 246, 0.9)', // purple-500
            endColor: 'rgba(109, 40, 217, 0.5)'    // purple-700
          };
      }
    }
    
    // Default to purple
    return {
      startColor: 'rgba(139, 92, 246, 0.9)', // purple-500
      endColor: 'rgba(109, 40, 217, 0.5)'   // purple-700
    };
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full overflow-hidden rounded-md"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default FrequencyEqualizer;
