
import React, { useRef, useEffect } from 'react';
import { VisualizationSettings, AudioAnalysisResult } from '@/types/visualization';
import {
  getFlowerOfLifePoints,
  getFibonacciSpiralPoints,
  getPrimeSpiralPoints,
  getMetatronsCubePoints,
  chakraFrequencyToColor,
  frequencyToColor,
  getCosmicGradient
} from '@/utils/visualizationMath';

interface SacredGrid2DVisualizerProps {
  width: number | string;
  height: number | string;
  settings: VisualizationSettings;
  audioAnalysis: AudioAnalysisResult;
  className?: string;
}

const SacredGrid2DVisualizer: React.FC<SacredGrid2DVisualizerProps> = ({
  width,
  height,
  settings,
  audioAnalysis,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  
  // Set up and draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      const targetWidth = typeof width === 'number' 
        ? width 
        : parent ? parent.clientWidth : window.innerWidth;
      const targetHeight = typeof height === 'number' 
        ? height 
        : parent ? parent.clientHeight : window.innerHeight;
      
      // Update canvas size if needed
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    };
    
    updateCanvasSize();
    
    // Add resize listener
    const handleResize = () => {
      updateCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const draw = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update rotation based on settings speed and audio activity
      const rotationSpeed = settings.speed * 0.005 * (audioAnalysis.isActive ? 1 : 0.2);
      rotationRef.current += rotationSpeed;
      
      // Draw background
      ctx.fillStyle = getCosmicGradient(ctx, canvas.width, canvas.height, settings.colorTheme);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scale based on audio amplitude
      const baseScale = Math.min(canvas.width, canvas.height) / 3;
      const dynamicScale = baseScale * (1 + audioAnalysis.amplitude * 0.3);
      
      // Get center coordinates
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Apply global rotation
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);
      ctx.translate(-centerX, -centerY);
      
      // Draw active shapes
      if (settings.activeShapes.includes('flower-of-life')) {
        drawFlowerOfLife(ctx, centerX, centerY, dynamicScale * 0.2);
      }
      
      if (settings.activeShapes.includes('metatron-cube')) {
        drawMetatronsCube(ctx, centerX, centerY, dynamicScale * 0.7);
      }
      
      if (settings.activeShapes.includes('prime-spiral')) {
        drawPrimeSpiral(ctx, centerX, centerY, dynamicScale * 0.02);
      }
      
      if (settings.activeShapes.includes('fibonacci-spiral')) {
        drawFibonacciSpiral(ctx, centerX, centerY, dynamicScale * 0.02);
      }
      
      // Restore context
      ctx.restore();
      
      // Draw mirror effects if enabled
      if (settings.mirrorEnabled) {
        drawMirrorEffects(ctx, canvas.width, canvas.height);
      }
      
      // Request next frame
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Draw Flower of Life pattern
    const drawFlowerOfLife = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number
    ) => {
      const circles = getFlowerOfLifePoints(
        centerX,
        centerY,
        radius,
        Math.max(1, Math.floor(settings.symmetry / 2))
      );
      
      // Get color based on audio analysis
      const baseColor = settings.chakraAlignmentMode
        ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
        : frequencyToColor(audioAnalysis.dominantFrequency);
        
      // Generate a glow effect based on amplitude
      const glowIntensity = 5 + (audioAnalysis.amplitude * 15);
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = glowIntensity * settings.brightness;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 1 + (audioAnalysis.amplitude * 2);
      
      // Draw each circle
      circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      // Reset shadow
      ctx.shadowBlur = 0;
    };
    
    // Draw Metatron's Cube
    const drawMetatronsCube = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number
    ) => {
      const { vertices, lines } = getMetatronsCubePoints(centerX, centerY, radius);
      
      // Get color based on audio analysis or frequency band
      const baseColor = settings.chakraAlignmentMode
        ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
        : frequencyToColor(audioAnalysis.dominantFrequency);
      
      // Generate a glow effect based on amplitude
      const glowIntensity = 5 + (audioAnalysis.amplitude * 15);
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = glowIntensity * settings.brightness;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 1.5 + (audioAnalysis.amplitude * 1.5);
      
      // Draw the lines
      lines.forEach(line => {
        const start = vertices[line[0]];
        const end = vertices[line[1]];
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });
      
      // Draw vertices as small circles
      ctx.fillStyle = baseColor;
      vertices.forEach(vertex => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 2 + (audioAnalysis.amplitude * 3), 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Reset shadow
      ctx.shadowBlur = 0;
    };
    
    // Draw Prime Spiral
    const drawPrimeSpiral = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      scale: number
    ) => {
      // Calculate prime points
      const points = getPrimeSpiralPoints(
        centerX, 
        centerY, 
        scale, 
        Math.max(50, Math.min(500, Math.floor(audioAnalysis.amplitude * 300) + 100))
      );
      
      // Set color and glow based on audio analysis
      const baseColor = settings.chakraAlignmentMode
        ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
        : '#FFD700'; // Gold color for primes
      
      const glowIntensity = 5 + (audioAnalysis.amplitude * 15);
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = glowIntensity * settings.brightness;
      
      // Draw spiral connecting all points
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
      }
      
      // Draw prime number points with larger dots
      ctx.fillStyle = baseColor;
      
      points.forEach(point => {
        if (point.isPrime) {
          const dotSize = 3 + (audioAnalysis.amplitude * 3);
          ctx.beginPath();
          ctx.arc(point.x, point.y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Reset shadow
      ctx.shadowBlur = 0;
    };
    
    // Draw Fibonacci Spiral
    const drawFibonacciSpiral = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      scale: number
    ) => {
      // Calculate spiral points
      const points = getFibonacciSpiralPoints(
        centerX, 
        centerY, 
        scale, 
        Math.max(50, Math.min(300, Math.floor(audioAnalysis.amplitude * 200) + 50))
      );
      
      // Set color and glow based on audio analysis
      const baseColor = settings.chakraAlignmentMode
        ? chakraFrequencyToColor(audioAnalysis.dominantFrequency)
        : '#9c27b0'; // Purple color for fibonacci
      
      const glowIntensity = 5 + (audioAnalysis.amplitude * 15);
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = glowIntensity * settings.brightness;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 1.5 + (audioAnalysis.amplitude * 1.5);
      
      // Draw spiral
      ctx.beginPath();
      
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
      }
      
      // Reset shadow
      ctx.shadowBlur = 0;
    };
    
    // Draw mirror effects
    const drawMirrorEffects = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      // Create a mirrored copy of the current canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) return;
      
      // Copy current canvas
      tempCtx.drawImage(canvas, 0, 0);
      
      // Set composite operation for interesting effects
      ctx.globalCompositeOperation = 'screen';
      
      // Draw mirrored versions with lower opacity
      const mirrorOpacity = 0.3 + (audioAnalysis.amplitude * 0.2);
      ctx.globalAlpha = mirrorOpacity;
      
      // Horizontal mirror
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
      
      // Vertical mirror
      ctx.save();
      ctx.translate(0, height);
      ctx.scale(1, -1);
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
      
      // Reset composite operation and opacity
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      // Clean up
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, settings, audioAnalysis]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`sacred-grid-canvas ${className || ''}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default SacredGrid2DVisualizer;
