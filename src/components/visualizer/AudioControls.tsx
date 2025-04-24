
import React, { useRef } from 'react';

interface AudioControlsProps {
  audioUrl: string;
  onAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSessionEnd: () => void;
  onToggleJournal: () => void;
  onToggleStats: () => void;
  statsCollapsed: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({ 
  audioUrl, 
  onAudioUpload, 
  onSessionEnd, 
  onToggleJournal, 
  onToggleStats, 
  statsCollapsed 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  return (
    <div className="audio-controls">
      <input 
        type="file" 
        accept="audio/*"
        onChange={onAudioUpload}
        className="bg-opacity-50 bg-gray-800 p-2 rounded text-sm w-full"
      />
      
      <div className="flex gap-2">
        <audio 
          ref={audioRef}
          controls 
          src={audioUrl}
          onEnded={onSessionEnd}
          className="w-full"
        />
        
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          onClick={onToggleJournal}
        >
          Journal
        </button>
        
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
          onClick={onToggleStats}
        >
          Stats
        </button>
      </div>
    </div>
  );
};

export default AudioControls;
