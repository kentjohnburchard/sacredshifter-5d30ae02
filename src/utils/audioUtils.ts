
/**
 * Creates an oscillator and gain node for playing a tone
 * @param frequency The frequency to play in Hertz
 * @param type The type of oscillator (default: sine)
 * @returns Object containing oscillator and gainNode
 */
export const createTone = (frequency: number, type: OscillatorType = 'sine') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create oscillator
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  // Create gain node for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.3; // Set initial volume
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start oscillator
  oscillator.start();
  
  return {
    oscillator,
    gainNode,
    audioContext
  };
};

/**
 * Check if a number is a prime number
 * @param num The number to check
 * @returns Boolean indicating if the number is prime
 */
export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
};

/**
 * Creates a global audio element or returns the existing one
 * @param volume Initial volume for the audio element
 * @returns HTMLAudioElement
 */
export const createGlobalAudioElement = (volume: number = 0.8): HTMLAudioElement => {
  const audioElement = document.createElement('audio');
  audioElement.id = 'sacred-shifter-audio-element';
  audioElement.setAttribute('data-global-player', 'true');
  audioElement.volume = volume;
  
  // Try to get saved volume from localStorage
  try {
    const savedVolume = localStorage.getItem('sacredShifterVolume');
    if (savedVolume) {
      audioElement.volume = parseFloat(savedVolume);
    }
  } catch (e) {
    console.error("Error reading volume from localStorage:", e);
  }
  
  document.body.appendChild(audioElement);
  return audioElement;
};

/**
 * Gets the existing global audio element if it exists
 * @returns HTMLAudioElement or null if not found
 */
export const getExistingAudioElement = (): HTMLAudioElement | null => {
  return document.getElementById('sacred-shifter-audio-element') as HTMLAudioElement;
};

