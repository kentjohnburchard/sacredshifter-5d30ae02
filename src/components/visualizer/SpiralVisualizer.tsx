import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

export interface SpiralParams {
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
    if (p5InstanceRef.current) p5InstanceRef.current.remove();

    const sketch = (p: p5) => {
      const a = 1.5;
      const b = 0.07;
      const maxAngle = params.maxCycles ? p.TWO_PI * params.maxCycles : p.TWO_PI * 12;
      const speed = params.speed || 0.012;

      const color = params.color || '180,200,255';
      const opacity = params.opacity || 80;
      const strokeW = params.strokeWeight || 1.4;

      let angle = 0;
      let currentScale = 1;
      let targetScale = 1;

      p.setup = () => {
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;

        p.createCanvas(width, height);
        p.background(0);
        p.frameRate(60);

        const minDim = Math.min(width, height);
        targetScale = minDim / 250;
        currentScale = targetScale;
        angle = 0;
      };

      p.draw = () => {
        p.translate(p.width / 2, p.height / 2);
        p.scale(currentScale);

        p.strokeWeight(strokeW);
        p.stroke(p.color(`rgba(${color},${opacity / 100})`));
        p.blendMode(p.ADD);

        if (angle < maxAngle) {
          const r = a * p.exp(b * angle);
          const x = r * p.cos(angle);
          const y = r * p.sin(angle);
          p.point(x, y);
          angle += speed;
        } else {
          p.rotate(p.sin(p.frameCount * 0.002) * 0.03);
        }
      };

      p.windowResized = () => {
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;

        p.resizeCanvas(width, height);
        const minDim = Math.min(width, height);
        targetScale = minDim / 250;
        currentScale = targetScale;
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      p5InstanceRef.current?.remove();
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
