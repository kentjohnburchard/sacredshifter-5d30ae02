
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { 
  generateMusic, 
  getTaskResult, 
  MusicGenerationRequest, 
  MusicTaskResult 
} from "../services/api";

export interface GeneratedTrack {
  id: string;
  title: string; // Added title field
  description: string;
  musicUrl: string;
  coverUrl?: string;
  timestamp: Date;
  lyrics_type: "generate" | "user" | "instrumental"; // Update the type here
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
          handleError(new Error("Generation is taking too long. Please try again."));
          return;
        }
        
        // We need to use a closure function here to avoid React hook issues
        const pollTaskResult = async (taskId: string) => {
          try {
            const result = await getTaskResult(taskId);
            console.log("Polling result:", result);
            
            if (result.status === "completed" && result.result) {
              // Add new track
              const newTrack: GeneratedTrack = {
                id: result.task_id,
                title: params.title, // Add the title from params
                description: params.gpt_description_prompt,
                musicUrl: result.result.music_url,
                coverUrl: result.result.cover_url,
                timestamp: new Date(),
                lyrics_type: params.lyrics_type
              };
              
              console.log("Music generation completed successfully:", newTrack);
              setGeneratedTracks(prev => [newTrack, ...prev]);
              
              // Cleanup
              if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              currentTaskRef.current = null;
              setIsGenerating(false);
              
              toast.success("Your music is ready!");
            } else if (result.status === "failed") {
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
  }, [isGenerating, handleError]);

  const deleteTrack = useCallback((id: string) => {
    setGeneratedTracks(prev => prev.filter(track => track.id !== id));
    toast.info("Track deleted");
  }, []);

  return {
    isGenerating,
    generatedTracks,
    startGeneration,
    deleteTrack
  };
};
