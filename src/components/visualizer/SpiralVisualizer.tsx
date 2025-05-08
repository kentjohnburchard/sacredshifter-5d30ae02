
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
      // Pure logarithmic spiral parameters based on sacred geometry principles
      const a = 2.0;  // Initial size factor - increased for larger spiral
      const b = 0.15; // Growth rate - golden ratio influenced
      
      // Original parameters used for color and visual styling only
      const color = params.color || '180,180,255'; // Default blue
      const opacity = params.opacity || 80;
      const strokeW = params.strokeWeight || 1.2; // Increased for visibility
      
      // Maximum angle controls how many revolutions the spiral completes
      const maxAngle = params.maxCycles ? p.TWO_PI * params.maxCycles : p.TWO_PI * 12;
      
      // Increase speed slightly for better visual effect
      const speed = params.speed ? Math.min(params.speed, 0.01) : 0.005;
      
      // Scale factor to ensure spiral fills appropriate screen space
      let scaleFactor = 1;
      
      // Variables for rendering
      let angle = 0;
      let trailPoints: Array<{x: number, y: number, opacity: number}> = [];
      const maxTrailPoints = 1200; // Increased for smoother trails
      
      // Background gradient properties
      let bgGradientInner = p.color(5, 0, 20, 255);
      let bgGradientOuter = p.color(0, 0, 10, 255);
      
      // Variables to control spiral growth
      let currentScale = 0.3; // Start larger
      let targetScale = 8; // Grow to a larger size
      let scalingSpeed = 0.008; // Slightly faster growth

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
        currentScale = 0.3;
        
        // Calculate appropriate scale factor based on canvas size
        // This ensures spiral fills 50-80% of the screen as requested
        const minDimension = Math.min(width, height);
        scaleFactor = minDimension / 400; // Base scale on canvas size
        targetScale = scaleFactor * 6;
        
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
        
        // Draw trails with decreasing opacity
        for (let i = 0; i < trailPoints.length; i++) {
          if (trailPoints[i]) {
            const point = trailPoints[i];
            const alpha = point.opacity * (0.5 + 0.2 * pulseValue);
            p.stroke(p.color(`rgba(${color},${alpha})`));
            p.strokeWeight(strokeW * (0.8 + 0.1 * pulseValue)); // Slight variation for organic feel
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
          
          // Slightly vary stroke weight for organic feel
          const dynamicStrokeWeight = strokeW * (1 + 0.1 * p.sin(angle * 3));
          p.strokeWeight(dynamicStrokeWeight);
          
          // Use consistent color with subtle variation
          const baseColor = p.color(`rgba(${color},${opacity/100})`);
          p.stroke(baseColor);
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
            trailPoints[j].opacity *= 0.998; // Slower fade
          }
          
          // Increment angle
          angle += speed;
        } else {
          // Once we've completed the spiral, slowly rotate it for meditative effect
          p.rotate(p.frameCount * 0.0002);
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
        targetScale = scaleFactor * 6;
        
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
