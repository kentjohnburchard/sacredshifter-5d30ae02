
import { HermeticTrack, HermeticPlaylist } from "@/types/playlist";
import { supabase } from "@/integrations/supabase/client";

// Mock data for initial development
const mockTracks: HermeticTrack[] = [
  {
    id: "track-1",
    title: "Crown Chakra Meditation",
    artist: "Sacred Sound Healing",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/18/audio_270f8897e1.mp3",
    duration: 360,
    tags: ["Consciousness", "Stillness", "Cosmic"],
    chakra: "Crown",
    principle: "Mentalism"
  },
  {
    id: "track-2",
    title: "Third Eye Awakening",
    artist: "Inner Vision",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/13/audio_cb1c12a96d.mp3",
    duration: 240,
    tags: ["Insight", "Self-reflection", "Intuitive"],
    chakra: "Third Eye",
    principle: "Correspondence"
  },
  {
    id: "track-3",
    title: "Heart Center Harmony",
    artist: "Healing Vibrations",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    duration: 420,
    tags: ["Connection", "Balance", "Emotional healing"],
    chakra: "Heart",
    principle: "Polarity"
  }
];

// Function to get tracks for a specific principle
export const getTracksForPrinciple = async (principle: string): Promise<HermeticTrack[]> => {
  try {
    // Here you would implement the actual Supabase query
    // For now, return mock data filtered by principle
    return mockTracks.filter(track => track.principle === principle);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }
};

// Function to save a new track
export const saveTrack = async (track: Omit<HermeticTrack, "id">): Promise<HermeticTrack | null> => {
  try {
    // Here you would implement the actual Supabase insert
    // For now, return a mock success
    const newTrack: HermeticTrack = {
      ...track,
      id: `track-${Date.now()}`
    };
    
    return newTrack;
  } catch (error) {
    console.error("Error saving track:", error);
    return null;
  }
};

// Function to get all playlists
export const getAllPlaylists = async (): Promise<HermeticPlaylist[]> => {
  try {
    // Here you would implement the actual Supabase query
    // For now, return mock data
    const principles = [...new Set(mockTracks.map(track => track.principle))];
    
    return principles.map(principle => ({
      id: `playlist-${principle.toLowerCase().replace(/\s+/g, '-')}`,
      principle,
      tracks: mockTracks.filter(track => track.principle === principle)
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};
