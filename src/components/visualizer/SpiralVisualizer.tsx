import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

type SpiralParams = {
  A: number;
  B: number;
  C: number;
  fa: number;
  fb: number;
  fc: number;
};

const defaultParams: SpiralParams = {
  A: 1.0,
  B: 0.8,
  C: 1.2,
  fa: 3.2,
  fb: 4.1,
  fc: 2.7,
};

const SacredVisualizer: React.FC<{ params?: SpiralParams }> = ({ params = defaultParams }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let t = 0;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.background(0);
      };

      p.draw = () => {
        p.translate(p.width / 2, p.height / 2);
        p.noFill();
        p.strokeWeight(1.5);
        p.background(0, 0, 0, 10); // Fading trail effect

        const { A, B, C, fa, fb, fc } = params;

        p.beginShape();
        for (let i = 0; i < 500; i++) {
          const tt = t + i * 0.02;
          const x =
            A * Math.cos(fa * tt) +
            B * Math.cos(fb * tt) +
            C * Math.cos(fc * tt);
          const y =
            A * Math.sin(fa * tt) +
            B * Math.sin(fb * tt) +
            C * Math.sin(fc * tt);

          const hue = (tt * 40) % 360;
          p.stroke(hue, 80, 100, 80);
          p.vertex(x * 100, y * 100);
        }
        p.endShape();

        t += 0.01;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    if (containerRef.current) {
      sketchRef.current = new p5(sketch, containerRef.current);
    }

    return () => {
      sketchRef.current?.remove();
    };
  }, [params]);

  return <div ref={containerRef} className="w-full h-full fixed top-0 left-0 z-0" />;
};

export default SacredVisualizer;
