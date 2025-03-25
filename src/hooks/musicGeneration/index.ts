
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { generateMusic, checkTimedOutTasks } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { startPolling, stopPolling } from "./taskPolling";
import { 
  fetchTracksFromSupabase, 
  saveTrackToSupabase, 
  fetchUserCredits,
  useGenerationCredit,
  deleteTrackFromSupabase
} from "./supabaseOperations";
import { 
  GeneratedTrack, 
  MusicGenerationRequest,
  UseMusicGenerationResult 
} from "./types";

export * from "./types";

export const useMusicGeneration = (): UseMusicGenerationResult => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>(() => {
    const saved = localStorage.getItem("generatedTracks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const { user } = useAuth();
  const pollingRef = useRef<number | null>(null);
  const currentTaskRef = useRef<string | null>(null);
  const pollingAttemptsRef = useRef(0);
  const [userCredits, setUserCredits] = useState<number | null>(null);

  // Fetch tracks from Supabase on mount
  useEffect(() => {
    if (!user) return;

    const loadTracksFromSupabase = async () => {
      const tracks = await fetchTracksFromSupabase(user.id);
      
      if (tracks.length > 0) {
        const savedTracks = localStorage.getItem("generatedTracks");
        const localTracks: GeneratedTrack[] = savedTracks ? JSON.parse(savedTracks) : [];
        
        const supabaseTrackIds = new Set(tracks.map(track => track.id));
        
        const mergedTracks = [
          ...tracks,
          ...localTracks.filter(track => !supabaseTrackIds.has(track.id))
        ];
        
        setGeneratedTracks(mergedTracks);
      }
    };
    
    loadTracksFromSupabase();
  }, [user]);

  // Fetch user credits on mount
  useEffect(() => {
    if (!user) {
      setUserCredits(null);
      return;
    }

    const loadUserCredits = async () => {
      const credits = await fetchUserCredits(user.id);
      setUserCredits(credits);
    };
    
    loadUserCredits();
  }, [user]);

  // Save tracks to localStorage on change
  useEffect(() => {
    localStorage.setItem("generatedTracks", JSON.stringify(generatedTracks));
  }, [generatedTracks]);

  // Check for timed out tasks periodically
  useEffect(() => {
    const checkInterval = window.setInterval(async () => {
      try {
        const results = await checkTimedOutTasks();
        
        for (const result of results) {
          if (result.status === "completed" && result.result) {
            const { data, error } = await supabase
              .from('music_generations')
              .select('title, description, lyrics_type')
              .eq('id', result.task_id)
              .single();
            
            if (error || !data) {
              console.error("Could not find original task details:", error);
              continue;
            }
            
            const newTrack: GeneratedTrack = {
              id: result.task_id,
              title: data.title || "Untitled",
              description: data.description || "",
              musicUrl: result.result.music_url,
              coverUrl: result.result.cover_url,
              timestamp: new Date(),
              lyrics_type: data.lyrics_type as "generate" | "user" | "instrumental"
            };
            
            setGeneratedTracks(prev => {
              if (prev.some(track => track.id === newTrack.id)) {
                return prev;
              }
              return [newTrack, ...prev];
            });
            
            await supabase
              .from('music_generations')
              .update({
                status: 'completed',
                music_url: result.result.music_url,
                cover_url: result.result.cover_url
              })
              .eq('id', result.task_id);
            
            toast.success(`Your music "${data.title}" is now ready!`);
          }
        }
      } catch (error) {
        console.error("Error checking timed out tasks:", error);
      }
    }, 30000);
    
    return () => {
      window.clearInterval(checkInterval);
    };
  }, []);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("Music generation error:", error);
    toast.error(error.message || "Failed to generate music");
    
    stopPolling(pollingRef, currentTaskRef);
    setIsGenerating(false);
  }, []);

  const startGeneration = useCallback(async (params: MusicGenerationRequest) => {
    if (isGenerating) {
      toast.warning("A generation is already in progress");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to generate music");
      return;
    }

    try {
      const creditBalance = await fetchUserCredits(user.id);
      
      const GENERATION_COST = 5;
      
      if (creditBalance !== null && creditBalance < GENERATION_COST) {
        toast.error(`Insufficient credits. You need ${GENERATION_COST} credits to generate music. Please subscribe to get more credits.`);
        return;
      }
      
      setIsGenerating(true);
      
      console.log("Starting generation with params:", params);
      const response = await generateMusic(params);
      
      if (!response || !response.task_id) {
        throw new Error("Failed to get task ID from API");
      }
      
      await useGenerationCredit(user.id, GENERATION_COST);
      setUserCredits(prevCredits => 
        prevCredits !== null ? prevCredits - GENERATION_COST : null
      );
      
      toast.success("Music generation started");
      
      // Start polling for results
      startPolling(
        response.task_id,
        { 
          pollingRef, 
          currentTaskRef, 
          pollingAttemptsRef, 
          setIsGenerating 
        },
        (result) => {
          // On success callback
          const newTrack: GeneratedTrack = {
            id: result.task_id,
            title: params.title,
            description: params.gpt_description_prompt,
            musicUrl: result.result!.music_url,
            coverUrl: result.result!.cover_url,
            timestamp: new Date(),
            lyrics_type: params.lyrics_type
          };
          
          setGeneratedTracks(prev => [newTrack, ...prev]);
          saveTrackToSupabase(newTrack, user);
        },
        handleError,
        {
          userId: user.id,
          title: params.title,
          description: params.gpt_description_prompt,
          lyricsType: params.lyrics_type,
          frequency: params.frequency
        }
      );
    } catch (error) {
      handleError(error);
    }
  }, [isGenerating, handleError, user]);

  const deleteTrack = useCallback(async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete music");
      return;
    }

    try {
      const deleted = await deleteTrackFromSupabase(id, user.id);
      
      if (deleted) {
        setGeneratedTracks(prev => prev.filter(track => track.id !== id));
        toast.info("Track deleted");
      } else {
        toast.error("Failed to delete track");
      }
    } catch (error) {
      console.error("Error during track deletion:", error);
      toast.error("Failed to delete track");
    }
  }, [user]);

  return {
    isGenerating,
    generatedTracks,
    startGeneration,
    deleteTrack,
    userCredits
  };
};

export default useMusicGeneration;
