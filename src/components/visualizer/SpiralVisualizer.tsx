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
  speed: 0.5,
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
    const visualizerParams = { ...defaultParams, ...params };

    const sketch = (p: p5) => {
      let t = 0;
      const goldenRatio = 1.61803398875;

      p.setup = () => {
        if (containerRef.current) {
          const canvas = p.createCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
          canvas.position(0, 0);
          canvas.style('z-index', '0');
        }
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
        p.smooth();
        p.blendMode(p.ADD); // Additive glow blend
        p.frameRate(30);
      };

      p.draw = () => {
        const growth = Math.min(1, Math.pow(t * 0.2, 1.5)); // Emergent ease-in

        const baseRadius = Math.min(p.width, p.height) * 0.4;
        p.translate(p.width / 2, p.height / 2);
        p.background(0, 0, 0, 10); // Trail fade

        drawFlowerOfLife(p, t, baseRadius * 0.6, growth);
        drawFibonacciSpirals(p, t, baseRadius, growth);
        drawSacredVortex(p, t, visualizerParams, baseRadius, growth);

        t += 0.005 * (visualizerParams.speed || 1);
      };

      const drawFlowerOfLife = (p: p5, time: number, radius: number, growth: number) => {
        const circleCount = 7;
        p.noFill();
        p.strokeWeight(1.5);

        p.stroke(280, 70, 90, 40 * growth);
        p.circle(0, 0, radius * 2 * growth);

        for (let i = 0; i < circleCount; i++) {
          const angle = (i * Math.PI * 2) / circleCount;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const hue = (280 + i * 30) % 360;

          p.stroke(hue, 70, 90, 40 * growth);
          p.circle(x, y, radius * 2 * growth);
        }
      };

      const drawFibonacciSpirals = (p: p5, time: number, maxRadius: number, growth: number) => {
        const spiralCount = 5;
        const maxAngle = 8 * Math.PI;

        p.strokeWeight(0.8);
        for (let s = 0; s < spiralCount; s++) {
          const rotation = (s * Math.PI * 2) / spiralCount + time * 0.2;
          const hue = (210 + s * 30) % 360;

          p.push();
          p.rotate(rotation);
          p.beginShape();
          p.noFill();
          p.stroke(hue, 80, 95, 60 * growth);

          const maxPoints = 150;
          for (let i = 0; i < maxPoints * growth; i++) {
            const ratio = i / maxPoints;
            const angle = maxAngle * ratio;
            const radius = maxRadius * 0.05 * Math.pow(goldenRatio, angle / Math.PI) * growth;

            if (radius > maxRadius) break;

            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            p.vertex(x, y);
          }

          p.endShape();
          p.pop();
        }
      };

      const drawSacredVortex = (p: p5, time: number, params: SpiralParams, baseRadius: number, growth: number) => {
        const {
          coeffA = 1, coeffB = 1, coeffC = 1,
          freqA = 3.2, freqB = 4.1, freqC = 2.7,
          opacity = 0.8, strokeWeight = 1.5
        } = params;

        const arms = 6;

        for (let arm = 0; arm < arms; arm++) {
          const armOffset = (Math.PI * 2 / arms) * arm;
          p.push();
          p.rotate(armOffset + time * 0.2);

          p.beginShape();
          p.noFill();

          const hue = (time * 10 + arm * 60) % 360;
          p.stroke(hue, 80, 95, opacity * 100 * growth);
          p.strokeWeight(strokeWeight);

          for (let i = 0; i < 200 * growth; i++) {
            const theta = i * 0.05 + time * 0.3;
            const r = baseRadius * 0.2 * Math.exp(0.15 * theta) * growth;

            const x = r * Math.cos(theta) * (1 + 0.2 * Math.sin(freqA * theta));
            const y = r * Math.sin(theta) * (1 + 0.2 * Math.sin(freqB * theta));

            p.vertex(x, y);

            if (r > baseRadius * 0.9) break;
          }

          p.endShape();
          p.pop();
        }
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
      setIsInitialized(true);
    }

    return () => {
      sketchRef.current?.remove();
    };
  }, [params, containerId]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={`relative w-full h-full ${className}`.trim()}
      style={{ backgroundColor: 'black' }}
    />
  );
};

export default SpiralVisualizer;
