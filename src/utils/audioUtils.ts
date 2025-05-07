
/**
 * Helper functions for working with audio elements
 */

export const createGlobalAudioElement = (volume: number = 0.7): HTMLAudioElement => {
  console.log("Creating new global audio element");
  
  // Create new audio element
  const audioElement = document.createElement('audio');
  audioElement.id = 'global-audio-player';
  audioElement.style.display = 'none'; // Hide from view
  audioElement.crossOrigin = 'anonymous'; // Important for audio analysis
  audioElement.volume = volume;
  
  // Add to body
  document.body.appendChild(audioElement);
  
  return audioElement;
};

export const getExistingAudioElement = (): HTMLAudioElement | null => {
  const existingElement = document.getElementById('global-audio-player') as HTMLAudioElement;
  
  if (existingElement) {
    console.log("Found existing global audio element");
    return existingElement;
  }
  
  return null;
};

export const createAudioContext = (): AudioContext | null => {
  try {
    // Try to use standard AudioContext or prefixed versions
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    
    if (AudioContextClass) {
      return new AudioContextClass();
    }
    
    console.error("AudioContext is not supported in this browser");
    return null;
  } catch (error) {
    console.error("Error creating AudioContext:", error);
    return null;
  }
};

export const connectAudioElementToContext = (
  audioElement: HTMLAudioElement,
  audioContext: AudioContext
): { sourceNode: MediaElementAudioSourceNode, analyserNode: AnalyserNode } | null => {
  try {
    // Create source node from audio element
    const sourceNode = audioContext.createMediaElementSource(audioElement);
    
    // Create analyser node for frequency analysis
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    
    // Connect nodes: sourceNode -> analyserNode -> destination
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    
    return { sourceNode, analyserNode };
  } catch (error) {
    console.error("Error connecting audio element to context:", error);
    return null;
  }
};

export const getAudioData = (analyserNode: AnalyserNode): Uint8Array => {
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(dataArray);
  return dataArray;
};
