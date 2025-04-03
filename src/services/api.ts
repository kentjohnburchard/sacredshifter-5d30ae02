const API_KEY = "90ae5a4ea209519a1f59f1d3f98de47e33aecb05cf32a2b708cc3f8d6e9fbd2a";
const API_BASE_URL = "https://api.piapi.ai/api/v1/task";

export interface MusicGenerationRequest {
  negative_tags?: string;
  gpt_description_prompt: string;
  lyrics_type: "generate" | "user" | "instrumental"; 
  title: string;
  seed?: number;
  make_instrumental?: boolean;
  frequency?: number;
}

export interface MusicGenerationResponse {
  task_id: string;
  status: string;
}

export interface MusicTaskResult {
  task_id: string;
  status: string;
  result?: {
    music_url: string;
    cover_url?: string;
  };
  error?: string;
}

const timedOutTasks = new Map<string, {
  lastChecked: number,
  retryCount: number,
  maxRetries: number
}>();

export const generateMusic = async (params: MusicGenerationRequest): Promise<MusicGenerationResponse> => {
  try {
    const apiParams = { ...params };
    
    if (params.lyrics_type === "instrumental") {
      apiParams.make_instrumental = true;
    }
    
    if (params.frequency) {
      const frequencyText = `This track should incorporate the healing frequency of ${params.frequency}Hz. `;
      apiParams.gpt_description_prompt = frequencyText + apiParams.gpt_description_prompt;
    }
    
    console.log("Sending API request with params:", apiParams);
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      },
      body: JSON.stringify({
        model: "music-u",
        task_type: "generate_music",
        input: apiParams
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(errorData.message || "Failed to generate music");
    }

    const data = await response.json();
    console.log("API success response:", data);
    
    if (data && data.code === 200 && data.data && data.data.task_id) {
      return {
        task_id: data.data.task_id,
        status: data.data.status || "pending"
      };
    } else {
      console.error("Unexpected API response structure:", data);
      throw new Error("Failed to get task ID from API response");
    }
  } catch (error) {
    console.error("Error generating music:", error);
    throw error;
  }
};

export const getTaskResult = async (taskId: string): Promise<MusicTaskResult> => {
  try {
    console.log(`Checking task result for ID: ${taskId}`);
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Task result error:", errorData);
      throw new Error(errorData.message || "Failed to get task result");
    }

    const data = await response.json();
    console.log("Task result response:", data);
    
    if (data && data.code === 200 && data.data) {
      const taskData = data.data;
      
      if (taskData.status === "completed" && 
          taskData.output && 
          taskData.output.songs && 
          taskData.output.songs.length > 0) {
        
        const song = taskData.output.songs[0];
        const songUrl = song.song_path || "";
        const coverUrl = song.image_path || "";
        
        console.log("Extracted song URL:", songUrl);
        console.log("Extracted cover URL:", coverUrl);
        
        if (timedOutTasks.has(taskId)) {
          console.log(`Previously timed out task ${taskId} is now complete.`);
          timedOutTasks.delete(taskId);
        }
        
        return {
          task_id: taskData.task_id,
          status: taskData.status,
          result: {
            music_url: songUrl,
            cover_url: coverUrl
          },
          error: undefined
        };
      }
      
      return {
        task_id: taskData.task_id,
        status: taskData.status,
        result: undefined,
        error: taskData.error?.message
      };
    } else {
      console.error("Unexpected task result structure:", data);
      throw new Error("Invalid task result structure");
    }
  } catch (error) {
    console.error("Error getting task result:", error);
    throw error;
  }
};

export const checkTimedOutTasks = async (): Promise<MusicTaskResult[]> => {
  const now = Date.now();
  const TWO_MINUTES = 2 * 60 * 1000;
  const results: MusicTaskResult[] = [];
  
  const taskIds = Array.from(timedOutTasks.keys());
  
  for (const taskId of taskIds) {
    const taskInfo = timedOutTasks.get(taskId);
    
    if (!taskInfo) continue;
    
    if (now - taskInfo.lastChecked >= TWO_MINUTES) {
      console.log(`Rechecking timed out task ${taskId} (retry ${taskInfo.retryCount + 1}/${taskInfo.maxRetries})`);
      
      try {
        const result = await getTaskResult(taskId);
        results.push(result);
        
        if (result.status === "completed" || result.status === "failed") {
          console.log(`Task ${taskId} is now ${result.status}, removing from timeout tracking`);
          timedOutTasks.delete(taskId);
        } else {
          taskInfo.lastChecked = now;
          taskInfo.retryCount++;
          
          if (taskInfo.retryCount >= taskInfo.maxRetries) {
            console.log(`Task ${taskId} has reached max retries, giving up`);
            timedOutTasks.delete(taskId);
          }
        }
      } catch (error) {
        console.error(`Error rechecking task ${taskId}:`, error);
        
        taskInfo.lastChecked = now;
        taskInfo.retryCount++;
        
        if (taskInfo.retryCount >= taskInfo.maxRetries) {
          console.log(`Task ${taskId} has reached max retries after errors, giving up`);
          timedOutTasks.delete(taskId);
        }
      }
    }
  }
  
  return results;
};

export const addTimedOutTask = (taskId: string, maxRetries: number = 3): void => {
  console.log(`Adding task ${taskId} to timeout tracking for later checks`);
  timedOutTasks.set(taskId, {
    lastChecked: Date.now(),
    retryCount: 0,
    maxRetries: maxRetries
  });
};
