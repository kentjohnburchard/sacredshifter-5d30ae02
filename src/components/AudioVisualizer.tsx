
import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  frequency: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioRef, isPlaying, frequency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [bufferLength, setBufferLength] = useState<number>(0);

  const colorMap: Record<number, string> = {
    396: "#9c27b0", // Purple for Liberation
    432: "#4caf50", // Green for Harmony
    528: "#2196f3", // Blue for Transformation
  };

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioRef.current) return;

    const initializeAudio = () => {
      // Create audio context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);

      // Create analyzer node
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      setBufferLength(bufferLength);
      
      const dataArray = new Uint8Array(bufferLength);
      setDataArray(dataArray);
      
      // Connect audio element to analyzer
      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
      }
    };

    // Only initialize once
    if (!audioContext) {
      try {
        initializeAudio();
      } catch (error) {
        console.error("Error initializing audio visualizer:", error);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext) {
        // Don't close the audio context as it may be needed elsewhere
      }
    };
  }, [audioRef, audioContext]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArray) return;
      
      // Make canvas responsive
      const parentWidth = canvas.parentElement?.clientWidth || 300;
      canvas.width = parentWidth;
      canvas.height = 100;
      
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      
      analyserRef.current.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Draw background
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      // Draw frequency visualization
      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;
      
      const primaryColor = colorMap[frequency] || "#8a2be2";
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * HEIGHT;
        
        // Create gradient based on frequency
        const gradient = ctx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight);
        gradient.addColorStop(0, `${primaryColor}88`);
        gradient.addColorStop(1, `${primaryColor}ff`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Draw static visualizer when paused
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw a flat line
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
      gradient.addColorStop(0, `${colorMap[frequency] || "#8a2be2"}44`);
      gradient.addColorStop(1, `${colorMap[frequency] || "#8a2be2"}88`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 10, canvas.width, 2);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, dataArray, bufferLength, frequency]);

  return (
    <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm bg-black/5">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[100px]"
        height={100}
      />
    </Card>
  );
};

export default AudioVisualizer;
