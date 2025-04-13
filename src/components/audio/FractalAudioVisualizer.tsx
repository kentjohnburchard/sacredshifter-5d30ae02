import React, { useEffect, useRef } from 'react';

interface FractalAudioVisualizerProps {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  colorScheme?: string;
  isVisible?: boolean;
  pauseWhenStopped?: boolean;
  frequency?: number;
  chakra?: string;
  onPrimeSequence?: (primes: number[]) => void;
  onFrequencyDetected?: (frequency: number) => void;
}

const FractalAudioVisualizer: React.FC<FractalAudioVisualizerProps> = ({
  audioContext,
  analyser,
  colorScheme = 'purple',
  isVisible = true,
  pauseWhenStopped = true,
  frequency,
  chakra,
  onPrimeSequence,
  onFrequencyDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const primeNumbers = useRef<number[]>([]);
  const lastPrimeUpdate = useRef<number>(0);
  const frequencyDataRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!isVisible || !audioContext || !analyser) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const WIDTH = canvas.width = canvas.offsetWidth;
    const HEIGHT = canvas.height = canvas.offsetHeight;

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    frequencyDataRef.current = new Uint8Array(bufferLength);

    const detectPrimeNumbers = (dataArray: Uint8Array) => {
      if (!frequency) return;

      const now = Date.now();
      if (now - lastPrimeUpdate.current < 2000) return;

      const threshold = 240;
      const primeRange = 5;

      for (let i = 0; i < bufferLength; i++) {
        if (Math.abs(i - frequency) <= primeRange && dataArray[i] > threshold) {
          if (!primeNumbers.current.includes(frequency)) {
            primeNumbers.current = [...primeNumbers.current, frequency];
            lastPrimeUpdate.current = now;
            if (onPrimeSequence) {
              onPrimeSequence(primeNumbers.current);
            }
            break;
          }
        }
      }
    };

    const getDominantFrequency = (dataArray: Uint8Array): number | null => {
      let maxVal = 0;
      let maxIndex = 0;

      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i];
          maxIndex = i;
        }
      }

      return maxIndex;
    };

    const drawFractal = (x: number, y: number, size: number, angle: number, depth: number) => {
      if (depth === 0 || !ctx) return;

      const branchLength = size * 0.75;
      const newX = x + Math.cos(angle) * branchLength;
      const newY = y + Math.sin(angle) * branchLength;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(newX, newY);
      ctx.stroke();

      drawFractal(newX, newY, branchLength, angle - 0.3, depth - 1);
      drawFractal(newX, newY, branchLength, angle + 0.3, depth - 1);
    };

    const getColor = () => {
      switch (colorScheme) {
        case 'red': return `rgba(255, 0, 0, 0.8)`;
        case 'gold': return `rgba(255, 215, 0, 0.8)`;
        case 'green': return `rgba(0, 255, 0, 0.8)`;
        case 'blue': return `rgba(0, 191, 255, 0.8)`;
        case 'rainbow': return `hsl(${Date.now() % 360}, 100%, 50%)`;
        default: return `rgba(138, 43, 226, 0.8)`;
      }
    };

    const animate = () => {
      if (!isVisible || !ctx || !analyser || !frequencyDataRef.current) {
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);

      analyser.getByteFrequencyData(frequencyDataRef.current);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const dominantFrequency = getDominantFrequency(frequencyDataRef.current);
      detectPrimeNumbers(frequencyDataRef.current);

      ctx.strokeStyle = getColor();
      ctx.lineWidth = 2;

      drawFractal(WIDTH / 2, HEIGHT, 100, -Math.PI / 2, 7);

      if (dominantFrequency && onFrequencyDetected) {
        onFrequencyDetected(dominantFrequency);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, audioContext, analyser, colorScheme, frequency, onPrimeSequence, onFrequencyDetected]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: isVisible ? 'block' : 'none' }}
    />
  );
};

export default FractalAudioVisualizer;
