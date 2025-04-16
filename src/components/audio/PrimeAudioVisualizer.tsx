
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { isPrime } from '@/utils/primeCalculations';

interface PrimeAudioVisualizerProps {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  colorMode?: 'standard' | 'veil-lifted' | 'chakra' | 'liquid-crystal';
  chakraColor?: string;
  visualMode?: 'spectrum' | 'waveform' | 'prime' | 'liquid-geometry';
  layout?: 'vertical' | 'radial' | 'fluid';
  sensitivity?: number;
  onPrimeDetected?: (prime: number) => void;
}

const PrimeAudioVisualizer: React.FC<PrimeAudioVisualizerProps> = ({
  audioContext,
  analyser,
  isPlaying,
  colorMode = 'standard',
  chakraColor,
  visualMode = 'spectrum',
  layout = 'vertical',
  sensitivity = 1.0,
  onPrimeDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastPrimeDetectionRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [dominantFrequency, setDominantFrequency] = useState<number | null>(null);
  
  // Initialize frequency data
  useEffect(() => {
    if (!analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    setFrequencyData(dataArray);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser]);
  
  // Animation and frequency analysis
  useEffect(() => {
    if (!isPlaying || !analyser || !frequencyData || !canvasRef.current) return;
    
    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      
      // Find dominant frequency
      if (visualMode === 'prime' && audioContext) {
        const maxIndex = findDominantFrequencyIndex(frequencyData);
        if (maxIndex !== null) {
          // Convert bin index to actual frequency
          const frequency = Math.round(maxIndex * audioContext.sampleRate / (analyser.frequencyBinCount * 2));
          setDominantFrequency(frequency);
          
          // Check if it's a prime number and notify
          if (frequency > 10 && isPrime(frequency)) {
            const now = Date.now();
            // Only notify once every 2 seconds
            if (now - lastPrimeDetectionRef.current > 2000) {
              lastPrimeDetectionRef.current = now;
              if (onPrimeDetected) {
                onPrimeDetected(frequency);
              }
            }
          }
        }
      }
      
      drawVisualizer();
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, analyser, frequencyData, visualMode, audioContext, onPrimeDetected]);
  
  const findDominantFrequencyIndex = (data: Uint8Array): number | null => {
    if (!data.length) return null;
    
    let maxValue = 0;
    let maxIndex = 0;
    
    // Skip the first few bins as they often contain noise
    for (let i = 5; i < data.length / 4; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIndex = i;
      }
    }
    
    // If signal is too weak, return null
    return maxValue > 140 ? maxIndex : null;
  };
  
  const drawVisualizer = () => {
    if (!canvasRef.current || !frequencyData) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get dimensions, accounting for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale for high DPI screens
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Update time reference for animations
    timeRef.current += 0.01;
    
    // Set visualization style
    if (layout === 'radial') {
      drawRadialVisualizer(ctx, rect.width, rect.height);
    } else if (layout === 'fluid') {
      drawFluidVisualizer(ctx, rect.width, rect.height);
    } else {
      drawVerticalBars(ctx, rect.width, rect.height);
    }
  };
  
  const drawVerticalBars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!frequencyData) return;
    
    // Use smaller number of bars for vertical display
    const barCount = Math.min(64, frequencyData.length);
    const barWidth = width / barCount;
    const barSpacing = 1;
    
    // Sample the frequency data
    const step = Math.floor(frequencyData.length / barCount);
    
    for (let i = 0; i < barCount; i++) {
      // Get the frequency value (0-255)
      const value = frequencyData[i * step];
      
      // Scale the height (make it more sensitive)
      const scaledValue = value * sensitivity;
      const barHeight = (scaledValue / 255) * height;
      
      // Choose color based on mode
      const { fillColor, glowColor } = getBarColors(i, barCount, value);
      
      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, glowColor);
      
      ctx.fillStyle = gradient;
      
      // Add glow effect for higher values
      if (value > 180) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }
      
      // Draw the bar with a wave effect for liquid geometry
      if (colorMode === 'liquid-crystal') {
        const waveOffset = Math.sin(i * 0.2 + timeRef.current * 2) * 10;
        ctx.fillRect(
          i * (barWidth + barSpacing), 
          height - barHeight + waveOffset, 
          barWidth - barSpacing, 
          barHeight - waveOffset
        );
        
        // Add water droplet effect
        if (value > 200 && i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(
            i * (barWidth + barSpacing) + barWidth/2,
            height - barHeight * 0.7,
            barWidth * 1.2,
            0, Math.PI * 2
          );
          ctx.fillStyle = glowColor + '80'; // Semi-transparent
          ctx.fill();
        }
      } else {
        // Standard bar
        ctx.fillRect(
          i * (barWidth + barSpacing), 
          height - barHeight, 
          barWidth - barSpacing, 
          barHeight
        );
      }
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }
  };
  
  const drawRadialVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!frequencyData) return;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Use more bars for radial display
    const barCount = Math.min(128, frequencyData.length);
    const angleStep = (2 * Math.PI) / barCount;
    
    // Sample the frequency data
    const step = Math.floor(frequencyData.length / barCount);
    
    // Add water-like ripple effect
    if (colorMode === 'liquid-crystal') {
      const time = timeRef.current;
      // Draw ripple circles
      for (let r = 0; r < 5; r++) {
        const rippleRadius = ((time * 0.5) % 1) * radius * (0.2 + r * 0.2);
        ctx.beginPath();
        ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - (rippleRadius/radius) * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    for (let i = 0; i < barCount; i++) {
      // Get the frequency value (0-255)
      const value = frequencyData[i * step];
      
      // Scale the height (make it more sensitive)
      const scaledValue = value * sensitivity;
      const barHeight = ((scaledValue / 255) * radius) * 0.5;
      
      // Calculate angle and positions
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * radius * 0.5;
      const y1 = centerY + Math.sin(angle) * radius * 0.5;
      const x2 = centerX + Math.cos(angle) * (radius * 0.5 + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius * 0.5 + barHeight);
      
      // Choose color based on mode
      const { fillColor, glowColor } = getBarColors(i, barCount, value);
      
      // Draw line from inner to outer edge
      ctx.beginPath();
      
      if (colorMode === 'liquid-crystal') {
        // Create sine wave pattern along the line for liquid effect
        const segments = 8;
        const segLen = barHeight / segments;
        let prevX = x1;
        let prevY = y1;
        
        for (let s = 1; s <= segments; s++) {
          const ratio = s / segments;
          const waveAmplitude = Math.min(15, value / 10);
          const waveX = Math.sin(angle * 3 + timeRef.current * 2) * waveAmplitude;
          const waveY = Math.cos(angle * 3 + timeRef.current * 2) * waveAmplitude;
          
          const currX = centerX + Math.cos(angle) * (radius * 0.5 + segLen * s) + waveX * ratio;
          const currY = centerY + Math.sin(angle) * (radius * 0.5 + segLen * s) + waveY * ratio;
          
          ctx.lineTo(currX, currY);
          prevX = currX;
          prevY = currY;
        }
        
        ctx.lineWidth = 3 + (value / 255) * 3;
        ctx.strokeStyle = fillColor;
        
        // Add water droplet effect at the end of higher-value lines
        if (value > 200) {
          ctx.stroke();
          
          ctx.beginPath();
          const bubbleSize = 5 + (value / 255) * 8;
          ctx.arc(prevX, prevY, bubbleSize, 0, Math.PI * 2);
          const bubbleGradient = ctx.createRadialGradient(
            prevX, prevY, 0,
            prevX, prevY, bubbleSize
          );
          bubbleGradient.addColorStop(0, glowColor);
          bubbleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
          ctx.fillStyle = bubbleGradient;
          
          // Add glow for the bubble
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.stroke();
        }
      } else {
        // Standard line
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 3;
        
        // Add glow for higher frequencies
        if (value > 180) {
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 10;
          ctx.strokeStyle = glowColor;
        } else {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = fillColor;
        }
        
        ctx.stroke();
      }
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Add circle for prime frequency indicators
      if (isPrime(i) && value > 140) {
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, Math.PI * 2);
        ctx.fillStyle = colorMode === 'veil-lifted' ? '#ec4899' : 
                      colorMode === 'liquid-crystal' ? '#00FFFF' : '#a855f7';
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = colorMode === 'veil-lifted' ? '#be185d' : 
                         colorMode === 'liquid-crystal' ? '#00BFFF' : '#7e22ce';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = colorMode === 'veil-lifted' ? '#ec4899' : 
                   colorMode === 'liquid-crystal' ? '#00FFFF' : '#a855f7';
    ctx.fill();
    
    // Add glow to center
    ctx.shadowColor = colorMode === 'veil-lifted' ? '#be185d' : 
                     colorMode === 'liquid-crystal' ? '#00BFFF' : '#7e22ce';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Add dominant frequency text
    if (dominantFrequency) {
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(`${dominantFrequency}Hz`, centerX, centerY + 5);
    }
  };
  
  // New fluid visualizer based on liquid living geometry concepts
  const drawFluidVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!frequencyData) return;
    
    const time = timeRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create a water-like background effect
    const grd = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width);
    grd.addColorStop(0, "rgba(0, 128, 255, 0.2)");
    grd.addColorStop(1, "rgba(0, 32, 64, 0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
    
    // Sample frequency data for visualizing as geometry
    const dataPoints = 36; // Use 36 points for hexagonal structures
    const step = Math.floor(frequencyData.length / dataPoints);
    const points: [number, number][] = [];
    
    // Calculate fluid geometry points based on audio data
    for (let i = 0; i < dataPoints; i++) {
      const angle = (i / dataPoints) * Math.PI * 2;
      const value = frequencyData[i * step] || 0;
      const normalizedValue = value / 255;
      
      // Base radius with variation from audio
      const radius = (Math.min(width, height) * 0.35) * 
        (0.6 + normalizedValue * 0.4 + Math.sin(angle * 6 + time) * 0.1);
      
      // Add points with fluid wave patterns
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      points.push([x, y]);
    }
    
    // Draw the main fluid shape
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i][0] + points[i - 1][0]) / 2;
      const yc = (points[i][1] + points[i - 1][1]) / 2;
      ctx.quadraticCurveTo(points[i - 1][0], points[i - 1][1], xc, yc);
    }
    
    // Close the path
    const xc = (points[0][0] + points[points.length - 1][0]) / 2;
    const yc = (points[0][1] + points[points.length - 1][1]) / 2;
    ctx.quadraticCurveTo(points[points.length - 1][0], points[points.length - 1][1], xc, yc);
    
    // Create gradient fill
    const avgAmplitude = Array.from(frequencyData).reduce((sum, val) => sum + val, 0) / 
      frequencyData.length / 255;
    
    const fillGradient = ctx.createRadialGradient(
      centerX, centerY, 10,
      centerX, centerY, width / 2
    );
    
    // Colors based on liquid crystal theme
    fillGradient.addColorStop(0, `rgba(64, 224, 208, ${0.3 + avgAmplitude * 0.4})`); // Turquoise core
    fillGradient.addColorStop(0.5, `rgba(0, 128, 255, ${0.2 + avgAmplitude * 0.3})`); // Blue mid
    fillGradient.addColorStop(1, `rgba(138, 43, 226, ${0.1 + avgAmplitude * 0.2})`); // Purple edge
    
    ctx.fillStyle = fillGradient;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    
    // Draw a crystalline border
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + avgAmplitude * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    
    // Draw hexagonal patterns throughout the fluid
    const hexCount = Math.floor(5 + avgAmplitude * 8);
    
    for (let h = 0; h < hexCount; h++) {
      // Get a position within the fluid shape
      const anglePos = Math.random() * Math.PI * 2;
      const radiusPos = Math.random() * (width * 0.3);
      const hexX = centerX + Math.cos(anglePos) * radiusPos;
      const hexY = centerY + Math.sin(anglePos) * radiusPos;
      const hexSize = 5 + Math.random() * 20;
      
      // Draw the hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const hexAngle = (i / 6) * Math.PI * 2;
        const hx = hexX + Math.cos(hexAngle) * hexSize;
        const hy = hexY + Math.sin(hexAngle) * hexSize;
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      
      // Use semi-transparent fill for crystal effect
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
    
    // Draw connection lines between points for crystal lattice effect
    if (avgAmplitude > 0.4) {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          // Only connect points that are close enough but not too close
          const dx = points[i][0] - points[j][0];
          const dy = points[i][1] - points[j][1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < width * 0.3 && distance > width * 0.1) {
            // Fade lines based on distance
            const opacity = 0.1 * (1 - (distance / (width * 0.3)));
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            
            ctx.moveTo(points[i][0], points[i][1]);
            ctx.lineTo(points[j][0], points[j][1]);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw floating light points representing water memory
    const particleCount = Math.floor(20 + avgAmplitude * 40);
    
    for (let p = 0; p < particleCount; p++) {
      const pAngle = (p / particleCount) * Math.PI * 2 + time;
      const pRadius = width * 0.2 * (0.7 + Math.sin(pAngle * 3 + time * 2) * 0.3);
      
      const px = centerX + Math.cos(pAngle) * pRadius;
      const py = centerY + Math.sin(pAngle) * pRadius;
      const size = 1 + Math.random() * 3;
      
      // Create small glowing particles
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.6})`;
      
      // Add glow to particles
      ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    // Display frequency text if available
    if (dominantFrequency) {
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(`${dominantFrequency}Hz - Living Geometry`, centerX, height - 20);
    }
  };
  
  const getBarColors = (index: number, barCount: number, value: number) => {
    if (colorMode === 'veil-lifted') {
      return {
        fillColor: `rgba(236, 72, 153, ${Math.min(0.7, value / 255 + 0.2)})`,
        glowColor: `rgba(219, 39, 119, ${Math.min(0.9, value / 255 + 0.4)})`
      };
    } else if (colorMode === 'liquid-crystal') {
      // Special liquid crystal palette with blues and cyans
      const hue = 180 + (index / barCount * 60); // Range from cyan to blue
      return {
        fillColor: `hsla(${hue}, 100%, ${60 + value * 0.1}%, ${Math.min(0.7, value / 255 + 0.2)})`,
        glowColor: `hsla(${hue}, 100%, ${70 + value * 0.1}%, ${Math.min(0.9, value / 255 + 0.4)})`
      };
    } else if (colorMode === 'chakra' && chakraColor) {
      // Chakra-specific colors
      switch(chakraColor) {
        case 'root':
          return {
            fillColor: `rgba(255, 0, 0, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(220, 0, 0, ${Math.min(0.9, value / 255 + 0.4)})`
          };
        case 'sacral':
          return {
            fillColor: `rgba(255, 128, 0, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(230, 100, 0, ${Math.min(0.9, value / 255 + 0.4)})`
          };
        case 'solar-plexus':
          return {
            fillColor: `rgba(255, 255, 0, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(230, 230, 0, ${Math.min(0.9, value / 255 + 0.4)})`
          };
        case 'heart':
          return {
            fillColor: `rgba(0, 255, 0, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(0, 220, 0, ${Math.min(0.9, value / 255 + 0.4)})`
          };
        case 'throat':
          return {
            fillColor: `rgba(0, 191, 255, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(0, 170, 230, ${Math.min(0.9, value / 255 + 0.4)})`
          };
        case 'third-eye':
          return {
            fillColor: `rgba(75, 0, 130, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(60, 0, 110, ${Math.min(0.9, value / 255 + 0.4)})`
          };
        case 'crown':
        default:
          return {
            fillColor: `rgba(138, 43, 226, ${Math.min(0.7, value / 255 + 0.2)})`,
            glowColor: `rgba(120, 30, 200, ${Math.min(0.9, value / 255 + 0.4)})`
          };
      }
    } else {
      // Standard gradient based on index position
      const hue = index / barCount * 270; // Purple-ish range
      return {
        fillColor: `hsla(${hue}, 80%, 70%, ${Math.min(0.7, value / 255 + 0.2)})`,
        glowColor: `hsla(${hue}, 90%, 60%, ${Math.min(0.9, value / 255 + 0.4)})`
      };
    }
  };
  
  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPlaying ? 1 : 0.6 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default PrimeAudioVisualizer;
