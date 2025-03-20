
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { 
  generateMusic, 
  getTaskResult, 
  MusicGenerationRequest, 
  MusicTaskResult 
} from "../services/api";
import { supabase } from "@/integrations/supabase/client";

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
    // Load from localStorage on init
    const saved = localStorage.getItem("generatedTracks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const pollingRef = useRef<number | null>(null);
  const currentTaskRef = useRef<string | null>(null);
  const pollingAttemptsRef = useRef(0);
  const MAX_POLLING_ATTEMPTS = 60; // 5 minutes max (5 seconds * 60)

  // Fetch tracks from Supabase on init
  useEffect(() => {
    const fetchTracksFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('music_generations')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching from Supabase:", error);
          return;
        }
        
        if (data && data.length > 0) {
          // Convert Supabase data to GeneratedTrack format
          const tracks: GeneratedTrack[] = data.map(item => ({
            id: item.id,
            title: item.title || "Untitled",
            description: item.description || "",
            musicUrl: item.music_url || "",
            coverUrl: item.cover_url,
            timestamp: new Date(item.created_at || new Date()),
            lyrics_type: item.lyrics_type as "generate" | "user" | "instrumental" || "generate"
          })).filter(track => track.musicUrl); // Only include tracks with valid URLs
          
          // Merge with localStorage, giving preference to Supabase data
          const savedTracks = localStorage.getItem("generatedTracks");
          const localTracks: GeneratedTrack[] = savedTracks ? JSON.parse(savedTracks) : [];
          
          // Create a map of Supabase track IDs for fast lookup
          const supabaseTrackIds = new Set(tracks.map(track => track.id));
          
          // Add any local tracks that aren't in Supabase
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
  }, []);

  // Save to localStorage when tracks change
  useEffect(() => {
    localStorage.setItem("generatedTracks", JSON.stringify(generatedTracks));
  }, [generatedTracks]);

  // Cleanup polling on unmount
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
    
    // Cleanup
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    currentTaskRef.current = null;
    setIsGenerating(false);
  }, []);

  const saveToSupabase = useCallback(async (track: GeneratedTrack) => {
    try {
      // First check if this track already exists in Supabase
      const { data: existingData } = await supabase
        .from('music_generations')
        .select('id')
        .eq('id', track.id)
        .maybeSingle();
      
      if (existingData) {
        console.log("Track already exists in Supabase, updating:", track.id);
        
        // Update existing record
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
        
        // Insert new record
        const { error: insertError } = await supabase
          .from('music_generations')
          .insert([
            {
              id: track.id,
              title: track.title,
              description: track.description,
              music_url: track.musicUrl,
              cover_url: track.coverUrl,
              lyrics_type: track.lyrics_type,
              status: 'completed',
              created_at: new Date().toISOString(),
              // These are required fields based on the table structure
              intention: track.description.substring(0, 100), // Using description as intention
              elemental_mode: 'default', // Default value
              frequency: 0 // Default value
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
  }, []);

  const startGeneration = useCallback(async (params: MusicGenerationRequest) => {
    if (isGenerating) {
      toast.warning("A generation is already in progress");
      return;
    }

    try {
      setIsGenerating(true);
      pollingAttemptsRef.current = 0;
      
      // Make sure we don't have an ongoing polling interval
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
      
      // Create initial Supabase record with pending status
      try {
        await supabase
          .from('music_generations')
          .insert([
            {
              id: response.task_id,
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
        // Continue anyway as this is not critical
      }
      
      toast.success("Music generation started");
      
      // Start polling for results
      pollingRef.current = window.setInterval(() => {
        if (!currentTaskRef.current) {
          // Clear the interval if we don't have a task ID
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          return;
        }
        
        pollingAttemptsRef.current += 1;
        console.log(`Polling attempt ${pollingAttemptsRef.current} for task ${currentTaskRef.current}`);
        
        // Check if we've reached the maximum polling attempts
        if (pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
          console.error("Max polling attempts reached");
          
          // Update Supabase status to failed
          try {
            supabase
              .from('music_generations')
              .update({ status: 'failed' })
              .eq('id', currentTaskRef.current);
          } catch (e) {
            console.error("Error updating failed status in Supabase:", e);
          }
          
          handleError(new Error("Generation is taking too long. Please try again."));
          return;
        }
        
        // We need to use a closure function here to avoid React hook issues
        const pollTaskResult = async (taskId: string) => {
          try {
            const result = await getTaskResult(taskId);
            console.log("Polling result:", result);
            
            // Update status in Supabase regardless of completion
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
              
              // Add new track
              const newTrack: GeneratedTrack = {
                id: result.task_id,
                title: params.title,
                description: params.gpt_description_prompt,
                musicUrl: result.result.music_url,
                coverUrl: result.result.cover_url,
                timestamp: new Date(),
                lyrics_type: params.lyrics_type
              };
              
              console.log("Music generation completed successfully:", newTrack);
              setGeneratedTracks(prev => [newTrack, ...prev]);
              
              // Save to Supabase with completed status and URLs
              saveToSupabase(newTrack);
              
              // Cleanup
              if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              currentTaskRef.current = null;
              setIsGenerating(false);
              
              toast.success("Your music is ready!");
            } else if (result.status === "failed") {
              // Update Supabase with error details
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
            // "pending" or "running" status will continue polling
          } catch (error) {
            handleError(error);
          }
        };
        
        // Call the function with the current task ID
        pollTaskResult(currentTaskRef.current);
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      handleError(error);
    }
  }, [isGenerating, handleError, saveToSupabase]);

  const deleteTrack = useCallback(async (id: string) => {
    try {
      // Delete from Supabase first
      const { error } = await supabase
        .from('music_generations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting from Supabase:", error);
      }
      
      // Then update local state
      setGeneratedTracks(prev => prev.filter(track => track.id !== id));
      toast.info("Track deleted");
    } catch (error) {
      console.error("Error during track deletion:", error);
      toast.error("Failed to delete track");
    }
  }, []);

  return {
    isGenerating,
    generatedTracks,
    startGeneration,
    deleteTrack
  };
};
