
import React from 'react';
import { Link } from 'react-router-dom';
import PrimeExplorer from '@/components/PrimeExplorer';
import ChakraPresets from '@/components/ChakraPresets';
import MandalaBuilder from '@/components/MandalaBuilder';

interface SideControlsProps {
  onPrimesChange: (primes: number[]) => void;
  audioContext: AudioContext | null;
  audioSourceNode: MediaElementAudioSourceNode | null;
  onVisualModeChange: (mode: string) => void;
  onMandalaChange: (settings: any) => void;
}

const SideControls: React.FC<SideControlsProps> = ({ 
  onPrimesChange, 
  audioContext, 
  audioSourceNode, 
  onVisualModeChange,
  onMandalaChange
}) => {
  return (
    <div className="fixed left-4 top-4 bottom-4 w-72 flex flex-col space-y-4 overflow-y-auto hide-scrollbar z-10">
      <Link 
        to="/prime-frequency" 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md shadow-lg text-center"
      >
        Try Prime Frequency Activation
      </Link>
      
      <PrimeExplorer 
        onPrimesChange={onPrimesChange}
        audioContext={audioContext}
        audioSourceNode={audioSourceNode}
        setVisualMode={onVisualModeChange}
      />
      
      <ChakraPresets
        audioContext={audioContext}
        audioSourceNode={audioSourceNode}
        setVisualMode={onVisualModeChange}
      />
      
      <MandalaBuilder
        setVisualMode={onVisualModeChange}
        onMandalaChange={onMandalaChange}
      />
    </div>
  );
};

export default SideControls;
