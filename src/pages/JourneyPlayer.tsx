import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { JourneyPlayer as FrequencyJourneyPlayer } from "@/components/frequency-journey";
import { supabase } from "@/integrations/supabase/client";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer, Headphones, HeadphoneOff, Volume2 } from "lucide-react";
import { useAudioLibrary } from "@/hooks/useAudioLibrary";

interface JourneySettings {
  lowSensitivityMode: boolean;
  useHeadphones: boolean;
  sleepTimer: number;
  saveToTimeline: boolean;
}

const JourneyPlayer = () => {
  const { frequencyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState<FrequencyLibraryItem | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [intention, setIntention] = useState("");
  const [audioGroupId, setAudioGroupId] = useState<string | null>(null);
  const [directAudioUrl, setDirectAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getByFrequency } = useAudioLibrary();
  
  const [settings, setSettings] = useState<JourneySettings>({
    lowSensitivityMode: false,
    useHeadphones: true,
    sleepTimer: 0,
    saveToTimeline: true
  });
  
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  useEffect(() => {
    const savedSettings = sessionStorage.getItem('journeySettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        if (parsedSettings.sleepTimer > 0) {
          setTimeRemaining(parsedSettings.sleepTimer * 60);
        }
      } catch (err) {
        console.error("Error parsing journey settings:", err);
      }
    }
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            toast.info("Sleep timer completed");
            navigate(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRemaining, navigate]);
  
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  useEffect(() => {
    if (!frequencyId) return;
    setLoading(true);
    
    // Check if the frequencyId is a URL (direct audio path)
    if (frequencyId.includes('http') || frequencyId.includes('supabase')) {
      try {
        const decodedUrl = decodeURIComponent(frequencyId);
        setDirectAudioUrl(decodedUrl);
        console.log("Setting direct audio URL:", decodedUrl);
        
        const syntheticFrequency: FrequencyLibraryItem = {
          id: 'direct-audio',
          title: 'Journey Experience',
          frequency: 528,
          description: 'A healing frequency journey experience.',
          audio_url: decodedUrl
        };
        setFrequency(syntheticFrequency);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error decoding URL:", error);
        setError("Invalid audio URL");
        toast.error("Invalid audio URL");
        navigate("/journey-templates");
        return;
      }
    }
    
    const loadFrequency = async () => {
      try {
        // First try direct frequency lookup
        const { data: frequencyData, error } = await supabase
          .from("frequency_library")
          .select("*")
          .eq("frequency", Number(frequencyId))
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching frequency:", error);
          throw new Error("Error loading frequency data");
        }
        
        if (frequencyData) {
          console.log("Found frequency in library:", frequencyData);
          setFrequency(frequencyData);
          if (frequencyData.group_id) {
            setAudioGroupId(frequencyData.group_id);
          }
        } else {
          // If not found in frequency_library, try getting from audioLibrary hook
          console.log("Trying to get frequency from audio library hook:", frequencyId);
          const audioTrack = await getByFrequency(Number(frequencyId));
          
          if (audioTrack) {
            console.log("Found frequency in audio library:", audioTrack);
            const syntheticFrequency: FrequencyLibraryItem = {
              id: audioTrack.id,
              title: audioTrack.title,
              frequency: audioTrack.frequency,
              chakra: audioTrack.chakra || "",
              audio_url: audioTrack.audioUrl,
              description: audioTrack.description || "",
            };
            setFrequency(syntheticFrequency);
            if (audioTrack.groupId) {
              setAudioGroupId(audioTrack.groupId);
            }
          } else {
            // As a fallback, create a default frequency object
            console.log("Creating synthetic frequency:", frequencyId);
            const numericFrequency = Number(frequencyId);
            if (!isNaN(numericFrequency)) {
              const syntheticFrequency: FrequencyLibraryItem = {
                id: `synthetic-${frequencyId}`,
                title: `${numericFrequency}Hz Journey`,
                frequency: numericFrequency,
                description: `Experience the healing vibrations of ${numericFrequency}Hz frequency.`,
                audio_url: null
              };
              setFrequency(syntheticFrequency);
            } else {
              throw new Error("Invalid frequency value");
            }
          }
        }
      } catch (err: any) {
        console.error("Error in frequency lookup:", err);
        setError(err.message || "Failed to load frequency data");
        toast.error("Failed to load frequency data");
      } finally {
        setLoading(false);
      }
    };
    
    loadFrequency();
  }, [frequencyId, navigate, getByFrequency]);

  const startSession = async (userIntention: string) => {
    if (!user || !frequency) return;
    
    try {
      const { data: sessionData, error } = await supabase
        .from("sessions")
        .insert([
          {
            user_id: user.id,
            frequency_id: frequency.id,
            intention: userIntention,
            initial_mood: "neutral",
            settings: settings
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (sessionData && sessionData.length > 0) {
        setSessionId(sessionData[0].id);
        setIntention(userIntention);
        toast.success("Journey session started");
        
        if (settings.saveToTimeline) {
          const { error: timelineError } = await supabase
            .from('timeline_snapshots')
            .insert([{
              user_id: user.id,
              title: `${frequency.frequency}Hz Journey`,
              notes: `Started a frequency journey with ${frequency.frequency}Hz`,
              tag: "journey_start",
              intention: userIntention,
              frequency: frequency.frequency,
              chakra: frequency.chakra || null,
              tags: ["journey", frequency.chakra || "frequency", frequency.id === 'silent-tune' ? "silent_tune" : ""]
            }]);
            
          if (timelineError) {
            console.error("Error creating timeline entry:", timelineError);
          }
        }
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to start journey session");
    }
  };

  const logReflection = async (reflectionText: string) => {
    if (!user || !sessionId) return;
    
    try {
      const { error } = await supabase
        .from("session_reflections")
        .insert([
          {
            user_id: user.id,
            session_id: sessionId,
            content: reflectionText,
            timestamp: new Date().toISOString()
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      if (settings.saveToTimeline && frequency) {
        const { error: timelineError } = await supabase
          .from('timeline_snapshots')
          .insert([{
            user_id: user.id,
            title: `${frequency.frequency}Hz Journey Reflection`,
            notes: reflectionText,
            tag: "reflection",
            intention: intention,
            frequency: frequency.frequency,
            chakra: frequency.chakra || null,
            tags: ["reflection", frequency.chakra || "frequency", frequency.id === 'silent-tune' ? "silent_tune" : ""]
          }]);
          
        if (timelineError) {
          console.error("Error saving reflection to timeline:", timelineError);
        }
      }
      
      toast.success("Reflection saved");
    } catch (error) {
      console.error("Failed to save reflection:", error);
      toast.error("Failed to save your reflection");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="flex items-center justify-center p-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading journey experience...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !frequency) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
              <p className="text-red-500">Failed to load journey: {error || "Frequency not found"}</p>
              <Button onClick={() => navigate("/journey-templates")}>
                Back to Journey Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            {settings.lowSensitivityMode && (
              <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                <Volume2 className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-700">Low Sensitivity</span>
              </div>
            )}
            
            {!settings.useHeadphones && (
              <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                <HeadphoneOff className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700">Speaker Mode</span>
              </div>
            )}
            
            {timeRemaining !== null && timeRemaining > 0 && (
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                <Timer className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>
        
        <FrequencyJourneyPlayer
          frequency={frequency}
          onSessionStart={startSession}
          onReflectionSubmit={logReflection}
          currentIntention={intention}
          sessionId={sessionId}
          audioGroupId={audioGroupId}
          audioUrl={directAudioUrl}
          journeySettings={settings}
        />
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
