
export const createGlobalAudioElement = (volume: number): HTMLAudioElement => {
  const audioElement = document.createElement('audio');
  audioElement.id = 'global-audio-player';
  audioElement.style.display = 'none';
  audioElement.volume = volume;
  document.body.appendChild(audioElement);
  return audioElement;
};

export const getExistingAudioElement = (): HTMLAudioElement | null => {
  const existingAudio = document.getElementById('global-audio-player');
  return existingAudio instanceof HTMLAudioElement ? existingAudio : null;
};

export const createTone = (frequency: number, duration: number = 1): HTMLAudioElement => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.00001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);

  const audioElement = document.createElement('audio');
  return audioElement;
};

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
