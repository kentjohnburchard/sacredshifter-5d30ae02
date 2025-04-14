
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

const chakraColors: Record<string, string> = {
  root: '#FF0000',
  sacral: '#FFA500',
  solar: '#FFFF00',
  heart: '#00FF00',
  throat: '#00FFFF',
  thirdEye: '#0000FF',
  crown: '#EE82EE',
};

const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

const SacredAudioPlayer: React.FC = () => {
  const {
    audioRef,
    currentTrack,
    isAudioPlaying,
    togglePlayPause,
    duration,
    currentAudioTime,
    setCurrentTime,
    audioContext,
  } = useAudioPlayer();

  const { liftTheVeil } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceConnectedRef = useRef<boolean>(false);

  // Set up audio analyzer only once when the audio context is available
  useEffect(() => {
    if (!audioContext || !audioRef.current || audioSourceConnectedRef.current) return;

    try {
      console.log("Setting up audio analyzer");
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;
      
      // Create media element source only if not already connected
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyserNode);
      analyserNode.connect(audioContext.destination);
      
      analyserRef.current = analyserNode;
      audioSourceConnectedRef.current = true;
    } catch (error) {
      console.error("Error setting up audio analyzer:", error);
    }
  }, [audioContext, audioRef]);

  // Animation loop for the canvas
  useEffect(() => {
    const analyser = analyserRef.current;
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const animationId = requestAnimationFrame(draw);
      
      // If component is unmounted or hidden, stop the animation
      if (!canvas.isConnected) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radiusBase = Math.min(centerX, centerY) * 0.8;
      const numPoints = bufferLength;
      const angleStep = (2 * Math.PI) / numPoints;

      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < numPoints; i++) {
        const value = dataArray[i];
        const angle = i * angleStep;
        const magnitude = (value / 255);
        const radius = radiusBase * (0.4 + magnitude * 0.6);

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const freq = Math.round(i * (audioContext.sampleRate / 2) / bufferLength);
        const isPrime = primeNumbers.includes(freq);

        ctx.beginPath();
        ctx.arc(x, y, 2 + magnitude * 3, 0, Math.PI * 2);
        ctx.fillStyle = isPrime
          ? liftTheVeil
            ? '#FF69B4AA'
            : '#A855F7AA'
          : liftTheVeil
          ? `hsla(${(i * 12) % 360}, 100%, 70%, 0.7)`
          : 'rgba(255, 255, 255, 0.14)';
        ctx.fill();
      }

      ctx.restore();
    };

    const animationId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyserRef.current, liftTheVeil, audioContext]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg backdrop-blur-md transition-all 
        ${liftTheVeil ? 'bg-pink-900/40 border-pink-500' : 'bg-purple-900/40 border-purple-500'} 
        border w-[320px]`}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="mb-3 rounded-lg w-full"
      />
      <div className="flex justify-between items-center text-white">
        <div className="font-bold text-sm">
          {currentTrack?.title || 'No Track'}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlayPause}
          className="px-3 py-1 bg-white text-black rounded"
        >
          {isAudioPlaying ? 'Pause' : 'Play'}
        </motion.button>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentAudioTime}
        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
        className="w-full mt-2"
      />
    </div>
  );
};

export default SacredAudioPlayer;
