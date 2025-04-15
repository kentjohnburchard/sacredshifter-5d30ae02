/**
 * Utility for preloading audio files to ensure they're in the browser cache
 */

// Keep track of files we've already preloaded
const preloadedFiles = new Set<string>();

/**
 * Preload an audio file so it's ready for playback
 * @param url The URL of the audio file to preload
 * @returns Promise that resolves when preloaded or rejects on error
 */
export const preloadAudio = (url: string): Promise<void> => {
  // Don't re-preload if already done
  if (preloadedFiles.has(url)) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    console.log(`Preloading audio: ${url}`);
    
    const audio = new Audio();
    
    audio.addEventListener('canplaythrough', () => {
      console.log(`Successfully preloaded: ${url}`);
      preloadedFiles.add(url);
      resolve();
      
      // Clean up
      audio.src = '';
    }, { once: true });
    
    audio.addEventListener('error', (err) => {
      console.error(`Failed to preload audio: ${url}`, err);
      reject(new Error(`Failed to preload ${url}`));
      
      // Clean up
      audio.src = '';
    }, { once: true });
    
    // Start loading
    audio.preload = 'auto';
    audio.src = url;
    audio.load();
  });
};

/**
 * Preload multiple audio files at once
 * @param urls Array of audio URLs to preload
 * @returns Promise that resolves when all are loaded
 */
export const preloadMultipleAudio = (urls: string[]): Promise<void[]> => {
  const uniqueUrls = urls.filter(url => !preloadedFiles.has(url));
  console.log(`Starting bulk preload of ${uniqueUrls.length} audio files`);
  
  return Promise.all(uniqueUrls.map(url => preloadAudio(url)));
};

/**
 * Preload key audio files that will be used throughout the app
 */
export const preloadCoreAudioFiles = (): void => {
  // List of essential audio files
  const coreAudioFiles = [
    '/sounds/focus-ambient.mp3',
    // Add other core audio files here as needed
  ];
  
  console.log('Preloading core audio files');
  
  // Don't await - let this run in the background
  preloadMultipleAudio(coreAudioFiles)
    .then(() => console.log('Core audio files preloaded successfully'))
    .catch(err => console.error('Failed to preload some core audio files', err));
};

export default {
  preloadAudio,
  preloadMultipleAudio,
  preloadCoreAudioFiles
};
