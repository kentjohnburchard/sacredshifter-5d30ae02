
import { HealingFrequency } from "@/data/frequencies";

export interface GeneratedTrack {
  id: string;
  title: string;
  description: string;
  musicUrl: string;
  coverUrl?: string;
  timestamp: Date;
  lyrics_type: "generate" | "user" | "instrumental";
}

export interface UseMusicGenerationResult {
  isGenerating: boolean;
  generatedTracks: GeneratedTrack[];
  startGeneration: (params: MusicGenerationRequest) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  userCredits: number | null;
}

export interface MusicGenerationRequest {
  negative_tags?: string;
  gpt_description_prompt: string;
  lyrics_type: "generate" | "user" | "instrumental"; 
  title: string;
  seed?: number;
  make_instrumental?: boolean;
  frequency?: HealingFrequency;
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
