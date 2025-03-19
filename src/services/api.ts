
const API_KEY = "90ae5a4ea209519a1f59f1d3f98de47e33aecb05cf32a2b708cc3f8d6e9fbd2a";
const API_BASE_URL = "https://api.piapi.ai/api/v1/task";

export interface MusicGenerationRequest {
  negative_tags?: string;
  gpt_description_prompt: string;
  lyrics_type: "instrumental" | "lyrical";
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
      throw new Error(errorData.message || "Failed to generate music");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating music:", error);
    throw error;
  }
};

export const getTaskResult = async (taskId: string): Promise<MusicTaskResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get task result");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting task result:", error);
    throw error;
  }
};
