
import { useCallback } from 'react';

type AudioInfo = {
  title: string;
  artist?: string;
  imageUrl?: string;
  source: string;
};

export function useGlobalAudioPlayer() {
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, []);

  return { playAudio };
}
