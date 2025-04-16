
import { AppFunctionality, SongMapping } from './music';

export interface JourneySong {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  duration: number; // in seconds
  journeyId: string;
  isPrimary?: boolean;
  chakra?: string;
  frequency?: number;
  category?: string; // Added missing category property
}

export interface JourneySongGroup {
  journeyId: string;
  title: string;
  songs: JourneySong[];
}

// Utility function to convert a SongMapping to a JourneySong
export const convertToJourneySong = (
  song: SongMapping, 
  journeyId: string, 
  isPrimary: boolean = false
): JourneySong => {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist || 'Unknown Artist',
    audioUrl: song.audioUrl || '',
    duration: song.duration || 180,
    journeyId: journeyId,
    isPrimary: isPrimary,
    chakra: song.chakra,
    frequency: song.frequency,
    category: song.category || 'Unknown' // Added with default value
  };
};
