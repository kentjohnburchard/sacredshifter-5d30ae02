
import { toast } from 'sonner';
import AudioContextService from '@/services/AudioContextService';

/**
 * Initialize the audio context after user interaction
 */
export const initializeAudioAfterInteraction = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const audioService = AudioContextService.getInstance();
    
    if (audioService.isInitialized) {
      console.log("Audio context already initialized");
      resolve(true);
      return;
    }
    
    console.log("Setting up audio context initialization");
    
    // Initialize on user interaction
    const handleInteraction = () => {
      console.log("User interaction detected, initializing audio context");
      const initialized = audioService.initialize();
      
      // Resume the audio context
      if (initialized) {
        audioService.resume()
          .then(() => {
            console.log("Audio context resumed successfully");
            resolve(true);
          })
          .catch(error => {
            console.error("Failed to resume audio context:", error);
            resolve(false);
          });
      } else {
        console.error("Failed to initialize audio context");
        resolve(false);
      }
      
      // Remove event listeners
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    
    // Also try initializing directly (may work if user already interacted)
    if (audioService.initialize()) {
      audioService.resume()
        .then(() => {
          console.log("Audio context initialized and resumed directly");
          resolve(true);
        })
        .catch(() => {
          console.log("Audio context initialized but needs user interaction to resume");
        });
    }
  });
};

/**
 * Resume the audio context
 */
export const resumeAudioContext = async (): Promise<boolean> => {
  try {
    const audioService = AudioContextService.getInstance();
    
    if (!audioService.isInitialized) {
      const initialized = audioService.initialize();
      if (!initialized) {
        console.warn("Could not initialize audio context");
        return false;
      }
    }
    
    const resumed = await audioService.resume();
    return resumed;
  } catch (error) {
    console.error("Failed to resume audio context:", error);
    return false;
  }
};

/**
 * Get the global audio context
 */
export const getAudioContext = (): AudioContext | null => {
  const audioService = AudioContextService.getInstance();
  return audioService.audioContext;
};

/**
 * Check if audio context is initialized
 */
export const isAudioContextInitialized = (): boolean => {
  const audioService = AudioContextService.getInstance();
  return audioService.isInitialized;
};
