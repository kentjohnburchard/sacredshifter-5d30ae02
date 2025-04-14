
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { calculatePrimeFactors, isPrime } from '@/utils/primeCalculations';

interface PrimeAudioVisualizerProps {
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  isPlaying: boolean;
  colorMode?: 'standard' | 'veil-lifted' | 'chakra'; // Updated to include chakra
  colorScheme?: string;
  visualMode?: 'prime' | 'regular';
  layout?: 'radial' | 'vertical';
  onPrimeDetected?: (prime: number) => void;
  sensitivity?: number;
  chakra?: string;
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying,
  colorMode = 'standard',
  colorScheme = 'purple',
  visualMode = 'prime',
  layout = 'vertical',
  onPrimeDetected,
  sensitivity = 1,
  chakra
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [primeArray, setPrimeArray] = useState<number[]>([]);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [activePrime, setActivePrime] = useState<number | null>(null);
  const lastPrimeDetectionTime = useRef<number>(0);
  const lastActivePrime = useRef<number | null>(null);

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
      
      // Check for dominant prime frequencies
      detectPrimeFrequency(frequencyData);
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioContext, analyser, frequencyData, layout, visualMode, colorMode, primeArray]);

  // Detect dominant frequencies that match prime numbers
  const detectPrimeFrequency = (frequencyData: Uint8Array) => {
    const now = Date.now();
    // Only check every 200ms to avoid too frequent updates
    if (now - lastPrimeDetectionTime.current < 200) return;
    
    // Find the highest amplitude frequency
    let maxAmplitude = 0;
    let dominantFreqIndex = 0;
    
    for (let i = 0; i < Math.min(64, frequencyData.length); i++) {
      if (frequencyData[i] > maxAmplitude) {
        maxAmplitude = frequencyData[i];
        dominantFreqIndex = i;
      }
    }
    
    // Check if this is a significant amplitude (above 70% of max)
    if (maxAmplitude > 180) { // 70% of 255
      // Check if dominant frequency index is prime or has prime factors
      if (isPrime(dominantFreqIndex)) {
        if (lastActivePrime.current !== dominantFreqIndex) {
          setActivePrime(dominantFreqIndex);
          lastActivePrime.current = dominantFreqIndex;
          if (onPrimeDetected) onPrimeDetected(dominantFreqIndex);
        }
        
        // Reset timestamp for detection limits
        lastPrimeDetectionTime.current = now;
        return;
      }
      
      // Check if any of the prime factors are significant
      const primeFactors = calculatePrimeFactors(dominantFreqIndex);
      if (primeFactors.length > 0 && primeFactors[0] > 2) { // Ignore if only factor is 2
        if (lastActivePrime.current !== primeFactors[0]) {
          setActivePrime(primeFactors[0]);
          lastActivePrime.current = primeFactors[0];
          if (onPrimeDetected) onPrimeDetected(primeFactors[0]);
        }
        
        // Reset timestamp for detection limits
        lastPrimeDetectionTime.current = now;
        return;
      }
    }
    
    // If we reach here and no prime was detected for 2 seconds, clear active prime
    if (now - lastPrimeDetectionTime.current > 2000 && activePrime !== null) {
      setActivePrime(null);
      lastActivePrime.current = null;
    }
  };

  // Get color based on colorMode and chakra
  const getBaseColor = () => {
    if (colorMode === 'veil-lifted') {
      return { r: 236, g: 72, b: 153 }; // Pink for lifted veil
    } else if (colorMode === 'chakra' && chakra) {
      switch(chakra) {
        case 'root': return { r: 255, g: 0, b: 0 };
        case 'sacral': return { r: 255, g: 165, b: 0 };
        case 'solar': return { r: 255, g: 255, b: 0 };
        case 'heart': return { r: 0, g: 255, b: 0 };
        case 'throat': return { r: 0, g: 255, b: 255 };
        case 'third-eye': return { r: 0, g: 0, b: 255 };
        case 'crown': return { r: 238, g: 130, b: 238 };
        default: return { r: 139, g: 92, b: 246 };
      }
    } else if (colorScheme) {
      switch(colorScheme) {
        case 'blue': return { r: 59, g: 130, b: 246 };
        case 'gold': return { r: 245, g: 158, b: 11 };
        case 'rainbow': 
          // Dynamic color based on time for rainbow
          const hue = (Date.now() / 50) % 360;
          const rgb = hslToRgb(hue/360, 0.8, 0.6);
          return { r: rgb[0], g: rgb[1], b: rgb[2] };
        default: return { r: 139, g: 92, b: 246 }; // Purple default
      }
    } else {
      return { r: 139, g: 92, b: 246 }; // Standard purple
    }
  };

  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const drawVerticalBars = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    frequencyData: Uint8Array
  ) => {
    const barWidth = canvas.width / Math.min(64, frequencyData.length);
    const barGap = 2;
    const baseColor = getBaseColor();

    // Add subtle background glow
    const glow = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    
    glow.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.05)`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < Math.min(64, frequencyData.length); i++) {
      const value = frequencyData[i] * (sensitivity || 1);
      const percent = Math.min(value / 255, 1);
      const barHeight = canvas.height * percent * 0.8;
      
      // Determine if this bar index is a prime number or in the prime array
      const isPrimeIndex = visualMode === 'prime' ? 
        (primeArray.includes(i) || isPrime(i)) : 
        false;
      
      // Create pulse animation based on time
      const pulseOffset = Date.now() * 0.001 + i * 0.2;
      const pulseFactor = 0.5 + 0.5 * Math.sin(pulseOffset);
      
      // Calculate color based on whether this is a prime index
      let alpha = 0.5 + percent * 0.5;
      let color;
      let glowIntensity = 0;
      
      if (isPrimeIndex) {
        // Make prime bars brighter and more saturated with pulsing effect
        glowIntensity = 0.2 + 0.8 * pulseFactor;
        alpha = 0.7 + 0.3 * glowIntensity;
        
        // Special highlight for the active prime
        if (activePrime !== null && (i === activePrime || i % activePrime === 0)) {
          // Create a rainbow effect for "lift the veil" mode when prime is active
          if (colorMode === 'veil-lifted') {
            // Rainbow effect
            const hue = (Date.now() * 0.05 + i * 10) % 360;
            color = `hsla(${hue}, 100%, 70%, ${alpha})`;
          } else if (colorMode === 'chakra' && chakra) {
            // Chakra-specific color with brightness
            color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
          } else if (colorScheme === 'rainbow') {
            // Rainbow color scheme
            const hue = (Date.now() * 0.05 + i * 10) % 360;
            color = `hsla(${hue}, 100%, 70%, ${alpha})`;
          } else {
            // Standard color for active prime
            color = `rgba(${baseColor.r + 20}, ${baseColor.g + 20}, ${baseColor.b + 20}, ${alpha})`;
          }
        } else {
          color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
        }
      } else {
        // Regular bars have lower opacity
        color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.7})`;
      }
      
      // Draw the bar
      ctx.fillStyle = color;
      
      // Create rounded bars
      const x = i * (barWidth + barGap);
      const barRadius = Math.min(barWidth / 2, 4);
      
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
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowColor = color;
        ctx.fillRect(
          x, 
          canvas.height - barHeight, 
          barWidth - barGap, 
          barHeight
        );
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
    const baseRadius = Math.min(centerX, centerY) * 0.2;
    const maxBarHeight = Math.min(centerX, centerY) * 0.6;
    const totalBars = Math.min(64, frequencyData.length);
    const angleStep = (Math.PI * 2) / totalBars;
    const baseColor = getBaseColor();
    
    // Add subtle background glow
    const glow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(centerX, centerY)
    );
    
    glow.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.05)`);
    glow.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.02)`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.3)`;
    ctx.fill();
    
    // Draw time-based orbital rings
    const time = Date.now() * 0.001;
    const ringCount = 3;
    
    for (let i = 0; i < ringCount; i++) {
      const ringRadius = baseRadius + maxBarHeight * (0.4 + i * 0.2);
      const ringThickness = 2 + Math.sin(time * (1 + i * 0.2)) * 1;
      const ringOpacity = 0.2 + Math.sin(time * (0.5 + i * 0.3)) * 0.1;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${ringOpacity})`;
      ctx.lineWidth = ringThickness;
      ctx.stroke();
    }
    
    // Draw the frequency bars in a radial pattern
    for (let i = 0; i < totalBars; i++) {
      const value = frequencyData[i] * (sensitivity || 1);
      const percent = Math.min(value / 255, 1);
      const barHeight = maxBarHeight * percent;
      const angle = i * angleStep;
      
      // Determine if this bar index is a prime number
      const isPrimeIndex = visualMode === 'prime' ? 
        (primeArray.includes(i) || isPrime(i)) : 
        false;
      
      // Calculate start and end points for the bar
      const startX = centerX + Math.cos(angle) * baseRadius;
      const startY = centerY + Math.sin(angle) * baseRadius;
      const endX = centerX + Math.cos(angle) * (baseRadius + barHeight);
      const endY = centerY + Math.sin(angle) * (baseRadius + barHeight);
      
      // Create pulse animation based on time
      const pulseOffset = time + i * 0.2;
      const pulseFactor = 0.5 + 0.5 * Math.sin(pulseOffset);
      
      // Calculate color based on whether this is a prime index
      let alpha = 0.5 + percent * 0.5;
      let color;
      let glowIntensity = 0;
      
      if (isPrimeIndex) {
        // Make prime bars brighter
        glowIntensity = 0.2 + 0.8 * pulseFactor;
        alpha = 0.7 + 0.3 * glowIntensity;
        
        // Special highlight for the active prime
        if (activePrime !== null && (i === activePrime || i % activePrime === 0)) {
          if (colorMode === 'veil-lifted') {
            // Rainbow effect for lifted veil
            const hue = (time * 100 + i * 10) % 360;
            color = `hsla(${hue}, 100%, 70%, ${alpha})`;
          } else if (colorMode === 'chakra' && chakra) {
            // Chakra color with brightness
            color = `rgba(${baseColor.r + 30}, ${baseColor.g + 30}, ${baseColor.b + 30}, ${alpha})`;
          } else if (colorScheme === 'rainbow') {
            // Rainbow color scheme
            const hue = (time * 100 + i * 10) % 360;
            color = `hsla(${hue}, 100%, 70%, ${alpha})`;
          } else {
            // Brighter version of base color
            color = `rgba(${baseColor.r + 30}, ${baseColor.g + 30}, ${baseColor.b + 30}, ${alpha})`;
          }
        } else {
          color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
        }
      } else {
        // Regular bars
        color = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha * 0.7})`;
      }
      
      // Draw the bar
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 4 + Math.sin(pulseOffset) * 2;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      
      // Add glow for prime bars
      if (isPrimeIndex) {
        ctx.shadowBlur = 10 * glowIntensity;
        ctx.shadowColor = color;
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Add dot at the end of bar for primes
      if (isPrimeIndex && percent > 0.3) {
        ctx.beginPath();
        ctx.arc(endX, endY, 3 + pulseFactor * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
    
    // Highlight active prime number
    if (activePrime !== null) {
      ctx.font = `bold ${Math.min(canvas.width, canvas.height) / 15}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${0.7 + Math.sin(time * 3) * 0.3})`;
      ctx.fillText(`${activePrime}`, centerX, centerY);
      
      // Animate rings around active prime
      const ringSize = baseRadius * (0.5 + Math.sin(time * 2) * 0.2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringSize, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${0.5 + Math.sin(time * 3) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default PrimeAudioVisualizer;
