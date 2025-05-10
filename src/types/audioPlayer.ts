
export interface PlayerInfo {
  id?: string;
  title?: string;
  source?: string;
  duration?: number;
  chakra?: string;
  frequency?: number;
  artist?: string;
  description?: string;
  imageUrl?: string;
  trackType?: string;
  metadata?: Record<string, any>;
}

export interface VisualRegistration {
  setAudioSource?: (url: string, info?: any) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}

export interface PlayerState {
  isBuffering: boolean;
  isPlaying: boolean;
  trackEnded: boolean;
  error: Error | null;
}

export interface GlobalAudioPlayerContextType {
  currentAudio: PlayerInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentFrequency: number | null;
  activeFrequencies: number[];
  activePrimeNumbers: number[];
  playerState: PlayerState;
  playAudio: (info: PlayerInfo) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  resetPlayer: () => void;
  setOnEndedCallback: (callback: (() => void) | null) => void;
  registerPlayerVisuals: (registration: VisualRegistration) => (() => void) | undefined;
  setVolume: (value: number) => void;
  getVolume: () => number;
  registerPrimeCallback: (callback: (prime: number) => void) => (() => void) | undefined;
  getAudioElement: () => HTMLAudioElement | null;
  forceVisualSync: () => void;
  currentAudioId?: string;
  isMuted?: boolean;
  toggleMute?: () => void;
  stopAudio?: () => void;
}
