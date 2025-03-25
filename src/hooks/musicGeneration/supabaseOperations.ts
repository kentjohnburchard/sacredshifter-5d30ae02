
import { supabase } from "@/integrations/supabase/client";
import { GeneratedTrack } from "./types";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const fetchUserCredits = async (userId: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching user credits:", error);
      return null;
    }
    
    if (data && data.length > 0) {
      return data[0].balance;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return null;
  }
};

export const fetchTracksFromSupabase = async (userId: string): Promise<GeneratedTrack[]> => {
  try {
    const { data, error } = await supabase
      .from('music_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching from Supabase:", error);
      return [];
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
      
      return tracks;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching music history:", error);
    return [];
  }
};

export const saveTrackToSupabase = async (
  track: GeneratedTrack,
  user: User | null
): Promise<void> => {
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
};

export const useGenerationCredit = async (
  userId: string,
  creditCost: number = 5
): Promise<boolean> => {
  try {
    const { data: deductResult, error: deductError } = await supabase
      .rpc('use_generation_credit', {
        user_id: userId,
        credit_cost: creditCost
      });
    
    if (deductError) {
      console.error("Error deducting credits:", deductError);
      throw new Error("Failed to deduct credits");
    }
    
    if (!deductResult) {
      throw new Error("Insufficient credits");
    }
    
    return true;
  } catch (error) {
    console.error("Error processing credits:", error);
    toast.error("Failed to process credits");
    throw error;
  }
};

export const deleteTrackFromSupabase = async (
  id: string,
  userId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('music_generations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error deleting from Supabase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error during track deletion:", error);
    return false;
  }
};
