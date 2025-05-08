
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
      // Normalize and clamp parameter values for better visual stability
      // Using verified spiral parameters that form proper sacred geometry
      const coeffA = Math.min(Math.max(params.coeffA || 1.2, 0.5), 2);
      const coeffB = Math.min(Math.max(params.coeffB || 0.9, 0.5), 2);
      const coeffC = Math.min(Math.max(params.coeffC || 0.6, 0.2), 2);
      
      // Clamp frequency values to prevent chaotic behavior
      const freqA = Math.min(Math.max(params.freqA || 4.1, 1), 8);
      const freqB = Math.min(Math.max(params.freqB || 3.6, 1), 8);
      const freqC = Math.min(Math.max(params.freqC || 2.8, 1), 8);
      
      const color = params.color || '180,180,255';
      const opacity = params.opacity || 80;
      const strokeW = params.strokeWeight || 0.5;
      // Maximum cycles to prevent infinite growth
      const maxCycles = params.maxCycles || 5;
      
      // Extremely slow speed for deliberate, meditative unfolding
      const speed = params.speed ? Math.min(params.speed, 0.0005) : 0.0003;
      
      // Variables for rendering
      let angle = 0;
      let trailPoints: Array<{x: number, y: number, opacity: number}> = [];
      const maxTrailPoints = 300;
      
      // Background gradient properties
      let bgGradientInner = p.color(5, 0, 20, 255);
      let bgGradientOuter = p.color(0, 0, 10, 255);

      p.setup = () => {
        console.log("SpiralVisualizer - Setting up canvas with dimensions:", 
          containerRef.current?.clientWidth, 
          containerRef.current?.clientHeight
        );
        
        // Get the container dimensions or use window dimensions
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        const canvas = p.createCanvas(width, height);
        p.background(0);
        p.frameCount = 0; // Reset frame count for consistent animation
        
        // Initialize trail points array
        trailPoints = [];
        
        console.log("SpiralVisualizer - Canvas created with dimensions:", width, height);
      };

      // Draw gradient background
      const drawBackground = () => {
        p.push();
        p.translate(p.width / 2, p.height / 2);
        
        // Create a radial gradient
        for (let i = 0; i < 100; i++) {
          const inter = p.map(i, 0, 100, 0, 1);
          const c = p.lerpColor(bgGradientInner, bgGradientOuter, inter);
          const size = p.map(i, 0, 100, p.width * 1.5, 0);
          p.fill(c);
          p.noStroke();
          p.ellipse(0, 0, size, size);
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
        
        // Use gentle sine wave for 3D rotation effect - SIGNIFICANTLY REDUCED
        const rotationAmount = p.sin(p.frameCount * 0.002) * 0.05;
        p.rotate(rotationAmount);
        
        // Use subtle scaling - reduced intensity
        const scaleFactor = 0.95 + 0.05 * p.sin(p.frameCount * 0.005);
        p.scale(scaleFactor * 6); // Maintain reasonable overall scale
        
        // Apply blending for glow effect
        p.blendMode(p.ADD);
        
        // Draw glow base - reduced intensity
        p.stroke(p.color(`rgba(${color},0.1)`));
        p.strokeWeight(strokeW * 3);
        for (let i = 0; i < trailPoints.length - 1; i++) {
          if (trailPoints[i] && trailPoints[i+1]) {
            const point = trailPoints[i];
            p.stroke(p.color(`rgba(${color},${point.opacity * 0.08})`));
            p.point(point.x, point.y);
          }
        }
        
        // Draw trails with decreasing opacity
        for (let i = 0; i < trailPoints.length; i++) {
          if (trailPoints[i]) {
            const point = trailPoints[i];
            const alpha = point.opacity * (0.4 + 0.3 * pulseValue);
            p.stroke(p.color(`rgba(${color},${alpha})`));
            p.strokeWeight(strokeW * (0.8 + 0.2 * pulseValue)); // Reduced variance
            p.point(point.x, point.y);
          }
        }
        
        // Draw spiral points - always start from center (0,0)
        if (angle < p.TWO_PI * maxCycles) {
          // Calculate the next point using the parametric equation
          const re = coeffA * p.cos(freqA * angle) + 
                    coeffB * p.cos(freqB * angle) + 
                    coeffC * p.cos(freqC * angle);
          const im = coeffA * p.sin(freqA * angle) + 
                    coeffB * p.sin(freqB * angle) + 
                    coeffC * p.sin(freqC * angle);
          
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
            trailPoints[j].opacity *= 0.995; // Slower fade
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
