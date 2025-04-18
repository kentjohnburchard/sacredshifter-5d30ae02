
export interface VisualRegistration {
  setAudioSource: (url: string, info?: any) => void;
}

export interface PlayerInfo {
  title?: string;
  artist?: string;
  source?: string;
  chakra?: string;
  frequency?: number;
  id?: string;
}

export interface GlobalAudioPlayerContextType {
  currentAudio: PlayerInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playAudio: (info: PlayerInfo) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  resetPlayer: () => void;
  setOnEndedCallback: (callback: () => void | null) => void;
  registerPlayerVisuals: (registration: VisualRegistration) => (() => void) | undefined;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  currentFrequency: number | null;
  activeFrequencies: number[];
  activePrimeNumbers: number[];
  registerPrimeCallback: (callback: (prime: number) => void) => (() => void) | undefined;
  getAudioElement: () => HTMLAudioElement | null;
  forceVisualSync: () => void;
}
