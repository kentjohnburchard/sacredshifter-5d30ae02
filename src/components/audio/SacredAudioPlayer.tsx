
import React from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const SacredAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    togglePlay,
  } = useAudioPlayer();

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 rounded-xl bg-black text-white">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="px-4 py-2 bg-white text-black rounded flex items-center gap-1"
      >
        {isPlaying ? (
          <>
            <Pause size={14} /> <span>Pause</span>
          </>
        ) : (
          <>
            <Play size={14} /> <span>Play</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default SacredAudioPlayer;
