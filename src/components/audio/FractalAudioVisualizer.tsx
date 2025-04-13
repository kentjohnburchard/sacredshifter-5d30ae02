
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

interface FractalAudioVisualizerProps {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  colorScheme?: 'purple' | 'blue' | 'rainbow' | 'gold';
  isVisible?: boolean;
  pauseWhenStopped?: boolean;
  frequency?: number;
  chakra?: string;
  onPrimeSequence?: (primes: number[]) => void;
  onFrequencyDetected?: (frequency: number) => void;
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioContext,
  analyser,
  colorScheme = 'purple',
  isVisible = true,
  pauseWhenStopped = true,
  frequency,
  chakra,
  onPrimeSequence,
  onFrequencyDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const primeNumbers = useRef<number[]>([]);
  const lastPrimeUpdate = useRef<number>(0);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const [activePrime, setActivePrime] = useState<number | null>(null);
  const lastActivePrimeTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!isVisible || !audioContext || !analyser) {
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Set up audio analyzer
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    frequencyDataRef.current = new Uint8Array(bufferLength);
    
    // Function to detect prime number frequencies
    const detectPrimeFrequencies = (dataArray: Uint8Array) => {
      const now = Date.now();
      
      // Only check every 200ms to avoid too many updates
      if (now - lastPrimeUpdate.current < 200) return;
      
      // Find the highest amplitude frequencies
      let maxVal = 0;
      let maxIndex = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i];
          maxIndex = i;
        }
      }
      
      // Check if this is a significant amplitude (above 70% of max)
      if (maxVal > 200) { // Threshold for detection
        // Calculate frequency
        const nyquist = audioContext.sampleRate / 2;
        const detectedFreq = Math.round((maxIndex / bufferLength) * nyquist);
        
        // Check nearby prime numbers (within 5Hz)
        for (let i = Math.max(2, detectedFreq - 5); i <= detectedFreq + 5; i++) {
          if (isPrime(i)) {
            // We found a prime near our frequency peak
            if (i !== activePrime) {
              setActivePrime(i);
              
              // Add to sequence if not already there
              if (!primeNumbers.current.includes(i)) {
                primeNumbers.current = [...primeNumbers.current, i];
                
                // Notify parent component about new prime sequence
                if (onPrimeSequence) {
                  onPrimeSequence(primeNumbers.current);
                }
              }
              
              lastActivePrimeTime.current = now;
              break;
            }
          }
        }
      } else if (now - lastActivePrimeTime.current > 2000 && activePrime !== null) {
        // Clear active prime after 2 seconds of inactivity
        setActivePrime(null);
      }
      
      lastPrimeUpdate.current = now;
      
      // If callback exists, report the detected frequency
      if (onFrequencyDetected && maxIndex > 0) {
        const nyquist = audioContext.sampleRate / 2;
        const detectedFreq = Math.round((maxIndex / bufferLength) * nyquist);
        onFrequencyDetected(detectedFreq);
      }
    };

    // Main animation function
    const animate = () => {
      if (!isVisible || pauseWhenStopped) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (!ctx || !analyser || !frequencyDataRef.current) return;
      
      analyser.getByteFrequencyData(frequencyDataRef.current);
      const dataArray = frequencyDataRef.current;
      
      // Detect prime frequencies
      detectPrimeFrequencies(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw audio visualization bars
      const barWidth = Math.max(2, (canvas.width / bufferLength) * 2.5);
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 0.5;
        
        // Color based on scheme
        let barColor;
        
        const isPrimeBar = isPrime(i);
        const barAlpha = isPrimeBar ? 0.9 : 0.7;
        
        switch (colorScheme) {
          case 'blue':
            barColor = isPrimeBar 
              ? `rgba(30, 144, 255, ${barAlpha})` // Bright blue for primes
              : `rgba(65, 105, 225, ${barAlpha})`; // Royal blue for others
            break;
          case 'rainbow':
            const hue = (i / bufferLength) * 360;
            barColor = isPrimeBar
              ? `hsla(${hue}, 100%, 60%, ${barAlpha})`
              : `hsla(${hue}, 80%, 45%, ${barAlpha})`;
            break;
          case 'gold':
            barColor = isPrimeBar 
              ? `rgba(255, 215, 0, ${barAlpha})` // Gold for primes
              : `rgba(218, 165, 32, ${barAlpha})`; // Golden rod for others
            break;
          default: // Purple
            barColor = isPrimeBar 
              ? `rgba(147, 112, 219, ${barAlpha})` // Bright purple for primes
              : `rgba(128, 0, 128, ${barAlpha})`; // Deep purple for others
        }
        
        // Make active prime bars glow
        if (activePrime !== null && (i === activePrime || i % activePrime === 0)) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = barColor;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = barColor;
        
        // Draw bar with rounded top
        const barX = x;
        const barY = canvas.height - barHeight;
        
        ctx.beginPath();
        ctx.moveTo(barX, canvas.height);
        ctx.lineTo(barX, barY + 2);
        ctx.arc(barX + barWidth/2, barY + 2, barWidth/2, Math.PI, 0, true);
        ctx.lineTo(barX + barWidth, canvas.height);
        ctx.fill();
        
        // Move to next bar
        x += barWidth + 1;
      }
      
      // Draw fractal patterns for significant frequencies
      const drawFractal = (x: number, y: number, size: number, depth: number, angle: number) => {
        if (depth <= 0 || size < 1) return;
        
        // Calculate branch angle based on audio
        const branchAngle = Math.PI / 4 + ((dataArray[depth * 5] || 0) / 255) * Math.PI / 6;
        
        // Calculate branch length
        const length = size * (0.65 + ((dataArray[depth * 3] || 0) / 255) * 0.2);
        
        // Calculate endpoints
        const x1 = x + Math.cos(angle) * length;
        const y1 = y + Math.sin(angle) * length;
        const x2 = x + Math.cos(angle + branchAngle) * length * 0.8;
        const y2 = y + Math.sin(angle + branchAngle) * length * 0.8;
        const x3 = x + Math.cos(angle - branchAngle) * length * 0.8;
        const y3 = y + Math.sin(angle - branchAngle) * length * 0.8;
        
        // Draw main branch
        const isPrimeDepth = isPrime(depth);
        
        // Set line color based on scheme and prime status
        switch (colorScheme) {
          case 'blue':
            ctx.strokeStyle = isPrimeDepth 
              ? `rgba(30, 144, 255, 0.9)` 
              : `rgba(65, 105, 225, 0.8)`;
            break;
          case 'rainbow':
            const hue = ((depth * 30) + Date.now() * 0.05) % 360;
            ctx.strokeStyle = isPrimeDepth
              ? `hsla(${hue}, 100%, 60%, 0.9)`
              : `hsla(${hue}, 80%, 45%, 0.8)`;
            break;
          case 'gold':
            ctx.strokeStyle = isPrimeDepth 
              ? `rgba(255, 215, 0, 0.9)` 
              : `rgba(218, 165, 32, 0.8)`;
            break;
          default: // Purple
            ctx.strokeStyle = isPrimeDepth 
              ? `rgba(147, 112, 219, 0.9)` 
              : `rgba(128, 0, 128, 0.8)`;
        }
        
        // Make active prime branches glow
        if (activePrime !== null && (depth === activePrime || depth % activePrime === 0)) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.strokeStyle;
        } else {
          ctx.shadowBlur = 0;
        }
        
        // Set line width based on depth
        ctx.lineWidth = Math.max(0.5, 3 - depth * 0.3);
        
        // Draw main branch
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        
        // Recursively draw branches
        drawFractal(x1, y1, length * 0.7, depth - 1, angle + branchAngle);
        drawFractal(x1, y1, length * 0.7, depth - 1, angle - branchAngle);
        
        // Add extra branches for prime depths
        if (isPrimeDepth && depth > 2) {
          const extraAngle = Math.PI / 3 + ((dataArray[depth * 7] || 0) / 255) * Math.PI / 6;
          drawFractal(x1, y1, length * 0.5, depth - 2, angle + extraAngle);
          drawFractal(x1, y1, length * 0.5, depth - 2, angle - extraAngle);
        }
      };
      
      // Calculate average amplitude for scaling
      let avgAmplitude = 0;
      for (let i = 0; i < bufferLength; i++) {
        avgAmplitude += dataArray[i];
      }
      avgAmplitude /= bufferLength;
      
      // Draw fractal
      const centerX = canvas.width / 2;
      const initialSize = Math.min(canvas.width, canvas.height) * 0.3;
      const scaledSize = initialSize * (0.7 + (avgAmplitude / 255) * 0.5);
      
      // Draw multiple fractals
      drawFractal(centerX, canvas.height, scaledSize, 7, -Math.PI/2);
      
      // Display active prime number
      if (activePrime !== null) {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(`Prime: ${activePrime}`, canvas.width / 2, 50);
        
        // Add a pulsing circle
        const pulseSize = 50 + 20 * Math.sin(Date.now() * 0.005);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 100, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.fill();
      }
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, audioContext, analyser, colorScheme, activePrime, pauseWhenStopped, onPrimeSequence, onFrequencyDetected]);

  if (!isVisible) return null;

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default FractalAudioVisualizer;
