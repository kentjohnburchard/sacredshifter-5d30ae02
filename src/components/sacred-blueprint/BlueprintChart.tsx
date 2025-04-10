
import React, { useEffect, useRef, useMemo, memo } from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { motion } from 'framer-motion';

interface BlueprintChartProps {
  blueprint: SacredBlueprint;
  className?: string;
}

// Optimized chart with more aggressive performance optimizations
const BlueprintChart: React.FC<BlueprintChartProps> = ({ blueprint, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Memoize chakra data and frequency to reduce re-calculations
  const chakraSignature = useMemo(() => blueprint.chakra_signature, [blueprint.chakra_signature]);
  const frequencyValue = useMemo(() => blueprint.frequency_value, [blueprint.frequency_value]);
  
  // Memoize chakra colors to prevent recreating them on each render
  const chakraColors = useMemo(() => ({
    root: '#FF0000',
    sacral: '#FF7F00',
    solar: '#FFFF00',
    heart: '#00FF00',
    throat: '#00FFFF',
    third_eye: '#0000FF',
    crown: '#8B00FF'
  }), []);

  // Optimized drawing function with fewer calculations and effects
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set size once during initialization to prevent constant resizing
    const size = Math.min(window.innerWidth * 0.8, 500);
    canvas.width = size;
    canvas.height = size;
    
    // Clear any previous drawings
    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.45;

    // Draw minimal background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, size, size);

    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw chakra rings with minimal effects
    const chakras = ["root", "sacral", "solar", "heart", "throat", "third_eye", "crown"];
    
    // Batch similar drawing operations
    chakras.forEach((chakra, index) => {
      const chakraData = chakraSignature[chakra];
      if (!chakraData) return;

      const radius = (maxRadius * (index + 1)) / chakras.length;
      const strength = chakraData.strength / 100;
      
      // Draw chakra ring with minimal effects
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = chakraColors[chakra as keyof typeof chakraColors] || '#FFFFFF';
      ctx.lineWidth = 2 * strength;
      ctx.stroke();
      
      // Simple glow only for strongest chakras
      if (strength > 0.6) {
        ctx.shadowColor = chakraData.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Draw frequency lines with minimal effects
    const frequencies = [396, 417, 432, 528, 639, 741, 852, 963];
    frequencies.forEach((freq, index) => {
      const angle = (index / frequencies.length) * Math.PI * 2;
      // Simplified intensity calculation
      const intensity = Math.max(0.3, 1 - Math.abs(freq - frequencyValue) / 500);
      
      if (intensity > 0.4) {
        // Draw line only for significant frequencies
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const endX = centerX + Math.cos(angle) * maxRadius * intensity;
        const endY = centerY + Math.sin(angle) * maxRadius * intensity;
        ctx.lineTo(endX, endY);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add minimal labels
        ctx.font = '10px Arial';
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.7})`;
        ctx.fillText(
          `${freq}Hz`, 
          centerX + Math.cos(angle) * (maxRadius + 10) * 0.9,
          centerY + Math.sin(angle) * (maxRadius + 10) * 0.9
        );
      }
    });

    // Draw elemental resonance with minimal effects
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
  }, [blueprint, chakraSignature, frequencyValue, chakraColors]);

  if (!blueprint) return null;

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas 
        ref={canvasRef} 
        className="mx-auto rounded-full bg-black/20 backdrop-blur-sm shadow-lg"
      />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-medium text-white"
        >
          {blueprint.core_frequency}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(BlueprintChart);
