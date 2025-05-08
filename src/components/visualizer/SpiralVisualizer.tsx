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
};

interface SpiralVisualizerProps {
  params?: SpiralParams;
  className?: string;
}

const SpiralVisualizer: React.FC<SpiralVisualizerProps> = ({
  params = {},
  className = '',
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
        const growth = Math.min(1, Math.pow(t * 0.2, 1.5)); // ease-in growth
        const baseRadius = Math.min(p.width, p.height) * 0.4;

        p.translate(p.width / 2, p.height / 2);
        p.background(0, 0, 0, 10); // fading trail

        p.beginShape();
        for (let i = 0; i < 400 * growth; i++) {
          const theta = i * 0.05 + t;
          const r =
            baseRadius *
            0.2 *
            Math.exp(0.15 * theta) *
            (1 + 0.2 * Math.sin(freqC * theta)) *
            growth;

          const x =
            r * Math.cos(theta) *
            (1 + 0.2 * Math.sin(freqA * theta));
          const y =
            r * Math.sin(theta) *
            (1 + 0.2 * Math.sin(freqB * theta));

          const hue = (theta * 30) % 360;
          p.stroke(hue, 80, 95, opacity * 100 * growth);
          p.strokeWeight(strokeWeight);
          p.vertex(x, y);

          if (r > baseRadius * 0.9) break;
        }
        p.endShape();

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
      className={`fixed top-0 left-0 w-full h-full z-0 ${className}`}
      style={{ backgroundColor: 'black' }}
    />
  );
};

export default SpiralVisualizer;
