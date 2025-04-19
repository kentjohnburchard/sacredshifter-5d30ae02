
import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AudioVisualizerProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  frequency: number;
  providedAudioContext?: AudioContext;
  providedAnalyser?: AnalyserNode;
  visualElementUrl?: string; // New prop for Three.js models or scenes
  visualType?: 'waveform' | 'frequency' | 'three-js'; // New prop for visualization type
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioRef, 
  isPlaying, 
  frequency,
  providedAudioContext,
  providedAnalyser,
  visualElementUrl,
  visualType = 'frequency'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null); // Container for Three.js scene
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [bufferLength, setBufferLength] = useState<number>(0);
  const [visualizationType, setVisualizationType] = useState<'waveform' | 'frequency' | 'three-js'>(visualType);

  // Function to toggle visualization type
  const toggleVisualizationType = () => {
    setVisualizationType(prev => {
      if (prev === 'waveform') return 'frequency';
      if (prev === 'frequency') return 'three-js';
      return 'waveform';
    });
  };

  // Initialize audio context and analyzer
  useEffect(() => {
    // Use provided audio context and analyser if available
    if (providedAudioContext && providedAnalyser) {
      console.log("AudioVisualizer: Using provided audio context and analyser");
      setAudioContext(providedAudioContext);
      analyserRef.current = providedAnalyser;
      
      const bufferLength = providedAnalyser.frequencyBinCount;
      setBufferLength(bufferLength);
      
      const dataArray = new Uint8Array(bufferLength);
      setDataArray(dataArray);
      
      return;
    }
    
    // Otherwise, set up our own audio processing if an audio ref is provided
    if (!audioRef?.current) return;

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
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        } catch (e) {
          console.error("Error connecting audio source:", e);
        }
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
    };
  }, [audioRef, audioContext, providedAudioContext, providedAnalyser]);

  // Animation loop for standard visualizations
  useEffect(() => {
    if (visualizationType === 'three-js') return; // Skip for Three.js visualizations
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
      
      if (visualizationType === 'frequency') {
        // Draw frequency visualization
        const barWidth = (WIDTH / bufferLength) * 2.5;
        let x = 0;
        
        const primaryColor = getColorForFrequency(frequency);
        
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
      } else if (visualizationType === 'waveform') {
        // Draw waveform visualization
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = getColorForFrequency(frequency);
        ctx.beginPath();
        
        const sliceWidth = WIDTH / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * HEIGHT / 2;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          
          x += sliceWidth;
        }
        
        ctx.lineTo(WIDTH, HEIGHT / 2);
        ctx.stroke();
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
      gradient.addColorStop(0, `${getColorForFrequency(frequency)}44`);
      gradient.addColorStop(1, `${getColorForFrequency(frequency)}88`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 10, canvas.width, 2);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, dataArray, bufferLength, frequency, visualizationType]);
  
  // Helper function to get color for frequency
  const getColorForFrequency = (freq: number): string => {
    const colorMap: Record<number, string> = {
      396: "#9c27b0", // Purple for Liberation
      432: "#4caf50", // Green for Harmony
      528: "#2196f3", // Blue for Transformation
    };
    
    return colorMap[freq] || "#8a2be2";
  };

  return (
    <div className="relative">
      <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm bg-black/5">
        {visualizationType === 'three-js' ? (
          <div 
            ref={threeContainerRef} 
            className="w-full h-[200px] bg-black/20"
            data-visual-url={visualElementUrl}
          >
            <div className="flex items-center justify-center h-full text-gray-400">
              3D Visualization
            </div>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            className="w-full h-[100px]"
            height={100}
          />
        )}
      </Card>
      <button 
        onClick={toggleVisualizationType}
        className="absolute bottom-2 right-2 bg-black/20 hover:bg-black/30 text-white text-xs px-2 py-1 rounded transition-colors"
      >
        Toggle Visual
      </button>
    </div>
  );
};

export default AudioVisualizer;
