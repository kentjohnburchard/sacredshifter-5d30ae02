
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
      // Basic logarithmic spiral parameters - MUCH larger initial values
      const a = 5.0;        // Initial size factor - significantly increased
      const b = 0.15;       // Growth rate - golden ratio influenced
      
      // Visual styling parameters
      const color = params.color || '180,180,255'; // Default blue
      const opacity = params.opacity || 85;        // Increased opacity
      const strokeW = params.strokeWeight || 1.5;  // Thicker stroke for better visibility
      
      // Maximum angle controls how many revolutions the spiral completes
      const maxAngle = params.maxCycles ? p.TWO_PI * params.maxCycles : p.TWO_PI * 16;
      
      // Fast initial speed - we want to see the spiral quickly
      const speed = params.speed ? Math.min(params.speed, 0.03) : 0.02;
      
      // Trail points for the glowing effect
      let trailPoints: Array<{x: number, y: number, opacity: number}> = [];
      const maxTrailPoints = 1500; // More points for smoother trails
      
      // Variables for rendering
      let angle = 0;
      let currentScale = 0.8;  // Start much larger
      let targetScale = 10;    // Grow to a much larger size
      let scalingSpeed = 0.025; // Faster growth speed
      
      // Background gradient properties
      let bgGradientInner = p.color(5, 0, 20, 255);
      let bgGradientOuter = p.color(0, 0, 10, 255);
      
      p.setup = () => {
        console.log("SpiralVisualizer - Setting up canvas with dimensions:", 
          containerRef.current?.clientWidth, 
          containerRef.current?.clientHeight
        );
        
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        p.createCanvas(width, height);
        
        // Reset important values for clean start
        p.frameRate(60); // Ensure smooth animation
        p.background(0);
        p.frameCount = 0;
        angle = 0;
        trailPoints = [];
        
        // Calculate appropriate scale factor based on canvas size
        const minDimension = Math.min(width, height);
        const scaleFactor = minDimension / 300; // Increased scale factor for better sizing
        targetScale = scaleFactor * 8; // Much larger target scale
        currentScale = scaleFactor * 0.8; // Start larger
        
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
        const pulseValue = (p.sin(p.frameCount * 0.02) + 1) * 0.5; // 0 to 1 sine wave
        
        // Center everything on the canvas
        p.push();
        p.translate(p.width / 2, p.height / 2);
        
        // Very gentle rotation of the entire scene for 3D feel
        const rotationAmount = p.sin(p.frameCount * 0.001) * 0.05;
        p.rotate(rotationAmount);
        
        // Aggressively scale up quickly and then slow down near target
        if (currentScale < targetScale) {
          const distanceToTarget = targetScale - currentScale;
          const growthThisFrame = distanceToTarget * scalingSpeed;
          currentScale += growthThisFrame;
        }
        
        // Scale the spiral to fill the screen appropriately
        p.scale(currentScale);
        
        // Apply blending for glow effect
        p.blendMode(p.ADD);
        
        // Draw glow base with reduced intensity - wider stroke creates aura
        p.strokeWeight(strokeW * 5);
        for (let i = 0; i < trailPoints.length; i += 3) {
          if (trailPoints[i]) {
            const point = trailPoints[i];
            p.stroke(p.color(`rgba(${color},${point.opacity * 0.1})`));
            p.point(point.x, point.y);
          }
        }
        
        // Draw trails with decreasing opacity
        for (let i = 0; i < trailPoints.length; i++) {
          if (trailPoints[i]) {
            const point = trailPoints[i];
            const alpha = point.opacity * (0.7 + 0.3 * pulseValue);
            p.stroke(p.color(`rgba(${color},${alpha})`));
            p.strokeWeight(strokeW * (0.9 + 0.2 * pulseValue)); // More variation for organic feel
            p.point(point.x, point.y);
          }
        }
        
        // Draw new spiral point if we haven't reached max angle
        if (angle < maxAngle) {
          // Pure logarithmic spiral formula: r = a * e^(b * θ)
          const radius = a * p.exp(b * angle);
          
          // Convert polar to Cartesian coordinates
          const x = radius * p.cos(angle);
          const y = radius * p.sin(angle);
          
          // Draw the current point with full brightness
          p.strokeWeight(strokeW * 2);
          p.stroke(p.color(`rgba(${color},${opacity/100})`));
          p.point(x, y);
          
          // Add point to trail with current opacity
          trailPoints.push({
            x: x,
            y: y,
            opacity: opacity/100
          });
          
          // Remove oldest point if we exceed max trail length
          if (trailPoints.length > maxTrailPoints) {
            trailPoints.shift();
          }
          
          // Slowly fade trail points
          for (let j = 0; j < trailPoints.length; j++) {
            trailPoints[j].opacity *= 0.997; // Slower fade
          }
          
          // Increment angle - faster at start, then slower
          if (angle < maxAngle * 0.3) {
            // Start faster to quickly show spiral form
            angle += speed * 1.5;
          } else {
            // Then slow down for contemplation
            angle += speed;
          }
        } else {
          // Once we've completed the spiral, gently rotate it
          p.rotate(p.frameCount * 0.0004);
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
        const scaleFactor = minDimension / 300;
        targetScale = scaleFactor * 8;
        
        // Don't reset currentScale to maintain current view
        // If we're below target, adjust current scale proportionally
        if (currentScale < targetScale * 0.7) {
          currentScale = scaleFactor * 0.8;
        }
        
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
