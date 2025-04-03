
import { addTimedOutTask, getTaskResult } from "@/services/api";
import { supabase } from "@/integrations/supabase/client";

interface TaskPollingRefs {
  pollingRef: React.MutableRefObject<number | null>;
  currentTaskRef: React.MutableRefObject<string | null>;
  pollingAttemptsRef: React.MutableRefObject<number>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SupabaseInfo {
  userId: string;
  title: string;
  description: string;
  lyricsType: "generate" | "user" | "instrumental";
  frequency?: number; // Make sure frequency is included
}

export const startPolling = (
  taskId: string,
  refs: TaskPollingRefs,
  onSuccess: (result: any) => void,
  onError: (error: any) => void,
  supabaseInfo: SupabaseInfo
) => {
  // Store task data in Supabase first
  const saveTaskToSupabase = async () => {
    try {
      const { error } = await supabase
        .from('music_generations')
        .insert([
          {
            id: taskId,
            user_id: supabaseInfo.userId,
            title: supabaseInfo.title,
            description: supabaseInfo.description,
            status: 'pending',
            lyrics_type: supabaseInfo.lyricsType,
            frequency: supabaseInfo.frequency || null // Include frequency in the database
          }
        ]);
      
      if (error) {
        console.error("Error saving task to Supabase:", error);
      }
    } catch (error) {
      console.error("Exception saving task to Supabase:", error);
    }
  };
  
  saveTaskToSupabase();
  
  const MAX_POLLING_TIME = 5 * 60 * 1000; // 5 minutes
  const startTime = Date.now();
  
  // Record progress
  refs.currentTaskRef.current = taskId;
  
  const pollTask = async () => {
    try {
      // Maximum polling attempts
      if (Date.now() - startTime > MAX_POLLING_TIME) {
        console.log(`Polling timed out for task ${taskId} after ${MAX_POLLING_TIME / 1000} seconds`);
        clearInterval(refs.pollingRef.current!);
        refs.pollingRef.current = null;
        refs.currentTaskRef.current = null;
        refs.setIsGenerating(false);
        
        // Add to timed out tasks for later checking
        addTimedOutTask(taskId);
        
        return;
      }
      
      refs.pollingAttemptsRef.current += 1;
      console.log(`Polling attempt ${refs.pollingAttemptsRef.current} for task ${taskId}`);
      
      const result = await getTaskResult(taskId);
      
      if (result.status === "completed" && result.result) {
        console.log("Task completed:", result);
        
        clearInterval(refs.pollingRef.current!);
        refs.pollingRef.current = null;
        refs.currentTaskRef.current = null;
        refs.setIsGenerating(false);
        
        onSuccess(result);
        
        // Update Supabase with completed status
        const { error } = await supabase
          .from('music_generations')
          .update({
            status: 'completed',
            music_url: result.result.music_url,
            cover_url: result.result.cover_url || null
          })
          .eq('id', taskId);
        
        if (error) {
          console.error("Error updating task status in Supabase:", error);
        }
      } else if (result.status === "failed") {
        console.error("Task failed:", result);
        
        clearInterval(refs.pollingRef.current!);
        refs.pollingRef.current = null;
        refs.currentTaskRef.current = null;
        refs.setIsGenerating(false);
        
        onError(new Error(result.error || "Task failed"));
        
        // Update Supabase with failed status
        const { error } = await supabase
          .from('music_generations')
          .update({
            status: 'failed'
          })
          .eq('id', taskId);
        
        if (error) {
          console.error("Error updating task status in Supabase:", error);
        }
      } else {
        console.log(`Task ${taskId} status: ${result.status}`);
      }
    } catch (error) {
      console.error("Error polling task:", error);
    }
  };
  
  // Start polling immediately and then continue at regular intervals
  pollTask();
  
  // Poll every 3 seconds
  refs.pollingRef.current = window.setInterval(pollTask, 3000);
};

export const stopPolling = (
  pollingRef: React.MutableRefObject<number | null>,
  currentTaskRef: React.MutableRefObject<string | null>
) => {
  if (pollingRef.current) {
    clearInterval(pollingRef.current);
    pollingRef.current = null;
  }
  
  currentTaskRef.current = null;
};
