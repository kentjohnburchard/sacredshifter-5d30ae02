
import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

type SpiralParams = {
  coeffA?: number;
  coeffB?: number;
  coeffC?: number;
  freqA?: number;
  freqB?: number;
  freqC?: number;
  opacity?: number;
  strokeWeight?: number;
  speed?: number;
  color?: string;
  maxCycles?: number;
};

const defaultParams: Required<SpiralParams> = {
  coeffA: 1.0,
  coeffB: 0.8, 
  coeffC: 1.2,
  freqA: 3.2,
  freqB: 4.1,
  freqC: 2.7,
  opacity: 0.8,
  strokeWeight: 1.5,
  speed: 0.5,
  color: '255,255,255',
  maxCycles: 5
};

interface SpiralVisualizerProps {
  params?: SpiralParams;
  className?: string;
  containerId?: string;
}

const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({
  params = {},
  className = '',
  containerId = 'spiralVisualizer'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Combine default parameters with provided ones, ensuring all params exist
    const processedParams = { ...defaultParams, ...params };
    
    console.log("SpiralVisualizer received params:", processedParams);

    const sketch = (p: p5) => {
      let t = 0;
      let frameCount = 0;
      const frameSkip = 2; // Only render every 2 frames for performance
      
      p.setup = () => {
        if (!containerRef.current) return;
        console.log("Setting up p5 canvas with dimensions:", containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        p.createCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
        p.blendMode(p.ADD);
        p.frameRate(30);
        setIsInitialized(true);
      };

      p.draw = () => {
        // Skip frames to improve performance
        if (frameCount % frameSkip !== 0) {
          frameCount++;
          return;
        }
        frameCount++;
        
        // Slowly advance time based on speed parameter
        t += processedParams.speed * 0.02;
        
        // Apply a subtle fade to create trail effect
        p.background(0, 0, 0, 8);
        
        // Translate to center of canvas
        p.translate(p.width / 2, p.height / 2);
        
        // Draw multiple spiral layers for depth
        const numLayers = 3;
        const baseRadius = Math.min(p.width, p.height) * 0.35;
        
        for (let layer = 0; layer < numLayers; layer++) {
          // Each layer gets slightly different parameters for visual interest
          const layerOffset = layer * 0.3;
          
          // Draw each spiral with subtle variations
          drawSpiral(
            p,
            baseRadius,
            t + layerOffset,
            processedParams,
            layer
          );
        }
      };
      
      // Helper function to draw a single spiral
      const drawSpiral = (
        p: p5, 
        radius: number, 
        time: number, 
        params: Required<SpiralParams>,
        layerIndex: number
      ) => {
        p.push();
        p.noFill();
        
        // Determine color based on layer
        const hueOffset = layerIndex * 30;
        const [r, g, b] = params.color.split(',').map(Number);
        const hue = (p.map(r + g + b, 0, 765, 0, 360) + hueOffset) % 360;
        
        // Start new shape
        p.beginShape();
        
        // Calculate how many points to use based on desired density and screen size
        const totalPoints = 120;
        const rotations = params.maxCycles;
        const angleStep = (Math.PI * 2 * rotations) / totalPoints;
        
        // For each point in the spiral
        for (let i = 0; i < totalPoints; i++) {
          // Calculate angle - grows with each point
          const angle = i * angleStep;
          
          // Calculate radius that grows logarithmically
          const spiralRadius = radius * (0.1 + 0.02 * angle) * 
            (1 + Math.sin(angle * params.freqA * 0.1 + time) * params.coeffA * 0.05) * 
            (1 + Math.sin(angle * params.freqB * 0.1 + time * 1.3) * params.coeffB * 0.05);
          
          // Apply modulation to position
          const x = spiralRadius * Math.cos(angle);
          const y = spiralRadius * Math.sin(angle);
          
          // Set stroke color and weight
          const pointHue = (hue + i * 0.5) % 360;
          const saturation = 70 + layerIndex * 10;
          const brightness = 90 - layerIndex * 10;
          
          // Fade opacity toward the end for smooth termination
          const pointOpacity = params.opacity * 100 * (1 - i/totalPoints * 0.3);
          
          p.stroke(pointHue, saturation, brightness, pointOpacity);
          p.strokeWeight(params.strokeWeight * (1 - i/totalPoints * 0.5));
          
          // Add vertex to the shape
          p.vertex(x, y);
        }
        
        p.endShape();
        p.pop();
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        }
      };
    };

    // Create and clean up sketch
    if (containerRef.current) {
      console.log("Creating p5 sketch in container:", containerId);
      
      if (sketchRef.current) {
        console.log("Removing existing sketch");
        sketchRef.current.remove();
      }
      
      sketchRef.current = new p5(sketch, containerRef.current);
    }

    return () => {
      if (sketchRef.current) {
        console.log("Cleaning up p5 sketch");
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
  }, [params, containerId]);

  // Add a background color to make it visible even if p5 fails
  return (
    <div
      ref={containerRef}
      id={containerId}
      className={`w-full h-full ${className}`}
      style={{ backgroundColor: 'black', minHeight: '300px' }}
    />
  );
};

export default SpiralVisualizer;
