
import { create } from 'zustand';

interface AppState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentSongId: string | null;
  setCurrentSongId: (id: string | null) => void;
  audioData: Uint8Array | null;
  setAudioData: (audioData: Uint8Array | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  currentSongId: null,
  setCurrentSongId: (id: string | null) => set({ currentSongId: id }),
  audioData: null,
  setAudioData: (audioData: Uint8Array | null) => set({ audioData }),
}));
