
import React, { useState, useEffect, useRef } from "react";
import { createTone } from "@/utils/audioUtils";
import { ChakraData } from "@/data/chakraData";
import { Button } from "../ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface ChakraTonePlayerProps {
  chakra: ChakraData;
  autoplay?: boolean;
}

const ChakraTonePlayer: React.FC<ChakraTonePlayerProps> = ({ 
  chakra, 
  autoplay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Initialize or get audio context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Generate tone for the chakra frequency
  const generateTone = () => {
    try {
      const audioContext = getAudioContext();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      
      // Create a gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : 0.3; // Default volume
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
      
      // Generate the tone
      const toneBuffer = createTone(audioContext, chakra.frequency, 60, 0.3);
      
      // Create and configure source node
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = toneBuffer;
      sourceNode.loop = true;
      sourceNode.connect(gainNode);
      
      // Store reference to control later
      sourceNodeRef.current = sourceNode;
      
      return sourceNode;
    } catch (error) {
      console.error("Failed to generate tone:", error);
      return null;
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopTone();
    } else {
      playTone();
    }
  };

  const playTone = () => {
    try {
      stopTone(); // Stop any currently playing tone
      
      const sourceNode = generateTone();
      if (sourceNode) {
        sourceNode.start(0);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to play tone:", error);
    }
  };

  const stopTone = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
        setIsPlaying(false);
      } catch (error) {
        console.error("Error stopping tone:", error);
      }
    }
  };

  const toggleMute = () => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0.3 : 0;
      setIsMuted(!isMuted);
    }
  };

  // Setup autoplay if enabled
  useEffect(() => {
    if (autoplay && !isPlaying) {
      // Short delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        playTone();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoplay, chakra.frequency]);

  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      stopTone();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={togglePlayPause} 
        variant="outline"
        size="sm"
        className={`rounded-full w-10 h-10 p-0 flex items-center justify-center ${
          isPlaying ? `${chakra.bgColor} border-${chakra.color.replace('bg-', '')}` : 'bg-white/10'
        }`}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
        <span className="sr-only">
          {isPlaying ? "Pause" : "Play"} {chakra.frequency} Hz
        </span>
      </Button>
      
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="sm"
        className="rounded-full w-8 h-8 p-0"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isMuted ? "Unmute" : "Mute"}
        </span>
      </Button>
      
      <div className="text-sm">
        <span className="font-medium">{chakra.frequency} Hz</span>
        <span className="text-gray-500 text-xs ml-1">Pure Tone</span>
      </div>
    </div>
  );
};

export default ChakraTonePlayer;
