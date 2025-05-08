
import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

type SpiralParams = {
  coeffA?: number;
  coeffB?: number;
  coeffC?: number;
  freqA?: number;
  freqB?: number;
  freqC?: number;
  color?: string;
  opacity?: number;
  strokeWeight?: number;
  maxCycles?: number;
  speed?: number;
};

const defaultParams: SpiralParams = {
  coeffA: 1.0,
  coeffB: 0.8,
  coeffC: 1.2,
  freqA: 3.2,
  freqB: 4.1,
  freqC: 2.7,
  color: '#9b87f5',
  opacity: 0.8,
  strokeWeight: 1.5,
  maxCycles: 12,
  speed: 0.5
};

interface SpiralVisualizerProps {
  params?: SpiralParams;
  containerId?: string;
  className?: string;
}

const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({ 
  params = defaultParams,
  containerId = 'spiralVisualizer',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Combine default params with user params
    const visualizerParams = { ...defaultParams, ...params };
    
    const sketch = (p: p5) => {
      let t = 0;
      const goldenRatio = 1.618033988749895;
      
      p.setup = () => {
        if (containerRef.current) {
          // Create canvas with the size of the container
          const canvas = p.createCanvas(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight
          );
          canvas.position(0, 0);
          canvas.style('z-index', '0');
        }
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0, 0, 0, 100); // Solid black background
        p.smooth();
        console.log("Spiral visualizer setup complete", 
                   "canvas size:", p.width, p.height, 
                   "container size:", containerRef.current?.offsetWidth, 
                   containerRef.current?.offsetHeight);
      };

      p.draw = () => {
        // Calculate the base radius based on the canvas size
        const baseRadius = Math.min(p.width, p.height) * 0.4;
        
        p.translate(p.width / 2, p.height / 2);
        p.background(0, 0, 0, 10); // Fade for trail effect
        
        // Draw sacred geometry patterns
        drawFlowerOfLife(p, t, baseRadius * 0.6);
        drawFibonacciSpirals(p, t, baseRadius);
        drawSacredVortex(p, t, visualizerParams, baseRadius);
        
        // Increment time for animation
        t += 0.005 * visualizerParams.speed!;
      };
      
      const drawFlowerOfLife = (p: p5, time: number, radius: number) => {
        const circleCount = 7;
        const growthProgress = Math.min(time * 2, 1); // Full growth in 0.5 seconds
        
        p.noFill();
        p.strokeWeight(1.5);
        
        // Draw central circle
        p.stroke(280, 70, 90, 40);
        p.circle(0, 0, radius * 2 * growthProgress);
        
        // Draw surrounding circles
        for (let i = 0; i < circleCount; i++) {
          const angle = (i * Math.PI * 2) / circleCount;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          if (growthProgress > 0.3) { // Start surrounding circles after central one is 30% grown
            const circleProgress = Math.min((growthProgress - 0.3) * 2, 1);
            const hue = (280 + i * 30) % 360;
            p.stroke(hue, 70, 90, 40);
            p.circle(x, y, radius * 2 * circleProgress);
            
            // Draw vesica piscis
            if (circleProgress > 0.5 && i > 0) {
              const prevAngle = ((i - 1) * Math.PI * 2) / circleCount;
              const prevX = radius * Math.cos(prevAngle);
              const prevY = radius * Math.sin(prevAngle);
              
              p.stroke(hue - 15, 70, 90, 20);
              p.beginShape();
              for (let j = 0; j <= 20; j++) {
                const a = j / 20 * Math.PI;
                const vx = x + Math.cos(a) * radius;
                const vy = y + Math.sin(a) * radius;
                p.vertex(vx, vy);
              }
              p.endShape();
            }
          }
        }
      };
      
      const drawFibonacciSpirals = (p: p5, time: number, maxRadius: number) => {
        const spiralCount = 5;
        const maxAngle = 8 * Math.PI;
        const growthProgress = Math.min(time * 1.5, 1); // Full growth in ~0.7 seconds
        
        p.strokeWeight(0.8);
        
        for (let s = 0; s < spiralCount; s++) {
          const rotation = (s * Math.PI * 2) / spiralCount + time * 0.2;
          const hue = (210 + s * 30) % 360;
          
          p.push();
          p.rotate(rotation);
          
          p.beginShape();
          p.noFill();
          p.stroke(hue, 80, 95, 60);
          
          const maxPoints = 150;
          for (let i = 0; i < maxPoints * growthProgress; i++) {
            const ratio = i / maxPoints;
            const angle = maxAngle * ratio;
            const radius = maxRadius * 0.05 * Math.pow(goldenRatio, angle / Math.PI);
            
            if (radius > maxRadius) break;
            
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            p.vertex(x, y);
          }
          p.endShape();
          p.pop();
        }
      };
      
      const drawSacredVortex = (p: p5, time: number, params: SpiralParams, baseRadius: number) => {
        const { coeffA, coeffB, coeffC, freqA, freqB, freqC, opacity, strokeWeight } = params;
        const arms = 6;
        
        for (let arm = 0; arm < arms; arm++) {
          const armOffset = (Math.PI * 2 / arms) * arm;
          
          p.push();
          p.rotate(armOffset + time * 0.2); // Each arm rotates
          
          p.beginShape();
          p.noFill();
          
          const hue = (time * 10 + arm * 60) % 360;
          p.stroke(hue, 80, 95, opacity! * 100);
          p.strokeWeight(strokeWeight!);
          
          // Create vortex pattern
          for (let i = 0; i < 200; i++) {
            // Progress along the curve (0 to 1)
            const progress = i / 200;
            
            // Logarithmic spiral with sacred geometry influences
            const theta = i * 0.05 + time * 0.3;
            const r = baseRadius * 0.2 * Math.exp(0.15 * theta);
            
            // Apply frequency modulations for sacred geometry pattern
            const x = r * Math.cos(theta) * (1 + 0.2 * Math.sin(freqA! * theta)); 
            const y = r * Math.sin(theta) * (1 + 0.2 * Math.sin(freqB! * theta));
            
            p.vertex(x, y);
            
            // Break point to prevent spiral from growing too large
            if (r > baseRadius * 0.9) break;
          }
          
          p.endShape();
          p.pop();
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
          console.log("Canvas resized to:", p.width, p.height);
        }
      };
    };

    if (containerRef.current) {
      // Clean up any previous instance
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
      
      // Create the new sketch
      sketchRef.current = new p5(sketch, containerRef.current);
      setIsInitialized(true);
      
      console.log("Spiral visualizer initialized", containerId);
    }

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
        console.log("Spiral visualizer removed");
      }
    };
  }, [params, containerId]);

  // Use appropriate positioning based on className
  return (
    <div 
      id={containerId} 
      ref={containerRef} 
      className={`relative w-full h-full ${className}`.trim()}
      style={{backgroundColor: 'black'}}
    />
  );
};

export default SpiralVisualizer;
