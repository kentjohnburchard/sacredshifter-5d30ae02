
import React, { useRef, useEffect, useState } from 'react';
import { VisualizerMode } from './SacredAudioPlayerWithVisualizer';
import { isPrime, calculatePrimeFactors } from '@/lib/primeUtils';
import { generatePrimeSequence } from '@/utils/primeCalculations';

interface CanvasAudioVisualizerProps {
  audioData?: Uint8Array;
  colorScheme: string;
  visualizerMode: VisualizerMode;
  isPlaying: boolean;
  primeFrequencies?: number[];
  isFullscreen?: boolean;
}

const CanvasAudioVisualizer: React.FC<CanvasAudioVisualizerProps> = ({ 
  audioData, 
  colorScheme = '#a855f7', 
  visualizerMode = 'primeFlow',
  isPlaying,
  primeFrequencies = [],
  isFullscreen = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [primeSequence, setPrimeSequence] = useState<number[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [growth, setGrowth] = useState(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Generate prime sequence for visualizations
  useEffect(() => {
    // Generate a sequence of the first 100 prime numbers
    const primes = generatePrimeSequence(100);
    setPrimeSequence(primes);
  }, []);

  // Animation timer for growth effect
  useEffect(() => {
    if (isPlaying) {
      const growthTimer = setInterval(() => {
        setGrowth(prev => Math.min(prev + 0.01, 1));
        setAnimationProgress(prev => (prev + 0.5) % 100);
      }, 50);
      
      return () => clearInterval(growthTimer);
    }
  }, [isPlaying]);

  // Respond to detected prime frequencies
  useEffect(() => {
    if (primeFrequencies.length > 0) {
      // Boost growth when primes are detected
      setGrowth(prev => Math.min(prev + 0.2, 1));
      
      // You could also do special visualization effects here
    }
  }, [primeFrequencies]);

  // Draw visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Define the draw function for each visualization mode
    // These are placed here to avoid reference errors
    const drawFunctions = {
      // Draw prime flow visualization - the sacred geometry of numbers
      primeFlow: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        try {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, width, height);
          
          const centerX = width / 2;
          const centerY = height / 2;
          const baseRadius = Math.min(width, height) * 0.3 * growth; // Use growth factor
          
          // Draw orbits based on prime sequence
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          
          // Draw concentric circles for the first few primes
          for (let i = 0; i < 10 && i < primeSequence.length; i++) {
            const prime = primeSequence[i];
            const radius = baseRadius * (prime / 30);
            
            if (radius <= 0) continue; // Skip if radius is zero or negative
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          // Draw particles along the orbits that respond to audio
          const maxAudioValue = audioData ? Math.max(...Array.from(audioData)) : 0;
          const audioMultiplier = maxAudioValue / 255;
          const time = performance.now() / 1000;
          
          ctx.fillStyle = color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          
          primeSequence.slice(0, 20).forEach((prime, i) => {
            const orbitRadius = baseRadius * (prime / 30);
            if (orbitRadius <= 0) return; // Skip if radius is zero or negative
            
            // Calculate position on orbit
            const angle = (time * (i + 1) * 0.1) % (Math.PI * 2);
            const x = centerX + Math.cos(angle) * orbitRadius;
            const y = centerY + Math.sin(angle) * orbitRadius;
            
            // Particle size responds to audio
            const particleSize = Math.max(2, (audioMultiplier * 8) * ((i % 3) + 1));
            
            ctx.beginPath();
            ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Add "soul" connection lines between particles when primes detected
            if (primeFrequencies.length > 0 && i > 0 && i < primeSequence.length - 1) {
              const prevPrime = primeSequence[i-1];
              const prevRadius = baseRadius * (prevPrime / 30);
              const prevAngle = (time * i * 0.1) % (Math.PI * 2);
              const prevX = centerX + Math.cos(prevAngle) * prevRadius;
              const prevY = centerY + Math.sin(prevAngle) * prevRadius;
              
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(prevX, prevY);
              ctx.strokeStyle = `rgba(${parseInt(color.substring(1, 3), 16)}, ${parseInt(color.substring(3, 5), 16)}, ${parseInt(color.substring(5, 7), 16)}, 0.3)`;
              ctx.stroke();
            }
          });
          
          // Draw center soul - grows with the visualization
          const soulSize = 5 + (audioMultiplier * 15) * growth;
          ctx.beginPath();
          ctx.arc(centerX, centerY, soulSize, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          
          // Create ripple effect when prime frequencies are detected
          if (primeFrequencies.length > 0) {
            primeFrequencies.forEach((_, i) => {
              const pulseRadius = (animationProgress + i * 10) * growth;
              if (pulseRadius > 0) { // Ensure radius is positive
                ctx.beginPath();
                ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${parseInt(color.substring(1, 3), 16)}, ${parseInt(color.substring(3, 5), 16)}, ${parseInt(color.substring(5, 7), 16)}, ${Math.max(0, 1 - pulseRadius / 100)})`;
                ctx.stroke();
              }
            });
          }
        } catch (error) {
          console.error("Error drawing primeFlow visualization:", error);
        }
      },
      
      // Flower of life visualization that grows based on primes
      flower: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        try {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, width, height);
          
          const centerX = width / 2;
          const centerY = height / 2;
          const maxRadius = Math.min(width, height) * 0.4 * growth;
          
          // Draw flower of life pattern
          const drawFlower = (radius: number, iterations: number, audioLevel: number) => {
            if (iterations <= 0 || radius <= 0) return;
            
            // Calculate circle radius based on audio level
            const circleRadius = Math.max(5, radius * (0.7 + audioLevel * 0.3));
            
            // Draw center circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Draw surrounding circles
            const numPetals = 6;
            for (let i = 0; i < numPetals; i++) {
              const angle = (i / numPetals) * Math.PI * 2;
              const x = centerX + Math.cos(angle) * circleRadius;
              const y = centerY + Math.sin(angle) * circleRadius;
              
              ctx.beginPath();
              ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
            
            // Recursively draw smaller flowers
            drawFlower(radius * 0.5, iterations - 1, audioLevel);
          };
          
          const audioLevel = audioData ? 
            Array.from(audioData).reduce((sum, val) => sum + val, 0) / (audioData.length * 255) : 
            0.5;
          
          drawFlower(maxRadius, 3, audioLevel);
          
          // Add particle effects when primes are detected
          if (primeFrequencies.length > 0) {
            ctx.fillStyle = color;
            const time = performance.now() / 1000;
            
            for (let i = 0; i < 50; i++) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * maxRadius;
              const x = centerX + Math.cos(angle) * distance;
              const y = centerY + Math.sin(angle) * distance;
              const size = 1 + Math.random() * 3;
              
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } catch (error) {
          console.error("Error drawing flower visualization:", error);
        }
      },
      
      // Sacred geometry visualization
      sacred: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        try {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, width, height);
          
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) * 0.4 * growth;
          
          // Draw merkaba (two interlocking tetrahedra)
          const time = performance.now() / 1000;
          const audioLevel = audioData ? 
            Array.from(audioData).reduce((sum, val) => sum + val, 0) / (audioData.length * 255) : 
            0.5;
          
          const rotationOffset = time * 0.2;
          
          // Draw first triangle (pointing up)
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          
          const triangle1Points = [
            { 
              x: centerX, 
              y: centerY - radius * (0.8 + audioLevel * 0.4)
            },
            { 
              x: centerX - radius * 0.866 * (0.8 + audioLevel * 0.4), 
              y: centerY + radius * 0.5 * (0.8 + audioLevel * 0.4)
            },
            { 
              x: centerX + radius * 0.866 * (0.8 + audioLevel * 0.4), 
              y: centerY + radius * 0.5 * (0.8 + audioLevel * 0.4)
            }
          ];
          
          ctx.moveTo(triangle1Points[0].x, triangle1Points[0].y);
          for (let i = 1; i <= 3; i++) {
            const point = triangle1Points[i % 3];
            ctx.lineTo(point.x, point.y);
          }
          
          ctx.stroke();
          
          // Draw second triangle (pointing down)
          ctx.beginPath();
          
          const triangle2Points = [
            { 
              x: centerX, 
              y: centerY + radius * (0.8 + audioLevel * 0.4)
            },
            { 
              x: centerX - radius * 0.866 * (0.8 + audioLevel * 0.4), 
              y: centerY - radius * 0.5 * (0.8 + audioLevel * 0.4)
            },
            { 
              x: centerX + radius * 0.866 * (0.8 + audioLevel * 0.4), 
              y: centerY - radius * 0.5 * (0.8 + audioLevel * 0.4)
            }
          ];
          
          ctx.moveTo(triangle2Points[0].x, triangle2Points[0].y);
          for (let i = 1; i <= 3; i++) {
            const point = triangle2Points[i % 3];
            ctx.lineTo(point.x, point.y);
          }
          
          ctx.stroke();
          
          // Draw connecting lines when primes detected
          if (primeFrequencies.length > 0) {
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
              ctx.moveTo(triangle1Points[i].x, triangle1Points[i].y);
              ctx.lineTo(triangle2Points[i].x, triangle2Points[i].y);
            }
            ctx.stroke();
            
            // Add particles at intersections
            const points = [...triangle1Points, ...triangle2Points];
            ctx.fillStyle = color;
            
            points.forEach(point => {
              ctx.beginPath();
              ctx.arc(point.x, point.y, 3 + audioLevel * 5, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        } catch (error) {
          console.error("Error drawing sacred visualization:", error);
        }
      },
      
      // Original visualizations kept for compatibility
      bars: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        if (!audioData) return;
        
        try {
          const barCount = Math.min(audioData.length, 64);
          const barWidth = width / barCount;
          const barSpacing = 2;
          
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(0, 0, width, height);
          
          ctx.fillStyle = color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          
          for (let i = 0; i < barCount; i++) {
            const value = audioData[i] || 0;
            const percent = value / 255;
            const barHeight = percent * height;
            
            // Highlight bars that correspond to prime frequencies
            if (isPrime(i + 20)) {
              ctx.fillStyle = '#ffffff';
            } else {
              ctx.fillStyle = color;
            }
            
            ctx.fillRect(
              i * barWidth + barSpacing/2, 
              height - barHeight, 
              barWidth - barSpacing, 
              barHeight
            );
          }
        } catch (error) {
          console.error("Error drawing bars visualization:", error);
        }
      },
      
      wave: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        if (!audioData) return;
        
        try {
          const sliceWidth = width / audioData.length;
          
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(0, 0, width, height);
          
          ctx.lineWidth = 2;
          ctx.strokeStyle = color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.beginPath();
          ctx.moveTo(0, height / 2);
          
          for (let i = 0; i < audioData.length; i++) {
            const value = audioData[i] || 0;
            const percent = value / 255;
            const y = height / 2 + (percent * height / 2 - height / 4);
            const x = i * sliceWidth;
            
            ctx.lineTo(x, y);
          }
          
          ctx.lineTo(width, height / 2);
          ctx.stroke();
        } catch (error) {
          console.error("Error drawing wave visualization:", error);
        }
      },
      
      circle: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        if (!audioData) return;
        
        try {
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(centerX, centerY) - 20;
          const segments = Math.min(audioData.length, 64);
          const angleStep = (Math.PI * 2) / segments;
          
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(0, 0, width, height);
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
          
          for (let i = 0; i < segments; i++) {
            const value = audioData[i] || 0;
            const percent = value / 255;
            const angle = i * angleStep;
            
            // Highlight segments that correspond to prime frequencies
            if (isPrime(i + 20)) {
              ctx.strokeStyle = '#ffffff';
            } else {
              ctx.strokeStyle = color;
            }
            
            const innerRadius = radius * 0.4;
            const outerRadius = radius * (0.4 + percent * 0.6);
            
            if (innerRadius <= 0 || outerRadius <= 0) continue;
            
            const startX = centerX + Math.cos(angle) * innerRadius;
            const startY = centerY + Math.sin(angle) * innerRadius;
            const endX = centerX + Math.cos(angle) * outerRadius;
            const endY = centerY + Math.sin(angle) * outerRadius;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
        } catch (error) {
          console.error("Error drawing circle visualization:", error);
        }
      },
      
      particles: (ctx: CanvasRenderingContext2D, audioData: Uint8Array | undefined, width: number, height: number, color: string) => {
        if (!audioData) return;
        
        try {
          const centerX = width / 2;
          const centerY = height / 2;
          const bassValue = audioData.slice(0, 10).reduce((acc, val) => acc + val, 0) / 10;
          const bassPercent = bassValue / 255;
          const particleCount = 50;
          
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(0, 0, width, height);
          
          ctx.fillStyle = color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const amplitudeFactor = 0.3 + bassPercent * 0.7;
            const distance = Math.random() * width * 0.4 * amplitudeFactor;
            
            if (distance <= 0) continue;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = 2 + Math.random() * 4 * bassPercent;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        } catch (error) {
          console.error("Error drawing particles visualization:", error);
        }
      }
    };
    
    const draw = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;
      
      if (!ctx || !canvas) return;
      
      // Set canvas background
      ctx.clearRect(0, 0, width, height);
      
      // Choose visualization based on mode
      const visualizationFunction = drawFunctions[visualizerMode] || drawFunctions['bars'];
      try {
        visualizationFunction(ctx, audioData, width, height, colorScheme);
      } catch (error) {
        console.error(`Error in ${visualizerMode} visualization:`, error);
      }
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    // Handle canvas resize
    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      // Apply high DPI scaling
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation if playing
    if (isPlaying) {
      lastFrameTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(draw);
    }
    
    // Clean up
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [audioData, colorScheme, visualizerMode, isPlaying, primeFrequencies, animationProgress, growth, primeSequence, isFullscreen]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-black/20"
    />
  );
};

export default CanvasAudioVisualizer;
