
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { isPrime } from '@/lib/primeUtils';

interface FrequencyEqualizerProps {
  frequencyData: Uint8Array;
  barCount?: number;
  chakraColor?: string;
  height?: number;
  showPrimes?: boolean;
}

const getChakraColor = (chakra?: string): string => {
  if (!chakra) return '#a855f7'; // Default purple
  
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
};

const FrequencyEqualizer: React.FC<FrequencyEqualizerProps> = ({
  frequencyData,
  barCount = 64,
  chakraColor = 'crown',
  height = 200,
  showPrimes = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { liftTheVeil } = useTheme();
  const color = getChakraColor(chakraColor);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    const resizeObserver = new ResizeObserver(() => {
      setCanvasDimensions();
      draw();
    });
    
    resizeObserver.observe(canvas);
    setCanvasDimensions();
    
    const draw = () => {
      if (!ctx || !canvas) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw cosmic background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (liftTheVeil) {
        gradient.addColorStop(0, 'rgba(85, 0, 85, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 20, 0.5)');
      } else {
        gradient.addColorStop(0, 'rgba(45, 0, 85, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 30, 0.5)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (!frequencyData.length) return;
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      // Determine how many frequency bands to display
      const bands = Math.min(barCount, frequencyData.length);
      const barWidth = width / bands;
      const barMargin = barWidth * 0.2;
      const effectiveBarWidth = barWidth - barMargin;
      
      // Find average frequency value
      const avgFrequency = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / frequencyData.length;
      const normalizedAvg = avgFrequency / 255;
      
      // Draw frequency bars
      for (let i = 0; i < bands; i++) {
        // Get value for this bar (combine multiple frequency values if needed)
        const dataIndex = Math.floor((i / bands) * frequencyData.length);
        const value = frequencyData[dataIndex];
        const normalizedValue = value / 255;
        
        // Calculate bar height
        const barHeight = height * normalizedValue * 0.8;
        
        // Calculate position
        const x = i * barWidth + barMargin / 2;
        const y = height - barHeight;
        
        // Determine if this is a prime number frequency and style accordingly
        const isPrimeFrequency = showPrimes && isPrime(dataIndex + 20);
        
        // Choose bar style based on prime status and consciousness mode
        let barColor;
        let glowColor;
        
        if (isPrimeFrequency) {
          barColor = liftTheVeil ? '#ff1493' : '#ffd700'; // Hot pink in veil mode, gold otherwise
          glowColor = liftTheVeil ? 'rgba(255, 20, 147, 0.8)' : 'rgba(255, 215, 0, 0.8)';
        } else {
          barColor = liftTheVeil ? `rgba(255, 105, 180, ${0.7 + normalizedValue * 0.3})` : 
                                 `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.7 + normalizedValue * 0.3})`;
          glowColor = liftTheVeil ? 'rgba(255, 105, 180, 0.4)' : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.4)`;
        }
        
        // Add glow effects for prime frequencies
        if (isPrimeFrequency) {
          // Create gradient for glow
          const glowGradient = ctx.createRadialGradient(
            x + effectiveBarWidth / 2, y + barHeight / 2, 0,
            x + effectiveBarWidth / 2, y + barHeight / 2, effectiveBarWidth * 2
          );
          
          glowGradient.addColorStop(0, glowColor);
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = glowGradient;
          ctx.fillRect(x - effectiveBarWidth, y - effectiveBarWidth, 
                      effectiveBarWidth * 3, barHeight + effectiveBarWidth * 2);
        }
        
        // Draw bar with rounded top
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, y + 2);
        ctx.arc(x + effectiveBarWidth / 2, y + 2, effectiveBarWidth / 2, Math.PI, 0, true);
        ctx.lineTo(x + effectiveBarWidth, height);
        ctx.closePath();
        ctx.fill();
        
        // Add a line at the top
        if (barHeight > 5) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y, effectiveBarWidth, 2);
        }
        
        // Add a small particle effect for prime frequencies
        if (isPrimeFrequency && normalizedValue > 0.5) {
          const particleSize = 2 + normalizedValue * 3;
          ctx.fillStyle = liftTheVeil ? '#ff69b4' : '#ffea00';
          
          // Add several particles above the bar
          for (let p = 0; p < 3; p++) {
            const particleX = x + effectiveBarWidth/2 + (Math.random() - 0.5) * effectiveBarWidth;
            const particleY = y - 5 - Math.random() * 15 * normalizedValue;
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Draw a reactive center circle
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.15;
      const circleRadius = maxRadius * (0.5 + normalizedAvg * 0.5);
      
      // Center circle glow
      const circleGradient = ctx.createRadialGradient(
        centerX, centerY, circleRadius * 0.5, 
        centerX, centerY, circleRadius * 2
      );
      
      if (liftTheVeil) {
        circleGradient.addColorStop(0, 'rgba(255, 105, 180, 0.6)');
        circleGradient.addColorStop(1, 'rgba(255, 20, 147, 0)');
      } else {
        circleGradient.addColorStop(0, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.6)`);
        circleGradient.addColorStop(1, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0)`);
      }
      
      ctx.fillStyle = circleGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Center circle
      ctx.fillStyle = liftTheVeil ? '#ff1493' : color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius * 1.1, 0, Math.PI * 2);
      ctx.stroke();
    };
    
    // Animation loop
    let animationFrame: number;
    const animate = () => {
      draw();
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [frequencyData, barCount, chakraColor, height, showPrimes, color, liftTheVeil]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full h-full"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default FrequencyEqualizer;
