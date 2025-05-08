
import React, { useRef, useEffect } from 'react';
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
}

const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({ 
  params = defaultParams,
  containerId = 'spiralVisualizer' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    // Combine default params with user params
    const visualizerParams = { ...defaultParams, ...params };
    
    const sketch = (p: p5) => {
      let t = 0;
      const goldenRatio = 1.618033988749895;
      const baseRadius = Math.min(p.windowWidth, p.windowHeight) * 0.35; // Starts at 35% of screen size
      
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
        p.smooth();
      };

      p.draw = () => {
        p.translate(p.width / 2, p.height / 2);
        p.background(0, 0, 0, 15); // Subtle fade for trail effect
        
        // Draw the primary sacred spiral pattern
        drawSacredSpiral(p, t, visualizerParams);
        
        // Draw the flower of life background pattern
        drawFlowerOfLifePattern(p, t, baseRadius);
        
        // Increment time for animation
        t += 0.01 * visualizerParams.speed!;
      };
      
      const drawSacredSpiral = (p: p5, time: number, params: SpiralParams) => {
        const { coeffA, coeffB, coeffC, freqA, freqB, freqC, strokeWeight, opacity } = params;
        
        // Create multiple spiral arms
        for (let arm = 0; arm < 6; arm++) {
          const armOffset = (Math.PI * 2 / 6) * arm;
          
          p.push();
          p.rotate(armOffset + time * 0.1); // Each arm slightly rotates
          
          p.beginShape();
          p.noFill();
          
          // Start with a thicker stroke that tapers
          const maxWeight = strokeWeight! * 2;
          
          for (let i = 0; i < 300; i++) {
            // Calculate the current point in the cycle (0 to 1)
            const cycleProgress = i / 300;
            
            // Fade opacity and stroke weight as we move outward
            const pointOpacity = opacity! * (1 - cycleProgress * 0.3);
            const pointWeight = maxWeight * (1 - cycleProgress * 0.5);
            
            // Pick the color based on cycle progress
            const hue = (time * 20 + i * 0.5) % 360;
            p.stroke(hue, 80, 95, pointOpacity * 100);
            p.strokeWeight(pointWeight);
            
            // Logarithmic spiral equation: r = a * e^(b * theta)
            const theta = i * 0.05 + time * 0.2;
            const spiralGrowth = 0.18; 
            const r = baseRadius * 0.1 * Math.exp(spiralGrowth * theta);
            
            // Modify the basic spiral with sacred geometry influences
            const x = r * Math.cos(theta) * (1 + 0.1 * Math.sin(freqA! * theta)); 
            const y = r * Math.sin(theta) * (1 + 0.1 * Math.sin(freqB! * theta));
            
            p.vertex(x, y);
            
            // Break point to prevent spiral from growing too large
            if (r > baseRadius * 1.8) break;
          }
          
          p.endShape();
          p.pop();
        }
      };
      
      const drawFlowerOfLifePattern = (p: p5, time: number, radius: number) => {
        const flowerRadius = radius * 0.3;
        const circleCount = 7;
        const growthProgress = Math.min(time / 3, 1); // Take 3 seconds to fully grow
        
        p.noFill();
        p.strokeWeight(1);
        
        // Draw central circle
        p.stroke(280, 70, 90, 30);
        p.circle(0, 0, flowerRadius * 2 * growthProgress);
        
        // Draw surrounding circles
        for (let i = 0; i < circleCount; i++) {
          const angle = (i * Math.PI * 2) / circleCount;
          const x = flowerRadius * Math.cos(angle);
          const y = flowerRadius * Math.sin(angle);
          
          // Only draw if we've progressed enough for this circle
          if (growthProgress > (i + 1) / (circleCount + 2)) {
            const circleProgress = Math.min((growthProgress - (i + 1) / (circleCount + 2)) * 5, 1);
            const hue = (280 + i * 30) % 360;
            p.stroke(hue, 70, 90, 30);
            p.circle(x, y, flowerRadius * 2 * circleProgress);
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    if (containerRef.current) {
      // Remove any existing canvas
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
      
      // Create the new sketch
      sketchRef.current = new p5(sketch, containerRef.current);
    }

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, [params, containerId]);

  return <div id={containerId} ref={containerRef} className="w-full h-full fixed top-0 left-0 z-0" />;
};

export default SpiralVisualizer;
