
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
import { ArrowLeft } from "lucide-react";
import { useAudioLibrary } from "@/hooks/useAudioLibrary";

const JourneyPlayer = () => {
  const { frequencyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState<FrequencyLibraryItem | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [intention, setIntention] = useState("");
  const [audioGroupId, setAudioGroupId] = useState<string | null>(null);
  const [directAudioUrl, setDirectAudioUrl] = useState<string | null>(null);
  const { getByFrequency } = useAudioLibrary();
  
  useEffect(() => {
    if (!frequencyId) return;
    
    // If the frequencyId is a URL (contains http/s), use it as direct audio
    if (frequencyId.startsWith('http')) {
      setDirectAudioUrl(decodeURIComponent(frequencyId));
      
      // Create a synthetic frequency object
      const syntheticFrequency: FrequencyLibraryItem = {
        id: 'direct-audio',
        title: 'Journey Experience',
        frequency: 528, // Default to 528Hz
        description: 'A healing frequency journey experience.',
        audio_url: decodeURIComponent(frequencyId)
      };
      setFrequency(syntheticFrequency);
      return;
    }
    
    const loadFrequency = async () => {
      try {
        // First try to find by exact frequency value
        const { data: frequencyData, error } = await supabase
          .from("frequency_library")
          .select("*")
          .eq("frequency", Number(frequencyId))
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching frequency:", error);
          toast.error("Error loading frequency data");
          return;
        }
        
        if (frequencyData) {
          setFrequency(frequencyData);
          if (frequencyData.group_id) {
            setAudioGroupId(frequencyData.group_id);
          }
        } else {
          // If not found by exact match, try to find nearest frequency
          // This is now handled by our useAudioLibrary hook
          const audioTrack = await getByFrequency(Number(frequencyId));
          if (audioTrack) {
            // Create a synthetic frequency item from the audio track
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
            toast.error("Specific frequency not found in library");
            navigate("/frequency-library");
          }
        }
      } catch (err) {
        console.error("Error in frequency lookup:", err);
        toast.error("Failed to load frequency data");
      }
    };
    
    loadFrequency();
  }, [frequencyId, navigate, getByFrequency]);

  const startSession = async (userIntention: string) => {
    if (!user || !frequency) return;
    
    try {
      // Create a session record
      const { data: sessionData, error } = await supabase
        .from("sessions")
        .insert([
          {
            user_id: user.id,
            frequency_id: frequency.id,
            intention: userIntention,
            initial_mood: "neutral" // Default value
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
        
        // Create an initial timeline entry for this session
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
            tags: ["journey", frequency.chakra || "frequency"]
          }]);
          
        if (timelineError) {
          console.error("Error creating timeline entry:", timelineError);
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
      
      // Also save the reflection to the timeline
      if (frequency) {
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
            tags: ["reflection", frequency.chakra || "frequency"]
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

  if (!frequency) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="flex items-center justify-center p-10">
              <p>Loading journey experience...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <FrequencyJourneyPlayer
          frequency={frequency}
          onSessionStart={startSession}
          onReflectionSubmit={logReflection}
          currentIntention={intention}
          sessionId={sessionId}
          audioGroupId={audioGroupId}
          audioUrl={directAudioUrl}
        />
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
