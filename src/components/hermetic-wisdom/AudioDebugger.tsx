
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

const AudioDebugger = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioSrc, setAudioSrc] = useState("https://cdn.pixabay.com/download/audio/2022/03/18/audio_270f8897e1.mp3");
  const [audioStatus, setAudioStatus] = useState("Ready");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;
    
    // Add event listeners
    audio.addEventListener("play", () => {
      setAudioStatus("Playing");
      console.log("Audio playing");
    });
    
    audio.addEventListener("pause", () => {
      setAudioStatus("Paused");
      console.log("Audio paused");
    });
    
    audio.addEventListener("error", (err) => {
      setAudioStatus("Error");
      console.error("Audio error:", err);
      toast.error("Failed to load audio");
      setIsPlaying(false);
    });
    
    audio.addEventListener("canplaythrough", () => {
      setAudioStatus("Ready to play");
      console.log("Audio loaded and ready to play");
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setAudioStatus("Ended");
      console.log("Audio playback ended");
    });
    
    // Set initial source later to avoid immediate loading
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);
  
  // Effect to handle audio source changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Reset playing state when source changes
    setIsPlaying(false);
    
    // Set the source and load the audio
    audioRef.current.src = audioSrc;
    audioRef.current.load();
    
    setAudioStatus("Loading");
    
  }, [audioSrc]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    console.log("Toggle play clicked, current state:", isPlaying ? "playing" : "paused");
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Ensure audio source is set
      if (audioRef.current.src !== audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          console.log("Playback started successfully");
        }).catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Failed to play audio");
        });
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Audio Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 p-2 rounded text-sm">
          <p><strong>Status:</strong> {audioStatus}</p>
          <p><strong>URL:</strong> {audioSrc}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className={`${isPlaying ? 'bg-red-100' : 'bg-green-100'}`}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Play
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = 0;
            }}
          >
            Reset
          </Button>
          
          <Button
            variant="outline" 
            size="sm"
            onClick={() => {
              // Test with a different known working audio
              setAudioSrc("https://cdn.pixabay.com/download/audio/2021/11/13/audio_cb1c12a96d.mp3");
            }}
          >
            Change Source
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioDebugger;
