
import { MusicTaskResult } from "./types";
import { getTaskResult, addTimedOutTask } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskPollingState {
  pollingRef: React.MutableRefObject<number | null>;
  currentTaskRef: React.MutableRefObject<string | null>;
  pollingAttemptsRef: React.MutableRefObject<number>;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const MAX_POLLING_ATTEMPTS = 60; // 5 minutes max (5 seconds * 60)

export const startPolling = (
  taskId: string,
  state: TaskPollingState,
  onSuccess: (result: MusicTaskResult) => void,
  onError: (error: any) => void,
  params: any
) => {
  state.currentTaskRef.current = taskId;
  state.pollingAttemptsRef.current = 0;
  
  if (state.pollingRef.current) {
    window.clearInterval(state.pollingRef.current);
  }
  
  try {
    supabase
      .from('music_generations')
      .insert([
        {
          id: taskId,
          user_id: params.userId,
          title: params.title,
          description: params.description,
          lyrics_type: params.lyricsType,
          status: 'pending',
          intention: params.description.substring(0, 100),
          elemental_mode: 'default',
          frequency: params.frequency?.frequency || 0
        }
      ]);
    console.log("Created initial pending record in Supabase");
  } catch (error) {
    console.error("Error creating initial Supabase record:", error);
  }
  
  state.pollingRef.current = window.setInterval(() => {
    if (!state.currentTaskRef.current) {
      if (state.pollingRef.current) {
        window.clearInterval(state.pollingRef.current);
        state.pollingRef.current = null;
      }
      return;
    }
    
    state.pollingAttemptsRef.current += 1;
    console.log(`Polling attempt ${state.pollingAttemptsRef.current} for task ${state.currentTaskRef.current}`);
    
    if (state.pollingAttemptsRef.current > MAX_POLLING_ATTEMPTS) {
      console.error("Max polling attempts reached");
      
      if (state.currentTaskRef.current) {
        addTimedOutTask(state.currentTaskRef.current, 5);
        toast.info("We'll check again later to see if your music is ready.");
      }
      
      try {
        supabase
          .from('music_generations')
          .update({ status: 'pending_extended' })
          .eq('id', state.currentTaskRef.current);
      } catch (e) {
        console.error("Error updating extended status in Supabase:", e);
      }
      
      if (state.pollingRef.current) {
        window.clearInterval(state.pollingRef.current);
        state.pollingRef.current = null;
      }
      state.currentTaskRef.current = null;
      state.setIsGenerating(false);
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
          
          if (state.pollingRef.current) {
            window.clearInterval(state.pollingRef.current);
            state.pollingRef.current = null;
          }
          state.currentTaskRef.current = null;
          state.setIsGenerating(false);
          
          toast.success("Your music is ready!");
          onSuccess(result);
        } else if (result.status === "failed") {
          try {
            await supabase
              .from('music_generations')
              .update({
                status: 'failed',
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
        onError(error);
      }
    };
    
    pollTaskResult(state.currentTaskRef.current);
  }, 5000);
};

export const stopPolling = (
  pollingRef: React.MutableRefObject<number | null>,
  currentTaskRef: React.MutableRefObject<string | null>
) => {
  if (pollingRef.current) {
    window.clearInterval(pollingRef.current);
    pollingRef.current = null;
  }
  currentTaskRef.current = null;
};
