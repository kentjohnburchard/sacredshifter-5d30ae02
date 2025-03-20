import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { 
  generateMusic, 
  getTaskResult, 
  MusicGenerationRequest,
  addTimedOutTask,
  checkTimedOutTasks
} from "../services/api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface GeneratedTrack {
  id: string;
  title: string;
  description: string;
  musicUrl: string;
  coverUrl?: string;
  timestamp: Date;
  lyrics_type: "generate" | "user" | "instrumental";
}

export const useMusicGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>(() => {
    const saved = localStorage.getItem("generatedTracks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const { user } = useAuth();
  const pollingRef = useRef<number | null>(null);
  const currentTaskRef = useRef<string | null>(null);
  const pollingAttemptsRef = useRef(0);
  const MAX_POLLING_ATTEMPTS = 60; // 5 minutes max (5 seconds * 60)
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTracksFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('music_generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching from Supabase:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const tracks: GeneratedTrack[] = data.map(item => ({
            id: item.id,
            title: item.title || "Untitled",
            description: item.description || "",
            musicUrl: item.music_url || "",
            coverUrl: item.cover_url,
            timestamp: new Date(item.created_at || new Date()),
            lyrics_type: item.lyrics_type as "generate" | "user" | "instrumental" || "generate"
          })).filter(track => track.musicUrl);
          
          const savedTracks = localStorage.getItem("generatedTracks");
          const localTracks: GeneratedTrack[] = savedTracks ? JSON.parse(savedTracks) : [];
          
          const supabaseTrackIds = new Set(tracks.map(track => track.id));
          
          const mergedTracks = [
            ...tracks,
            ...localTracks.filter(track => !supabaseTrackIds.has(track.id))
          ];
          
          setGeneratedTracks(mergedTracks);
        }
      } catch (error) {
        console.error("Error fetching music history:", error);
      }
    };
    
    fetchTracksFromSupabase();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUserCredits(null);
      return;
    }

    const fetchUserCredits = async () => {
      try {
        const { data, error } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', user.id);
        
        if (error) {
          console.error("Error fetching user credits:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setUserCredits(data[0].balance);
        } else {
          setUserCredits(0);
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
      }
    };
    
    fetchUserCredits();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("generatedTracks", JSON.stringify(generatedTracks));
  }, [generatedTracks]);

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
    
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    currentTaskRef.current = null;
    setIsGenerating(false);
  }, []);

  const saveToSupabase = useCallback(async (track: GeneratedTrack) => {
    if (!user) {
      console.log("User not authenticated, skipping Supabase save");
      return;
    }

    try {
      const { data: existingData } = await supabase
        .from('music_generations')
        .select('id')
        .eq('id', track.id)
        .maybeSingle();
      
      if (existingData) {
        console.log("Track already exists in Supabase, updating:", track.id);
        
        const { error: updateError } = await supabase
          .from('music_generations')
          .update({
            title: track.title,
            description: track.description,
            music_url: track.musicUrl,
            cover_url: track.coverUrl,
            lyrics_type: track.lyrics_type,
            status: 'completed'
          })
          .eq('id', track.id);
          
        if (updateError) {
          console.error("Error updating Supabase record:", updateError);
        } else {
          console.log("Successfully updated track in Supabase:", track.id);
        }
      } else {
        console.log("Creating new track in Supabase:", track.id);
        
        const { error: insertError } = await supabase
          .from('music_generations')
          .insert([
            {
              id: track.id,
              user_id: user.id,
              title: track.title,
              description: track.description,
              music_url: track.musicUrl,
              cover_url: track.coverUrl,
              lyrics_type: track.lyrics_type,
              status: 'completed',
              created_at: new Date().toISOString(),
              intention: track.description.substring(0, 100),
              elemental_mode: 'default',
              frequency: 0
            }
          ]);
          
        if (insertError) {
          console.error("Error saving to Supabase:", insertError);
        } else {
          console.log("Successfully saved track to Supabase:", track.id);
        }
      }
    } catch (error) {
      console.error("Error during Supabase save:", error);
    }
  }, [user]);

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
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', user.id);
      
      if (creditsError) {
        console.error("Error checking user credits:", creditsError);
        toast.error("Could not check your credit balance");
        return;
      }
      
      const creditBalance = creditsData && creditsData.length > 0 ? creditsData[0].balance : 0;
      
      const GENERATION_COST = 5;
      
      if (creditBalance < GENERATION_COST) {
        toast.error(`Insufficient credits. You need ${GENERATION_COST} credits to generate music. Please subscribe to get more credits.`);
        return;
      }
      
      setIsGenerating(true);
      pollingAttemptsRef.current = 0;
      
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      console.log("Starting generation with params:", params);
      const response = await generateMusic(params);
      
      if (!response || !response.task_id) {
        throw new Error("Failed to get task ID from API");
      }
      
      currentTaskRef.current = response.task_id;
      console.log("Generation started with task ID:", response.task_id);
      
      try {
        await supabase
          .from('music_generations')
          .insert([
            {
              id: response.task_id,
              user_id: user.id,
              title: params.title,
              description: params.gpt_description_prompt,
              lyrics_type: params.lyrics_type,
              status: 'pending',
              intention: params.gpt_description_prompt.substring(0, 100),
              elemental_mode: 'default',
              frequency: 0
            }
          ]);
        console.log("Created initial pending record in Supabase");
      } catch (error) {
        console.error("Error creating initial Supabase record:", error);
      }
      
      try {
        const { data: deductResult, error: deductError } = await supabase
          .rpc('use_generation_credit', {
            user_id: user.id,
            credit_cost: GENERATION_COST
          });
        
        if (deductError) {
          console.error("Error deducting credits:", deductError);
          throw new Error("Failed to deduct credits");
        }
        
        if (!deductResult) {
          throw new Error("Insufficient credits");
        }
        
        setUserCredits(prevCredits => 
          prevCredits !== null ? prevCredits - GENERATION_COST : null
        );
      } catch (error) {
        console.error("Error processing credits:", error);
        toast.error("Failed to process credits");
        throw error;
      }
      
      toast.success("Music generation started");
      
      pollingRef.current = window.setInterval(() => {
        if (!currentTaskRef.current) {
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          return;
        }
        
        pollingAttemptsRef.current += 1;
        console.log(`Polling attempt ${pollingAttemptsRef.current} for task ${currentTaskRef.current}`);
        
        if (pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          console.error("Max polling attempts reached");
          
          if (currentTaskRef.current) {
            addTimedOutTask(currentTaskRef.current, 5);
            toast.info("We'll check again later to see if your music is ready.");
          }
          
          try {
            supabase
              .from('music_generations')
              .update({ status: 'pending_extended' })
              .eq('id', currentTaskRef.current);
          } catch (e) {
            console.error("Error updating extended status in Supabase:", e);
          }
          
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          currentTaskRef.current = null;
          setIsGenerating(false);
          return;
        }
        
        const pollTaskResult = async (taskId: string) => {
          try {
            const result = await getTaskResult(taskId);
            console.log("Polling result:", result);
            
            try {
              await supabase
                .from('music_generations')
                .update({ status: result.status })
                .eq('id', taskId);
            } catch (e) {
              console.error("Error updating status in Supabase:", e);
            }
            
            if (result.status === "completed" && result.result) {
              if (!result.result.music_url) {
                console.error("Completed status received but no music URL was provided");
                throw new Error("Music generation completed but no music was produced");
              }
              
              const newTrack: GeneratedTrack = {
                id: result.task_id,
                title: params.title,
                description: params.gpt_description_prompt,
                musicUrl: result.result.music_url,
                coverUrl: result.result.cover_url,
                timestamp: new Date(),
                lyrics_type: params.lyrics_type
              };
              
              setGeneratedTracks(prev => [newTrack, ...prev]);
              
              saveToSupabase(newTrack);
              
              if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              currentTaskRef.current = null;
              setIsGenerating(false);
              
              toast.success("Your music is ready!");
            } else if (result.status === "failed") {
              try {
                await supabase
                  .from('music_generations')
                  .update({
                    status: 'failed',
                    // Store error message in a suitable column if available
                  })
                  .eq('id', taskId);
              } catch (e) {
                console.error("Error updating failed status in Supabase:", e);
              }
              
              throw new Error(result.error || "Generation failed");
            } else {
              console.log(`Task status: ${result.status}. Continuing to poll...`);
            }
          } catch (error) {
            handleError(error);
          }
        };
        
        pollTaskResult(currentTaskRef.current);
      }, 5000);
    } catch (error) {
      handleError(error);
    }
  }, [isGenerating, handleError, saveToSupabase, user]);

  const deleteTrack = useCallback(async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete music");
      return;
    }

    try {
      const { error } = await supabase
        .from('music_generations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error deleting from Supabase:", error);
      }
      
      setGeneratedTracks(prev => prev.filter(track => track.id !== id));
      toast.info("Track deleted");
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
