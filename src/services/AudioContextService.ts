
// A singleton service to manage a global AudioContext and AnalyserNode
class AudioContextService {
  private static instance: AudioContextService | null = null;
  private _audioContext: AudioContext | null = null;
  private _analyser: AnalyserNode | null = null;
  private _sourceConnected = false;
  private _sourceNode: MediaElementAudioSourceNode | null = null;
  private _audioElement: HTMLAudioElement | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
    console.log("AudioContextService: Initializing");
  }

  static getInstance(): AudioContextService {
    if (!AudioContextService.instance) {
      AudioContextService.instance = new AudioContextService();
    }
    return AudioContextService.instance;
  }

  // Initialize the audio context (requires user interaction)
  initialize(): boolean {
    if (this._audioContext) {
      return true; // Already initialized
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("AudioContext not supported in this browser");
        return false;
      }
      
      this._audioContext = new AudioContextClass();
      this._analyser = this._audioContext.createAnalyser();
      this._analyser.fftSize = 256; // Power of 2: smaller for better performance
      this._analyser.smoothingTimeConstant = 0.8;
      
      console.log("AudioContextService: Successfully created AudioContext");
      return true;
    } catch (error) {
      console.error("AudioContextService: Failed to initialize audio context", error);
      return false;
    }
  }

  // Connect an audio element to the analyzer
  connectAudioElement(audioElement: HTMLAudioElement): boolean {
    if (!this._audioContext || !this._analyser) {
      console.warn("AudioContextService: Cannot connect audio element - context not initialized");
      return false;
    }

    // If already connected to this element, do nothing
    if (this._sourceConnected && this._audioElement === audioElement) {
      console.log("AudioContextService: Audio element already connected");
      return true;
    }

    try {
      // Disconnect previous source if it exists
      if (this._sourceNode) {
        try {
          this._sourceNode.disconnect();
        } catch (e) {
          console.log("AudioContextService: Error disconnecting previous source", e);
        }
      }

      // Create and connect new source
      this._sourceNode = this._audioContext.createMediaElementSource(audioElement);
      this._sourceNode.connect(this._analyser);
      this._analyser.connect(this._audioContext.destination);
      this._sourceConnected = true;
      this._audioElement = audioElement;
      
      console.log("AudioContextService: Successfully connected audio element to analyser");
      return true;
    } catch (error: any) {
      // Handle the common case where the node is already connected
      if (error.toString().includes('already connected')) {
        console.log("AudioContextService: Audio node already connected");
        this._sourceConnected = true;
        this._audioElement = audioElement;
        return true;
      }
      
      console.error("AudioContextService: Error connecting audio element", error);
      return false;
    }
  }

  // Resume audio context (required after user interaction in some browsers)
  async resume(): Promise<boolean> {
    if (!this._audioContext) {
      return false;
    }
    
    if (this._audioContext.state === 'suspended') {
      try {
        await this._audioContext.resume();
        console.log("AudioContextService: AudioContext resumed successfully");
        return true;
      } catch (error) {
        console.error("AudioContextService: Failed to resume audio context", error);
        return false;
      }
    }
    
    return this._audioContext.state === 'running';
  }

  // Get audio data for visualization
  getAudioData(): { frequencyData: Uint8Array, waveformData: Uint8Array } | null {
    if (!this._analyser) {
      return null;
    }
    
    const frequencyData = new Uint8Array(this._analyser.frequencyBinCount);
    const waveformData = new Uint8Array(this._analyser.frequencyBinCount);
    
    this._analyser.getByteFrequencyData(frequencyData);
    this._analyser.getByteTimeDomainData(waveformData);
    
    return { frequencyData, waveformData };
  }

  // Getters
  get audioContext(): AudioContext | null {
    return this._audioContext;
  }

  get analyser(): AnalyserNode | null {
    return this._analyser;
  }

  get isInitialized(): boolean {
    return !!this._audioContext;
  }

  get isConnected(): boolean {
    return this._sourceConnected;
  }
}

export default AudioContextService;
