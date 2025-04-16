
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
  onPrimeDetected?: (prime: number) => void;
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying,
  colorMode = 'standard',
  visualMode = 'prime',
  layout = 'vertical',
  onPrimeDetected
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

    // Add subtle background glow
    const glow = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    
    if (colorMode === 'standard') {
      glow.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      glow.addColorStop(0, 'rgba(236, 72, 153, 0.05)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < Math.min(64, frequencyData.length); i++) {
      const value = frequencyData[i];
      const percent = value / 255;
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
          } else {
            // Extra bright purple for active prime
            color = `rgba(159, 122, 255, ${alpha})`;
          }
        } else {
          if (colorMode === 'standard') {
            color = `rgba(139, 92, 246, ${alpha})`; // Brighter purple for primes
          } else {
            color = `rgba(236, 72, 153, ${alpha})`; // Brighter pink for primes
          }
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
        ctx.shadowColor = colorMode === 'standard' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(236, 72, 153, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Add a glow trail for prime bars
        const trailHeight = barHeight * 0.4 * pulseFactor;
        const trailGradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height - barHeight - trailHeight);
        
        if (colorMode === 'standard') {
          trailGradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
          trailGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        } else {
          trailGradient.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
          trailGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
        }
        
        ctx.fillStyle = trailGradient;
        ctx.fillRect(x, canvas.height - barHeight - trailHeight, barWidth, trailHeight);
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
    
    // Add subtle background glow
    const glow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    if (colorMode === 'standard') {
      glow.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      glow.addColorStop(0, 'rgba(236, 72, 153, 0.05)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a subtle center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = colorMode === 'standard' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(236, 72, 153, 0.8)';
    ctx.fill();
    
    for (let i = 0; i < barCount; i++) {
      const value = frequencyData[i];
      const percent = value / 255;
      const barHeight = radius * percent * 0.5;
      
      // Determine if this bar index is a prime number
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
          } else {
            // Extra bright purple for active prime
            color = `rgba(159, 122, 255, ${alpha})`;
          }
        } else {
          if (colorMode === 'standard') {
            color = `rgba(139, 92, 246, ${alpha})`; // Brighter purple for primes
          } else {
            color = `rgba(236, 72, 153, ${alpha})`; // Brighter pink for primes
          }
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
      const innerRadius = radius * 0.3;
      const outerRadius = innerRadius + barHeight;
      
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;
      
      // Draw the line with varying thickness based on frequency
      const lineWidth = 2 + percent * 4;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.stroke();
      
      // Add glow effect for prime bars
      if (isPrimeIndex && percent > 0.1) {
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowColor = colorMode === 'standard' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(236, 72, 153, 0.8)';
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Add a small dot at the end of prime bars
        ctx.beginPath();
        ctx.arc(x2, y2, lineWidth * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = colorMode === 'standard' ? 'rgba(139, 92, 246, 0.9)' : 'rgba(236, 72, 153, 0.9)';
        ctx.fill();
        
        // Connect prime nodes with subtle arcs
        if (isPrimeIndex && i > 0) {
          // Find previous prime index
          for (let j = i - 1; j >= 0; j--) {
            if (primeArray.includes(j) || isPrime(j)) {
              const prevAngle = j * angleStep;
              const prevX = centerX + Math.cos(prevAngle) * outerRadius;
              const prevY = centerY + Math.sin(prevAngle) * outerRadius;
              
              // Draw subtle connection line
              ctx.beginPath();
              ctx.moveTo(x2, y2);
              
              // Draw arc between prime points
              const arcRadius = Math.sqrt(Math.pow(x2 - prevX, 2) + Math.pow(y2 - prevY, 2)) / 2;
              ctx.strokeStyle = colorMode === 'standard' ? 
                `rgba(139, 92, 246, ${0.1 * pulseFactor})` : 
                `rgba(236, 72, 153, ${0.1 * pulseFactor})`;
              ctx.lineWidth = 1;
              ctx.lineTo(prevX, prevY);
              ctx.stroke();
              break;
            }
          }
        }
      }
    }
    
    // Draw prime frequency label when active
    if (activePrime !== null) {
      const fontSize = Math.min(canvas.width, canvas.height) * 0.08;
      ctx.font = `${fontSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colorMode === 'standard' ? 
        'rgba(139, 92, 246, 0.8)' : 
        'rgba(236, 72, 153, 0.8)';
      ctx.fillText(`Prime ${activePrime}`, centerX, centerY + radius * 0.8);
      
      // Add glow to text
      ctx.shadowBlur = 10;
      ctx.shadowColor = colorMode === 'standard' ? 
        'rgba(139, 92, 246, 0.8)' : 
        'rgba(236, 72, 153, 0.8)';
      ctx.fillText(`Prime ${activePrime}`, centerX, centerY + radius * 0.8);
      ctx.shadowBlur = 0;
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
