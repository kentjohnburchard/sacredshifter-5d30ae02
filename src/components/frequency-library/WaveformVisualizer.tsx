
import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isPlaying: boolean;
  frequencyHz: number;
  chakra?: string;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  canvasRef,
  isPlaying,
  frequencyHz,
  chakra
}) => {
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Get chakra color based on chakra name
  const getChakraColor = (): string => {
    if (!chakra) return 'rgb(147, 51, 234)'; // Default purple
    
    switch (chakra.toLowerCase()) {
      case 'root': return 'rgb(239, 68, 68)'; // red
      case 'sacral': return 'rgb(249, 115, 22)'; // orange
      case 'solar plexus': return 'rgb(234, 179, 8)'; // yellow
      case 'heart': return 'rgb(34, 197, 94)'; // green
      case 'throat': return 'rgb(59, 130, 246)'; // blue
      case 'third eye': return 'rgb(99, 102, 241)'; // indigo
      case 'crown': return 'rgb(139, 92, 246)'; // purple
      default: return 'rgb(147, 51, 234)'; // Default purple
    }
  };

  // Setup audio context and analyser node
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Find the audio element
    const audioElement = document.querySelector('audio');
    if (!audioElement) return;
    
    // Create audio context and analyzer if they don't exist
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Connect audio element to analyser
      const source = audioContextRef.current.createMediaElementSource(audioElement);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      // Configure analyser
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animate waveform
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get canvas dimensions and adjust for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const chakraColor = getChakraColor();
    const frequency = frequencyHz / 100; // Scale down for visual effect
    
    const animate = () => {
      if (!ctx || !analyserRef.current || !dataArrayRef.current) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      if (isPlaying && analyserRef.current) {
        // Get frequency data
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Draw waveform
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        const centerY = height / 2;
        const bufferLength = analyserRef.current.frequencyBinCount;
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = chakraColor;
        ctx.beginPath();
        
        const sliceWidth = width / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArrayRef.current[i] / 128.0;
          const y = v * centerY;
          
          // Modify the waveform with frequency factor
          const modY = centerY + Math.sin(x / frequency + Date.now() / 1000) * y / 2;
          
          if (i === 0) {
            ctx.moveTo(x, modY);
          } else {
            ctx.lineTo(x, modY);
          }
          
          x += sliceWidth;
        }
        
        ctx.lineTo(width, centerY);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = chakraColor;
      } else {
        // Draw placeholder sine wave when not playing
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        const centerY = height / 2;
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = chakraColor;
        ctx.beginPath();
        
        const amplitude = height / 4;
        const frequency = 0.01;
        
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * frequency + Date.now() / 2000) * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frequencyHz, chakra]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full bg-black/5"
      style={{ display: 'block' }}
    />
  );
};

export default WaveformVisualizer;
