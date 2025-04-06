
import React, { useEffect, useRef } from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { motion } from 'framer-motion';

interface BlueprintChartProps {
  blueprint: SacredBlueprint;
  className?: string;
}

export const BlueprintChart: React.FC<BlueprintChartProps> = ({ blueprint, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the blueprint visualization
  useEffect(() => {
    if (!canvasRef.current || !blueprint) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chakraSignature = blueprint.chakra_signature;
    const frequencyValue = blueprint.frequency_value;
    
    // Set canvas dimensions
    const size = Math.min(window.innerWidth * 0.8, 500);
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.45;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const bgGradient = ctx.createRadialGradient(
      centerX, centerY, 0, 
      centerX, centerY, maxRadius
    );
    bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, size, size);

    // Draw chakra rings
    const chakras = [
      "root", "sacral", "solar", "heart", 
      "throat", "third_eye", "crown"
    ];
    
    // Draw center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw rings for each chakra
    chakras.forEach((chakra, index) => {
      const chakraData = chakraSignature[chakra];
      if (!chakraData) return;

      const radius = (maxRadius * (index + 1)) / chakras.length;
      const strength = chakraData.strength / 100;
      
      // Draw chakra ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = chakraData.color;
      ctx.lineWidth = 4 * strength;
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowColor = chakraData.color;
      ctx.shadowBlur = 15 * strength;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `${chakraData.color}80`; // Add transparency
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Draw frequency lines
    const frequencies = [396, 417, 432, 528, 639, 741, 852, 963];
    frequencies.forEach((freq, index) => {
      const angle = (index / frequencies.length) * Math.PI * 2;
      const intensity = 1 - Math.min(1, Math.abs(freq - frequencyValue) / 400);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const endX = centerX + Math.cos(angle) * maxRadius * intensity;
      const endY = centerY + Math.sin(angle) * maxRadius * intensity;
      ctx.lineTo(endX, endY);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${intensity * 0.3})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1 + intensity * 2;
      ctx.stroke();
      
      // Add frequency label
      ctx.font = '10px Arial';
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.7 + 0.3})`;
      ctx.fillText(
        `${freq}Hz`, 
        centerX + Math.cos(angle) * (maxRadius + 15) * 0.9,
        centerY + Math.sin(angle) * (maxRadius + 15) * 0.9
      );
    });

    // Draw elemental resonance
    const elementColors = {
      earth: "#4CAF50",
      water: "#2196F3",
      fire: "#FF5722",
      air: "#CDDC39"
    };
    
    const elementColor = elementColors[blueprint.elemental_resonance as keyof typeof elementColors] || "#FFFFFF";
    
    // Add element symbol in center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = elementColor;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add core frequency ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    const coreFreqGradient = ctx.createRadialGradient(
      centerX, centerY, 15,
      centerX, centerY, 40
    );
    coreFreqGradient.addColorStop(0, `${elementColor}30`);
    coreFreqGradient.addColorStop(1, `${elementColor}00`);
    ctx.fillStyle = coreFreqGradient;
    ctx.fill();

    // Draw sacred geometry overlay
    const drawSacredGeometry = () => {
      // Flower of life pattern
      const iterations = 6;
      const circleRadius = maxRadius / 8;
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      
      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw surrounding circles
      for (let i = 0; i < iterations; i++) {
        const angle = (i / iterations) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * circleRadius;
        const y = centerY + Math.sin(angle) * circleRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    
    drawSacredGeometry();
    
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
        className="mx-auto rounded-full bg-black/10 backdrop-blur-sm shadow-lg"
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
