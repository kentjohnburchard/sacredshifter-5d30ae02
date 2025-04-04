
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, Timer, Volume2, VolumeX } from "lucide-react";
import { MeditationType } from "@/types/meditation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MeditationPlayerProps {
  meditation: MeditationType;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ meditation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showGuidance, setShowGuidance] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const guidanceAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    
    if (guidanceAudioRef.current && showGuidance) {
      guidanceAudioRef.current.volume = volume;
      guidanceAudioRef.current.muted = isMuted;
    }

    // Reset player when meditation changes
    setIsPlaying(false);
    setCurrentTime(0);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (guidanceAudioRef.current) {
        guidanceAudioRef.current.pause();
      }
    };
  }, [meditation.id, isMuted, volume, showGuidance]);
  
  // Handle audio events
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioRef.current]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (guidanceAudioRef.current && showGuidance) {
        guidanceAudioRef.current.pause();
      }
    } else {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
      if (guidanceAudioRef.current && showGuidance) {
        guidanceAudioRef.current.play().catch(err => console.error("Error playing guidance:", err));
      }
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const resetPlayer = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    if (guidanceAudioRef.current) {
      guidanceAudioRef.current.currentTime = 0;
    }
    
    setCurrentTime(0);
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
      if (guidanceAudioRef.current && showGuidance) {
        guidanceAudioRef.current.play().catch(err => console.error("Error playing guidance:", err));
      }
    }
  };
  
  const handleSeek = (values: number[]) => {
    if (!audioRef.current) return;
    
    const seekTime = values[0];
    audioRef.current.currentTime = seekTime;
    if (guidanceAudioRef.current && showGuidance) {
      guidanceAudioRef.current.currentTime = seekTime;
    }
    
    setCurrentTime(seekTime);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (guidanceAudioRef.current && showGuidance) {
      guidanceAudioRef.current.volume = newVolume;
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    if (guidanceAudioRef.current && showGuidance) {
      guidanceAudioRef.current.muted = !isMuted;
    }
    
    setIsMuted(!isMuted);
  };
  
  const toggleGuidance = () => {
    if (!guidanceAudioRef.current) return;
    
    const newShowGuidance = !showGuidance;
    
    if (newShowGuidance && isPlaying) {
      guidanceAudioRef.current.currentTime = audioRef.current?.currentTime || 0;
      guidanceAudioRef.current.play().catch(err => console.error("Error playing guidance:", err));
    } else {
      guidanceAudioRef.current.pause();
    }
    
    setShowGuidance(newShowGuidance);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-[#9966FF]/10 to-[#bf99ff]/5 border border-[#9966FF]/20 shadow-lg">
        <CardContent className="pt-6 px-6">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-medium mb-2 text-[#7510c9]">{meditation.title}</h2>
            <p className="text-sm text-center text-gray-600">{meditation.description}</p>
            
            <div className="w-full mt-8 space-y-6">
              {/* Audio elements */}
              <audio
                ref={audioRef}
                src={meditation.audioUrl}
                preload="metadata"
                className="hidden"
              />
              
              {meditation.guidanceUrl && (
                <audio
                  ref={guidanceAudioRef}
                  src={meditation.guidanceUrl}
                  preload="metadata"
                  className="hidden"
                />
              )}
              
              {/* Time display and progress */}
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              <Slider 
                value={[currentTime]} 
                max={duration || 100} 
                step={0.1} 
                onValueChange={handleSeek}
                className="w-full"
              />
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-[#7510c9]/70 hover:text-[#7510c9] hover:bg-[#9966FF]/10"
                    onClick={resetPlayer}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="icon"
                    className={`h-12 w-12 rounded-full ${isPlaying ? 'bg-[#7510c9]' : 'bg-[#9966FF]'} hover:bg-[#7510c9]`}
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4 text-[#7510c9]/70" />
                    <span className="text-sm text-gray-500">
                      {formatTime(meditation.duration * 60)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 w-32">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#7510c9]/70 hover:text-[#7510c9] hover:bg-[#9966FF]/10"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
              
              {/* Guidance toggle */}
              {meditation.guidanceUrl && (
                <div className="flex items-center justify-end space-x-2 pt-4">
                  <Label htmlFor="guidance-toggle" className="text-sm text-gray-600">
                    Guided Meditation
                  </Label>
                  <Switch
                    id="guidance-toggle"
                    checked={showGuidance}
                    onCheckedChange={toggleGuidance}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Meditation information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-2 text-[#7510c9]">About this meditation</h3>
            <p className="text-sm text-gray-600 mb-3">{meditation.longDescription}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80">Duration:</span>
                <span>{meditation.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80">Frequency:</span>
                <span>{meditation.frequency} Hz</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80">Focus:</span>
                <span>{meditation.focus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7510c9]/80">Level:</span>
                <span>{meditation.level}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationPlayer;
