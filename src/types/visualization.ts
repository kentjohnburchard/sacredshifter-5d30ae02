
export interface VisualizerProps {
  width?: string | number;
  height?: string | number;
  audioRef?: React.RefObject<HTMLAudioElement>;
  autoConnect?: boolean;
  showControls?: boolean;
  fullScreen?: boolean;
  initialSettings?: VisualizationSettings;
  onSettingsChange?: (settings: VisualizationSettings) => void;
  audioContext?: AudioContext | null;
  analyserNode?: AnalyserNode | null;
  musicFunctionality?: any;
  expandable?: boolean;
  onExpandStateChange?: (isExpanded: boolean) => void;
}

export interface VisualizationSettings {
  activeShapes: string[];
  speed: number;
  colorTheme: string;
  symmetry: number;
  mode: '2d' | '3d';
  mirrorEnabled: boolean;
  chakraAlignmentMode: boolean;
  sensitivity: number;
  brightness: number;
  showGrid: boolean;
  gridIntensity: number;
  showPrimeAffirmations: boolean;
  visualizerType: string;
  rotationSpeed: number;
}

// Add missing types to fix imports
export type AudioAnalysisResult = {
  amplitude: number;
  frequency: number;
  primeResonance?: number;
  activeFrequencies?: number[];
};

export type VisualizerType = 'sacred-geometry' | 'prime-audio' | 'fractal';
export type ColorTheme = 'cosmic-violet' | 'chakra-rainbow' | 'fire-essence' | 'ocean-depths' | 'earth-tones' | 'ethereal-mist';
export type SacredGeometryShape = string;
export type VisualizationMode = '2d' | '3d';

// Empty type aliases to satisfy imports
export type VisualTheme = string;
export type VisualThemeParams = any;
