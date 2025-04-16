
/**
 * Utility functions for testing and handling audio URLs
 */

/**
 * Test if an audio URL is valid and can be played
 * @param url The audio URL to test
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves to true if valid, false if not
 */
export const testAudioUrl = async (url: string, timeout: number = 5000): Promise<boolean> => {
  if (!url) return false;
  
  return new Promise((resolve) => {
    const audio = new Audio();
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      console.log(`Audio test timeout for ${url}`);
      audio.removeEventListener('canplaythrough', handleSuccess);
      audio.removeEventListener('error', handleError);
      resolve(false);
    }, timeout);
    
    // Success handler
    const handleSuccess = () => {
      clearTimeout(timeoutId);
      audio.removeEventListener('canplaythrough', handleSuccess);
      audio.removeEventListener('error', handleError);
      console.log(`Audio test successful for ${url}`);
      resolve(true);
    };
    
    // Error handler
    const handleError = () => {
      clearTimeout(timeoutId);
      audio.removeEventListener('canplaythrough', handleSuccess);
      audio.removeEventListener('error', handleError);
      console.log(`Audio test failed for ${url}`);
      resolve(false);
    };
    
    // Set up event listeners
    audio.addEventListener('canplaythrough', handleSuccess);
    audio.addEventListener('error', handleError);
    
    // Start loading the audio
    audio.src = url;
    audio.load();
  });
};

/**
 * Get a fallback audio URL when the original fails
 * @returns A fallback audio URL
 */
export const getFallbackAudioUrl = (): string => {
  const fallbackUrls = [
    '/assets/audio/meditation.mp3',
    '/assets/sounds/meditation.mp3',
    'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-2287.mp3',
    'https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3'
  ];
  
  // Pick one randomly to increase chances of finding a working URL
  const randomIndex = Math.floor(Math.random() * fallbackUrls.length);
  return fallbackUrls[randomIndex];
};
