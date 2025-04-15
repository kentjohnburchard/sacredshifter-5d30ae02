
/**
 * Utility for initializing and managing the Web Audio API context
 * This ensures we handle browser restrictions properly
 */

// Singleton instance for the audio context
let audioContextInstance: AudioContext | null = null;
let initializationAttempted = false;

/**
 * Get or create the shared audio context
 * @returns The audio context instance or null if unavailable
 */
export const getAudioContext = (): AudioContext | null => {
  if (audioContextInstance) {
    return audioContextInstance;
  }

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("AudioContext not supported in this browser");
      return null;
    }
    audioContextInstance = new AudioContextClass();
    console.log("Created new AudioContext");
    return audioContextInstance;
  } catch (error) {
    console.error("Failed to create AudioContext:", error);
    return null;
  }
};

/**
 * Resume the audio context if it's suspended
 * Most browsers require a user interaction to start AudioContext
 * @returns Promise that resolves when resumed or rejects on error
 */
export const resumeAudioContext = async (): Promise<void> => {
  const context = getAudioContext();
  
  if (!context) {
    console.error("No AudioContext available to resume");
    return Promise.reject(new Error("No AudioContext available"));
  }
  
  if (context.state === 'suspended') {
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
 * Initialize audio context after user interaction
 * This sets up listeners for user events to initialize audio
 */
export const initializeAudioAfterInteraction = (): void => {
  if (initializationAttempted) {
    return;
  }
  
  initializationAttempted = true;
  console.log("Setting up audio initialization on user interaction");
  
  const initAudio = () => {
    getAudioContext();
    resumeAudioContext().catch(e => {
      console.warn("Could not resume audio context:", e);
    });
  };
  
  // Set up event listeners for user interactions
  const userInteractionEvents = ['click', 'touchstart', 'keydown'];
  
  const handleUserInteraction = () => {
    initAudio();
    // Remove listeners after first interaction
    userInteractionEvents.forEach(event => {
      document.removeEventListener(event, handleUserInteraction);
    });
    console.log("Audio initialized after user interaction");
  };
  
  userInteractionEvents.forEach(event => {
    document.addEventListener(event, handleUserInteraction);
  });
};

export default {
  getAudioContext,
  resumeAudioContext,
  initializeAudioAfterInteraction
};
