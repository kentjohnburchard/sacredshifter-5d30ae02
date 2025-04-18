
import { useCallback } from 'react';
import { PlayerInfo, VisualRegistration } from '@/types/audioPlayer';

export const usePlayerCallbacks = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setCurrentAudio: (audio: PlayerInfo | null) => void,
  visualRegistrationsRef: React.MutableRefObject<VisualRegistration[]>
) => {
  const playAudio = useCallback((info: PlayerInfo) => {
    if (audioRef.current && info.source) {
      audioRef.current.src = info.source;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setCurrentAudio(info);
            
            visualRegistrationsRef.current.forEach(reg => {
              reg.setAudioSource(info.source || '', info);
            });
          })
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => console.error("Playback failed:", error));
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return {
    playAudio,
    togglePlayPause,
    seekTo
  };
};
