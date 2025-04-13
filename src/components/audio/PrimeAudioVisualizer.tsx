
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { calculatePrimeFactors, isPrime } from '@/utils/primeCalculations';

interface PrimeAudioVisualizerProps {
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  isPlaying: boolean;
  colorMode?: 'standard' | 'veil-lifted';
  visualMode?: 'prime' | 'regular';
  layout?: 'radial' | 'vertical';
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying,
  colorMode = 'standard',
  visualMode = 'prime',
  layout = 'vertical'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [primeArray, setPrimeArray] = useState<number[]>([]);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);

  // Generate array of prime numbers up to 100
  useEffect(() => {
    const primes: number[] = [];
    for (let i = 2; i <= 100; i++) {
      if (isPrime(i)) {
        primes.push(i);
      }
    }
    setPrimeArray(primes);
  }, []);

  // Set up the analyzer and canvas when component mounts or audioContext changes
  useEffect(() => {
    if (!audioContext || !analyser || !canvasRef.current) return;

    // Create frequency data array based on analyzer
    const frequencyDataArray = new Uint8Array(analyser.frequencyBinCount);
    setFrequencyData(frequencyDataArray);

    // Set up canvas context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match parent container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    // Initial resize
    resizeCanvas();

    // Set up resize listener
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [audioContext, analyser]);

  // Animation loop to draw the visualizer
  useEffect(() => {
    if (!isPlaying || !audioContext || !analyser || !canvasRef.current || !frequencyData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (layout === 'vertical') {
        drawVerticalBars(ctx, canvas, frequencyData);
      } else {
        drawRadialBars(ctx, canvas, frequencyData);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioContext, analyser, frequencyData, layout, visualMode, colorMode, primeArray]);

  const drawVerticalBars = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    frequencyData: Uint8Array
  ) => {
    const barWidth = canvas.width / Math.min(64, frequencyData.length);
    const barGap = 2;
    const baseColor = colorMode === 'standard' ? 
      { r: 139, g: 92, b: 246 } : // purple
      { r: 236, g: 72, b: 153 };  // pink
    
    for (let i = 0; i < Math.min(64, frequencyData.length); i++) {
      const value = frequencyData[i];
      const percent = value / 255;
      const barHeight = canvas.height * percent * 0.8;
      
      // Determine if this bar index is a prime number or in the prime array
      const isPrimeIndex = visualMode === 'prime' ? 
        (primeArray.includes(i) || isPrime(i)) : 
        false;
      
      // Calculate color based on whether this is a prime index
      let alpha = 0.5 + percent * 0.5;
      let color;
      
      if (isPrimeIndex) {
        // Make prime bars brighter and more saturated
        const glowIntensity = 0.2 + 0.8 * Math.sin(Date.now() * 0.003 + i * 0.2);
        alpha = 0.7 + 0.3 * glowIntensity;
        
        if (colorMode === 'standard') {
          color = `rgba(139, 92, 246, ${alpha})`; // Brighter purple for primes
        } else {
          color = `rgba(236, 72, 153, ${alpha})`; // Brighter pink for primes
        }
      } else {
        // Regular bars have lower opacity
        if (colorMode === 'standard') {
          color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.7})`;
        } else {
          color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.7})`;
        }
      }
      
      // Draw the bar
      ctx.fillStyle = color;
      
      // Create rounded bars
      const x = i * (barWidth + barGap);
      const barRadius = barWidth / 2;
      
      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(x + barRadius, canvas.height);
      ctx.lineTo(x + barRadius, canvas.height - barHeight + barRadius);
      ctx.arc(x + barRadius, canvas.height - barHeight + barRadius, barRadius, Math.PI, 0, true);
      ctx.lineTo(x + barWidth - barRadius, canvas.height - barHeight);
      ctx.arc(x + barWidth - barRadius, canvas.height - barHeight + barRadius, barRadius, 0, Math.PI, true);
      ctx.lineTo(x, canvas.height);
      ctx.fill();
      
      // Add glow effect for prime bars
      if (isPrimeIndex && percent > 0.1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorMode === 'standard' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(236, 72, 153, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };
  
  const drawRadialBars = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    frequencyData: Uint8Array
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    const barCount = Math.min(64, frequencyData.length);
    const angleStep = (Math.PI * 2) / barCount;
    const baseColor = colorMode === 'standard' ? 
      { r: 139, g: 92, b: 246 } : // purple
      { r: 236, g: 72, b: 153 };  // pink
    
    for (let i = 0; i < barCount; i++) {
      const value = frequencyData[i];
      const percent = value / 255;
      const barHeight = radius * percent * 0.5;
      
      // Determine if this bar index is a prime number
      const isPrimeIndex = visualMode === 'prime' ? 
        (primeArray.includes(i) || isPrime(i)) : 
        false;
      
      // Calculate color based on whether this is a prime index
      let alpha = 0.5 + percent * 0.5;
      let color;
      
      if (isPrimeIndex) {
        // Make prime bars brighter and more saturated
        const glowIntensity = 0.2 + 0.8 * Math.sin(Date.now() * 0.003 + i * 0.2);
        alpha = 0.7 + 0.3 * glowIntensity;
        
        if (colorMode === 'standard') {
          color = `rgba(139, 92, 246, ${alpha})`; // Brighter purple for primes
        } else {
          color = `rgba(236, 72, 153, ${alpha})`; // Brighter pink for primes
        }
      } else {
        // Regular bars have lower opacity
        if (colorMode === 'standard') {
          color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.7})`;
        } else {
          color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.7})`;
        }
      }
      
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      // Draw the line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();
      
      // Add glow effect for prime bars
      if (isPrimeIndex && percent > 0.1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colorMode === 'standard' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(236, 72, 153, 0.8)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  };

  return (
    <div className="w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default PrimeAudioVisualizer;
