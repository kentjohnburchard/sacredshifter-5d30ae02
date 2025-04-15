
/**
 * Utility to initialize and manage AudioContext safely across the application
 * This helps resolve issues with browsers requiring user interaction before playing audio
 */

// Store a single instance of AudioContext
let audioContextInstance: AudioContext | null = null;
let initializationAttempted = false;
let initializationSuccessful = false;

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
    console.log("🎵 AudioContext created successfully");
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
    console.log("🎵 Attempting to resume AudioContext");
    try {
      await context.resume();
      console.log("🎵 AudioContext resumed successfully");
      initializationSuccessful = true;
    } catch (error) {
      console.error("Failed to resume AudioContext:", error);
      throw error;
    }
  } else if (context && context.state === 'running') {
    initializationSuccessful = true;
  }
};

/**
 * Initialize AudioContext after user interaction
 * Sets up listeners for common user interactions to initialize audio
 */
export const initializeAudioAfterInteraction = () => {
  if (initializationAttempted) return;
  
  initializationAttempted = true;
  console.log("🎵 Setting up audio context initialization");
  
  const initAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      resumeAudioContext().catch(console.error);
    }
  };
  
  // Attempt to initialize immediately
  try {
    initAudio();
  } catch (e) {
    console.warn("Initial audio initialization failed, waiting for user interaction");
  }
  
  // Set up event listeners for common user interactions
  document.addEventListener('click', initAudio);
  document.addEventListener('touchstart', initAudio);
  document.addEventListener('keydown', initAudio);
  
  // Create a temporary hidden audio element to help initialize the system
  const tempAudio = document.createElement('audio');
  tempAudio.src = '/sounds/focus-ambient.mp3';
  tempAudio.volume = 0.01; // Very quiet
  
  // Try to play it to kick-start the audio system
  const attemptPlay = () => {
    tempAudio.play().then(() => {
      console.log("Temporary audio played successfully to initialize the system");
      setTimeout(() => tempAudio.pause(), 50);
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
    }).catch(() => {
      // This is expected to fail until user interaction
    });
  };
  
  document.addEventListener('click', attemptPlay, { once: true });
  document.addEventListener('touchstart', attemptPlay, { once: true });
  
  // Clean up event listeners after 10 seconds if initialization was successful
  setTimeout(() => {
    if (initializationSuccessful) {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('keydown', initAudio);
      console.log("🎵 Audio initialization successful, removed event listeners");
    }
  }, 10000);
};

/**
 * Create an audio analyzer node connected to the given audio element
 * @param audioElement HTML audio element to analyze
 * @returns The analyzer node or null if creation fails
 */
export const createAudioAnalyzer = (audioElement: HTMLAudioElement): AnalyserNode | null => {
  try {
    // Ensure we have an audio element
    if (!audioElement) {
      console.error("No audio element provided to createAudioAnalyzer");
      return null;
    }
    
    const ctx = getAudioContext();
    if (!ctx) {
      console.error("Failed to get AudioContext");
      return null;
    }
    
    // Resume the audio context if needed
    if (ctx.state === 'suspended') {
      ctx.resume().catch(error => {
        console.error("Failed to resume AudioContext:", error);
      });
    }
    
    // Create analyzer node
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024; // Power of 2, controls frequency bin count
    
    // Connect audio element to analyzer if it hasn't been connected before
    try {
      const source = ctx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      console.log("🎵 Audio analyzer connected successfully");
      return analyser;
    } catch (error: any) {
      // If the error is because it's already connected, create a new analyzer
      // and try to connect to the existing source
      if (error.toString().includes('already connected')) {
        console.log("Audio element already connected to an audio context");
        return analyser; // Return the analyzer anyway
      } else {
        console.error("Error connecting audio element to analyzer:", error);
        return null;
      }
    }
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
      initializationAttempted = false;
      initializationSuccessful = false;
    } catch (error) {
      console.error("Error closing AudioContext:", error);
    }
  }
};

// Automatically initialize audio context when this module is imported
initializeAudioAfterInteraction();

export default { 
  getAudioContext, 
  resumeAudioContext, 
  initializeAudioAfterInteraction,
  createAudioAnalyzer,
  cleanupAudioContext 
};
