
import { create } from 'zustand';

interface AppState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentSongId: string | null;
  setCurrentSongId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  currentSongId: null,
  setCurrentSongId: (id: string | null) => set({ currentSongId: id }),
}));
