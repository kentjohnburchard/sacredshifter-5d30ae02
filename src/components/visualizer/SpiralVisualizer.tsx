
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

export interface SpiralParams {
  coeffA: number;
  coeffB: number;
  coeffC: number;
  freqA: number;
  freqB: number;
  freqC: number;
  color?: string;
  opacity?: number;
  strokeWeight?: number;
  maxCycles?: number;
  speed?: number;
}

interface SpiralVisualizerProps {
  params: SpiralParams;
  containerId?: string;
  className?: string;
}

const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({ 
  params, 
  containerId = "spiralContainer",
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing p5 instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    console.log("SpiralVisualizer - Creating new p5 instance with params:", params);
    console.log("SpiralVisualizer - Container ID:", containerId);

    const sketch = (p: p5) => {
      // Normalize sacred geometry parameters - using golden ratio influenced values
      // These values are carefully selected to create harmonic, balanced spirals
      const coeffA = Math.min(Math.max(params.coeffA || 1.618, 0.5), 3); // Golden ratio influence
      const coeffB = Math.min(Math.max(params.coeffB || 1, 0.5), 3);
      const coeffC = Math.min(Math.max(params.coeffC || 0.618, 0.2), 2); // Inverse golden ratio
      
      // Use moderate frequency values for elegant spiral formation
      const freqA = Math.min(Math.max(params.freqA || 3.14, 1), 6); // Pi influence
      const freqB = Math.min(Math.max(params.freqB || 2.618, 1), 6); // Golden ratio × 1.618
      const freqC = Math.min(Math.max(params.freqC || 1.618, 1), 5); // Golden ratio
      
      const color = params.color || '180,180,255'; // Default blue
      const opacity = params.opacity || 80;
      const strokeW = params.strokeWeight || 0.8; // Slightly thicker for visibility
      
      // Maximum cycles controls how many revolutions the spiral completes
      const maxCycles = params.maxCycles || 8; // More cycles for fuller spiral
      
      // Extremely slow speed for meditative unfolding
      const speed = params.speed ? Math.min(params.speed, 0.0006) : 0.0003;
      
      // Scale factor to ensure spiral fills appropriate screen space
      let scaleFactor = 1;
      
      // Variables for rendering
      let angle = 0;
      let trailPoints: Array<{x: number, y: number, opacity: number}> = [];
      const maxTrailPoints = 1000; // Increased for smoother trails
      
      // Background gradient properties
      let bgGradientInner = p.color(5, 0, 20, 255);
      let bgGradientOuter = p.color(0, 0, 10, 255);
      
      // Variables to control spiral growth
      let currentScale = 0.1; // Start small
      let targetScale = 6; // Grow to this size
      let scalingSpeed = 0.01; // Speed of growth

      p.setup = () => {
        console.log("SpiralVisualizer - Setting up canvas with dimensions:", 
          containerRef.current?.clientWidth, 
          containerRef.current?.clientHeight
        );
        
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        const canvas = p.createCanvas(width, height);
        
        // Reset important values for clean start
        p.background(0);
        p.frameCount = 0;
        angle = 0;
        trailPoints = [];
        currentScale = 0.1;
        
        // Calculate appropriate scale factor based on canvas size
        // This ensures spiral fills 50-80% of the screen as requested
        const minDimension = Math.min(width, height);
        scaleFactor = minDimension / 400; // Base scale on canvas size
        targetScale = scaleFactor * 5;
        
        console.log("SpiralVisualizer - Canvas created with dimensions:", width, height);
        console.log("SpiralVisualizer - Scale factor:", scaleFactor, "Target scale:", targetScale);
      };

      // Draw gradient background
      const drawBackground = () => {
        p.push();
        
        // Create a radial gradient
        for (let i = 0; i < 100; i++) {
          const inter = p.map(i, 0, 100, 0, 1);
          const c = p.lerpColor(bgGradientInner, bgGradientOuter, inter);
          const size = p.map(i, 0, 100, p.width * 1.5, 0);
          p.fill(c);
          p.noStroke();
          p.ellipse(p.width / 2, p.height / 2, size, size);
        }
        
        p.pop();
      };

      p.draw = () => {
        // Draw gradient background first
        drawBackground();
        
        // Use gentle sine wave for subtle pulsing
        const pulseValue = (p.sin(p.frameCount * 0.01) + 1) * 0.5; // 0 to 1 sine wave, slower
        
        // Center everything on the canvas
        p.push();
        p.translate(p.width / 2, p.height / 2);
        
        // Very gentle rotation for 3D feel - significantly reduced
        const rotationAmount = p.sin(p.frameCount * 0.0008) * 0.03;
        p.rotate(rotationAmount);
        
        // Gradually increase scale to create growth effect
        if (currentScale < targetScale) {
          currentScale += (targetScale - currentScale) * scalingSpeed;
        }
        
        // Scale the spiral to fill the screen appropriately
        p.scale(currentScale);
        
        // Apply blending for glow effect
        p.blendMode(p.ADD);
        
        // Draw glow base with reduced intensity
        p.stroke(p.color(`rgba(${color},0.05)`));
        p.strokeWeight(strokeW * 3);
        for (let i = 0; i < trailPoints.length - 1; i++) {
          if (trailPoints[i] && trailPoints[i+1]) {
            const point = trailPoints[i];
            p.stroke(p.color(`rgba(${color},${point.opacity * 0.05})`));
            p.point(point.x, point.y);
          }
        }
        
        // Draw trails with decreasing opacity
        for (let i = 0; i < trailPoints.length; i++) {
          if (trailPoints[i]) {
            const point = trailPoints[i];
            const alpha = point.opacity * (0.3 + 0.2 * pulseValue);
            p.stroke(p.color(`rgba(${color},${alpha})`));
            p.strokeWeight(strokeW * (0.8 + 0.1 * pulseValue)); // Reduced variance
            p.point(point.x, point.y);
          }
        }
        
        // Draw spiral points - always start from center (0,0)
        if (angle < p.TWO_PI * maxCycles) {
          // Use logarithmic spiral formula for more elegant growth
          // r = a * e^(b * theta)
          const radius = 0.2 * p.exp(0.1 * angle);

          // Calculate point using the parametric equation with natural growth
          const re = radius * (
            coeffA * p.cos(freqA * angle) + 
            coeffB * p.cos(freqB * angle) + 
            coeffC * p.cos(freqC * angle)
          );
          
          const im = radius * (
            coeffA * p.sin(freqA * angle) + 
            coeffB * p.sin(freqB * angle) + 
            coeffC * p.sin(freqC * angle)
          );
          
          // Slightly vary stroke weight for organic feel
          const dynamicStrokeWeight = strokeW * (1 + 0.1 * p.sin(angle * 3));
          p.strokeWeight(dynamicStrokeWeight);
          
          // Use consistent color with subtle variation
          const baseColor = p.color(`rgba(${color},${opacity/100})`);
          p.stroke(baseColor);
          p.point(re, im);
          
          // Add point to trail with current opacity
          trailPoints.push({
            x: re,
            y: im,
            opacity: opacity/100
          });
          
          // Remove oldest point if we exceed max trail length
          if (trailPoints.length > maxTrailPoints) {
            trailPoints.shift();
          }
          
          // Slowly fade trail points
          for (let j = 0; j < trailPoints.length; j++) {
            trailPoints[j].opacity *= 0.998; // Slower fade
          }
          
          // CRITICAL: Use much slower increment for angle
          angle += speed;
        }
        
        p.pop();
      };

      p.windowResized = () => {
        // Get the new dimensions of the container
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        p.resizeCanvas(width, height);
        console.log("SpiralVisualizer - Canvas resized to:", width, height);
        
        // Recalculate scale factor on resize
        const minDimension = Math.min(width, height);
        scaleFactor = minDimension / 400;
        targetScale = scaleFactor * 5;
        
        // Redraw background on resize
        drawBackground();
      };
    };

    // Create new p5 instance
    p5InstanceRef.current = new p5(sketch, containerRef.current);

    // Cleanup on component unmount
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [params, containerId]);

  return (
    <div 
      id={containerId}
      ref={containerRef} 
      className={`absolute inset-0 w-full h-full z-10 bg-black ${className}`}
      aria-hidden="true"
      style={{ minHeight: '100%', minWidth: '100%' }}
    />
  );
};

export default SpiralVisualizer;
