
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
  color?: string; // Added for compatibility with existing code
  maxCycles?: number; // Added for compatibility with existing code
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
  color: '255,255,255', // Default white (compatibility)
  maxCycles: 5 // Default max cycles (compatibility)
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
        // Force the spiral to always have a minimum size to ensure visibility
        t += Math.max(0.01, processedParams.speed * 0.1); // Ensure time always advances
        
        // Calculate growth factor for smooth appearance
        const growth = Math.min(1, Math.pow(t * 0.2, 1.5)); // ease-in growth
        
        // Base calculations on the smaller dimension to ensure proper display on any screen
        const baseRadius = Math.min(p.width, p.height) * 0.35;
        
        // Translate to center
        p.translate(p.width / 2, p.height / 2);
        
        // Use a low-alpha background for trail effect
        p.background(0, 0, 0, 10); // fading trail
        
        // Draw the sacred spiral
        p.noFill();
        
        // First spiral layer (golden spiral)
        p.beginShape();
        
        // Ensure minimum visibility even with extreme parameters
        const safeCoeffA = Number.isFinite(processedParams.coeffA) ? processedParams.coeffA : 1.0;
        const safeCoeffB = Number.isFinite(processedParams.coeffB) ? processedParams.coeffB : 0.8;
        const safeCoeffC = Number.isFinite(processedParams.coeffC) ? processedParams.coeffC : 1.2;
        
        // Allow for negative frequency values, but prevent NaN
        const safeFreqA = Number.isFinite(processedParams.freqA) ? processedParams.freqA : 3.2;
        const safeFreqB = Number.isFinite(processedParams.freqB) ? processedParams.freqB : 4.1;
        const safeFreqC = Number.isFinite(processedParams.freqC) ? processedParams.freqC : 2.7;
        
        // Draw main spiral
        for (let i = 0; i < 400 * growth; i++) {
          const theta = i * 0.05 + t;
          
          // Calculate radius with safe parameter values
          const r =
            baseRadius *
            0.2 *
            Math.exp(0.15 * theta) *
            (1 + Math.abs(safeCoeffA) * 0.2 * Math.sin(safeFreqA * theta)) *
            growth;

          const x =
            r * Math.cos(theta) *
            (1 + Math.abs(safeCoeffB) * 0.2 * Math.sin(safeFreqB * theta));
          const y =
            r * Math.sin(theta) *
            (1 + Math.abs(safeCoeffC) * 0.2 * Math.sin(safeFreqC * theta));

          const hue = (theta * 30 + t * 10) % 360;
          
          // Ensure opacity is always visible
          const visibleOpacity = Math.min(100, Math.max(30, processedParams.opacity * 100 * growth));
          
          p.stroke(hue, 80, 95, visibleOpacity);
          
          // Ensure strokeWeight is visible
          const visibleStrokeWeight = Math.max(0.5, processedParams.strokeWeight);
          p.strokeWeight(visibleStrokeWeight);
          
          p.vertex(x, y);

          // Break if spiral gets too large
          if (r > baseRadius * 0.9) break;
        }
        p.endShape();

        // Secondary spiral layer - always drawn regardless of parameters
        if (growth > 0.3) {
          p.beginShape();
          for (let i = 0; i < 300 * growth; i++) {
            const theta = i * 0.05 + t * 1.2;
            const r =
              baseRadius *
              0.15 *
              Math.exp(0.12 * theta) *
              (1 + 0.15 * Math.sin(4 * theta)) *
              growth;

            const x = r * Math.cos(-theta + Math.PI);
            const y = r * Math.sin(-theta + Math.PI);

            const hue = ((theta * 30) + 180) % 360;
            p.stroke(hue, 85, 90, 70 * growth);
            p.strokeWeight(Math.max(0.5, visibleStrokeWeight * 0.7));
            p.vertex(x, y);

            if (r > baseRadius * 0.6) break;
          }
          p.endShape();
        }

        // Flower of life patterns (appear after initial growth)
        if (growth > 0.5) {
          const flowerScale = growth - 0.5;
          const flowerRadius = baseRadius * 0.3 * flowerScale;
          
          // Draw central flower of life pattern
          for (let j = 0; j < 6; j++) {
            const angle = j * Math.PI / 3;
            p.stroke(j * 60, 70, 90, 70 * flowerScale);
            p.strokeWeight(Math.max(0.5, visibleStrokeWeight * 0.8));
            p.noFill();
            p.circle(
              flowerRadius * Math.cos(angle), 
              flowerRadius * Math.sin(angle), 
              flowerRadius * 1.2
            );
          }
          
          // Central circle
          p.stroke(0, 0, 100, 60 * flowerScale);
          p.circle(0, 0, flowerRadius);
        }

        // Always add some basic circular elements to ensure visibility
        if (t < 0.5) {
          p.stroke(120, 70, 95, 50);
          p.strokeWeight(0.8);
          p.circle(0, 0, baseRadius * 0.2 * growth * 10); // Initial pulse
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          console.log("Resizing canvas to:", containerRef.current.offsetWidth, containerRef.current.offsetHeight);
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        }
      };
    };

    // Only create the sketch if the container exists
    if (containerRef.current) {
      console.log("Creating p5 sketch in container:", containerId);
      
      // Clean up any existing sketch before creating a new one
      if (sketchRef.current) {
        console.log("Removing existing sketch");
        sketchRef.current.remove();
      }
      
      sketchRef.current = new p5(sketch, containerRef.current);
    } else {
      console.warn("Container ref is null, cannot create p5 sketch");
    }

    return () => {
      if (sketchRef.current) {
        console.log("Cleaning up p5 sketch");
        sketchRef.current.remove();
        sketchRef.current = null;
      }
    };
  }, [params, containerId]);

  // Add a background color to the container to make it visible even if p5 fails
  return (
    <div
      ref={containerRef}
      id={containerId}
      className={`fixed top-0 left-0 w-full h-full z-0 ${className}`}
      style={{ backgroundColor: 'black', minHeight: '300px' }}
    />
  );
};

export default SpiralVisualizer;
