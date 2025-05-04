
export interface SceneProps {
  analyzer?: AnalyserNode | null;
  isPlaying?: boolean;
  audioData?: Uint8Array;
  frequency?: number;
  sensitivity?: number;
}

export interface MandalaSceneProps extends SceneProps {
  settings?: any;
}

export interface PrimeSymphonySceneProps extends SceneProps {
  activePrimes?: number[];
}

export interface FractalAudioVisualizerProps extends SceneProps {
  analyzer?: AnalyserNode | null; // Using analyzer instead of audioAnalyzer
}
