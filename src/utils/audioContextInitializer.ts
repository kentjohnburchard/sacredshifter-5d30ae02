
/**
 * Utility to initialize and manage AudioContext safely across the application
 */

// Store a single instance of AudioContext
let audioContextInstance: AudioContext | null = null;

/**
 * Get the global AudioContext instance, creating it if needed
 * @returns The global AudioContext instance
 */
export const getAudioContext = (): AudioContext | null => {
  if (audioContextInstance) {
    return audioContextInstance;
  }
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      console.warn("AudioContext is not supported in this browser");
      return null;
    }
    
    audioContextInstance = new AudioContext();
    console.log("AudioContext created successfully");
    return audioContextInstance;
  } catch (error) {
    console.error("Failed to create AudioContext:", error);
    return null;
  }
};

/**
 * Resume the AudioContext if it's suspended (must be called after user interaction)
 * @returns Promise that resolves when the context is resumed or rejects on error
 */
export const resumeAudioContext = async (): Promise<void> => {
  const context = getAudioContext();
  
  if (context && context.state === 'suspended') {
    console.log("Attempting to resume AudioContext");
    try {
      await context.resume();
      console.log("AudioContext resumed successfully");
    } catch (error) {
      console.error("Failed to resume AudioContext:", error);
      throw error;
    }
  }
};

/**
 * Initialize AudioContext after user interaction
 * Sets up listeners for common user interactions to initialize audio
 */
export const initializeAudioAfterInteraction = () => {
  const initAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      resumeAudioContext().catch(console.error);
    }
    
    // Remove event listeners once initialized
    document.removeEventListener('click', initAudio);
    document.removeEventListener('touchstart', initAudio);
    document.removeEventListener('keydown', initAudio);
  };
  
  // Set up event listeners for common user interactions
  document.addEventListener('click', initAudio);
  document.addEventListener('touchstart', initAudio);
  document.addEventListener('keydown', initAudio);
};

/**
 * Create an audio analyzer node connected to the given audio element
 * @param audioElement HTML audio element to analyze
 * @returns The analyzer node or null if creation fails
 */
export const createAudioAnalyzer = (audioElement: HTMLAudioElement): AnalyserNode | null => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return null;
    
    // Create analyzer node
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256; // Power of 2, controls frequency bin count
    
    // Connect audio element to analyzer if it hasn't been connected before
    try {
      const source = ctx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      console.log("Audio analyzer connected successfully");
    } catch (error: any) {
      // If the error is because it's already connected, that's fine
      if (error.toString().includes('already connected')) {
        console.log("Audio element already connected to an audio context");
      } else {
        console.error("Error connecting audio element to analyzer:", error);
        return null;
      }
    }
    
    return analyser;
  } catch (error) {
    console.error("Failed to create audio analyzer:", error);
    return null;
  }
};

/**
 * Clean up audio context and related nodes
 */
export const cleanupAudioContext = () => {
  if (audioContextInstance && audioContextInstance.state !== 'closed') {
    try {
      audioContextInstance.close().catch(console.error);
      audioContextInstance = null;
    } catch (error) {
      console.error("Error closing AudioContext:", error);
    }
  }
};

export default { 
  getAudioContext, 
  resumeAudioContext, 
  initializeAudioAfterInteraction,
  createAudioAnalyzer,
  cleanupAudioContext 
};
