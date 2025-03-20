
const API_KEY = "90ae5a4ea209519a1f59f1d3f98de47e33aecb05cf32a2b708cc3f8d6e9fbd2a";
const API_BASE_URL = "https://api.piapi.ai/api/v1/task";

export interface MusicGenerationRequest {
  negative_tags?: string;
  gpt_description_prompt: string;
  lyrics_type: "instrumental"; // Restrict to only "instrumental"
  seed?: number;
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

export const generateMusic = async (params: MusicGenerationRequest): Promise<MusicGenerationResponse> => {
  try {
    console.log("Sending API request with params:", params);
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      },
      body: JSON.stringify({
        model: "music-u",
        task_type: "generate_music",
        input: params
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(errorData.message || "Failed to generate music");
    }

    const data = await response.json();
    console.log("API success response:", data);
    
    // The API returns data in a nested structure
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
    
    // Handle the nested response structure
    if (data && data.code === 200 && data.data) {
      const taskData = data.data;
      
      // Extract song URL and cover URL from the response
      let songUrl = "";
      let coverUrl = "";
      
      if (taskData.output && taskData.output.songs && taskData.output.songs.length > 0) {
        const song = taskData.output.songs[0];
        songUrl = song.song_path || ""; // Use song_path instead of url
        coverUrl = song.image_path || ""; // Use image_path instead of cover_url
        
        console.log("Extracted song URL:", songUrl);
        console.log("Extracted cover URL:", coverUrl);
      }
      
      return {
        task_id: taskData.task_id,
        status: taskData.status,
        result: songUrl ? {
          music_url: songUrl,
          cover_url: coverUrl
        } : undefined,
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
