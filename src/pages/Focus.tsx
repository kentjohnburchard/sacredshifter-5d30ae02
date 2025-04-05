import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, AudioWaves } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatTime } from "@/lib/utils";
import { toast } from "sonner";
import { createFrequencyBlobUrl, getFrequencyName } from "@/utils/audioUtils";

const focusSessions = [
  {
    id: "pomodoro",
    name: "Pomodoro",
    description: "25 minutes of focused work followed by a 5-minute break",
    duration: 25 * 60, // 25 minutes in seconds
    frequency: 396,
    benefits: "Enhances focus and concentration",
  },
  {
    id: "deep-work",
    name: "Deep Work",
    description: "50 minutes of deep focus followed by a 10-minute break",
    duration: 50 * 60, // 50 minutes in seconds
    frequency: 528,
    benefits: "Promotes clarity and deep concentration",
  },
  {
    id: "quick-focus",
    name: "Quick Focus",
    description: "15 minutes of intense focus for quick tasks",
    duration: 15 * 60, // 15 minutes in seconds
    frequency: 432,
    benefits: "Helps with quick bursts of productivity",
  },
];

const Focus = () => {
  const [activeSession, setActiveSession] = useState(focusSessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useLocalStorage("focusVolume", 80);
  const [remainingTime, setRemainingTime] = useState(activeSession.duration);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    audioRef, 
    togglePlayPause, 
    handleTimeUpdate, 
    handleVolumeChange,
    setAudioSource,
    duration,
    currentAudioTime,
    isAudioPlaying
  } = useAudioPlayer();
  
  useEffect(() => {
    const loadFrequencyAudio = async () => {
      try {
        setLoading(true);
        const audioBlobUrl = await createFrequencyBlobUrl(activeSession.frequency);
        setAudioSrc(audioBlobUrl);
        setAudioSource(audioBlobUrl);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load frequency audio:", error);
        toast.error("Failed to load frequency audio");
        setLoading(false);
      }
    };
    
    loadFrequencyAudio();
  }, [activeSession, setAudioSource]);
  
  useEffect(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setRemainingTime(activeSession.duration);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeSession]);
  
  useEffect(() => {
    if (isPlaying && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            toast.success(`${activeSession.name} session completed!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(interval);
      
      return () => clearInterval(interval);
    } else if (!isPlaying && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [isPlaying, activeSession]);
  
  const handleStartSession = () => {
    setIsPlaying(!isPlaying);
    togglePlayPause();
  };
  
  const handleSessionChange = (sessionId: string) => {
    const session = focusSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
    }
  };
  
  const formatSessionTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Layout pageTitle="Focus">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your productivity with sacred frequencies designed to improve focus and concentration.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="border border-gray-200 shadow-sm h-full">
              <CardContent className="p-6">
                <Tabs defaultValue="pomodoro" className="w-full" onValueChange={handleSessionChange}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    {focusSessions.map(session => (
                      <TabsTrigger key={session.id} value={session.id}>
                        {session.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {focusSessions.map(session => (
                    <TabsContent key={session.id} value={session.id} className="space-y-4">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-light mb-2">{session.name}</h3>
                        <p className="text-gray-600">{session.description}</p>
                        {loading && (
                          <div className="mt-2 text-sm text-purple-600">Loading frequency audio...</div>
                        )}
                        {audioSrc && !loading && (
                          <div className="mt-2 text-sm flex items-center justify-center gap-1 text-purple-600">
                            <AudioWaves className="h-4 w-4" />
                            <span>{getFrequencyName(session.frequency)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center justify-center space-y-8">
                        <div className="text-6xl font-light text-purple-600">
                          {formatSessionTime(remainingTime)}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setRemainingTime(activeSession.duration);
                              setIsPlaying(false);
                              if (audioRef.current) {
                                audioRef.current.pause();
                                audioRef.current.currentTime = 0;
                              }
                            }}
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="default" 
                            size="lg"
                            className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700"
                            onClick={handleStartSession}
                            disabled={loading}
                          >
                            {isPlaying ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6 ml-1" />
                            )}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              toast.info("Skipping to next session");
                              const currentIndex = focusSessions.findIndex(s => s.id === activeSession.id);
                              const nextIndex = (currentIndex + 1) % focusSessions.length;
                              setActiveSession(focusSessions[nextIndex]);
                            }}
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2 w-full max-w-xs">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            onValueChange={(value) => {
                              setVolume(value[0]);
                              handleVolumeChange(value[0] / 100);
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border border-gray-200 shadow-sm h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Session Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">FREQUENCY</h4>
                    <div className="flex items-center gap-2 text-lg">
                      <Music className="h-4 w-4 text-purple-500" />
                      <span>{activeSession.frequency} Hz</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">DURATION</h4>
                    <p className="text-lg">{activeSession.duration / 60} minutes</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">BENEFITS</h4>
                    <p className="text-lg">{activeSession.benefits}</p>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">TIPS FOR BETTER FOCUS</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      <li>Find a quiet space free from distractions</li>
                      <li>Set clear intentions for your focus session</li>
                      <li>Stay hydrated during your session</li>
                      <li>Take deep breaths if you feel your focus waning</li>
                      <li>Use headphones for the best frequency experience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">About Focus Frequencies</h3>
            <p className="text-gray-600 mb-4">
              Sacred frequencies can enhance focus and concentration by synchronizing brainwaves to optimal states for cognitive performance. 
              The frequencies used in these sessions have been carefully selected to promote mental clarity, reduce distractions, and support sustained attention.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">396 Hz - Liberation from Fear</h4>
                <p className="text-gray-600">Helps clear mental blocks and negative thought patterns that interfere with focus.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">528 Hz - Transformation</h4>
                <p className="text-gray-600">Promotes clarity of mind and enhanced cognitive function for complex problem-solving.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">432 Hz - Natural Harmony</h4>
                <p className="text-gray-600">Aligns with the natural frequency of the universe, promoting a state of relaxed alertness ideal for focus.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {audioSrc && (
        <audio 
          ref={audioRef}
          src={audioSrc} 
          loop 
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </Layout>
  );
};

export default Focus;
