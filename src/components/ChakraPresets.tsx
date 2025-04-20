
import React, { useState, useRef, useEffect } from 'react';

interface ChakraPresetsProps {
  audioContext: AudioContext | null;
  audioSourceNode: MediaElementAudioSourceNode | null;
  setVisualMode: (mode: string) => void;
}

interface SolfeggioTone {
  name: string;
  frequency: number;
  chakra: string;
  color: string;
  description: string;
}

const ChakraPresets: React.FC<ChakraPresetsProps> = ({ 
  audioContext, 
  audioSourceNode, 
  setVisualMode
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Solfeggio frequencies and their associated chakras
  const solfeggioTones: SolfeggioTone[] = [
    { 
      name: "UT - 396 Hz", 
      frequency: 396, 
      chakra: "Root", 
      color: "#FF0000", 
      description: "Liberating guilt and fear"
    },
    {
      name: "RE - 417 Hz",
      frequency: 417,
      chakra: "Sacral",
      color: "#FF7F00",
      description: "Undoing situations and facilitating change"
    },
    {
      name: "MI - 528 Hz",
      frequency: 528,
      chakra: "Solar Plexus",
      color: "#FFFF00",
      description: "Transformation and miracles, DNA repair"
    },
    {
      name: "FA - 639 Hz",
      frequency: 639,
      chakra: "Heart",
      color: "#00FF00",
      description: "Connecting and relationships"
    },
    {
      name: "SOL - 741 Hz",
      frequency: 741,
      chakra: "Throat",
      color: "#0000FF",
      description: "Awakening intuition"
    },
    {
      name: "LA - 852 Hz",
      frequency: 852,
      chakra: "Third Eye",
      color: "#4B0082",
      description: "Returning to spiritual order"
    }
  ];
  
  // Initialize gain node
  useEffect(() => {
    if (!audioContext || !audioSourceNode) return;
    
    // Create a gain node
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;
    gainNode.connect(audioContext.destination);
    gainNodeRef.current = gainNode;
    
    // Connect audio source to gain node
    audioSourceNode.disconnect();
    audioSourceNode.connect(gainNode);
    
    return () => {
      if (audioSourceNode && gainNode) {
        // Clean up
        audioSourceNode.disconnect();
        audioSourceNode.connect(audioContext.destination);
      }
    };
  }, [audioContext, audioSourceNode]);
  
  // Apply solfeggio filters when preset changes
  useEffect(() => {
    if (!audioContext || !gainNodeRef.current) return;
    
    // Clear existing filters
    clearFilters();
    
    if (!activePreset) return;
    
    // Switch to chakra visualization
    setVisualMode('chakra');
    
    // Apply new filters for each solfeggio frequency
    const newFilters: BiquadFilterNode[] = [];
    
    solfeggioTones.forEach(tone => {
      const filter = audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = tone.frequency;
      filter.Q.value = 30; // Very narrow band for precise frequency
      filter.gain.value = 20; // Strong boost
      
      gainNodeRef.current!.connect(filter);
      filter.connect(audioContext.destination);
      
      newFilters.push(filter);
    });
    
    filterNodesRef.current = newFilters;
    
  }, [activePreset, audioContext, setVisualMode]);
  
  // Clear all filters
  const clearFilters = () => {
    filterNodesRef.current.forEach(filter => {
      filter.disconnect();
    });
    filterNodesRef.current = [];
  };
  
  // Handle preset selection
  const handlePresetChange = (preset: string | null) => {
    setActivePreset(preset);
  };
  
  return (
    <div className="chakra-presets bg-black/70 backdrop-blur-md p-4 rounded-lg">
      <h3 className="text-lg text-white mb-3 font-semibold">Solfeggio & Chakra Presets</h3>
      
      <div className="mb-4">
        <select
          value={activePreset || ""}
          onChange={(e) => handlePresetChange(e.target.value || null)}
          className="w-full bg-gray-800 text-white p-2 rounded"
        >
          <option value="">Select a Solfeggio Frequency</option>
          <option value="all-solfeggio">All Solfeggio Tones (396-852 Hz)</option>
          {solfeggioTones.map(tone => (
            <option key={tone.frequency} value={`single-${tone.frequency}`}>
              {tone.name} - {tone.chakra} Chakra
            </option>
          ))}
        </select>
      </div>
      
      {activePreset && (
        <div className="grid grid-cols-6 gap-1">
          {solfeggioTones.map(tone => (
            <div 
              key={tone.frequency} 
              className="p-2 rounded flex flex-col items-center"
              style={{ backgroundColor: `${tone.color}33` }}
            >
              <div 
                className="w-6 h-6 rounded-full mb-1" 
                style={{ backgroundColor: tone.color }}
              ></div>
              <span className="text-xs text-white">{tone.frequency} Hz</span>
            </div>
          ))}
        </div>
      )}
      
      {activePreset && (
        <button
          onClick={() => handlePresetChange(null)}
          className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white p-1 rounded text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default ChakraPresets;
