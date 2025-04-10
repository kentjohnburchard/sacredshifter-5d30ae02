
import React, { useEffect, useRef, useMemo, memo } from 'react';
import { SacredBlueprint } from '@/types/blueprint';
import { motion } from 'framer-motion';

interface BlueprintChartProps {
  blueprint: SacredBlueprint;
  className?: string;
}

// Extremely optimized chart to prevent browser lockup
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

  // Simplified drawing with absolute minimal calculations
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed size to prevent recalculations
    const size = 400; 
    canvas.width = size;
    canvas.height = size;
    
    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.45;

    // Simple background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, size, size);

    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw very basic chakra rings - minimalistic approach
    const chakras = ["root", "sacral", "solar", "heart", "throat", "third_eye", "crown"];
    chakras.forEach((chakra, index) => {
      const chakraData = chakraSignature[chakra];
      if (!chakraData) return;

      const radius = (maxRadius * (index + 1)) / chakras.length;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = chakraColors[chakra as keyof typeof chakraColors] || '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Add core frequency text
    ctx.font = '14px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(blueprint.core_frequency, centerX, centerY + 30);
    
  }, [blueprint, chakraSignature, frequencyValue, chakraColors]);

  if (!blueprint) return null;

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="mx-auto rounded-full bg-black/20 backdrop-blur-sm"
      />
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(BlueprintChart);
