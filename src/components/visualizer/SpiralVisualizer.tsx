
import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const {
      coeffA,
      coeffB,
      coeffC,
      freqA,
      freqB,
      freqC,
      opacity,
      strokeWeight,
      speed,
    } = { ...defaultParams, ...params };

    const sketch = (p: p5) => {
      let t = 0;

      p.setup = () => {
        if (!containerRef.current) return;
        p.createCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
        p.blendMode(p.ADD);
        p.frameRate(30);
      };

      p.draw = () => {
        // Calculate growth factor for smooth appearance
        const growth = Math.min(1, Math.pow(t * 0.2, 1.5)); // ease-in growth
        const baseRadius = Math.min(p.width, p.height) * 0.35;

        p.translate(p.width / 2, p.height / 2);
        p.background(0, 0, 0, 10); // fading trail

        // Draw the sacred spiral
        p.noFill();
        
        // First spiral layer (golden spiral)
        p.beginShape();
        for (let i = 0; i < 400 * growth; i++) {
          const theta = i * 0.05 + t;
          const r =
            baseRadius *
            0.2 *
            Math.exp(0.15 * theta) *
            (1 + coeffA * 0.2 * Math.sin(freqA * theta)) *
            growth;

          const x =
            r * Math.cos(theta) *
            (1 + coeffB * 0.2 * Math.sin(freqB * theta));
          const y =
            r * Math.sin(theta) *
            (1 + coeffC * 0.2 * Math.sin(freqC * theta));

          const hue = (theta * 30) % 360;
          p.stroke(hue, 80, 95, opacity * 100 * growth);
          p.strokeWeight(strokeWeight);
          p.vertex(x, y);

          // Break if spiral gets too large
          if (r > baseRadius * 0.9) break;
        }
        p.endShape();

        // Second spiral layer (phi-based counterclockwise)
        if (growth > 0.3) {
          p.beginShape();
          for (let i = 0; i < 300 * growth; i++) {
            const theta = i * 0.05 + t * 1.2;
            const r =
              baseRadius *
              0.15 *
              Math.exp(0.12 * theta) *
              (1 + coeffC * 0.15 * Math.sin(freqB * theta)) *
              growth;

            const x = r * Math.cos(-theta + Math.PI);
            const y = r * Math.sin(-theta + Math.PI);

            const hue = ((theta * 30) + 180) % 360;
            p.stroke(hue, 85, 90, opacity * 70 * growth);
            p.strokeWeight(strokeWeight * 0.7);
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
            p.stroke(j * 60, 70, 90, opacity * 70 * flowerScale);
            p.strokeWeight(strokeWeight * 0.8);
            p.noFill();
            p.circle(
              flowerRadius * Math.cos(angle), 
              flowerRadius * Math.sin(angle), 
              flowerRadius * 1.2
            );
          }
          
          // Central circle
          p.stroke(0, 0, 100, opacity * 60 * flowerScale);
          p.circle(0, 0, flowerRadius);
        }

        // Dynamic vortex elements
        if (growth > 0.7) {
          const vortexScale = growth - 0.7;
          for (let k = 0; k < 12; k++) {
            const vAngle = k * Math.PI / 6 + t * 0.2;
            const vr = baseRadius * 0.5 * vortexScale;
            const vx = vr * Math.cos(vAngle);
            const vy = vr * Math.sin(vAngle);
            
            p.stroke((k * 30 + t * 20) % 360, 90, 95, opacity * 40 * vortexScale);
            p.strokeWeight(strokeWeight * 0.6);
            
            // Draw connecting lines to center with wave distortion
            p.beginShape();
            for (let s = 0; s < 10; s++) {
              const sf = s / 10;
              const waveDist = 5 * Math.sin(sf * Math.PI * 4 + t * 2);
              const px = vx * sf + waveDist * Math.cos(vAngle + Math.PI/2);
              const py = vy * sf + waveDist * Math.sin(vAngle + Math.PI/2);
              p.vertex(px, py);
            }
            p.endShape();
          }
        }

        // Increment time based on speed parameter
        t += 0.01 * speed;
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        }
      };
    };

    if (containerRef.current) {
      sketchRef.current?.remove();
      sketchRef.current = new p5(sketch, containerRef.current);
    }

    return () => {
      sketchRef.current?.remove();
    };
  }, [params]);

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={`fixed top-0 left-0 w-full h-full z-0 ${className}`}
      style={{ backgroundColor: 'black' }}
    />
  );
};

export default SpiralVisualizer;
