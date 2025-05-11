
import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

export type SpiralParams = {
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

// Reduced default parameters for initial state
const initialParams: Required<SpiralParams> = {
  coeffA: 1.0,
  coeffB: 0.8, 
  coeffC: 1.2,
  freqA: 3.2,
  freqB: 4.1,
  freqC: 2.7,
  opacity: 0.3, // Start more transparent
  strokeWeight: 0.8, // Thinner lines initially
  speed: 0.00002, // Ultra slow for stability
  color: '255,255,255',
  maxCycles: 2 // Start with fewer cycles
};

// Regular parameters for later stages
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
  startSmall?: boolean;
}

const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({
  params = {},
  className = '',
  containerId = 'spiralVisualizer',
  startSmall = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastParamsRef = useRef<SpiralParams>(params);
  const animationFrameRef = useRef<number | null>(null);
  const [growthProgress, setGrowthProgress] = useState(0);

  useEffect(() => {
    // Start with minimal parameters if startSmall is true, otherwise use regular defaults
    const baseDefaults = startSmall ? initialParams : defaultParams;
    
    // Combine default parameters with provided ones, ensuring all params exist
    const processedParams = { ...baseDefaults, ...params };
    lastParamsRef.current = processedParams;
    
    console.log("SpiralVisualizer received params:", processedParams);

    // Small delay to ensure the container is fully rendered before creating the p5 instance
    const initTimer = setTimeout(() => {
      if (containerRef.current && !isInitialized) {
        initSketch(processedParams);
      } else if (isInitialized && sketchRef.current) {
        // Already initialized, just update parameters
        console.log("Updating existing spiral with new params");
      }
    }, 100);

    // Start growth animation if startSmall is true
    if (startSmall) {
      let growthStep = 0;
      const growthInterval = setInterval(() => {
        growthStep += 0.02; // 2% growth per interval
        if (growthStep >= 1) {
          clearInterval(growthInterval);
          growthStep = 1;
        }
        setGrowthProgress(growthStep);
      }, 200);
      
      return () => {
        clearInterval(growthInterval);
        clearTimeout(initTimer);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    return () => {
      clearTimeout(initTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startSmall]);

  // Handle parameter updates and growth separately for better performance
  useEffect(() => {
    if (isInitialized) {
      // Blend between initial and target parameters based on growth progress
      if (startSmall && growthProgress < 1) {
        const targetParams = { ...defaultParams, ...params };
        // Use a typed record to ensure we can assign values properly
        const currentParams: Record<keyof SpiralParams, any> = { ...initialParams };
        
        // Interpolate between initial and target parameters
        Object.keys(targetParams).forEach((key) => {
          const paramKey = key as keyof SpiralParams;
          if (paramKey in initialParams && paramKey in targetParams) {
            const initValue = initialParams[paramKey as keyof Required<SpiralParams>];
            const targetValue = targetParams[paramKey as keyof Required<SpiralParams>];
            
            if (typeof initValue === 'number' && typeof targetValue === 'number') {
              currentParams[paramKey] = initValue + (targetValue - initValue) * growthProgress;
            }
          }
        });
        
        lastParamsRef.current = currentParams;
      } else if (JSON.stringify(lastParamsRef.current) !== JSON.stringify(params)) {
        console.log("Parameters changed, updating spiral");
        lastParamsRef.current = { ...defaultParams, ...params };
      }
    }
  }, [params, growthProgress, isInitialized, startSmall]);

  const initSketch = (processedParams: Required<SpiralParams>) => {
    const sketch = (p: p5) => {
      let t = 0;
      let frameCount = 0;
      const frameSkip = 2; // Only render every 2 frames for performance
      let animationSpeed = processedParams.speed;
      
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
        
        // Get the latest parameters from ref
        const currentParams = lastParamsRef.current;
        animationSpeed = currentParams.speed || defaultParams.speed;
        
        // Slowly advance time based on speed parameter - using ultra slow speed
        t += Math.min(animationSpeed * 0.01, 0.0001); // Cap the time advancement to avoid issues
        
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
            currentParams,
            layer
          );
        }

        // Request the next animation frame for smooth updates
        animationFrameRef.current = requestAnimationFrame(() => p.redraw());
      };
      
      // Helper function to draw a single spiral
      const drawSpiral = (
        p: p5, 
        radius: number, 
        time: number, 
        params: SpiralParams,
        layerIndex: number
      ) => {
        const coeffA = params.coeffA || defaultParams.coeffA;
        const coeffB = params.coeffB || defaultParams.coeffB;
        const coeffC = params.coeffC || defaultParams.coeffC;
        const freqA = params.freqA || defaultParams.freqA;
        const freqB = params.freqB || defaultParams.freqB;
        const freqC = params.freqC || defaultParams.freqC;
        const maxCycles = params.maxCycles || defaultParams.maxCycles;
        const opacity = params.opacity || defaultParams.opacity;
        const strokeWeight = params.strokeWeight || defaultParams.strokeWeight;
        const color = params.color || defaultParams.color;
        
        p.push();
        p.noFill();
        
        // Determine color based on layer
        const hueOffset = layerIndex * 30;
        const [r, g, b] = color.split(',').map(Number);
        const hue = (p.map(r + g + b, 0, 765, 0, 360) + hueOffset) % 360;
        
        // Start new shape
        p.beginShape();
        
        // Calculate how many points to use based on desired density and screen size
        const totalPoints = 120;
        const rotations = maxCycles;
        const angleStep = (Math.PI * 2 * rotations) / totalPoints;
        
        // For each point in the spiral
        for (let i = 0; i < totalPoints; i++) {
          // Calculate angle - grows with each point
          const angle = i * angleStep;
          
          // Calculate radius that grows logarithmically
          const spiralRadius = radius * (0.1 + 0.02 * angle) * 
            (1 + Math.sin(angle * freqA * 0.1 + time) * coeffA * 0.05) * 
            (1 + Math.sin(angle * freqB * 0.1 + time * 1.3) * coeffB * 0.05);
          
          // Apply modulation to position
          const x = spiralRadius * Math.cos(angle);
          const y = spiralRadius * Math.sin(angle);
          
          // Set stroke color and weight
          const pointHue = (hue + i * 0.5) % 360;
          const saturation = 70 + layerIndex * 10;
          const brightness = 90 - layerIndex * 10;
          
          // Fade opacity toward the end for smooth termination
          const pointOpacity = opacity * 100 * (1 - i/totalPoints * 0.3);
          
          p.stroke(pointHue, saturation, brightness, pointOpacity);
          p.strokeWeight(strokeWeight * (1 - i/totalPoints * 0.5));
          
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

    // Create sketch
    if (containerRef.current) {
      console.log("Creating p5 sketch in container:", containerId);
      
      if (sketchRef.current) {
        console.log("Removing existing sketch");
        sketchRef.current.remove();
      }
      
      sketchRef.current = new p5(sketch, containerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (sketchRef.current) {
        console.log("Cleaning up p5 sketch");
        sketchRef.current.remove();
        sketchRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
