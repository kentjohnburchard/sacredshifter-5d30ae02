
import React, { useState, useEffect, useRef } from 'react';
import Layout from "@/components/Layout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Clock,
  Music,
  Brain,
  ArrowRight,
  Sun
} from "lucide-react";
import { healingFrequencies } from "@/data/frequencies";
import { useToast } from "@/hooks/use-toast";

const Focus: React.FC = () => {
  // Timer state
  const [duration, setDuration] = useState<number>(25 * 60); // Default 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Frequency state
  const [selectedFrequency, setSelectedFrequency] = useState<string>("beta");
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playFrequency, setPlayFrequency] = useState<boolean>(true);
  
  // Background noise settings
  const [backgroundNoise, setBackgroundNoise] = useState<string>("none");
  const [showCompletionAlert, setShowCompletionAlert] = useState<boolean>(true);
  
  // Audio elements
  const frequencyAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();

  // Get frequency audio URL based on selection
  const getFrequencyAudioUrl = () => {
    switch (selectedFrequency) {
      case "beta":
        return healingFrequencies.find(f => f.frequency > 14)?.audio_url || "";
      case "alpha":
        return healingFrequencies.find(f => f.frequency >= 8 && f.frequency < 14)?.audio_url || "";
      case "theta":
        return healingFrequencies.find(f => f.frequency >= 4 && f.frequency < 8)?.audio_url || "";
      default:
        return "";
    }
  };

  // Get background noise audio URL
  const getBackgroundNoiseUrl = () => {
    switch (backgroundNoise) {
      case "rain":
        return "https://pixabay.com/sound-effects/light-rain-ambient-114354.mp3";
      case "white-noise":
        return "https://pixabay.com/sound-effects/white-noise-6453.mp3";
      case "nature":
        return "https://pixabay.com/sound-effects/forest-with-small-river-birds-and-nature-field-recording-6735.mp3";
      default:
        return "";
    }
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize and update audio elements
  useEffect(() => {
    if (!frequencyAudioRef.current) {
      frequencyAudioRef.current = new Audio(getFrequencyAudioUrl());
      frequencyAudioRef.current.loop = true;
    } else {
      frequencyAudioRef.current.src = getFrequencyAudioUrl();
      frequencyAudioRef.current.load();
    }

    if (!backgroundAudioRef.current) {
      backgroundAudioRef.current = new Audio(getBackgroundNoiseUrl());
      backgroundAudioRef.current.loop = true;
    } else {
      backgroundAudioRef.current.src = getBackgroundNoiseUrl();
      backgroundAudioRef.current.load();
    }

    // Set volume
    if (frequencyAudioRef.current) {
      frequencyAudioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : (volume / 100) * 0.5; // Background at 50% of main volume
    }

    return () => {
      // Cleanup audio on component unmount
      if (frequencyAudioRef.current) {
        frequencyAudioRef.current.pause();
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    };
  }, [selectedFrequency, backgroundNoise, volume, isMuted]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer finished
            clearInterval(interval!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  // Handle audio playback based on timer state
  useEffect(() => {
    if (isActive && !isPaused && playFrequency) {
      if (frequencyAudioRef.current) {
        try {
          frequencyAudioRef.current.play().catch(e => console.error("Audio play error:", e));
        } catch (e) {
          console.error("Audio play error:", e);
        }
      }
      if (backgroundAudioRef.current && backgroundNoise !== 'none') {
        try {
          backgroundAudioRef.current.play().catch(e => console.error("Background audio play error:", e));
        } catch (e) {
          console.error("Background audio play error:", e);
        }
      }
    } else {
      if (frequencyAudioRef.current) {
        frequencyAudioRef.current.pause();
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    }
  }, [isActive, isPaused, playFrequency, backgroundNoise]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Stop all audio
    if (frequencyAudioRef.current) {
      frequencyAudioRef.current.pause();
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
    
    // Show completion notification
    if (showCompletionAlert) {
      toast({
        title: "Focus Session Complete!",
        description: "Great job! Your focus session has ended.",
      });
    }
  };

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration);
    
    // Stop all audio
    if (frequencyAudioRef.current) {
      frequencyAudioRef.current.pause();
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
  };

  const setCustomDuration = (minutes: number) => {
    const newDuration = minutes * 60;
    setDuration(newDuration);
    if (!isActive) {
      setTimeLeft(newDuration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (frequencyAudioRef.current) {
        frequencyAudioRef.current.volume = newVolume / 100;
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.volume = (newVolume / 100) * 0.5;
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (frequencyAudioRef.current) {
      frequencyAudioRef.current.volume = !isMuted ? 0 : volume / 100;
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = !isMuted ? 0 : (volume / 100) * 0.5;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light mb-4">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#7510c9] to-[#4d00ff]">
              Focus Session
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your productivity with brainwave entrainment frequencies that help you focus and concentrate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Frequency Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center mb-4">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-purple-700">Frequency Selection</h2>
            </div>
            
            <p className="text-gray-600 mb-4">Select a frequency that helps you focus and concentrate on your tasks.</p>
            
            <RadioGroup 
              value={selectedFrequency} 
              onValueChange={setSelectedFrequency}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beta" id="beta" />
                <Label htmlFor="beta" className="text-sm font-medium cursor-pointer">
                  Beta (14-30 Hz) - Active concentration, problem-solving
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alpha" id="alpha" />
                <Label htmlFor="alpha" className="text-sm font-medium cursor-pointer">
                  Alpha (8-13.9 Hz) - Relaxed focus, calm alertness
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="theta" id="theta" />
                <Label htmlFor="theta" className="text-sm font-medium cursor-pointer">
                  Theta (4-7.9 Hz) - Deep meditation, enhanced creativity
                </Label>
              </div>
            </RadioGroup>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="volume" className="text-sm font-medium">
                    Volume
                  </Label>
                  <button onClick={toggleMute} className="text-purple-600 hover:text-purple-700">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  className="[&>[data-scale-x]]:bg-purple-200 [&>[data-scale-x-active]]:bg-purple-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="play-frequency" className="text-sm font-medium">
                  Play frequency during session
                </Label>
                <Switch
                  id="play-frequency"
                  checked={playFrequency}
                  onCheckedChange={setPlayFrequency}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Background Sound</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${backgroundNoise === 'none' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => setBackgroundNoise('none')}
                  >
                    None
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${backgroundNoise === 'rain' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => setBackgroundNoise('rain')}
                  >
                    Rain
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${backgroundNoise === 'white-noise' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => setBackgroundNoise('white-noise')}
                  >
                    White Noise
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${backgroundNoise === 'nature' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => setBackgroundNoise('nature')}
                  >
                    Nature
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timer */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-purple-700">Session Timer</h2>
            </div>
            
            <p className="text-gray-600 mb-4">Set a timer for your focus session to maintain productivity.</p>
            
            <div className="flex space-x-3 mb-8">
              <Button
                variant="outline"
                className={`flex-1 ${duration === 25 * 60 ? 'bg-purple-100 border-purple-300' : ''}`}
                onClick={() => setCustomDuration(25)}
              >
                25 min
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${duration === 45 * 60 ? 'bg-purple-100 border-purple-300' : ''}`}
                onClick={() => setCustomDuration(45)}
              >
                45 min
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${duration === 60 * 60 ? 'bg-purple-100 border-purple-300' : ''}`}
                onClick={() => setCustomDuration(60)}
              >
                60 min
              </Button>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-purple-800 mb-4 font-mono">
                {formatTime(timeLeft)}
              </div>
              
              <div className="flex justify-center space-x-4">
                {!isActive || isPaused ? (
                  <Button 
                    className="px-6 py-4 h-auto bg-purple-600 hover:bg-purple-700"
                    onClick={startTimer}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {isPaused ? 'Resume' : 'Start'}
                  </Button>
                ) : (
                  <Button 
                    className="px-6 py-4 h-auto bg-amber-500 hover:bg-amber-600"
                    onClick={pauseTimer}
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="px-6 py-4 h-auto"
                  onClick={resetTimer}
                  disabled={!isActive && timeLeft === duration}
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="completion-alert" className="text-sm font-medium">
                Play alert when session ends
              </Label>
              <Switch
                id="completion-alert"
                checked={showCompletionAlert}
                onCheckedChange={setShowCompletionAlert}
              />
            </div>
            
            {isActive && !isPaused && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-center">
                <Sun className="h-5 w-5 text-purple-500 mr-2 animate-pulse" />
                <p className="text-sm text-purple-700">
                  Focus session in progress. Stay focused!
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={() => {
              if (isActive) {
                const confirmed = window.confirm("You have an active focus session. Are you sure you want to navigate away?");
                if (confirmed) {
                  // Navigate to meditation
                  window.location.href = "/meditation";
                }
              } else {
                // Navigate to meditation
                window.location.href = "/meditation";
              }
            }}
          >
            <Music className="h-4 w-4 mr-2" />
            Try a Guided Meditation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;
