import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { isPrime, analyzeFrequency } from '@/lib/primeUtils';
import { getChakraColorScheme, getChakraGradient } from '@/lib/chakraColors';

interface PrimePulseVisualizerProps {
  analyzerNode?: AnalyserNode | null;
  isPlaying?: boolean;
  frequencies?: number[];
  chakras?: string[];
  visualTheme?: string;
}

const PrimePulseVisualizer: React.FC<PrimePulseVisualizerProps> = ({
  analyzerNode,
  isPlaying = false,
  frequencies = [432],
  chakras = ["Crown"],
  visualTheme = "gentle-waves"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { liftTheVeil } = useTheme();
  
  // Convert frequencies to numbers if they're strings
  const numericFrequencies = useMemo(() => {
    return frequencies.map(f => typeof f === 'string' ? parseFloat(f) : f);
  }, [frequencies]);
  
  // Get base color scheme
  const colorScheme = useMemo(() => {
    // First try to get colors based on visualTheme
    if (visualTheme && visualTheme !== 'default') {
      const themeKey = visualTheme.replace(/-/g, '');
      const themeColors = getChakraColorScheme([themeKey]);
      if (themeColors) return themeColors;
    }
    
    // Fall back to chakra colors
    return getChakraColorScheme(chakras);
  }, [chakras, visualTheme]);

  // Effect for visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Prepare frequency data if analyzer is available
    const bufferLength = analyzerNode?.frequencyBinCount || 0;
    const dataArray = new Uint8Array(bufferLength);
    
    // Animation variables
    let time = 0;
    const circles: Array<{
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      frequency: number;
      isPrime: boolean;
      color: string;
      phase: number;
    }> = [];
    
    // Initialize circles based on frequencies
    const initCircles = () => {
      circles.length = 0;
      const width = canvas.width;
      const height = canvas.height;
      
      // Create circles for each frequency
      numericFrequencies.forEach((freq, index) => {
        const { isPrime: isPrimeFreq } = analyzeFrequency(freq, 3);
        
        // Position in a kind of flower pattern
        const angle = (index / numericFrequencies.length) * Math.PI * 2;
        const distance = Math.min(width, height) * 0.25;
        const x = width / 2 + Math.cos(angle) * distance;
        const y = height / 2 + Math.sin(angle) * distance;
        
        // Calculate base radius based on frequency
        const baseRadius = Math.max(10, Math.min(50, freq / 20));
        
        // Get color based on frequency and whether it's prime
        let color;
        if (isPrimeFreq) {
          // Bright gold for prime frequencies
          color = liftTheVeil ? '#ffeb3b' : '#ffd700';
        } else {
          // Use color from chakra or theme
          const chakraIndex = index % chakras.length;
          const chakraName = chakras[chakraIndex]?.replace(/\s+/g, '');
          color = getChakraColorScheme([chakraName]).primary;
        }
        
        circles.push({
          x,
          y,
          radius: baseRadius,
          baseRadius,
          frequency: freq,
          isPrime: isPrimeFreq,
          color,
          phase: Math.random() * Math.PI * 2
        });
      });
      
      // Always add a central circle
      circles.push({
        x: width / 2,
        y: height / 2,
        radius: 50,
        baseRadius: 50,
        frequency: numericFrequencies[0] || 432,
        isPrime: false,
        color: colorScheme.primary,
        phase: 0
      });
    };
    
    initCircles();
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      
      // Update frequency data if playing
      if (isPlaying && analyzerNode) {
        analyzerNode.getByteFrequencyData(dataArray);
      }
      
      // Draw background
      ctx.fillStyle = liftTheVeil ? '#100015' : colorScheme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines first (behind circles)
      ctx.strokeStyle = liftTheVeil ? 'rgba(255, 235, 59, 0.3)' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          const c1 = circles[i];
          const c2 = circles[j];
          
          // Only connect prime circles or the center circle
          if ((c1.isPrime || c2.isPrime || i === circles.length - 1 || j === circles.length - 1)) {
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c2.x, c2.y);
          }
        }
      }
      ctx.stroke();
      
      // Draw each circle
      circles.forEach((circle, index) => {
        // Modify radius based on audio data or animation
        let radiusModifier = 1;
        
        if (isPlaying && analyzerNode && dataArray.length) {
          // Map frequency to dataArray index
          const dataIndex = Math.floor(circle.frequency / 22050 * bufferLength);
          if (dataIndex < dataArray.length) {
            radiusModifier = 1 + dataArray[dataIndex] / 128;
          }
        } else {
          // Gentle pulsing when not playing
          radiusModifier = 1 + 0.2 * Math.sin(time * 2 + circle.phase);
        }
        
        // Update radius
        circle.radius = circle.baseRadius * radiusModifier;
        
        // Draw glow for prime numbers
        if (circle.isPrime) {
          ctx.save();
          const glowSize = circle.radius * 1.5;
          
          // Create radial gradient for glow
          const gradient = ctx.createRadialGradient(
            circle.x, circle.y, circle.radius * 0.5,
            circle.x, circle.y, glowSize
          );
          
          gradient.addColorStop(0, liftTheVeil ? 'rgba(255, 235, 59, 0.7)' : 'rgba(255, 215, 0, 0.7)');
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        // Draw the circle
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add ringed effect for prime frequencies
        if (circle.isPrime) {
          ctx.strokeStyle = liftTheVeil ? '#ffffff' : '#ffd700';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Add a second ring
          ctx.strokeStyle = liftTheVeil ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 215, 0, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.radius * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Draw frequency label for larger circles
        if (circle.baseRadius > 15) {
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = `${Math.max(10, circle.radius/3)}px sans-serif`;
          ctx.fillText(`${Math.round(circle.frequency)}Hz`, circle.x, circle.y);
        }
      });
      
      // Draw connection from center to mouse on hover
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Find nearest circle
        let closestDist = Infinity;
        let closestCircle = null;
        
        circles.forEach(circle => {
          const dx = mouseX - circle.x;
          const dy = mouseY - circle.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < closestDist) {
            closestDist = dist;
            closestCircle = circle;
          }
        });
        
        // Draw connection if mouse is close enough to any circle
        if (closestCircle && closestDist < 100) {
          ctx.strokeStyle = liftTheVeil ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(circles[circles.length - 1].x, circles[circles.length - 1].y);
          ctx.lineTo(closestCircle.x, closestCircle.y);
          ctx.stroke();
          
          // Show frequency tooltip
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.beginPath();
          ctx.roundRect(mouseX + 10, mouseY - 30, 100, 25, 5);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.font = '12px sans-serif';
          ctx.fillText(`${Math.round(closestCircle.frequency)}Hz`, mouseX + 15, mouseY - 17.5);
          
          if (closestCircle.isPrime) {
            ctx.fillText('(Prime)', mouseX + 60, mouseY - 17.5);
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start the animation
    draw();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [analyzerNode, isPlaying, numericFrequencies, chakras, colorScheme, liftTheVeil, visualTheme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded-lg"
    />
  );
};

export default PrimePulseVisualizer;
