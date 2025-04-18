
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
