/**
 * Helper functions for working with audio URLs in the application
 */

// Default Supabase storage URL
export const SUPABASE_STORAGE_URL = 'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets';

/**
 * External URL sources that are known to be reliable
 */
export const FALLBACK_AUDIO_URLS = [
  'https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-2287.mp3'
];

/**
 * Normalized audio URL - ensure we use the correct base URL for relative paths
 * @param url The URL to normalize
 * @returns The normalized URL
 */
export const normalizeAudioUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // If it's already an absolute URL, return it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it starts with a slash, it's a relative path from the root
  if (url.startsWith('/')) {
    // Attempt to resolve against Supabase storage
    return `${SUPABASE_STORAGE_URL}${url}`;
  }
  
  // Otherwise, it's just a filename
  return `${SUPABASE_STORAGE_URL}/${url}`;
};

/**
 * Get a fallback audio URL if the primary one fails
 * @returns A fallback audio URL
 */
export const getFallbackAudioUrl = (): string => {
  const randomIndex = Math.floor(Math.random() * FALLBACK_AUDIO_URLS.length);
  return FALLBACK_AUDIO_URLS[randomIndex];
};

/**
 * Tests if an audio URL is playable
 * @param url The URL to test
 * @param timeout Timeout in ms before considering the test failed
 * @returns Promise resolving to true if audio can play, false otherwise
 */
export const testAudioUrl = async (url: string, timeout = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    
    const resolveTrue = () => {
      console.log(`✅ Audio URL is valid: ${url}`);
      clearTimeout(timeoutId);
      resolve(true);
    };
    
    const resolveFalse = () => {
      console.log(`❌ Audio URL is invalid: ${url}`);
      resolve(false);
    };
    
    audio.addEventListener('canplaythrough', resolveTrue, { once: true });
    audio.addEventListener('error', resolveFalse, { once: true });
    
    // Set crossOrigin to allow playing from different domains
    audio.crossOrigin = 'anonymous';
    
    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(resolveFalse, timeout);
    
    // Start loading the audio
    audio.src = url;
    audio.load();
  });
};
