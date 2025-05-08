import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface SacredShapeVisualizerProps {
  containerId?: string;
  className?: string;
  arms?: number;
  radius?: number;
  color?: string;
}

const SacredShapeVisualizer: React.FC<SacredShapeVisualizerProps> = ({
  containerId = "sacredCanvas",
  className = "",
  arms = 6,
  radius = 200,
  color = "#8a2be2"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p: p5) => {
      let angleStep: number;

      p.setup = () => {
        const width = containerRef.current?.clientWidth || 600;
        const height = containerRef.current?.clientHeight || 600;
        p.createCanvas(width, height);
        p.background(0);
        p.angleMode(p.DEGREES);
        p.noFill();
        p.strokeWeight(1.5);
        p.stroke(color);
        angleStep = 360 / arms;

        drawMandala();
      };

      const drawMandala = () => {
        p.translate(p.width / 2, p.height / 2);
        for (let i = 0; i < arms; i++) {
          p.push();
          p.rotate(i * angleStep);
          drawPetal();
          p.pop();
        }
      };

      const drawPetal = () => {
        p.beginShape();
        for (let angle = 0; angle <= 180; angle += 1) {
          const r = radius * Math.sin(angle);
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          p.vertex(x, y);
        }
        p.endShape();
      };

      p.windowResized = () => {
        const width = containerRef.current?.clientWidth || 600;
        const height = containerRef.current?.clientHeight || 600;
        p.resizeCanvas(width, height);
        p.background(0);
        drawMandala();
      };
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      p5InstanceRef.current?.remove();
    };
  }, [containerId, className, arms, radius, color]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      className={`absolute inset-0 w-full h-full z-10 bg-black ${className}`}
    />
  );
};

export default SacredShapeVisualizer;
