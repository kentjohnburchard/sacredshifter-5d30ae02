
import create from 'zustand';

interface AppState {
  isPlaying: boolean;
  audioData: Uint8Array | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setAudioData: (audioData: Uint8Array | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPlaying: false,
  audioData: null,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setAudioData: (audioData) => set({ audioData }),
}));
