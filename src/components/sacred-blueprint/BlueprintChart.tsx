
import React, { useEffect, useRef, memo } from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { motion } from 'framer-motion';

interface BlueprintChartProps {
  blueprint: SacredBlueprint;
  className?: string;
}

// Optimized chart - reduced unnecessary redraws and optimized rendering
const BlueprintChart: React.FC<BlueprintChartProps> = ({ blueprint, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the blueprint visualization with optimizations
  useEffect(() => {
    if (!canvasRef.current || !blueprint) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chakraSignature = blueprint.chakra_signature;
    const frequencyValue = blueprint.frequency_value;
    
    // Handle canvas sizing and cleanup
    const handleResize = () => {
      const size = Math.min(window.innerWidth * 0.8, 500);
      canvas.width = size;
      canvas.height = size;
      
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(drawChart);
    };

    // Optimized drawing function
    const drawChart = () => {
      if (!ctx) return;
      
      const size = canvas.width;
      const centerX = size / 2;
      const centerY = size / 2;
      const maxRadius = size * 0.45;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background - simplified for better performance
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, size, size);

      // Draw chakra rings with reduced operations
      const chakras = ["root", "sacral", "solar", "heart", "throat", "third_eye", "crown"];
      
      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Batch similar operations together
      chakras.forEach((chakra, index) => {
        const chakraData = chakraSignature[chakra];
        if (!chakraData) return;

        const radius = (maxRadius * (index + 1)) / chakras.length;
        const strength = chakraData.strength / 100;
        
        // Draw chakra ring without excessive effects
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = chakraData.color;
        ctx.lineWidth = 3 * strength;
        ctx.stroke();
        
        // Simplified glow effect
        if (strength > 0.5) {
          ctx.shadowColor = chakraData.color;
          ctx.shadowBlur = 10 * strength;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${chakraData.color}60`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // Draw frequency lines with fewer calculations
      const frequencies = [396, 417, 432, 528, 639, 741, 852, 963];
      frequencies.forEach((freq, index) => {
        const angle = (index / frequencies.length) * Math.PI * 2;
        // Simpler intensity calculation
        const intensity = Math.max(0.3, 1 - Math.abs(freq - frequencyValue) / 500);
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const endX = centerX + Math.cos(angle) * maxRadius * intensity;
        const endY = centerY + Math.sin(angle) * maxRadius * intensity;
        ctx.lineTo(endX, endY);
        
        // Simplified gradient
        ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
        ctx.lineWidth = 1 + intensity;
        ctx.stroke();
        
        // Only add labels if intensity is significant
        if (intensity > 0.4) {
          ctx.font = '10px Arial';
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.7})`;
          ctx.fillText(
            `${freq}Hz`, 
            centerX + Math.cos(angle) * (maxRadius + 10) * 0.9,
            centerY + Math.sin(angle) * (maxRadius + 10) * 0.9
          );
        }
      });

      // Draw elemental resonance with fewer effects
      const elementColors = {
        earth: "#4CAF50",
        water: "#2196F3",
        fire: "#FF5722",
        air: "#CDDC39"
      };
      
      const elementColor = elementColors[blueprint.elemental_resonance as keyof typeof elementColors] || "#FFFFFF";
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = elementColor;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Initial setup
    handleResize();
    
    // Use a throttled resize listener to prevent performance issues
    let resizeTimeout: number;
    const throttledResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(handleResize, 200);
    };
    
    window.addEventListener('resize', throttledResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
    };
  }, [blueprint]);

  if (!blueprint) return null;

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas 
        ref={canvasRef} 
        className="mx-auto rounded-full bg-black/20 backdrop-blur-sm shadow-lg"
      />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl font-medium text-white text-shadow"
        >
          {blueprint.core_frequency}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(BlueprintChart);
