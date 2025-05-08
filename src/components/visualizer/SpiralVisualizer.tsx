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
      const a = 1.1;
      const b = 0.08;

      const maxAngle = params.maxCycles ? p.TWO_PI * params.maxCycles : p.TWO_PI * 16;
      const speed = params.speed || 0.015;

      const color = params.color || '180,200,255';
      const opacity = params.opacity || 70;
      const strokeW = params.strokeWeight || 1.4;

      let angle = 0;
      let trailPoints: { x: number; y: number; opacity: number }[] = [];
      const maxTrailPoints = 1000;

      let canvasWidth = 0;
      let canvasHeight = 0;
      let currentScale = 1;
      let targetScale = 1;

      p.setup = () => {
        canvasWidth = containerRef.current?.clientWidth || window.innerWidth;
        canvasHeight = containerRef.current?.clientHeight || window.innerHeight;

        p.createCanvas(canvasWidth, canvasHeight);
        p.frameRate(60);
        p.background(0);

        const minDim = Math.min(canvasWidth, canvasHeight);
        targetScale = minDim / 300;
        currentScale = targetScale * 0.8;

        angle = 0;
        trailPoints = [];
      };

      p.draw = () => {
        // Soft background fade for glow trails
        p.noStroke();
        p.fill(0, 0, 0, 15);
        p.rect(0, 0, p.width, p.height);

        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.scale(currentScale);

        // Slow 3D-like wobble
        p.rotate(p.sin(p.frameCount * 0.003) * 0.03);

        // Grow scale gradually
        if (currentScale < targetScale) {
          currentScale += (targetScale - currentScale) * 0.03;
        }

        // Draw trail
        p.blendMode(p.ADD);
        p.strokeWeight(strokeW * 4);
        trailPoints.forEach((pt, i) => {
          if (i % 3 === 0) {
            p.stroke(p.color(`rgba(${color},${pt.opacity * 0.1})`));
            p.point(pt.x, pt.y);
          }
        });

        // Draw new point
        if (angle < maxAngle) {
          const r = a * p.exp(b * angle);
          const x = r * p.cos(angle);
          const y = r * p.sin(angle);

          p.strokeWeight(strokeW);
          p.stroke(p.color(`rgba(${color},${opacity / 100})`));
          p.point(x, y);

          trailPoints.push({ x, y, opacity: opacity / 100 });
          if (trailPoints.length > maxTrailPoints) trailPoints.shift();
          trailPoints.forEach(pt => pt.opacity *= 0.995);

          angle += speed;
        }

        p.pop();
      };

      p.windowResized = () => {
        canvasWidth = containerRef.current?.clientWidth || window.innerWidth;
        canvasHeight = containerRef.current?.clientHeight || window.innerHeight;

        p.resizeCanvas(canvasWidth, canvasHeight);
        const minDim = Math.min(canvasWidth, canvasHeight);
        targetScale = minDim / 300;
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

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
