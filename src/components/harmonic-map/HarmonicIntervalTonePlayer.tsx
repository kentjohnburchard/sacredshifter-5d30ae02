
import React, { useState, useRef } from "react";
import { createTone } from "@/utils/audioUtils";
import { HarmonicInterval } from "@/data/harmonicSequence";
import { Button } from "../ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface HarmonicIntervalTonePlayerProps {
  interval: HarmonicInterval;
  autoplay?: boolean;
}

const HarmonicIntervalTonePlayer: React.FC<HarmonicIntervalTonePlayerProps> = ({ 
  interval, 
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

  // Generate tone for the harmonic interval frequency
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
      
      // Get the frequency value from the interval
      const frequency = interval.hertz as number;
      
      // Generate the tone
      const toneBuffer = createTone(audioContext, frequency, 60, 0.3);
      
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

  // Clean up audio context when component unmounts
  React.useEffect(() => {
    return () => {
      stopTone();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, []);

  // Setup autoplay if enabled
  React.useEffect(() => {
    if (autoplay && !isPlaying) {
      // Short delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        playTone();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoplay, isPlaying]);

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={togglePlayPause} 
        variant="outline"
        size="sm"
        className={`rounded-full w-8 h-8 p-0 flex items-center justify-center ${
          isPlaying ? `bg-${interval.color.replace('#', '')}` : 'bg-white/10'
        }`}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
        <span className="sr-only">
          {isPlaying ? "Pause" : "Play"} {interval.hertz} Hz
        </span>
      </Button>
      
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="sm"
        className="rounded-full w-6 h-6 p-0"
      >
        {isMuted ? (
          <VolumeX className="h-3 w-3" />
        ) : (
          <Volume2 className="h-3 w-3" />
        )}
        <span className="sr-only">
          {isMuted ? "Unmute" : "Mute"}
        </span>
      </Button>
    </div>
  );
};

export default HarmonicIntervalTonePlayer;
