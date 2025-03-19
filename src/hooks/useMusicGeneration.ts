
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
  description: string;
  musicUrl: string;
  coverUrl?: string;
  timestamp: Date;
  lyrics_type: "instrumental" | "lyrical";
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

  const startGeneration = useCallback(async (params: MusicGenerationRequest) => {
    if (isGenerating) {
      toast.warning("A generation is already in progress");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateMusic(params);
      currentTaskRef.current = response.task_id;
      
      toast.success("Music generation started");
      
      // Start polling for results
      pollingRef.current = window.setInterval(async () => {
        if (!currentTaskRef.current) return;
        
        try {
          const result = await getTaskResult(currentTaskRef.current);
          
          if (result.status === "completed" && result.result) {
            // Add new track
            const newTrack: GeneratedTrack = {
              id: result.task_id,
              description: params.gpt_description_prompt,
              musicUrl: result.result.music_url,
              coverUrl: result.result.cover_url,
              timestamp: new Date(),
              lyrics_type: params.lyrics_type
            };
            
            setGeneratedTracks(prev => [newTrack, ...prev]);
            
            // Cleanup
            window.clearInterval(pollingRef.current!);
            pollingRef.current = null;
            currentTaskRef.current = null;
            setIsGenerating(false);
            
            toast.success("Your music is ready!");
          } else if (result.status === "failed") {
            throw new Error(result.error || "Generation failed");
          }
          // "pending" or "running" status will continue polling
        } catch (error) {
          handleError(error);
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      handleError(error);
    }
  }, [isGenerating]);

  const handleError = (error: any) => {
    console.error("Music generation error:", error);
    toast.error(error.message || "Failed to generate music");
    
    // Cleanup
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    currentTaskRef.current = null;
    setIsGenerating(false);
  };

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
