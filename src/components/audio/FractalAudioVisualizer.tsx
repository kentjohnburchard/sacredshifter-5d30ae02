
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
  const [renderMode, setRenderMode] = useState<'fractal' | 'flower' | 'spiral'>('flower');
  const lastModeCycleTime = useRef<number>(Date.now());

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
    analyser.fftSize = 2048; // Increased for better frequency resolution
    const bufferLength = analyser.frequencyBinCount;
    frequencyDataRef.current = new Uint8Array(bufferLength);
    
    // Helper to check if audio is active
    const isAudioActive = (dataArray: Uint8Array): boolean => {
      let sum = 0;
      const sampleSize = Math.min(32, dataArray.length);
      
      for (let i = 0; i < sampleSize; i++) {
        sum += dataArray[i];
      }
      
      return (sum / sampleSize) > 5; // Consider active if average is above threshold
    };
    
    // Function to detect prime number frequencies
    const detectPrimeFrequencies = (dataArray: Uint8Array) => {
      const now = Date.now();
      
      // Only check every 100ms to avoid too many updates but be more responsive
      if (now - lastPrimeUpdate.current < 100) return;
      
      // Find the highest amplitude frequencies
      let maxVal = 0;
      let maxIndex = 0;
      let secondaryPeaks: {value: number, index: number}[] = [];
      
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          secondaryPeaks.push({value: maxVal, index: maxIndex});
          maxVal = dataArray[i];
          maxIndex = i;
        } else if (dataArray[i] > maxVal * 0.8) {
          // Also track secondary peaks (at least 80% of max)
          secondaryPeaks.push({value: dataArray[i], index: i});
        }
      }
      
      // Sort secondary peaks by value (descending)
      secondaryPeaks.sort((a, b) => b.value - a.value);
      
      // Check if this is a significant amplitude
      if (maxVal > 180) { // Adjusted threshold
        // Calculate frequency
        const nyquist = audioContext.sampleRate / 2;
        const detectedFreq = Math.round((maxIndex / bufferLength) * nyquist);
        
        // Check nearby prime numbers (within 10Hz for better detection)
        let foundPrime = false;
        for (let i = Math.max(2, detectedFreq - 10); i <= detectedFreq + 10; i++) {
          if (isPrime(i)) {
            // We found a prime near our frequency peak
            if (i !== activePrime) {
              console.log(`Prime frequency detected: ${i}Hz`);
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
              foundPrime = true;
              break;
            } else {
              // Already tracking this prime
              lastActivePrimeTime.current = now;
              foundPrime = true;
            }
          }
        }
        
        // If no prime found in the main peak, check secondary peaks
        if (!foundPrime && secondaryPeaks.length > 0) {
          for (let peak of secondaryPeaks.slice(0, 3)) { // Check top 3 secondary peaks
            const secondaryFreq = Math.round((peak.index / bufferLength) * nyquist);
            for (let i = Math.max(2, secondaryFreq - 10); i <= secondaryFreq + 10; i++) {
              if (isPrime(i)) {
                if (i !== activePrime) {
                  console.log(`Prime frequency detected in secondary peak: ${i}Hz`);
                  setActivePrime(i);
                  
                  if (!primeNumbers.current.includes(i)) {
                    primeNumbers.current = [...primeNumbers.current, i];
                    
                    if (onPrimeSequence) {
                      onPrimeSequence(primeNumbers.current);
                    }
                  }
                  
                  lastActivePrimeTime.current = now;
                  break;
                } else {
                  lastActivePrimeTime.current = now;
                }
              }
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
      if (!isVisible || !analyser || !frequencyDataRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (!ctx) return;
      
      // Get frequency data
      const dataArray = frequencyDataRef.current;
      analyser.getByteFrequencyData(dataArray);
      
      // Check if audio is active before continuing
      if (pauseWhenStopped && !isAudioActive(dataArray)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }
      
      // Detect prime frequencies
      detectPrimeFrequencies(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate average amplitude for use in animations
      let avgAmplitude = 0;
      for (let i = 0; i < bufferLength; i++) {
        avgAmplitude += dataArray[i];
      }
      avgAmplitude /= bufferLength;
      const normalizedAmplitude = avgAmplitude / 255; // 0 to 1
      
      // Choose rendering method based on mode
      switch (renderMode) {
        case 'fractal':
          drawFractalVisualizer(ctx, canvas, dataArray, normalizedAmplitude);
          break;
        case 'flower':
          drawFlowerVisualizer(ctx, canvas, dataArray, normalizedAmplitude);
          break;
        case 'spiral':
          drawSpiralVisualizer(ctx, canvas, dataArray, normalizedAmplitude);
          break;
      }
      
      // Cycle through rendering modes every 20 seconds if active prime is present
      const now = Date.now();
      if (activePrime !== null && now - lastModeCycleTime.current > 20000) {
        const modes: ('fractal' | 'flower' | 'spiral')[] = ['fractal', 'flower', 'spiral'];
        const currentIndex = modes.indexOf(renderMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRenderMode(modes[nextIndex]);
        lastModeCycleTime.current = now;
      }
    };

    // Draw audio visualization with flower of life pattern
    const drawFlowerVisualizer = (
      ctx: CanvasRenderingContext2D, 
      canvas: HTMLCanvasElement, 
      dataArray: Uint8Array,
      normalizedAmplitude: number
    ) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Base size that scales with canvas
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.4;
      
      // Scale with audio amplitude
      const activeRadius = baseRadius * (0.7 + normalizedAmplitude * 0.5);
      
      // Draw flower of life pattern
      const drawFlower = (iterations: number, maxRadius: number) => {
        const petals = 6 + Math.floor(normalizedAmplitude * 6); // 6-12 petals based on amplitude
        const outerCircleRadius = maxRadius / 3;
        
        // Center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerCircleRadius * 0.7, 0, Math.PI * 2);
        
        // Set color based on scheme and activity
        const setCircleStyle = (index: number, isPrimeRelated: boolean) => {
          const alpha = 0.1 + normalizedAmplitude * 0.3;
          const isActive = activePrime !== null;
          
          if (isPrimeRelated && isActive) {
            ctx.shadowBlur = 15;
            ctx.fillStyle = getColorForScheme(colorScheme, isPrimeRelated, 0.8);
            ctx.shadowColor = getColorForScheme(colorScheme, true, 1);
          } else {
            ctx.shadowBlur = isPrimeRelated ? 5 : 0;
            ctx.fillStyle = getColorForScheme(colorScheme, isPrimeRelated, alpha);
            ctx.shadowColor = getColorForScheme(colorScheme, isPrimeRelated, alpha);
          }
        };
        
        // Center circle - always prime related for visual focus
        setCircleStyle(0, true);
        ctx.fill();
        
        // Outer circles forming the flower pattern
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2;
          
          // Calculate position in the circle
          const x = centerX + Math.cos(angle) * outerCircleRadius;
          const y = centerY + Math.sin(angle) * outerCircleRadius;
          
          // Each index corresponds to a frequency band
          const frequencyIndex = Math.min(i * 8, dataArray.length - 1);
          const amplitude = dataArray[frequencyIndex] / 255;
          
          // Scale circle with its frequency amplitude
          const pulsingRadius = outerCircleRadius * (0.6 + amplitude * 0.4);
          
          // Check if this index is a prime number
          const isPrimeIndex = isPrime(i + 2);  // Offset by 2 to avoid 0 and 1
          
          // Special highlight if this circle relates to the active prime
          const isPrimeRelated = isPrimeIndex || (activePrime !== null && ((i + 2) % activePrime === 0));
          
          ctx.beginPath();
          ctx.arc(x, y, pulsingRadius, 0, Math.PI * 2);
          
          setCircleStyle(i, isPrimeRelated);
          ctx.fill();
          
          // For active primes, add connecting lines
          if (isPrimeRelated && activePrime !== null) {
            // Draw connecting lines to center
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = getColorForScheme(colorScheme, true, 0.3);
            ctx.lineWidth = 1 + amplitude * 2;
            ctx.stroke();
          }
          
          // Add recursive petals for prime-related circles
          if (isPrimeRelated && iterations > 0) {
            const subPetals = 3 + Math.floor(amplitude * 3);
            for (let j = 0; j < subPetals; j++) {
              const subAngle = angle + ((j / subPetals) * Math.PI) - Math.PI/2;
              const dist = pulsingRadius * 1.2;
              const subX = x + Math.cos(subAngle) * dist;
              const subY = y + Math.sin(subAngle) * dist;
              
              // Draw smaller petal
              ctx.beginPath();
              ctx.arc(subX, subY, pulsingRadius * 0.6, 0, Math.PI * 2);
              ctx.fillStyle = getColorForScheme(colorScheme, isPrimeRelated, 0.2 + amplitude * 0.3);
              ctx.fill();
              
              // Connect to parent circle
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(subX, subY);
              ctx.strokeStyle = getColorForScheme(colorScheme, isPrimeRelated, 0.15 + amplitude * 0.1);
              ctx.lineWidth = 0.5 + amplitude;
              ctx.stroke();
            }
          }
        }
        
        // If we have an active prime, show additional visual effects
        if (activePrime !== null) {
          // Outer vibration ring
          const ringRadius = baseRadius * (0.9 + 0.1 * Math.sin(Date.now() / 200));
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = getColorForScheme(colorScheme, true, 0.4);
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Display the active prime number
          displayPrimeNumber(ctx, canvas, activePrime);
        }
      };
      
      // Draw with animation based on audio amplitude
      drawFlower(2, activeRadius);
    };
    
    // Draw fractal-based visualizer
    const drawFractalVisualizer = (
      ctx: CanvasRenderingContext2D, 
      canvas: HTMLCanvasElement, 
      dataArray: Uint8Array,
      normalizedAmplitude: number
    ) => {
      // Draw audio visualization bars first
      const barWidth = Math.max(2, (canvas.width / 128)); // Show fewer bars for clarity
      let barHeight;
      let x = 0;
      
      // Only visualize a portion of the frequency data for better visuals
      const visualizationEnd = Math.min(128, dataArray.length);
      
      for (let i = 0; i < visualizationEnd; i++) {
        barHeight = dataArray[i] * 0.5;
        
        // Color based on chakra frequency ranges
        let barColor;
        const nyquist = (audioContext?.sampleRate || 44100) / 2;
        const barFrequency = (i / visualizationEnd) * nyquist;
        
        const isPrimeBar = isPrime(i + 2); // Offset to avoid 0, 1
        const barAlpha = isPrimeBar ? 0.9 : 0.7;
        
        // Create special effects for active primes
        const isPrimeRelated = isPrimeBar || (activePrime !== null && ((i + 2) % activePrime === 0));
        
        // Get color based on frequency range (chakra mapping)
        barColor = getChakraColor(barFrequency, isPrimeRelated, barAlpha);
        
        // Make active prime bars glow
        if (isPrimeRelated && activePrime !== null) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = barColor;
        } else {
          ctx.shadowBlur = isPrimeBar ? 5 : 0;
          ctx.shadowColor = barColor;
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
      
      // Draw fractal patterns in center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.3;
      const scaledSize = size * (0.7 + normalizedAmplitude * 0.5);
      
      // Draw recursive fractal pattern
      drawFractal(centerX, centerY, scaledSize, 5, -Math.PI/2, dataArray);
      
      // If we have an active prime, display it
      if (activePrime !== null) {
        displayPrimeNumber(ctx, canvas, activePrime);
      }
    };

    // Draw a fractal pattern recursively
    const drawFractal = (
      x: number, 
      y: number, 
      size: number, 
      depth: number, 
      angle: number,
      dataArray: Uint8Array
    ) => {
      if (depth <= 0 || size < 1) return;
      
      // Frequency data influences branch angles and lengths
      const dataIndex = Math.min(depth * 10, dataArray.length - 1);
      const amplitude = dataArray[dataIndex] / 255;
      
      // Calculate branch angle based on audio
      const branchAngle = Math.PI / 4 + (amplitude * Math.PI / 6);
      
      // Calculate branch length
      const length = size * (0.65 + amplitude * 0.2);
      
      // Calculate endpoints
      const x1 = x + Math.cos(angle) * length;
      const y1 = y + Math.sin(angle) * length;
      
      // Set line color based on scheme
      const isPrimeDepth = isPrime(depth + 2);
      const isPrimeRelated = isPrimeDepth || (activePrime !== null && ((depth + 2) % activePrime === 0));
      
      ctx.strokeStyle = getColorForScheme(colorScheme, isPrimeRelated, isPrimeRelated ? 0.9 : 0.7);
      
      // Make active prime branches glow
      if (isPrimeRelated && activePrime !== null) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.strokeStyle;
      } else {
        ctx.shadowBlur = isPrimeDepth ? 5 : 0;
      }
      
      // Set line width based on depth
      ctx.lineWidth = Math.max(0.5, 3 - depth * 0.3);
      
      // Draw main branch
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      
      // Recursively draw branches
      drawFractal(x1, y1, length * 0.7, depth - 1, angle + branchAngle, dataArray);
      drawFractal(x1, y1, length * 0.7, depth - 1, angle - branchAngle, dataArray);
      
      // Add extra branches for prime depths
      if (isPrimeDepth && depth > 2) {
        const extraAngle = Math.PI / 3 + (amplitude * Math.PI / 6);
        drawFractal(x1, y1, length * 0.5, depth - 2, angle + extraAngle, dataArray);
        drawFractal(x1, y1, length * 0.5, depth - 2, angle - extraAngle, dataArray);
      }
    };

    // Draw spiral-based visualizer
    const drawSpiralVisualizer = (
      ctx: CanvasRenderingContext2D, 
      canvas: HTMLCanvasElement, 
      dataArray: Uint8Array,
      normalizedAmplitude: number
    ) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Base radius scales with canvas
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;
      const scaledRadius = maxRadius * (0.7 + normalizedAmplitude * 0.5);
      
      // Draw spiral pattern
      const drawSpiral = () => {
        const spiralTurns = 3 + Math.floor(normalizedAmplitude * 5); // More turns with higher amplitude
        const pointsPerTurn = 30; // Resolution of spiral
        const totalPoints = spiralTurns * pointsPerTurn;
        
        let prevX = centerX;
        let prevY = centerY;
        
        // Draw center point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3 + normalizedAmplitude * 5, 0, Math.PI * 2);
        ctx.fillStyle = getColorForScheme(colorScheme, true, 0.9);
        ctx.shadowBlur = 10;
        ctx.shadowColor = getColorForScheme(colorScheme, true, 0.9);
        ctx.fill();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
        
        // Draw the spiral
        for (let i = 1; i <= totalPoints; i++) {
          // Calculate angle and radius for this point
          const progress = i / totalPoints;
          const angle = progress * spiralTurns * Math.PI * 2;
          const radius = progress * scaledRadius;
          
          // Get data index that maps to this position in spiral
          const dataIndex = Math.min(Math.floor(i * (dataArray.length / totalPoints)), dataArray.length - 1);
          const amplitude = dataArray[dataIndex] / 255;
          
          // Adjust point based on frequency amplitude
          const adjustedRadius = radius * (0.8 + amplitude * 0.5);
          const x = centerX + Math.cos(angle) * adjustedRadius;
          const y = centerY + Math.sin(angle) * adjustedRadius;
          
          // Map this point to a frequency for coloring
          const nyquist = (audioContext?.sampleRate || 44100) / 2;
          const pointFrequency = (dataIndex / dataArray.length) * nyquist;
          
          // Check if this index is prime
          const pointNumber = i + 1; // 1-based indexing
          const isPrimePoint = isPrime(pointNumber);
          const isPrimeRelated = isPrimePoint || (activePrime !== null && (pointNumber % activePrime === 0));
          
          // Draw line segment
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          
          // Set line style based on prime status and frequency (chakra color)
          const lineAlpha = 0.3 + (amplitude * 0.7);
          ctx.strokeStyle = getChakraColor(pointFrequency, isPrimeRelated, lineAlpha);
          ctx.lineWidth = 1 + (isPrimeRelated ? amplitude * 2 : amplitude);
          
          // Add glow for prime points
          if (isPrimeRelated) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = getChakraColor(pointFrequency, true, 0.7);
          } else {
            ctx.shadowBlur = 0;
          }
          
          ctx.stroke();
          
          // Draw points at prime locations
          if (isPrimeRelated) {
            ctx.beginPath();
            const pointSize = 2 + amplitude * 6;
            ctx.arc(x, y, pointSize, 0, Math.PI * 2);
            ctx.fillStyle = getChakraColor(pointFrequency, true, 0.8);
            ctx.fill();
            
            // For active primes, add connecting lines to center
            if (activePrime !== null && pointNumber % activePrime === 0) {
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(x, y);
              ctx.strokeStyle = getChakraColor(pointFrequency, true, 0.3);
              ctx.lineWidth = 0.5 + amplitude;
              ctx.stroke();
            }
          }
          
          // Update previous point
          prevX = x;
          prevY = y;
        }
        
        // If we have an active prime, show additional visual effects
        if (activePrime !== null) {
          // Outer vibration ring
          const ringRadius = maxRadius * (0.9 + 0.1 * Math.sin(Date.now() / 200));
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = getColorForScheme(colorScheme, true, 0.4);
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Display the active prime number
          displayPrimeNumber(ctx, canvas, activePrime);
        }
      };
      
      drawSpiral();
    };

    // Helper to get colors based on chakra frequency ranges
    const getChakraColor = (frequency: number, isPrime: boolean, alpha: number): string => {
      // Define frequency ranges for chakras
      if (frequency < 60) {
        // Root - Red (20-60 Hz)
        return isPrime 
          ? `rgba(234, 56, 76, ${alpha})` // Bright red for primes
          : `rgba(200, 36, 50, ${alpha})`; // Darker red for others
      } else if (frequency < 100) {
        // Sacral - Orange (60–100 Hz)
        return isPrime
          ? `rgba(255, 165, 0, ${alpha})` // Bright orange for primes
          : `rgba(230, 140, 0, ${alpha})`; // Darker orange for others
      } else if (frequency < 150) {
        // Solar Plexus - Yellow (100–150 Hz)
        return isPrime 
          ? `rgba(255, 215, 0, ${alpha})` // Bright yellow/gold for primes
          : `rgba(218, 165, 32, ${alpha})`; // Darker golden rod for others
      } else if (frequency < 250) {
        // Heart - Green (150–250 Hz)
        return isPrime
          ? `rgba(46, 204, 113, ${alpha})` // Bright green for primes
          : `rgba(39, 174, 96, ${alpha})`; // Darker green for others
      } else if (frequency < 400) {
        // Throat - Blue (250–400 Hz)
        return isPrime
          ? `rgba(52, 152, 219, ${alpha})` // Bright blue for primes
          : `rgba(41, 128, 185, ${alpha})`; // Darker blue for others
      } else if (frequency < 600) {
        // Third Eye - Indigo (400–600 Hz)
        return isPrime
          ? `rgba(155, 89, 182, ${alpha})` // Bright indigo for primes
          : `rgba(142, 68, 173, ${alpha})`; // Darker indigo for others
      } else {
        // Crown - Violet/White (600+ Hz)
        return isPrime
          ? `rgba(243, 240, 255, ${alpha})` // Nearly white for primes
          : `rgba(175, 122, 197, ${alpha})`; // Violet for others
      }
    };

    // Helper to get colors based on scheme
    const getColorForScheme = (scheme: string, isPrime: boolean, alpha: number): string => {
      switch (scheme) {
        case 'blue':
          return isPrime 
            ? `rgba(30, 144, 255, ${alpha})` // Bright blue for primes
            : `rgba(65, 105, 225, ${alpha})`; // Royal blue for others
        case 'rainbow':
          const hue = (Date.now() * 0.05) % 360;
          return isPrime
            ? `hsla(${hue}, 100%, 60%, ${alpha})`
            : `hsla(${hue + 30}, 80%, 45%, ${alpha})`;
        case 'gold':
          return isPrime 
            ? `rgba(255, 215, 0, ${alpha})` // Gold for primes
            : `rgba(218, 165, 32, ${alpha})`; // Golden rod for others
        default: // Purple
          return isPrime 
            ? `rgba(147, 112, 219, ${alpha})` // Bright purple for primes
            : `rgba(128, 0, 128, ${alpha})`; // Deep purple for others
      }
    };

    // Display active prime number
    const displayPrimeNumber = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, prime: number) => {
      ctx.font = '24px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(`Prime: ${prime}`, canvas.width / 2, 50);
      
      // Add a tooltip about prime mapping if on mouseover
      if (canvas.dataset.showTooltip === 'true') {
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(
          "Prime Harmonic Activated: Aligned with natural consciousness fields",
          canvas.width / 2, 
          80
        );
      }
    };

    // Add mouse events for tooltip
    const handleMouseEnter = () => {
      if (canvas) {
        canvas.dataset.showTooltip = 'true';
      }
    };
    
    const handleMouseLeave = () => {
      if (canvas) {
        canvas.dataset.showTooltip = 'false';
      }
    };
    
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, audioContext, analyser, colorScheme, activePrime, pauseWhenStopped, onPrimeSequence, onFrequencyDetected, renderMode]);

  // Toggle through visualizer modes
  const cycleRenderMode = () => {
    const modes: ('fractal' | 'flower' | 'spiral')[] = ['fractal', 'flower', 'spiral'];
    const currentIndex = modes.indexOf(renderMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRenderMode(modes[nextIndex]);
  };

  if (!isVisible) return null;

  return (
    <>
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={cycleRenderMode} // Allow clicking to cycle through modes
        title="Prime Harmonics Visualizer - Click to change style"
      />
      
      {/* Optional tooltip about prime mapping */}
      {activePrime && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs md:text-sm px-3 py-1.5 rounded-full pointer-events-none"
        >
          Prime {activePrime} activated • Resonating with consciousness fields
        </motion.div>
      )}
    </>
  );
};

export default FractalAudioVisualizer;
