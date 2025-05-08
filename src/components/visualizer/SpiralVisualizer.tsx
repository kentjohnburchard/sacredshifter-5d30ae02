
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
      const coeffA = params.coeffA;
      const coeffB = params.coeffB;
      const coeffC = params.coeffC;
      const freqA = params.freqA;
      const freqB = params.freqB;
      const freqC = params.freqC;
      const color = params.color || '255,255,0';
      const opacity = params.opacity || 100;
      const strokeW = params.strokeWeight || 0.5;
      const maxCycles = params.maxCycles || 5;
      const speed = params.speed || 0.001;
      
      // New variables for enhanced effects
      let t = 0;
      let zRotation = 0;
      let trailPoints: Array<{x: number, y: number, opacity: number}> = [];
      const maxTrailPoints = 300;
      let hueOffset = 0;
      let pulseValue = 0;
      
      // Background gradient properties
      let bgGradientInner = p.color(0, 0, 20, 255);
      let bgGradientOuter = p.color(0, 0, 0, 255);

      p.setup = () => {
        console.log("SpiralVisualizer - Setting up canvas with dimensions:", 
          containerRef.current?.clientWidth, 
          containerRef.current?.clientHeight
        );
        
        // Get the container dimensions or use window dimensions for fullscreen
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        const canvas = p.createCanvas(width, height);
        p.background(0);
        p.blendMode(p.BLEND);
        p.strokeWeight(strokeW);
        p.noFill();
        
        // Initialize trail points array
        trailPoints = [];
        
        console.log("SpiralVisualizer - Canvas created with dimensions:", width, height);
      };

      // Draw gradient background
      const drawBackground = () => {
        p.push();
        p.blendMode(p.BLEND);
        
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
        
        // Update the pulse effect values
        pulseValue = (p.sin(p.frameCount * 0.02) + 1) * 0.5; // 0 to 1 sine wave
        hueOffset = (hueOffset + 0.2) % 360; // Slowly rotate hue
        
        // Prepare for drawing the spiral
        p.push();
        p.translate(p.width / 2, p.height / 2);
        
        // Create 3D rotation effect
        zRotation += 0.001;
        const scaleFactorX = 0.9 + 0.1 * p.sin(zRotation);
        const scaleFactorY = 0.9 + 0.1 * p.cos(zRotation);
        p.scale(scaleFactorX * 6, scaleFactorY * 6); // Increased scale to fill screen better
        
        // Apply blending for glow effect
        p.blendMode(p.ADD);
        
        // Draw glow base
        p.stroke(p.color(`rgba(${color},0.2)`));
        p.strokeWeight(strokeW * 5);
        for (let i = 0; i < trailPoints.length - 1; i++) {
          if (trailPoints[i] && trailPoints[i+1]) {
            const point = trailPoints[i];
            p.stroke(p.color(`rgba(${color},${point.opacity * 0.1})`));
            p.point(point.x, point.y);
          }
        }
        
        // Draw trails with decreasing opacity
        for (let i = 0; i < trailPoints.length; i++) {
          if (trailPoints[i]) {
            const point = trailPoints[i];
            const alpha = point.opacity * (0.5 + 0.5 * pulseValue);
            p.stroke(p.color(`rgba(${color},${alpha})`));
            p.strokeWeight(strokeW * (0.8 + 0.4 * pulseValue));
            p.point(point.x, point.y);
          }
        }
        
        // Draw the current point of the spiral with full opacity
        // Draw multiple points per frame for faster rendering
        for (let i = 0; i < 10; i++) {
          const re = coeffA * p.cos(freqA * t) + 
                    coeffB * p.cos(freqB * t) + 
                    coeffC * p.cos(freqC * t);
          const im = coeffA * p.sin(freqA * t) + 
                    coeffB * p.sin(freqB * t) + 
                    coeffC * p.sin(freqC * t);
          
          // Animate stroke weight slightly based on sine wave
          const dynamicStrokeWeight = strokeW * (1 + 0.3 * p.sin(t * 5));
          p.strokeWeight(dynamicStrokeWeight);
          
          // Dynamic color with subtle hue variation
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
          
          // Reduce opacity of all trail points slightly
          for (let j = 0; j < trailPoints.length; j++) {
            trailPoints[j].opacity *= 0.99;
          }
          
          t += speed; // Smaller step for smoother lines
          
          // Stop after specified number of complete cycles
          if (t > p.TWO_PI * maxCycles) {
            p.noLoop();
            break;
          }
        }
        
        p.pop();
      };

      p.windowResized = () => {
        // Get the new dimensions of the container or use window dimensions for fullscreen
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
