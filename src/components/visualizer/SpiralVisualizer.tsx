
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
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        p.background(0);
        p.stroke(p.color(`rgba(${color},${opacity/100})`));
        p.strokeWeight(strokeW);
        p.noFill();
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
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        // Fix: p.background() is only accessible after setup has been called
        // Create a check to ensure p is initialized
        if (p.drawingContext) {
          p.background(0);
        }
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
  }, [params]);

  return (
    <div 
      id={containerId}
      ref={containerRef} 
      className={`fixed inset-0 w-full h-full z-[-2] bg-black ${className}`}
      aria-hidden="true"
    />
  );
};

export default SpiralVisualizer;
