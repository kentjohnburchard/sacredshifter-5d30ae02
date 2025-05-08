
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
      let t = 0;

      p.setup = () => {
        console.log("SpiralVisualizer - Setting up canvas with dimensions:", 
          containerRef.current?.clientWidth, 
          containerRef.current?.clientHeight
        );
        
        // Get the container dimensions or use fallback values
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        const canvas = p.createCanvas(width, height);
        p.background(0);
        p.stroke(p.color(`rgba(${color},${opacity/100})`));
        p.strokeWeight(strokeW);
        p.noFill();
        
        console.log("SpiralVisualizer - Canvas created with dimensions:", width, height);
      };

      p.draw = () => {
        p.translate(p.width / 2, p.height / 2);
        p.scale(5);
        
        // Draw multiple points per frame for faster rendering
        for (let i = 0; i < 20; i++) {
          const re = coeffA * p.cos(freqA * t) + coeffB * p.cos(freqB * t) + coeffC * p.cos(freqC * t);
          const im = coeffA * p.sin(freqA * t) + coeffB * p.sin(freqB * t) + coeffC * p.sin(freqC * t);
          p.point(re, im);
          t += speed; // Smaller step for smoother lines
          
          // Stop after specified number of complete cycles
          if (t > p.TWO_PI * maxCycles) {
            p.noLoop();
            break;
          }
        }
      };

      p.windowResized = () => {
        // Get the new dimensions of the container
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        p.resizeCanvas(width, height);
        
        // Fix: p.background() is only accessible after setup has been called
        // Create a check to ensure p is initialized
        if (p.drawingContext) {
          p.background(0);
        }
        
        console.log("SpiralVisualizer - Canvas resized to:", width, height);
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
